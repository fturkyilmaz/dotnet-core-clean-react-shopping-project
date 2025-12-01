---
sidebar_position: 3
---

# Testing Kılavuzu

Bu kılavuz, ShoppingProject için test yazma ve çalıştırma stratejilerini açıklar.

## Test Piramidi

```
        /\
       /  \      E2E Tests (Az sayıda)
      /____\
     /      \    Integration Tests (Orta sayıda)
    /________\
   /          \  Unit Tests (Çok sayıda)
  /____________\
```

## Unit Tests

### Kurulum

Unit testler `src/UnitTests` klasöründe bulunur.

```bash
cd src/UnitTests
dotnet test
```

### Test Yapısı

```csharp
using Xunit;
using FluentAssertions;
using Moq;

namespace ShoppingProject.UnitTests.Application.Products;

public class CreateProductCommandHandlerTests
{
    private readonly Mock<IApplicationDbContext> _contextMock;
    private readonly CreateProductCommandHandler _handler;

    public CreateProductCommandHandlerTests()
    {
        _contextMock = new Mock<IApplicationDbContext>();
        _handler = new CreateProductCommandHandler(_contextMock.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldCreateProduct()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Title = "Test Product",
            Price = 99.99m,
            Description = "Test Description",
            Category = "Electronics"
        };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().BeGreaterThan(0);
        _contextMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_InvalidPrice_ShouldThrowValidationException()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Title = "Test Product",
            Price = -10m, // Invalid
            Description = "Test Description",
            Category = "Electronics"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(
            () => _handler.Handle(command, CancellationToken.None)
        );
    }
}
```

### Test Coverage

```bash
# Coverage raporu oluştur
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover

# HTML rapor oluştur
reportgenerator \
  -reports:coverage.opencover.xml \
  -targetdir:coverage \
  -reporttypes:Html

# Raporu aç
open coverage/index.html
```

### Hedef Coverage

- **Minimum:** 70%
- **Hedef:** 80%+
- **Critical Paths:** 95%+

## Integration Tests

### Kurulum

```bash
# Test projesi oluştur
dotnet new xunit -n IntegrationTests -o tests/IntegrationTests
cd tests/IntegrationTests

# Gerekli paketleri ekle
dotnet add package Microsoft.AspNetCore.Mvc.Testing
dotnet add package Testcontainers
dotnet add package Testcontainers.PostgreSql
```

### WebApplicationFactory Kullanımı

```csharp
using Microsoft.AspNetCore.Mvc.Testing;
using Testcontainers.PostgreSql;

namespace ShoppingProject.IntegrationTests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
        .WithImage("postgres:14")
        .WithDatabase("ShoppingDb_Test")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Test veritabanını kullan
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

            if (descriptor != null)
                services.Remove(descriptor);

            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseNpgsql(_dbContainer.GetConnectionString());
            });
        });
    }

    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();
    }

    public new async Task DisposeAsync()
    {
        await _dbContainer.StopAsync();
    }
}
```

### API Integration Test Örneği

```csharp
public class ProductsControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public ProductsControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetProducts_ReturnsSuccessStatusCode()
    {
        // Act
        var response = await _client.GetAsync("/api/v1/products");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        content.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task CreateProduct_WithValidData_ReturnsCreated()
    {
        // Arrange
        var product = new
        {
            Title = "Test Product",
            Price = 99.99,
            Description = "Test Description",
            Category = "Electronics",
            Image = "https://example.com/image.jpg"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/products", product);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
```

## E2E Tests (Playwright)

### Kurulum

```bash
# Frontend klasöründe
cd src/Presentation/ClientApp

# Playwright yükle
npm install -D @playwright/test
npx playwright install
```

### Test Örneği

```typescript
// tests/e2e/shopping-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Shopping Flow', () => {
  test('user can add product to cart and checkout', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'user@test.com');
    await page.fill('input[name="password"]', 'Test@123');
    await page.click('button[type="submit"]');
    
    // Navigate to products
    await page.goto('http://localhost:3000/products');
    await expect(page).toHaveURL(/.*products/);
    
    // Add to cart
    await page.click('button:has-text("Add to Cart"):first');
    await expect(page.locator('.cart-badge')).toHaveText('1');
    
    // Go to cart
    await page.click('a[href="/cart"]');
    await expect(page).toHaveURL(/.*cart/);
    
    // Verify product in cart
    await expect(page.locator('.cart-item')).toBeVisible();
    
    // Checkout
    await page.click('button:has-text("Checkout")');
    await expect(page).toHaveURL(/.*checkout/);
  });
});
```

### E2E Test Çalıştırma

```bash
# Tüm testler
npx playwright test

# Headed mode (browser görünür)
npx playwright test --headed

# Belirli bir test
npx playwright test shopping-flow.spec.ts

# Debug mode
npx playwright test --debug
```

## Performance Tests (k6)

### Kurulum

```bash
# k6 yükle (macOS)
brew install k6

# veya
# https://k6.io/docs/getting-started/installation/
```

### Load Test Örneği

```javascript
// tests/performance/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be below 1%
  },
};

export default function () {
  // Get products
  const res = http.get('https://localhost:7001/api/v1/products');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

### Performance Test Çalıştırma

```bash
# Load test
k6 run tests/performance/load-test.js

# Stress test
k6 run --vus 100 --duration 5m tests/performance/stress-test.js

# Spike test
k6 run tests/performance/spike-test.js
```

## Test Best Practices

### 1. AAA Pattern (Arrange-Act-Assert)

```csharp
[Fact]
public async Task Example_Test()
{
    // Arrange - Test için gerekli setup
    var command = new CreateProductCommand { /* ... */ };
    
    // Act - Test edilen metodu çalıştır
    var result = await _handler.Handle(command, CancellationToken.None);
    
    // Assert - Sonucu doğrula
    result.Should().BeGreaterThan(0);
}
```

### 2. Test Naming Convention

```csharp
// Pattern: MethodName_StateUnderTest_ExpectedBehavior
[Fact]
public async Task Handle_ValidCommand_ShouldCreateProduct() { }

[Fact]
public async Task Handle_InvalidPrice_ShouldThrowValidationException() { }
```

### 3. Test Data Builders

```csharp
public class ProductBuilder
{
    private string _title = "Default Product";
    private decimal _price = 99.99m;
    
    public ProductBuilder WithTitle(string title)
    {
        _title = title;
        return this;
    }
    
    public ProductBuilder WithPrice(decimal price)
    {
        _price = price;
        return this;
    }
    
    public Product Build()
    {
        return new Product
        {
            Title = _title,
            Price = _price,
            // ...
        };
    }
}

// Kullanım
var product = new ProductBuilder()
    .WithTitle("Test Product")
    .WithPrice(49.99m)
    .Build();
```

### 4. Mocking Best Practices

```csharp
// ✅ İyi - Sadece gerekli davranışı mock'la
_contextMock.Setup(x => x.Products.Add(It.IsAny<Product>()));

// ❌ Kötü - Tüm davranışları mock'lama
_contextMock.Setup(x => x.Products).Returns(mockDbSet.Object);
_contextMock.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);
// ...
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '10.0.x'
    
    - name: Restore dependencies
      run: dotnet restore
    
    - name: Build
      run: dotnet build --no-restore
    
    - name: Unit Tests
      run: dotnet test --no-build --verbosity normal --collect:"XPlat Code Coverage"
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage.opencover.xml
```

## Test Raporlama

### Coverage Badge

```markdown
[![codecov](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
```

### Test Results Dashboard

- **Azure DevOps:** Test Plans
- **GitHub Actions:** Test Summary
- **SonarQube:** Quality Gate

## Troubleshooting

### Test Timeout

```csharp
[Fact(Timeout = 5000)] // 5 saniye timeout
public async Task LongRunningTest() { }
```

### Flaky Tests

```csharp
// Retry mekanizması ekle
[Fact]
[Retry(3)]
public async Task FlakyTest() { }
```

### Database Cleanup

```csharp
public class DatabaseFixture : IDisposable
{
    public ApplicationDbContext Context { get; }
    
    public DatabaseFixture()
    {
        Context = CreateContext();
        Context.Database.EnsureCreated();
    }
    
    public void Dispose()
    {
        Context.Database.EnsureDeleted();
        Context.Dispose();
    }
}
```

## Sonraki Adımlar

- [Development Setup](/docs/guides/development-setup)
- [CI/CD Pipeline](/docs/guides/cicd)
- [Performance Optimization](/docs/guides/performance)
