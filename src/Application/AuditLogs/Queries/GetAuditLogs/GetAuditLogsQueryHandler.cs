using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Mappings;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.AuditLogs.Queries.GetAuditLogs;

public class GetAuditLogsQueryHandler
    : IRequestHandler<GetAuditLogsQuery, PaginatedList<AuditLogDto>>
{
    private readonly IAuditDbContext _context;
    private readonly IMapper _mapper;

    public GetAuditLogsQueryHandler(IAuditDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<AuditLogDto>> Handle(
        GetAuditLogsQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _context
            .AuditLogs.AsNoTracking()
            .OrderByDescending(x => x.Timestamp)
            .ProjectTo<AuditLogDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize, cancellationToken);
    }
}
