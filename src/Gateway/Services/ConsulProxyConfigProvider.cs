using Consul;
using Microsoft.Extensions.Primitives;
using Yarp.ReverseProxy.Configuration;
using YarpDestinationConfig = Yarp.ReverseProxy.Configuration.DestinationConfig;
using YarpRouteConfig = Yarp.ReverseProxy.Configuration.RouteConfig;

namespace ShoppingProject.Gateway.Services;

public class ConsulProxyConfigProvider : IProxyConfigProvider
{
    private readonly IConsulClient _consulClient;
    private CustomProxyConfig _config;
    private readonly ILogger<ConsulProxyConfigProvider> _logger;

    public ConsulProxyConfigProvider(
        IConsulClient consulClient,
        ILogger<ConsulProxyConfigProvider> logger
    )
    {
        _consulClient = consulClient;
        _logger = logger;
        _config = new CustomProxyConfig(new List<YarpRouteConfig>(), new List<ClusterConfig>());
        LoadConfig();
    }

    public IProxyConfig GetConfig() => _config;

    private void LoadConfig()
    {
        try
        {
            // In a real scenario, this would be async and polled periodically
            // For simplicity, we'll just load it once or on demand
            var services = _consulClient.Agent.Services().Result.Response;

            var routes = new List<YarpRouteConfig>();
            var clusters = new List<ClusterConfig>();

            foreach (var service in services.Values)
            {
                if (!service.Tags.Contains("api"))
                    continue;

                var clusterId = $"{service.Service}-cluster";
                var routeId = $"{service.Service}-route";

                routes.Add(
                    new YarpRouteConfig
                    {
                        RouteId = routeId,
                        ClusterId = clusterId,
                        Match = new RouteMatch
                        {
                            Path = "/api/{**catch-all}", // Simple catch-all for now
                        },
                    }
                );

                clusters.Add(
                    new ClusterConfig
                    {
                        ClusterId = clusterId,
                        Destinations = new Dictionary<string, YarpDestinationConfig>
                        {
                            {
                                "destination1",
                                new YarpDestinationConfig
                                {
                                    Address = $"http://{service.Address}:{service.Port}",
                                }
                            },
                        },
                    }
                );
            }

            // Fallback if no services found (for testing)
            if (!routes.Any())
            {
                routes.Add(
                    new YarpRouteConfig
                    {
                        RouteId = "fallback-route",
                        ClusterId = "fallback-cluster",
                        Match = new RouteMatch { Path = "{**catch-all}" },
                    }
                );
                clusters.Add(
                    new ClusterConfig
                    {
                        ClusterId = "fallback-cluster",
                        Destinations = new Dictionary<string, YarpDestinationConfig>
                        {
                            {
                                "destination1",
                                new YarpDestinationConfig { Address = "http://localhost:5000" }
                            },
                        },
                    }
                );
            }

            var oldConfig = _config;
            _config = new CustomProxyConfig(routes, clusters);
            oldConfig.SignalChange();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error loading config from Consul");
        }
    }

    private class CustomProxyConfig : IProxyConfig, IDisposable
    {
        private readonly CancellationTokenSource _cts = new CancellationTokenSource();

        public CustomProxyConfig(
            IReadOnlyList<YarpRouteConfig> routes,
            IReadOnlyList<ClusterConfig> clusters
        )
        {
            Routes = routes;
            Clusters = clusters;
            ChangeToken = new CancellationChangeToken(_cts.Token);
        }

        public IReadOnlyList<YarpRouteConfig> Routes { get; }
        public IReadOnlyList<ClusterConfig> Clusters { get; }
        public IChangeToken ChangeToken { get; }

        public void SignalChange()
        {
            _cts.Cancel();
        }

        public void Dispose()
        {
            _cts.Dispose();
        }
    }
}
