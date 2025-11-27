namespace ShoppingProject.Application.Common.Exceptions;

/// <summary>
/// Exception thrown when a requested resource is not found.
/// </summary>
public class NotFoundException : Exception
{
    public NotFoundException(string message)
        : base(message)
    {
    }

    public NotFoundException(string message, Exception innerException)
        : base(message, innerException)
    {
    }

    public NotFoundException(string name, object key)
        : base($"Entity \"{name}\" ({key}) was not found.")
    {
    }
}
