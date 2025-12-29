namespace ShoppingProject.Domain.Common;

public abstract class BaseAuditableEntity : BaseEntity
{
    public string? EntityName { get; set; }
    public string? Action { get; set; } // Added | Modified | Deleted
    public string? EntityId { get; set; }

    public string? OldValues { get; set; }
    public string? NewValues { get; set; }

    public string? UserId { get; set; }
    public string? UserEmail { get; set; }
    public DateTimeOffset Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTimeOffset LastModified { get; set; }

    public string? LastModifiedBy { get; set; }

}
