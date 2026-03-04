using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Infrastructure.Data.Configurations;
using ShoppingProject.Infrastructure.Identity;

namespace ShoppingProject.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<FeatureFlag> FeatureFlags { get; set; }
    public DbSet<OutboxMessage> OutboxMessages { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    IQueryable<Product> IApplicationDbContext.Products => Products;
    IQueryable<Cart> IApplicationDbContext.Carts => Carts;
    IQueryable<FeatureFlag> IApplicationDbContext.FeatureFlags => FeatureFlags;
    IQueryable<OutboxMessage> IApplicationDbContext.OutboxMessages => OutboxMessages;
    IQueryable<AuditLog> IApplicationDbContext.AuditLogs => AuditLogs;

    public new void Add<T>(T entity)
        where T : class
    {
        base.Add(entity);
    }

    public new void Remove<T>(T entity)
        where T : class
    {
        base.Remove(entity);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Apply entity configurations
        builder.ApplyConfiguration(new ProductConfiguration());
        builder.ApplyConfiguration(new CartConfiguration());

        // AuditLog configuration (can be moved to separate config class in future)
        builder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.EntityName).HasMaxLength(256);
            entity.Property(a => a.Action).HasMaxLength(50);
            entity.Property(a => a.UserId).HasMaxLength(256);
            entity.Property(a => a.UserEmail).HasMaxLength(256);
            entity.Property(a => a.UserAgent).HasMaxLength(500);
            entity.HasIndex(a => a.Timestamp);
            entity.HasIndex(a => a.EntityName);
            entity.HasIndex(a => a.UserId);
        });

        // FeatureFlag configuration
        builder.Entity<FeatureFlag>(entity =>
        {
            entity.HasKey(f => f.Id);
            entity.Property(f => f.Name).IsRequired().HasMaxLength(100);
            entity.Property(f => f.Description).HasMaxLength(500);
            entity.HasIndex(f => f.Name).IsUnique();
        });

        // OutboxMessage configuration
        builder.Entity<OutboxMessage>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.Property(o => o.Type).IsRequired().HasMaxLength(255);
            entity.HasIndex(o => new { o.ProcessedOnUtc, o.NextRetryUtc });
            entity.HasIndex(o => o.CorrelationId);
        });
    }
}
