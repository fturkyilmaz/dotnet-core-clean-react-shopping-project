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
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
        {
            // var products = await _productService.GetAllAsync();

            var fakeProducts = new List<ProductDto>
            {
                new ProductDto(1, "Product 1", "Description 1", 100),
                new ProductDto(2, "Product 2", "Description 2", 200),
                new ProductDto(3, "Product 3", "Description 3", 300)
            };

            return Ok(fakeProducts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);
            return Ok(product);
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> Create(CreateProductDto dto)
        {
            var product = await _productService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateProductDto dto)
        {
            await _productService.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productService.DeleteAsync(id);
            return NoContent();
        }
    }
}
