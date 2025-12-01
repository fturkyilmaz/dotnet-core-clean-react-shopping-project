namespace ShoppingProject.Domain.Constants;

public abstract class Policies
{
    public const string CanPurge = nameof(CanPurge);
    public const string CanManageProducts = nameof(CanManageProducts);
    public const string RequireAdministratorRole = nameof(RequireAdministratorRole);
    public const string RequireClientRole = nameof(RequireClientRole);
    public const string CanManageClients = nameof(CanManageClients);
    public const string CanViewSystemConfig = nameof(CanViewSystemConfig);
    public const string CanManageOwnClients = nameof(CanManageOwnClients);
};
