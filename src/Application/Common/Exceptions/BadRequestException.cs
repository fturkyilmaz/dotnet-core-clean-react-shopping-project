namespace ShoppingProject.Application.Common.Exceptions;

/// <summary>
/// Exception thrown when a bad request is made.
/// </summary>
public class BadRequestException : Exception
{
    public BadRequestException(string message)
        : base(message)
    {
    }

    public BadRequestException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
