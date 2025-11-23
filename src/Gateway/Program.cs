using Consul;
using ShoppingProject.Gateway.Services;
using Yarp.ReverseProxy.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IConsulClient, ConsulClient>(p => new ConsulClient(consulConfig =>
{
    var address = builder.Configuration.GetValue<string>("Consul:Host") ?? "http://localhost:8500";
    consulConfig.Address = new Uri(address);
}));

builder.Services.AddSingleton<IProxyConfigProvider, ConsulProxyConfigProvider>();

builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.MapReverseProxy();

app.Run();
