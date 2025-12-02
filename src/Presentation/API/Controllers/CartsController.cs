using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Application.Carts.Commands.CreateCart;
using ShoppingProject.Application.Carts.Commands.DeleteAllCarts;
using ShoppingProject.Application.Carts.Commands.DeleteCart;
using ShoppingProject.Application.Carts.Commands.UpdateCart;
using ShoppingProject.Application.Carts.Queries.GetCartById;
using ShoppingProject.Application.Carts.Queries.GetCarts;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.WebApi.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class CartsController : ControllerBase
    {
        private readonly ISender _sender;

        public CartsController(ISender sender)
        {
            _sender = sender;
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(List<CartBriefDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<List<CartBriefDto>>> GetAll()
        {
            var carts = await _sender.Send(new GetCartsQuery());
            return Ok(carts);
        }

        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(typeof(CartBriefDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<CartBriefDto>> GetById(int id)
        {
            var cart = await _sender.Send(new GetCartByIdQuery(id));
            return Ok(cart);
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(ServiceResult<int>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<int>> Create(CreateCartCommand command)
        {
            var id = await _sender.Send(command);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Update(int id, UpdateCartCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            await _sender.Send(command);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Delete(int id)
        {
            await _sender.Send(new DeleteCartCommand(id));
            return NoContent();
        }

        [HttpDelete("delete-all")]
        [Authorize(Policy = Policies.CanPurge)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteAll()
        {
            await _sender.Send(new DeleteAllCartsCommand());
            return NoContent();
        }
    }
}
