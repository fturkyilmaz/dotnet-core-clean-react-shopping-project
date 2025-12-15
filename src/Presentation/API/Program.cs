using Serilog;
using ShoppingProject.Application;
using ShoppingProject.Infrastructure;
using ShoppingProject.Infrastructure.Constants;
using ShoppingProject.Infrastructure.Data;
using ShoppingProject.Infrastructure.Identity;
using ShoppingProject.WebApi;

var builder = WebApplication.CreateBuilder(args);

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Host.UseSerilog(
    (context, configuration) => configuration.ReadFrom.Configuration(context.Configuration)
);

// DI extension
builder.AddInfrastructureServices();
builder.Services.AddApplicationServices();
builder.Services.AddWebApiServices(builder.Configuration);

// OutputCache
builder.Services.AddOutputCache();

var app = builder.Build();

// Seed Identity data
using (var scope = app.Services.CreateScope())
{
    await DataSeeder.SeedAsync(scope.ServiceProvider, app.Environment.IsDevelopment());
}

// Middleware pipeline
app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseSerilogRequestLogging();
app.UseCors(AppConstants.CorsPolicies.AllowReactApp);
app.UseAuthentication();
app.UseAuthorization();

// OutputCache middleware
app.UseOutputCache();

app.MapControllers();
app.Run();
