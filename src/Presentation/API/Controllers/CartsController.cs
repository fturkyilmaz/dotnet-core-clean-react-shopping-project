using System.Net;
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
        [ProducesResponseType(typeof(ServiceResult<List<CartBriefDto>>), StatusCodes.Status200OK)]
        public async Task<ActionResult<ServiceResult<List<CartBriefDto>>>> GetAll()
        {
            var carts = await _sender.Send(new GetCartsQuery());
            return ServiceResult<List<CartBriefDto>>.Success(carts);
        }

        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(typeof(ServiceResult<CartBriefDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ServiceResult<CartBriefDto>), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ServiceResult<CartBriefDto>>> GetById(int id)
        {
            var cart = await _sender.Send(new GetCartByIdQuery(id));
            if (cart == null)
                return ServiceResult<CartBriefDto>.Fail("Cart not found", HttpStatusCode.NotFound);

            return ServiceResult<CartBriefDto>.Success(cart);
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(ServiceResult<int>), StatusCodes.Status201Created)]
        public async Task<ActionResult<ServiceResult<int>>> Create(CreateCartCommand command)
        {
            var id = await _sender.Send(command);
            var location = Url.Action(nameof(GetById), new { id });
            return ServiceResult<int>.SuccessAsCreated(id, location!);
        }

        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(typeof(ServiceResult<bool>), StatusCodes.Status204NoContent)]
        public async Task<ActionResult<ServiceResult<bool>>> Update(
            int id,
            UpdateCartCommand command
        )
        {
            if (id != command.Id)
                return ServiceResult<bool>.Fail("Id mismatch", HttpStatusCode.BadRequest);

            await _sender.Send(command);
            return ServiceResult<bool>.Success(true, HttpStatusCode.NoContent);
        }

        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(typeof(ServiceResult<bool>), StatusCodes.Status204NoContent)]
        public async Task<ActionResult<ServiceResult<bool>>> Delete(int id)
        {
            await _sender.Send(new DeleteCartCommand(id));
            return ServiceResult<bool>.Success(true, HttpStatusCode.NoContent);
        }

        [HttpDelete("delete-all")]
        [Authorize]
        [ProducesResponseType(typeof(ServiceResult<bool>), StatusCodes.Status204NoContent)]
        public async Task<ActionResult<ServiceResult<bool>>> DeleteAll()
        {
            await _sender.Send(new DeleteAllCartsCommand());
            return ServiceResult<bool>.Success(true, HttpStatusCode.NoContent);
        }
    }
}
