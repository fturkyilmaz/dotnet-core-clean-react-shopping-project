using Asp.Versioning;
using Hangfire;
using Hangfire.PostgreSql;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;
using Serilog;
using ShoppingProject.Application;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Infrastructure.Bus;
using ShoppingProject.Infrastructure.Data;
using ShoppingProject.Infrastructure.Identity;
using ShoppingProject.WebApi;
using ShoppingProject.WebApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog(
    (context, configuration) => configuration.ReadFrom.Configuration(context.Configuration)
);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder
    .Services.AddApiVersioning(options =>
    {
        options.DefaultApiVersion = new ApiVersion(1, 0);
        options.AssumeDefaultVersionWhenUnspecified = true;
        options.ReportApiVersions = true;
    })
    .AddApiExplorer(options =>
    {
        options.GroupNameFormat = "'v'VVV";
        options.SubstituteApiVersionInUrl = true;
    });

builder.Services.ConfigureOptions<ConfigureSwaggerOptions>();

// Register dependencies And Use PostgreSQL Database
builder.AddInfrastructureServices();

builder.Services.AddApplicationServices();
builder.Services.AddScoped<IUser, CurrentUser>();
builder.Services.AddHttpContextAccessor();

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowReactApp",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173") // Vite default port
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    );
});

builder.Services.AddBusExt(builder.Configuration);

// Add Hangfire services
builder.Services.AddHangfire(configuration =>
    configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UsePostgreSqlStorage(options =>
            options.UseNpgsqlConnection(
                builder.Configuration.GetSection("Hangfire:ConnectionString").Value
            )
        )
);

builder.Services.AddHangfireServer(options =>
{
    options.WorkerCount = builder.Configuration.GetValue<int>("Hangfire:WorkerCount", 5);
});

builder
    .Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("DefaultConnection")!)
    .AddRedis(builder.Configuration.GetConnectionString("RedisConnection")!)
    .AddRabbitMQ(sp =>
    {
        var factory = new ConnectionFactory()
        {
            Uri = new Uri(builder.Configuration["ServiceBusOption:Url"]!),
        };
        return factory.CreateConnectionAsync().GetAwaiter().GetResult();
    })
    .AddUrlGroup(
        new Uri("http://localhost:9200"),
        name: "elasticsearch",
        tags: new[] { "elasticsearch" }
    );

builder.Services.AddHealthChecksUI().AddInMemoryStorage();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSerilogRequestLogging();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        var descriptions = app.DescribeApiVersions();
        foreach (var description in descriptions)
        {
            options.SwaggerEndpoint(
                $"/swagger/{description.GroupName}/swagger.json",
                description.GroupName.ToUpperInvariant()
            );
        }
    });

    // Add Hangfire Dashboard
    app.UseHangfireDashboard(
        builder.Configuration.GetValue<string>("Hangfire:DashboardPath", "/hangfire")
    );
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks(
    "/health",
    new HealthCheckOptions
    {
        Predicate = _ => true,
        ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
    }
);
app.MapHealthChecksUI(options => options.UIPath = "/health-ui");

app.MapControllers();
app.Run();
