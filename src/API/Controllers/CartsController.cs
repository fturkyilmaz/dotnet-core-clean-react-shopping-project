using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace ShoppingProject.WebApi.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartsController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResult<IEnumerable<CartDto>>>> GetAll()
        {
            var result = await _cartService.GetAllAsync();
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResult<CartDto>>> GetById(int id)
        {
            var result = await _cartService.GetByIdAsync(id);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResult<CartDto>>> Create(CreateCartDto dto)
        {
            var result = await _cartService.CreateAsync(dto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResult<bool>>> Update(int id, UpdateCartDto dto)
        {
            var result = await _cartService.UpdateAsync(id, dto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResult<bool>>> Delete(int id)
        {
            var result = await _cartService.DeleteAsync(id);
            return StatusCode((int)result.StatusCode, result);
        }
    }
}
