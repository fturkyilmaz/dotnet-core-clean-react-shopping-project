
using ShoppingProject.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ShoppingProject.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>().HasKey(p => p.Id);

            // Seed data
            modelBuilder.Entity<Product>().HasData(
                new Product() { Id = 1, Name = "Product 1", Description = "Description 1", Price = 19.99m },
                new Product() { Id = 2, Name = "Product 2", Description = "Description 2", Price = 29.99m }
            );
        }
    }
}
