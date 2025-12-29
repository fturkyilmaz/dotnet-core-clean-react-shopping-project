using MediatR;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.AuditLogs.Queries.GetAuditLogs;

public record GetAuditLogsQuery : IRequest<PaginatedList<AuditLogDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}
