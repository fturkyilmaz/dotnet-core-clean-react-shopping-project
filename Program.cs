using ShoppingProject.Service;
using StackExchange.Redis;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var configuration = builder.Configuration.GetConnectionString("Redis");
    if (string.IsNullOrEmpty(configuration))
    {
        throw new InvalidOperationException("Redis connection string is not configured.");
    }

    return ConnectionMultiplexer.Connect(configuration);
});


builder.Services.AddScoped<RedisCacheService>();
builder.Services.AddControllers();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();


app.Run();