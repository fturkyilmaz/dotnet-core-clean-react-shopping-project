namespace ShoppingProject.Application.Common.Exceptions;

/// <summary>
/// Exception thrown when a business rule is violated.
/// </summary>
public sealed class BusinessRuleException : Exception
{
    public string RuleName { get; }
    public object? Context { get; }

    public BusinessRuleException(string ruleName, string message, object? context = null)
        : base($"Business rule \"{ruleName}\" was violated. {message}")
    {
        RuleName = ruleName;
        Context = context;
    }

    public BusinessRuleException(string message)
        : base(message)
    {
        RuleName = string.Empty;
        Context = null;
    }

    public BusinessRuleException(string message, Exception innerException)
        : base(message, innerException)
    {
        RuleName = string.Empty;
        Context = null;
    }
}
