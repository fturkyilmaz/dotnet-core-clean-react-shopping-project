using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.API.Controllers;

[ApiController]
[Route("api/${LOWER}s")]
public class ${NAME}sController : ControllerBase
{
    private readonly IMediator _mediator;

    public ${NAME}sController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create(Create${NAME}Command command)
        => Ok(await _mediator.Send(command));
}
