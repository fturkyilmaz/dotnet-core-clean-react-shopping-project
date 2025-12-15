namespace ShoppingProject.Application.Common.Exceptions;

/// <summary>
/// Exception thrown when a requested resource is not found.
/// </summary>
public sealed class NotFoundException : Exception
{
    public string EntityName { get; }
    public object? Key { get; }

    public NotFoundException(string entityName, object key)
        : base($"Entity \"{entityName}\" ({key}) was not found.")
    {
        EntityName = entityName;
        Key = key;
    }

    public NotFoundException(string message)
        : base(message)
    {
        EntityName = string.Empty;
        Key = null;
    }

    public NotFoundException(string message, Exception innerException)
        : base(message, innerException)
    {
        EntityName = string.Empty;
        Key = null;
    }
}
