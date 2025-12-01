namespace ShoppingProject.Domain.Constants;

public static class Permissions
{
    // Product Management
    public const string ProductCreate = "product.create";
    public const string ProductRead = "product.read";
    public const string ProductUpdate = "product.update";
    public const string ProductDelete = "product.delete";
    public const string ProductManage = "product.manage";

    // Cart Management
    public const string CartCreate = "cart.create";
    public const string CartRead = "cart.read";
    public const string CartUpdate = "cart.update";
    public const string CartDelete = "cart.delete";
    public const string CartManage = "cart.manage";

    // Client Management
    public const string ClientCreate = "client.create";
    public const string ClientRead = "client.read";
    public const string ClientUpdate = "client.update";
    public const string ClientDelete = "client.delete";
    public const string ClientManage = "client.manage";

    // System Configuration
    public const string SystemConfig = "system.config";
    public const string SystemMonitoring = "system.monitoring";
}
