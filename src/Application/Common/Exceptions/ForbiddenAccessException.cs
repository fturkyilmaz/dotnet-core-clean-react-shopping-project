namespace ShoppingProject.Application.Common.Exceptions;

/// <summary>
/// Exception thrown when a user attempts to access a resource without being authenticated
/// or having a valid session.
/// Corresponds to HTTP Status Code: 403 Forbidden.
/// </summary>
public class ForbiddenAccessException : Exception
{
    public ForbiddenAccessException()
        : base("Forbidden access attempted. You do not have permission to access this resource.")
    {
    }

    public ForbiddenAccessException(string message)
        : base(message)
    {
    }

    public ForbiddenAccessException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
