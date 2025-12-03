using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Domain.Entities;

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
                var identityRole = new IdentityRole(role);
                await roleManager.CreateAsync(identityRole);

                // ✅ Role claims ekle
                if (role == Roles.Administrator)
                {
                    await roleManager.AddClaimAsync(
                        identityRole,
                        new Claim(Policies.CanPurge, "true")
                    );
                    await roleManager.AddClaimAsync(
                        identityRole,
                        new Claim(Policies.CanManageProducts, "true")
                    );
                    await roleManager.AddClaimAsync(
                        identityRole,
                        new Claim(Policies.CanManageClients, "true")
                    );
                    await roleManager.AddClaimAsync(
                        identityRole,
                        new Claim(Policies.CanViewSystemConfig, "true")
                    );
                }
                else if (role == Roles.Client)
                {
                    await roleManager.AddClaimAsync(
                        identityRole,
                        new Claim(Policies.CanManageOwnClients, "true")
                    );
                }
            }
        }

        // --- Seed Admin User ---
        var adminEmail = "admin@test.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            var user = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FirstName = "System",
                LastName = "Admin",
                Gender = "Male",
            };

            var result = await userManager.CreateAsync(user, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, Roles.Administrator);

                await userManager.AddClaimAsync(
                    user,
                    new Claim(Policies.RequireAdministratorRole, "true")
                );
            }
        }

        // --- Seed Client User ---
        var clientEmail = "user@test.com";
        var clientUser = await userManager.FindByEmailAsync(clientEmail);
        if (clientUser == null)
        {
            var user = new ApplicationUser
            {
                UserName = clientEmail,
                Email = clientEmail,
                EmailConfirmed = true,
                FirstName = "Furkan",
                LastName = "Türkyılmaz",
                Gender = "Male",
            };

            var result = await userManager.CreateAsync(user, "User123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, Roles.Client);

                await userManager.AddClaimAsync(
                    user,
                    new Claim(Policies.RequireClientRole, "true")
                );
            }
        }
    }
}
