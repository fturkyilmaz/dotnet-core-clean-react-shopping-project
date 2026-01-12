namespace ShoppingProject.Domain.Exceptions;

/// <summary>
/// Base exception for all domain-related exceptions.
/// </summary>
public abstract class DomainException : Exception
{
    protected DomainException(string message, Exception? innerException = null)
        : base(message, innerException)
    {
    }

    protected DomainException(string code, string message, Exception? innerException = null)
        : base(message, innerException)
    {
        Code = code;
    }

    /// <summary>
    /// Gets the error code for this exception.
    /// </summary>
    public string? Code { get; }
}

/// <summary>
/// Exception thrown when application logic validation fails.
/// </summary>
public sealed class BusinessException : DomainException
{
    public BusinessException(string message, Exception? innerException = null)
        : base(nameof(BusinessException), message, innerException)
    {
    }

    public BusinessException(string code, string message, Exception? innerException = null)
        : base(code, message, innerException)
    {
    }
}

/// <summary>
/// Exception thrown when an entity is not found.
/// </summary>
public sealed class EntityNotFoundException : DomainException
{
    public EntityNotFoundException(string entityName, string identifier)
        : base(
            "NotFound",
            $"{entityName} with identifier '{identifier}' was not found.")
    {
        EntityName = entityName;
        Identifier = identifier;
    }

    public string EntityName { get; }
    public string Identifier { get; }
}

/// <summary>
/// Exception thrown when there's a conflict (e.g., duplicate key, version conflict).
/// </summary>
public sealed class ConflictException : DomainException
{
    public ConflictException(string message, Exception? innerException = null)
        : base("Conflict", message, innerException)
    {
    }
}

/// <summary>
/// Exception thrown when a resource access is forbidden.
/// </summary>
public sealed class ForbiddenException : DomainException
{
    public ForbiddenException(string message = "You do not have permission to perform this action.")
        : base("Forbidden", message)
    {
    }
}

/// <summary>
/// Exception thrown when authentication is required but not provided.
/// </summary>
public sealed class UnauthorizedException : DomainException
{
    public UnauthorizedException(string message = "You must be authenticated to access this resource.")
        : base("Unauthorized", message)
    {
    }
}

/// <summary>
/// Exception thrown when entity state is invalid.
/// </summary>
public sealed class InvalidEntityStateException : DomainException
{
    public InvalidEntityStateException(string entityName, string reason)
        : base(
            "InvalidEntityState",
            $"Entity '{entityName}' is in an invalid state: {reason}")
    {
        EntityName = entityName;
        Reason = reason;
    }

    public string EntityName { get; }
    public string Reason { get; }
}

/// <summary>
/// Exception thrown when operation preconditions are not met.
/// </summary>
public sealed class PreconditionFailedException : DomainException
{
    public PreconditionFailedException(string message, Exception? innerException = null)
        : base("PreconditionFailed", message, innerException)
    {
    }
}
