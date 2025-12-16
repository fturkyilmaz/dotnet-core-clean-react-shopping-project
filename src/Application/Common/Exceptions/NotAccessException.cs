using System;

namespace ShoppingProject.Application.Common.Exceptions;

/// <summary>
/// Exception thrown when a user attempts to access a resource without being authenticated
/// or having a valid session.
/// Corresponds to HTTP Status Code: 401 Unauthorized.
/// </summary>
public class NotAccessException : Exception
{
    public NotAccessException()
        : base("Unauthorized access attempted. Authentication is required to access this resource.")
    {
    }

    public NotAccessException(string message)
        : base(message)
    {
    }

    public NotAccessException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
