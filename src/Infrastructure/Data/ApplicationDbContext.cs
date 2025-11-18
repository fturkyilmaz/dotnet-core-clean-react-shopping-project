
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
            
            // Configure Rating as an owned entity (no separate table, embedded in Product)
            modelBuilder.Entity<Product>()
                .OwnsOne(p => p.Rating);
            
            // Seed data
        //    modelBuilder.Entity<Product>().HasData(
        //         new Product() 
        //         { 
        //             Id = 1, 
        //             Title = "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops", 
        //             Price = 109.95m,
        //             Description = "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        //             Category = "men's clothing",
        //             Image = "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png"
        //         },
        //         new Product() 
        //         { 
        //             Id = 2, 
        //             Title = "Mens Casual Premium Slim Fit T-Shirts ", 
        //             Price = 22.30m, 
        //             Description = "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
        //             Category = "men's clothing",
        //             Image = "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png"
        //         },
        //         new Product() 
        //         { 
        //             Id = 3, 
        //             Title = "Mens Cotton Jacket", 
        //             Price = 55.99m, 
        //             Description = "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
        //             Category = "men's clothing",
        //             Image = "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png"
        //         },
        //         new Product() 
        //         { 
        //             Id = 4, 
        //             Title = "Mens Casual Slim Fit", 
        //             Price = 15.99m, 
        //             Description = "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
        //             Category = "men's clothing",
        //             Image = "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png"
        //         },
        //         new Product() 
        //         { 
        //             Id = 5, 
        //             Title = "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet", 
        //             Price = 695.00m, 
        //             Description = "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
        //             Category = "jewelery",
        //             Image = "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png"
        //         }
        //     );

        //     // You must use .OwnsOne().HasData() to seed data for the owned entity
        //     modelBuilder.Entity<Product>().OwnsOne(p => p.Rating).HasData(
        //         new { ProductId = 1, Rate = 3.9, Count = 120 },
        //         new { ProductId = 2, Rate = 4.1, Count = 259 },
        //         new { ProductId = 3, Rate = 4.7, Count = 500 },
        //         new { ProductId = 4, Rate = 2.1, Count = 430 },
        //         new { ProductId = 5, Rate = 4.6, Count = 400 }
        //     );
        }
    }
}
