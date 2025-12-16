using Ardalis.GuardClauses;
using FluentValidation;
using MassTransit;
using RabbitMQ.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Services;
using ShoppingProject.Application.Contracts.ServiceBus;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Infrastructure.Authorization;
using ShoppingProject.Infrastructure.BackgroundJobs;
using ShoppingProject.Infrastructure.Bus;
using ShoppingProject.Infrastructure.Configuration;
using ShoppingProject.Infrastructure.Configuration.Validators;
using ShoppingProject.Infrastructure.Constants;
using ShoppingProject.Infrastructure.Data;
using ShoppingProject.Infrastructure.Data.Interceptors;
using ShoppingProject.Infrastructure.Extensions;
using ShoppingProject.Infrastructure.Identity;
using ShoppingProject.Infrastructure.Repositories;
using ShoppingProject.Infrastructure.Services;

namespace ShoppingProject.Infrastructure;

public static class DependencyInjection
{
    public static void AddInfrastructureServices(this IHostApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString(
            ConfigurationConstants.ConnectionStrings.DefaultConnection
        );
        Guard.Against.Null(connectionString);

        // DbContexts
        builder.Services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        builder.Services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();
        builder.Services.AddScoped<ApplicationDbContextInitialiser>();

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(connectionString);
            options.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
        });
        builder.Services.AddScoped<IApplicationDbContext, ApplicationDbContext>();

        var readOnlyConnectionString =
            builder.Configuration.GetConnectionString(
                ConfigurationConstants.ConnectionStrings.DefaultConnectionReadOnly
            ) ?? connectionString;

        builder.Services.AddDbContext<ReadOnlyApplicationDbContext>(options =>
        {
            options.UseNpgsql(readOnlyConnectionString);
            options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            options.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
        });
        builder.Services.AddScoped<IReadOnlyApplicationDbContext, ReadOnlyApplicationDbContext>();

        // Identity
        builder
            .Services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        builder.Services.AddSingleton(TimeProvider.System);
        builder.Services.AddSingleton<IClock, SystemClock>();
        builder.Services.AddTransient<IIdentityService, IdentityService>();

        // Repositories
        builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        builder.Services.AddScoped<IFeatureFlagRepository, FeatureFlagRepository>();
        builder.Services.AddScoped<ICartRepository, CartRepository>();
        builder.Services.AddScoped<IProductRepository, ProductRepository>();
        builder.Services.AddScoped<IPushTokenRepository, PushTokenRepository>();

        // Services
        builder.Services.AddSingleton<ICacheService, RedisCacheService>();
        builder.Services.AddScoped<IFeatureFlagService, FeatureFlagService>();
        builder.Services.AddScoped<IEmailService, EmailService>();
        builder.Services.AddHostedService<OutboxProcessorService>();
        builder.Services.AddTransient<LogHangfireJobActivityAttribute>();

        // Cache
        builder.Services.AddMemoryCache();
        builder.Services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = builder.Configuration.GetConnectionString(
                ConfigurationConstants.ConnectionStrings.RedisConnection
            );
        });

        // MassTransit + ServiceBus
        builder.Services.AddMassTransit(x =>
        {
            x.AddConsumers(typeof(DependencyInjection).Assembly);

            x.UsingRabbitMq(
                (context, cfg) =>
                {
                    cfg.Host(
                        builder.Configuration.GetConnectionString(
                            ConfigurationConstants.ConnectionStrings.RabbitMqConnection
                        )
                    );

                    cfg.ConfigureEndpoints(context);
                }
            );
        });

        builder.Services.AddScoped<IServiceBus, ServiceBus>();

        // Authentication & JWT
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
                var jwtOptions = new JwtOptions();
                builder.Configuration.GetSection(JwtOptions.SectionName).Bind(jwtOptions);

                Guard.Against.Null(jwtOptions.Issuer);
                Guard.Against.Null(jwtOptions.Audience);
                Guard.Against.Null(jwtOptions.Secret);

                options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var cacheService =
                            context.HttpContext.RequestServices.GetRequiredService<ICacheService>();
                        var jti = context
                            .Principal?.FindFirst(
                                System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti
                            )
                            ?.Value;

                        if (!string.IsNullOrEmpty(jti))
                        {
                            var isRevoked = await cacheService.GetAsync<string>(
                                $"revoked_token:{jti}"
                            );
                            if (!string.IsNullOrEmpty(isRevoked))
                            {
                                context.Fail("Token is revoked.");
                            }
                        }
                    },
                };

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

        // Authorization Policies
        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy(Policies.CanPurge, p => p.RequireRole(Roles.Administrator));
            options.AddPolicy(Policies.CanManageProducts, p => p.RequireRole(Roles.Administrator));
            options.AddPolicy(
                Policies.RequireAdministratorRole,
                p => p.RequireRole(Roles.Administrator)
            );
            options.AddPolicy(Policies.CanManageClients, p => p.RequireRole(Roles.Administrator));
            options.AddPolicy(
                Policies.CanViewSystemConfig,
                p => p.RequireRole(Roles.Administrator)
            );
            options.AddPolicy(Policies.RequireClientRole, p => p.RequireRole(Roles.Client));
        });

        // Authorization Handlers
        builder.Services.AddScoped<IAuthorizationHandler, ResourceOwnerRequirementHandler>();
        builder.Services.AddScoped<IUser, CurrentUser>();

        // Observability
        const string serviceName = "ShoppingProject.API";
        builder.Services.AddTelemetry(serviceName);

        // Validators
        builder.Services.AddSingleton<IValidator<RabbitMqOptions>, RabbitMqOptionsValidator>();
        builder.Services.AddSingleton<IValidator<RedisOptions>, RedisOptionsValidator>();
        builder.Services.AddSingleton<IValidator<PostgresOptions>, PostgresOptionsValidator>();

        builder.Services.AddHttpContextAccessor();
    }
}
