namespace ShoppingProject.Domain.Common;

public class RedisCacheRequest
{
    public string Key { get; set; } = "";
    public string Value { get; set; } = "";
}