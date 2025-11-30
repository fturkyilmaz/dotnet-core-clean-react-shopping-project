using ShoppingProject.Application.Carts.Commands.DeleteAllCarts;
using ShoppingProject.Application.Carts.Commands.CreateCart;
using ShoppingProject.Application.Carts.Commands.UpdateCart;
using ShoppingProject.Application.Carts.Commands.DeleteCart;
using ShoppingProject.Application.Carts.Queries.GetCarts;
using ShoppingProject.Application.Carts.Queries.GetCartById;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using MediatR; // Added this using statement for ISender

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
        [AllowAnonymous]
        public async Task<ActionResult<List<CartBriefDto>>> GetAll()
        {
            var carts = await _sender.Send(new GetCartsQuery());
            return Ok(carts);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<CartBriefDto>> GetById(int id)
        {
            var cart = await _sender.Send(new GetCartByIdQuery(id));
            return Ok(cart);
        }

        [HttpPost]
        [Authorize(Policy = Policies.CanPurge)]
        public async Task<ActionResult<int>> Create(CreateCartCommand command)
        {
            var id = await _sender.Send(command);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = Policies.CanPurge)]
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
        [Authorize(Policy = Policies.CanPurge)]
        public async Task<IActionResult> Delete(int id)
        {
            await _sender.Send(new DeleteCartCommand(id));
            return NoContent();
        }

        [HttpDelete]
        [Route("delete-all")]
        [Authorize(Policy = Policies.CanPurge)]
        public async Task<IActionResult> DeleteAll()
        {
            await _sender.Send(new DeleteAllCartsCommand());
            return NoContent();
        }
    }
}
