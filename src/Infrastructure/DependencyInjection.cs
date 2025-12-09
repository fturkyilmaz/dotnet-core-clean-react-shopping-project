using Ardalis.GuardClauses;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Services;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Infrastructure.Authorization;
using ShoppingProject.Infrastructure.BackgroundJobs;
using ShoppingProject.Infrastructure.Configuration;
using ShoppingProject.Infrastructure.Configuration.Validators;
using ShoppingProject.Infrastructure.Constants;
using ShoppingProject.Infrastructure.Data;
using ShoppingProject.Infrastructure.Data.Interceptors;
using ShoppingProject.Infrastructure.Identity;
using ShoppingProject.Infrastructure.Repositories;
using ShoppingProject.Infrastructure.Services;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static void AddInfrastructureServices(this IHostApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString(
            ConfigurationConstants.ConnectionStrings.DefaultConnection
        );
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
            builder.Configuration.GetConnectionString(
                ConfigurationConstants.ConnectionStrings.DefaultConnectionReadOnly
            ) ?? connectionString; // Fallback to default if not set

        builder.Services.AddDbContext<ReadOnlyApplicationDbContext>(
            (sp, options) =>
            {
                options.UseNpgsql(readOnlyConnectionString);
                // Disable change tracking for read-only context to improve performance
                options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
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
        builder.Services.AddSingleton<IClock, SystemClock>();
        builder.Services.AddTransient<IIdentityService, IdentityService>();

        // Register repositories
        builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        builder.Services.AddScoped<IFeatureFlagRepository, FeatureFlagRepository>();
        builder.Services.AddScoped<ICartRepository, CartRepository>();
        builder.Services.AddScoped<IProductRepository, ProductRepository>();

        builder.Services.AddSingleton<ICacheService, RedisCacheService>();
        builder.Services.AddScoped<IFeatureFlagService, FeatureFlagService>();
        builder.Services.AddHostedService<OutboxProcessorService>();

        builder.Services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = builder.Configuration.GetConnectionString(
                ConfigurationConstants.ConnectionStrings.RedisConnection
            );
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
                // Configure JWT options using strongly-typed configuration
                var jwtOptions = new JwtOptions();
                builder.Configuration.GetSection(JwtOptions.SectionName).Bind(jwtOptions);

                Guard.Against.Null(jwtOptions.Issuer, nameof(jwtOptions.Issuer));
                Guard.Against.Null(jwtOptions.Audience, nameof(jwtOptions.Audience));
                Guard.Against.Null(jwtOptions.Secret, nameof(jwtOptions.Secret));

                options.TokenValidationParameters =
                    new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtOptions.Issuer,
                        ValidAudience = jwtOptions.Audience,
                        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                            System.Text.Encoding.UTF8.GetBytes(jwtOptions.Secret)
                        ),
                    };
            });

        builder.Services.AddAuthorization(options =>
        {
            // Administrator-only policies
            options.AddPolicy(Policies.CanPurge, policy => policy.RequireRole(Roles.Administrator));
            options.AddPolicy(
                Policies.CanManageProducts,
                policy => policy.RequireRole(Roles.Administrator)
            );
            options.AddPolicy(
                Policies.RequireAdministratorRole,
                policy => policy.RequireRole(Roles.Administrator)
            );
            options.AddPolicy(
                Policies.CanManageClients,
                policy => policy.RequireRole(Roles.Administrator)
            );
            options.AddPolicy(
                Policies.CanViewSystemConfig,
                policy => policy.RequireRole(Roles.Administrator)
            );

            // Client role policy
            options.AddPolicy(
                Policies.RequireClientRole,
                policy => policy.RequireRole(Roles.Client)
            );
        });

        // Register authorization handlers
        builder.Services.AddScoped<IAuthorizationHandler, ResourceOwnerRequirementHandler>();
        builder.Services.AddScoped<IUser, CurrentUser>();
        builder.Services.AddScoped<IEmailService, EmailService>();
        builder.Services.AddSingleton<IValidator<RabbitMqOptions>, RabbitMqOptionsValidator>();
        builder.Services.AddSingleton<IValidator<RedisOptions>, RedisOptionsValidator>();
        builder.Services.AddSingleton<IValidator<PostgresOptions>, PostgresOptionsValidator>();

        builder.Services.AddHttpContextAccessor();
    }
}
