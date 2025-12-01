namespace ShoppingProject.Infrastructure.Configuration;

public class ApiKeyOptions
{
    public const string SectionName = "Authentication:ApiKey";
    public string Value { get; set; } = string.Empty;
}
