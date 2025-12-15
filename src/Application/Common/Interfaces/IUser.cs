namespace ShoppingProject.Application.Common.Interfaces
{
    public interface IUser
    {
        string? Id { get; }
        IReadOnlyCollection<string> GetRoles();
    }
}
