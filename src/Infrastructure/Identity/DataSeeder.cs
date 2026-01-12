using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Infrastructure.Identity;

public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider, bool isDevelopment)
    {
        if (!isDevelopment)
            return;

        using var scope = serviceProvider.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        // --- Seed Roles ---
        var roles = new[] { Roles.Administrator, Roles.Client };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // --- Seed Admin User ---
        var adminEmail = "admin@test.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            var user = new ApplicationUser
            {
                UserName = adminEmail.Split('@')[0],
                Email = adminEmail,
                EmailConfirmed = true,
                FirstName = "System",
                LastName = "Admin",
                Gender = "Male",
                PhoneNumber = new Faker("tr").Phone.PhoneNumber("+90##########"),
                PhoneNumberConfirmed = true,
            };

            var result = await userManager.CreateAsync(user, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, Roles.Administrator);
            }
        }

        // --- Seed Client User ---
        var clientEmail = "user@test.com";
        var clientUser = await userManager.FindByEmailAsync(clientEmail);
        if (clientUser == null)
        {
            var user = new ApplicationUser
            {
                UserName = clientEmail.Split('@')[0],
                Email = clientEmail,
                EmailConfirmed = true,
                FirstName = "Furkan",
                LastName = "Türkyılmaz",
                Gender = "Male",
                PhoneNumber = new Faker("tr").Phone.PhoneNumber("+90##########"),
                PhoneNumberConfirmed = true,
            };

            var result = await userManager.CreateAsync(user, "User123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, Roles.Client);
            }
        }

        // --- Seed 50 Random Users ---
        var faker = new Faker("tr");
        for (int i = 0; i < 50; i++)
        {
            var email = faker.Internet.Email();
            var existingUser = await userManager.FindByEmailAsync(email);
            if (existingUser != null)
                continue;

            var user = new ApplicationUser
            {
                UserName = email.Split('@')[0],
                Email = email,
                EmailConfirmed = true,
                FirstName = faker.Name.FirstName(),
                LastName = faker.Name.LastName(),
                Gender = faker.PickRandom("Male", "Female", "Unknown"),
                PhoneNumber = faker.Phone.PhoneNumber("+90##########"),
                PhoneNumberConfirmed = true,
            };

            var result = await userManager.CreateAsync(user, "User123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, Roles.Client);
            }
        }
    }
}
