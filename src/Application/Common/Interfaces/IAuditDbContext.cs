using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Common.Interfaces;

public interface IAuditDbContext
{
    IQueryable<AuditLog> AuditLogs { get; }
}
