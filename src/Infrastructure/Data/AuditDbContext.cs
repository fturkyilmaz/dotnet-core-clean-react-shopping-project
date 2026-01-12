using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Infrastructure.Data;

public class AuditDbContext : DbContext, IAuditDbContext
{
    public AuditDbContext(DbContextOptions<AuditDbContext> options)
        : base(options) { }

    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    IQueryable<AuditLog> IAuditDbContext.AuditLogs => AuditLogs;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditLog>(builder =>
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.EntityName).HasMaxLength(256);
            builder.Property(x => x.Action).HasMaxLength(50);
            builder.Property(x => x.UserId).HasMaxLength(256);
            builder.Property(x => x.UserEmail).HasMaxLength(256);
            builder.Property(x => x.CorrelationId).HasMaxLength(100);
            builder.Property(x => x.RemoteIp).HasMaxLength(50);

            // Optimization for the reads
            builder.HasIndex(x => x.Timestamp);
            builder.HasIndex(x => x.CorrelationId);
        });

        base.OnModelCreating(modelBuilder);
    }
}
