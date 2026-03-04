using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Enums;

namespace ShoppingProject.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Product entity.
/// </summary>
public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(p => p.Category)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Image)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(p => p.Price)
            .HasPrecision(18, 2);

        builder.Property(p => p.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        // Owned entity configuration for Rating
        builder.OwnsOne(p => p.Rating, ratingBuilder =>
        {
            ratingBuilder.Property(r => r.Rate).HasPrecision(3, 2);
            ratingBuilder.Property(r => r.Count);
        });

        // Index for common queries
        builder.HasIndex(p => p.Category);
        builder.HasIndex(p => p.Status);
        builder.HasIndex(p => new { p.Category, p.Status });

        // Global query filter for soft delete
        builder.HasQueryFilter(p => p.Status != EntityStatus.Deleted);

        // Auditable entity properties
        builder.Property(p => p.CreatedBy).HasMaxLength(256);
        builder.Property(p => p.LastModifiedBy).HasMaxLength(256);
    }
}
