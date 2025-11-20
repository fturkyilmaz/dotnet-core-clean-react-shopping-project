using ShoppingProject.Application.Interfaces;
using ShoppingProject.Application;
using ShoppingProject.Application.Services;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Infrastructure.Bus;
using ShoppingProject.Domain.Interfaces;
using ShoppingProject.Infrastructure.Data;
using ShoppingProject.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using ShoppingProject.Infrastructure.Identity;
using ShoppingProject.WebApi.Services;
using Asp.Versioning;
using ShoppingProject.WebApi;
using Serilog;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApiVersioning(options =>
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

builder.Services.AddSingleton<IConnectionMultiplexer>(sp => ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("RedisConnection") ?? "localhost:6379"));   

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddApplicationServices();
builder.Services.AddScoped<IUser, CurrentUser>();
builder.Services.AddHttpContextAccessor();

builder.Services.AddBusExt(builder.Configuration);
builder.Services.AddSingleton<IRedisCacheService, RedisCacheService>();


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
            options.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json", description.GroupName.ToUpperInvariant());
        }
    });
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();