namespace ShoppingProject.Infrastructure.Configuration;

public class PostgresOptions
{
    public const string SectionName = "Postgres";
    public string ConnectionString { get; set; } = string.Empty;
}
