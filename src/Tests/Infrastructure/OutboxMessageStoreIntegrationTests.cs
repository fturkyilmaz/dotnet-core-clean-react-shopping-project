using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Events;
using ShoppingProject.Infrastructure.Data;
using ShoppingProject.Infrastructure.Services;
using Testcontainers.PostgreSql;
using Xunit;

namespace ShoppingProject.Tests.Infrastructure;

/// <summary>
/// Integration tests for OutboxMessageStore.
/// Tests reliable event publishing, retry logic, dead-letter handling, and cleanup.
/// </summary>
[Collection("PostgreSQL Tests")]
public class OutboxMessageStoreIntegrationTests : IAsyncLifetime
{
    private readonly PostgreSqlContainer _container;
    private ApplicationDbContext _context = null!;
    private IOutboxMessageStore _outboxStore = null!;
    private IClock _clock = null!;

    public OutboxMessageStoreIntegrationTests()
    {
        _container = new PostgreSqlBuilder()
            .WithDatabase("testdb_outbox")
            .WithUsername("testuser")
            .WithPassword("testpass")
            .Build();
    }

    public async Task InitializeAsync()
    {
        await _container.StartAsync();

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseNpgsql(_container.GetConnectionString())
            .Options;

        _context = new ApplicationDbContext(options);
        await _context.Database.EnsureCreatedAsync();

        _clock = new SystemClock();
        _outboxStore = new OutboxMessageStore(_context, _clock, new TestLogger());
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
        await _container.StopAsync();
    }

    [Fact]
    public async Task AddEventAsync_CreatesOutboxMessage()
    {
        // Arrange
        var product = Product.Create("Test", 10m, "Desc", "Cat", "https://img.jpg");

        // Act
        var message = await _outboxStore.AddEventAsync(product.DomainEvents.First());

        // Assert
        message.Should().NotBeNull();
        message.Type.Should().NotBeNullOrEmpty();
        message.Content.Should().NotBeNullOrEmpty();
        message.OccurredOnUtc.Should().NotBe(DateTime.MinValue);
        message.ProcessedOnUtc.Should().BeNull();
        message.RetryCount.Should().Be(0);
    }

    [Fact]
    public async Task AddEventAsync_WithCorrelationId()
    {
        // Arrange
        var product = Product.Create("Test", 10m, "Desc", "Cat", "https://img.jpg");
        var correlationId = Guid.NewGuid().ToString();

        // Act
        var message = await _outboxStore.AddEventAsync(
            product.DomainEvents.First(),
            correlationId: correlationId
        );

        // Assert
        message.CorrelationId.Should().Be(correlationId);
    }

    [Fact]
    public async Task GetUnprocessedMessagesAsync_ReturnsUnprocessedMessages()
    {
        // Arrange
        var product1 = Product.Create("Product1", 10m, "Desc1", "Cat1", "https://img1.jpg");
        var product2 = Product.Create("Product2", 20m, "Desc2", "Cat2", "https://img2.jpg");

        await _outboxStore.AddEventAsync(product1.DomainEvents.First());
        await _outboxStore.AddEventAsync(product2.DomainEvents.First());

        // Act
        var messages = await _outboxStore.GetUnprocessedMessagesAsync(batchSize: 10);

        // Assert
        messages.Should().HaveCount(2);
        messages.Should().AllSatisfy(m => m.ProcessedOnUtc.Should().BeNull());
    }

    [Fact]
    public async Task GetUnprocessedMessagesAsync_WithBatchSize()
    {
        // Arrange
        for (int i = 0; i < 5; i++)
        {
            var product = Product.Create(
                $"Product{i}",
                10m * (i + 1),
                $"Desc{i}",
                "Cat",
                "https://img.jpg"
            );
            await _outboxStore.AddEventAsync(product.DomainEvents.First());
        }

        // Act
        var messages = await _outboxStore.GetUnprocessedMessagesAsync(batchSize: 3);

        // Assert
        messages.Should().HaveCount(3);
    }

    [Fact]
    public async Task MarkAsProcessedAsync_MarksMessageAsProcessed()
    {
        // Arrange
        var product = Product.Create("Test", 10m, "Desc", "Cat", "https://img.jpg");
        var message = await _outboxStore.AddEventAsync(product.DomainEvents.First());

        // Act
        await _outboxStore.MarkAsProcessedAsync(message.Id, DateTimeOffset.UtcNow);

        // Assert
        var retrieved = await _outboxStore.GetByIdAsync(message.Id);
        retrieved.Should().NotBeNull();
        retrieved!.ProcessedOnUtc.Should().NotBeNull();
        retrieved.Error.Should().BeNull();
    }

    [Fact]
    public async Task MarkAsFailedAsync_IncrementsRetryCount()
    {
        // Arrange
        var product = Product.Create("Test", 10m, "Desc", "Cat", "https://img.jpg");
        var message = await _outboxStore.AddEventAsync(product.DomainEvents.First());

        // Act
        await _outboxStore.MarkAsFailedAsync(message.Id, "First error", DateTimeOffset.UtcNow);

        // Assert
        var retrieved = await _outboxStore.GetByIdAsync(message.Id);
        retrieved.Should().NotBeNull();
        retrieved!.RetryCount.Should().Be(1);
        retrieved.Error.Should().Be("First error");
        retrieved.NextRetryUtc.Should().NotBeNull();
    }

    [Fact]
    public async Task MarkAsFailedAsync_ImplementsExponentialBackoff()
    {
        // Arrange
        var product = Product.Create("Test", 10m, "Desc", "Cat", "https://img.jpg");
        var message = await _outboxStore.AddEventAsync(product.DomainEvents.First());
        var utcNow = DateTimeOffset.UtcNow;

        // Act - first failure
        await _outboxStore.MarkAsFailedAsync(message.Id, "Error 1", utcNow);
        var after1stFailure = await _outboxStore.GetByIdAsync(message.Id);

        // Act - second failure
        await _outboxStore.MarkAsFailedAsync(message.Id, "Error 2", utcNow);
        var after2ndFailure = await _outboxStore.GetByIdAsync(message.Id);

        // Assert - exponential backoff increases delay
        var delay1 = (after1stFailure!.NextRetryUtc - utcNow.DateTime)?.TotalMinutes ?? 0;
        var delay2 = (after2ndFailure!.NextRetryUtc - utcNow.DateTime)?.TotalMinutes ?? 0;

        delay2.Should().BeGreaterThan(delay1);
        after2ndFailure.RetryCount.Should().Be(2);
    }

    [Fact]
    public async Task GetUnprocessedMessagesAsync_SkipsMessagesWithFutureRetryTime()
    {
        // Arrange
        var product = Product.Create("Test", 10m, "Desc", "Cat", "https://img.jpg");
        var message = await _outboxStore.AddEventAsync(product.DomainEvents.First());

        // Mark as failed (sets future retry time)
        await _outboxStore.MarkAsFailedAsync(
            message.Id,
            "Error",
            DateTimeOffset.UtcNow.AddHours(-1)
        ); // Failed 1 hour ago

        // Act
        var unprocessed = await _outboxStore.GetUnprocessedMessagesAsync();

        // Assert - message should not be included since NextRetryUtc is in future
        unprocessed.Should().NotContain(m => m.Id == message.Id);
    }

    [Fact]
    public async Task MarkAsDeadLetterAsync_PreventsRetries()
    {
        // Arrange
        var product = Product.Create("Test", 10m, "Desc", "Cat", "https://img.jpg");
        var message = await _outboxStore.AddEventAsync(product.DomainEvents.First());

        // Act
        await _outboxStore.MarkAsDeadLetterAsync(
            message.Id,
            "Max retries exceeded",
            DateTimeOffset.UtcNow
        );

        // Assert
        var retrieved = await _outboxStore.GetByIdAsync(message.Id);
        retrieved.Should().NotBeNull();
        retrieved!.ProcessedOnUtc.Should().NotBeNull(); // Marked as processed to prevent further attempts
        retrieved.RetryCount.Should().Be(5); // Max retries
        retrieved.Error.Should().Be("Max retries exceeded");
    }

    [Fact]
    public async Task GetUnprocessedMessagesAsync_ExcludesDeadLetteredMessages()
    {
        // Arrange
        var product1 = Product.Create("Product1", 10m, "Desc1", "Cat1", "https://img1.jpg");
        var product2 = Product.Create("Product2", 20m, "Desc2", "Cat2", "https://img2.jpg");

        var msg1 = await _outboxStore.AddEventAsync(product1.DomainEvents.First());
        var msg2 = await _outboxStore.AddEventAsync(product2.DomainEvents.First());

        // Dead-letter first message
        await _outboxStore.MarkAsDeadLetterAsync(msg1.Id, "Failed", DateTimeOffset.UtcNow);

        // Act
        var unprocessed = await _outboxStore.GetUnprocessedMessagesAsync();

        // Assert
        unprocessed.Should().ContainSingle();
        unprocessed[0].Id.Should().Be(msg2.Id);
    }

    [Fact]
    public async Task CleanupProcessedMessagesAsync_RemovesOldProcessedMessages()
    {
        // Arrange
        var oldDate = DateTime.UtcNow.AddDays(-10);
        var product = Product.Create("Test", 10m, "Desc", "Cat", "https://img.jpg");
        var message = await _outboxStore.AddEventAsync(product.DomainEvents.First());

        // Manually mark as processed with old date
        await _context
            .OutboxMessages.Where(m => m.Id == message.Id)
            .ExecuteUpdateAsync(s => s.SetProperty(m => m.ProcessedOnUtc, oldDate));

        // Act
        var deleted = await _outboxStore.CleanupProcessedMessagesAsync(TimeSpan.FromDays(5));

        // Assert
        deleted.Should().Be(1);
        var remaining = await _context.OutboxMessages.FirstOrDefaultAsync(m => m.Id == message.Id);
        remaining.Should().BeNull();
    }

    [Fact]
    public async Task CleanupProcessedMessagesAsync_PreservesRecentMessages()
    {
        // Arrange
        var product = Product.Create("Test", 10m, "Desc", "Cat", "https://img.jpg");
        var message = await _outboxStore.AddEventAsync(product.DomainEvents.First());

        // Mark as processed just now
        await _outboxStore.MarkAsProcessedAsync(message.Id, DateTimeOffset.UtcNow);

        // Act
        var deleted = await _outboxStore.CleanupProcessedMessagesAsync(TimeSpan.FromDays(5));

        // Assert
        deleted.Should().Be(0);
        var retrieved = await _outboxStore.GetByIdAsync(message.Id);
        retrieved.Should().NotBeNull();
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsCorrectMessage()
    {
        // Arrange
        var product = Product.Create("Test", 10m, "Desc", "Cat", "https://img.jpg");
        var message = await _outboxStore.AddEventAsync(product.DomainEvents.First());

        // Act
        var retrieved = await _outboxStore.GetByIdAsync(message.Id);

        // Assert
        retrieved.Should().NotBeNull();
        retrieved!.Id.Should().Be(message.Id);
        retrieved.Type.Should().Be(message.Type);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNullForNonexistentMessage()
    {
        // Act
        var retrieved = await _outboxStore.GetByIdAsync(99999);

        // Assert
        retrieved.Should().BeNull();
    }

    [Fact]
    public async Task MultipleFailures_RespectsMaxRetries()
    {
        // Arrange
        var product = Product.Create("Test", 10m, "Desc", "Cat", "https://img.jpg");
        var message = await _outboxStore.AddEventAsync(product.DomainEvents.First());
        var utcNow = DateTimeOffset.UtcNow;

        // Act - fail multiple times
        for (int i = 0; i < 5; i++)
        {
            await _outboxStore.MarkAsFailedAsync(message.Id, $"Error {i}", utcNow);
        }

        var retrieved = await _outboxStore.GetByIdAsync(message.Id);

        // Assert
        retrieved!.RetryCount.Should().Be(5);
        retrieved.CanRetry(utcNow).Should().BeFalse();
    }
}

/// <summary>
/// Simple logger implementation for testing.
/// </summary>
file class TestLogger : ILogger<OutboxMessageStore>
{
    public IDisposable? BeginScope<TState>(TState state)
        where TState : notnull => null;

    public bool IsEnabled(LogLevel logLevel) => false;

    public void Log<TState>(
        LogLevel logLevel,
        EventId eventId,
        TState state,
        Exception? exception,
        Func<TState, Exception?, string> formatter
    ) { }
}
