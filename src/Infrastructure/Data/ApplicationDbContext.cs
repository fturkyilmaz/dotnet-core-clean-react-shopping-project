using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Infrastructure.Identity;

namespace ShoppingProject.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<FeatureFlag> FeatureFlags { get; set; }
        public DbSet<OutboxMessage> OutboxMessages { get; set; }

        IQueryable<Product> IApplicationDbContext.Products => Products;
        IQueryable<Cart> IApplicationDbContext.Carts => Carts;
        IQueryable<FeatureFlag> IApplicationDbContext.FeatureFlags => FeatureFlags;
        IQueryable<OutboxMessage> IApplicationDbContext.OutboxMessages => OutboxMessages;

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

            builder.Entity<Product>().HasKey(p => p.Id);
            builder.Entity<Cart>().HasKey(c => c.Id);
            builder.Entity<Product>().OwnsOne(p => p.Rating);
        }
    }
}
