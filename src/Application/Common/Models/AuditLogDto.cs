namespace ShoppingProject.Application.Common.Models;

public class AuditLogDto
{
    public int Id { get; set; }
    public string? UserId { get; set; }
    public string? UserEmail { get; set; }
    public string? Action { get; set; }
    public string? EntityName { get; set; }
    public string? EntityId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public DateTimeOffset Timestamp { get; set; }
    public string? CorrelationId { get; set; }
    public string? RemoteIp { get; set; }
    public string? UserAgent { get; set; }
    public string? Hash { get; set; }
}
