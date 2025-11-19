using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ShoppingProject.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResult<IEnumerable<ProductDto>>>> GetAll()
        {
             var result = await _productService.GetAllAsync();
             return StatusCode((int)result.StatusCode, result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResult<ProductDto>>> GetById(int id)
        {
            var result = await _productService.GetByIdAsync(id);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResult<ProductDto>>> Create(CreateProductDto dto)
        {
            var result = await _productService.CreateAsync(dto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResult<bool>>> Update(int id, UpdateProductDto dto)
        {
            var result = await _productService.UpdateAsync(id, dto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResult<bool>>> Delete(int id)
        {
            var result = await _productService.DeleteAsync(id);
            return StatusCode((int)result.StatusCode, result);
        }
    }
}
