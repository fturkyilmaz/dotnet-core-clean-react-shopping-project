namespace ShoppingProject.Application.Common.Interfaces
{
    public interface IUser
    {
        string? Id { get; }
        string? Email { get; }
        IReadOnlyCollection<string> GetRoles();
    }
}
