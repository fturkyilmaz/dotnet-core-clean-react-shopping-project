using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.ValueObjects;
using ShoppingProject.Infrastructure.Common.Exceptions;
using ShoppingProject.Infrastructure.Identity;

namespace ShoppingProject.Infrastructure.Data;

public static class InitialiserExtensions
{
    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();

        await initialiser.InitialiseAsync();
        await initialiser.SeedAsync();
    }
}

public class ApplicationDbContextInitialiser
{
    private readonly ILogger<ApplicationDbContextInitialiser> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public ApplicationDbContextInitialiser(
        ILogger<ApplicationDbContextInitialiser> logger,
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task InitialiseAsync()
    {
        try
        {
            await _context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initialising the database.");
            throw new InfrastructureException("Database initialisation failed", ex);
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw new InfrastructureException("Database seeding failed", ex);
        }
    }

    public async Task TrySeedAsync()
    {
        // Default roles
        var administratorRole = new IdentityRole(Roles.Administrator);

        if (await _roleManager.Roles.AllAsync(r => r.Name != administratorRole.Name))
        {
            await _roleManager.CreateAsync(administratorRole);
        }

        // Default users
        var administrator = new ApplicationUser
        {
            UserName = "administrator@localhost",
            Email = "administrator@localhost",
        };

        if (await _userManager.Users.AllAsync(u => u.UserName != administrator.UserName))
        {
            await _userManager.CreateAsync(administrator, "Administrator1!");
            if (!string.IsNullOrWhiteSpace(administratorRole.Name))
            {
                await _userManager.AddToRolesAsync(administrator, new[] { administratorRole.Name });
            }
        }

        if (!await _context.Products.AnyAsync())
        {
            var products = new List<Product>();

            var p1 = Product.Create(
                "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
                109,
                "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                "men's clothing",
                "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png"
            );
            p1.Id = 1;
            p1.UpdateRating(new Rating(3.9, 120));
            products.Add(p1);

            var p2 = Product.Create(
                "Mens Casual Premium Slim Fit T-Shirts",
                22,
                "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
                "men's clothing",
                "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png"
            );
            p2.Id = 2;
            p2.UpdateRating(new Rating(4.1, 259));
            products.Add(p2);

            var p3 = Product.Create(
                "Mens Cotton Jacket",
                55,
                "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
                "men's clothing",
                "https://fakestoreapi.com/img/71li-ujtlul._AC_UX679_t.png"
            );
            p3.Id = 3;
            p3.UpdateRating(new Rating(4.7, 500));
            products.Add(p3);

            var p4 = Product.Create(
                "Mens Casual Premium Slim Fit T-Shirts",
                22,
                "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
                "men's clothing",
                "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png"
            );
            p4.Id = 4;
            p4.UpdateRating(new Rating(4.1, 259));
            products.Add(p4);

            var p5 = Product.Create(
                "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
                695,
                "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
                "jewelery",
                "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg"
            );
            p5.Id = 5;
            p5.UpdateRating(new Rating(4.6, 400));
            products.Add(p5);

            var p6 = Product.Create(
                "Solid Gold Petite Micropave",
                168,
                "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.",
                "jewelery",
                "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg"
            );
            p6.Id = 6;
            p6.UpdateRating(new Rating(3.9, 70));
            products.Add(p6);

            var p7 = Product.Create(
                "White Gold Plated Princess",
                9.99m,
                "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
                "jewelery",
                "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg"
            );
            p7.Id = 7;
            p7.UpdateRating(new Rating(3, 400));
            products.Add(p7);

            var p8 = Product.Create(
                "Pierced Owl Rose Gold Plated Stainless Steel Double",
                10.99m,
                "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel",
                "jewelery",
                "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg"
            );
            p8.Id = 8;
            p8.UpdateRating(new Rating(1.9, 100));
            products.Add(p8);

            var p9 = Product.Create(
                "WD 2TB Elements Portable External Hard Drive - USB 3.0",
                64,
                "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
                "electronics",
                "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"
            );
            p9.Id = 9;
            p9.UpdateRating(new Rating(3.3, 203));
            products.Add(p9);

            var p10 = Product.Create(
                "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
                109,
                "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)",
                "electronics",
                "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg"
            );
            p10.Id = 10;
            p10.UpdateRating(new Rating(2.9, 470));
            products.Add(p10);

            _context.Products.AddRange(products);
            await _context.SaveChangesAsync();
        }
    }
}
