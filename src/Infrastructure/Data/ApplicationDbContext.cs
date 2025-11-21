
using ShoppingProject.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Infrastructure.Identity;

namespace ShoppingProject.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Cart> Carts { get; set; }

        IQueryable<Product> IApplicationDbContext.Products => Products;
        IQueryable<Cart> IApplicationDbContext.Carts => Carts;

        public new void Add<T>(T entity) where T : class
        {
            base.Add(entity);
        }

        public new void Remove<T>(T entity) where T : class
        {
            base.Remove(entity);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Product>().HasKey(p => p.Id);
            modelBuilder.Entity<Cart>().HasKey(c => c.Id);
            modelBuilder.Entity<Product>()
                .OwnsOne(p => p.Rating);
        }
    }
}
