using Ardalis.GuardClauses;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Infrastructure.Data;
using ShoppingProject.Infrastructure.Data.Interceptors;
using ShoppingProject.Infrastructure.Identity;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static void AddInfrastructureServices(this IHostApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        Guard.Against.Null(
            connectionString,
            message: "Connection string 'DefaultConnection' not found."
        );

        builder.Services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        builder.Services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();
        builder.Services.AddScoped<ApplicationDbContextInitialiser>();

        builder.Services.AddDbContext<ApplicationDbContext>(
            (sp, options) =>
            {
                options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
                options.UseNpgsql(connectionString);
                options.ConfigureWarnings(warnings =>
                    warnings.Ignore(RelationalEventId.PendingModelChangesWarning)
                );
            }
        );

        builder.Services.AddScoped<IApplicationDbContext>(provider =>
            provider.GetRequiredService<ApplicationDbContext>()
        );

        var readOnlyConnectionString =
            builder.Configuration.GetConnectionString("DefaultConnection_ReadOnly")
            ?? connectionString; // Fallback to default if not set

        builder.Services.AddDbContext<ReadOnlyApplicationDbContext>(
            (sp, options) =>
            {
                options.UseNpgsql(readOnlyConnectionString);
                options.ConfigureWarnings(warnings =>
                    warnings.Ignore(RelationalEventId.PendingModelChangesWarning)
                );
            }
        );

        builder.Services.AddScoped<IReadOnlyApplicationDbContext>(provider =>
            provider.GetRequiredService<ReadOnlyApplicationDbContext>()
        );

        builder
            .Services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        builder.Services.AddSingleton(TimeProvider.System);
        builder.Services.AddTransient<IIdentityService, IdentityService>();
        builder.Services.AddSingleton<
            ICacheService,
            ShoppingProject.Infrastructure.Services.CacheService
        >();

        builder.Services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = builder.Configuration.GetConnectionString("RedisConnection");
        });

        builder
            .Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = Microsoft
                    .AspNetCore
                    .Authentication
                    .JwtBearer
                    .JwtBearerDefaults
                    .AuthenticationScheme;
                options.DefaultChallengeScheme = Microsoft
                    .AspNetCore
                    .Authentication
                    .JwtBearer
                    .JwtBearerDefaults
                    .AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters =
                    new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                        ValidAudience = builder.Configuration["JwtSettings:Audience"],
                        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                            System.Text.Encoding.UTF8.GetBytes(
                                builder.Configuration["JwtSettings:Secret"]!
                            )
                        ),
                    };
            });

        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy(Policies.CanPurge, policy => policy.RequireRole(Roles.Administrator));
            options.AddPolicy(
                Policies.CanManageProducts,
                policy => policy.RequireRole(Roles.Administrator)
            );
        });
    }
}
