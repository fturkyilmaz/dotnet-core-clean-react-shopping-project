using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Application.AuditLogs.Queries.GetAuditLogs;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.WebApi.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize(Policy = Policies.RequireAdministratorRole)]
public class AuditLogsController : ControllerBase
{
    private readonly ISender _sender;

    public AuditLogsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(ServiceResult<PaginatedList<AuditLogDto>>),
        StatusCodes.Status200OK
    )]
    public async Task<ActionResult<ServiceResult<PaginatedList<AuditLogDto>>>> GetAuditLogs(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10
    )
    {
        var result = await _sender.Send(
            new GetAuditLogsQuery { PageNumber = pageNumber, PageSize = pageSize }
        );

        return ServiceResult<PaginatedList<AuditLogDto>>.Success(result);
    }
}
