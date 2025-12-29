namespace ShoppingProject.Application.Common.Interfaces;

public interface IRequestContext
{
    string? CorrelationId { get; }
    string? RemoteIp { get; }
    string? UserAgent { get; }
}
