namespace ShoppingProject.Application.Common.Exceptions;

/// <summary>
/// Exception thrown when an unhandled request exception occurs.
/// </summary>
public class UnhandledRequestException : Exception
{
    public UnhandledRequestException(string requestName, object request, Exception innerException)
        : base(
            $"Unhandled exception in {requestName}. See inner exception for details.",
            innerException
        )
    {
        RequestName = requestName;
        Request = request;
    }

    public string RequestName { get; }
    public object Request { get; }
}
