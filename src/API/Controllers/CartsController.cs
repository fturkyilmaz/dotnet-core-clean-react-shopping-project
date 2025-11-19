using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ShoppingProject.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartsController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartsController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartDto>>> GetAll()
        {
            var carts = await _cartService.GetAllAsync();
            return Ok(carts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CartDto>> GetById(int id)
        {
            var cart = await _cartService.GetByIdAsync(id);
            return Ok(cart);
        }

        [HttpPost]
        public async Task<ActionResult<CartDto>> Create(CreateCartDto dto)
        {
            var cart = await _cartService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = cart.Id }, cart);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateCartDto dto)
        {
            await _cartService.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _cartService.DeleteAsync(id);
            return NoContent();
        }
    }
}
