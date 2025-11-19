using ShoppingProject.Application.Carts.Commands.CreateCart;
using ShoppingProject.Application.Carts.Commands.DeleteCart;
using ShoppingProject.Application.Carts.Commands.UpdateCart;
using ShoppingProject.Application.Carts.Queries.GetCartById;
using ShoppingProject.Application.Carts.Queries.GetCarts;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ShoppingProject.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly ISender _sender;

        public CartsController(ISender sender)
        {
            _sender = sender;
        }

        [HttpGet]
        public async Task<ActionResult<List<CartBriefDto>>> GetCarts()
        {
            return await _sender.Send(new GetCartsQuery());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CartBriefDto>> GetCart(int id)
        {
            return await _sender.Send(new GetCartByIdQuery(id));
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateCartCommand command)
        {
            return await _sender.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, UpdateCartCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            await _sender.Send(command);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _sender.Send(new DeleteCartCommand(id));

            return NoContent();
        }
    }
}
