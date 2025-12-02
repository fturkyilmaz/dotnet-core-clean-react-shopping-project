namespace ShoppingProject.Infrastructure.Configuration;

public class RedisOptions
{
    public const string SectionName = "Redis";
    public string ConnectionString { get; set; } = string.Empty;
}
