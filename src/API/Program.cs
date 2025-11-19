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

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register dependencies And Use PostgreSQL Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddApplicationServices();
builder.Services.AddScoped<IUser, CurrentUser>();
builder.Services.AddTransient<IIdentityService, IdentityService>();
builder.Services.AddHttpContextAccessor();

builder.Services.AddBusExt(builder.Configuration);
builder.Services.AddSingleton<IRedisCacheService, RedisCacheService>();
builder.Services.AddSingleton<IConnectionMultiplexer>(sp => ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("RedisConnection") ?? "localhost:6379"));   

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();