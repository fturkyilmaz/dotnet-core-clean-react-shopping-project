namespace ShoppingProject.Application.Common.Exceptions;

/// <summary>
/// Genel Application katmanı exception'ı.
/// </summary>
public class ApplicationBaseException : Exception
{
    public ApplicationBaseException(string message)
        : base(message) { }

    public ApplicationBaseException(string message, Exception innerException)
        : base(message, innerException) { }
}
