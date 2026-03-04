using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Enums;

namespace ShoppingProject.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Cart entity.
/// </summary>
public class CartConfiguration : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Image)
            .HasMaxLength(500);

        builder.Property(c => c.Price)
            .HasPrecision(18, 2);

        builder.Property(c => c.Quantity)
            .HasDefaultValue(1);

        builder.Property(c => c.OwnerId)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(c => c.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        // Index for common queries
        builder.HasIndex(c => c.OwnerId);
        builder.HasIndex(c => new { c.OwnerId, c.Status });

        // Global query filter for soft delete
        builder.HasQueryFilter(c => c.Status != EntityStatus.Deleted);

        // Auditable entity properties
        builder.Property(c => c.CreatedBy).HasMaxLength(256);
        builder.Property(c => c.LastModifiedBy).HasMaxLength(256);
    }
}
