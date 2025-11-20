using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Interfaces;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace ShoppingProject.WebApi.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<ServiceResult<IEnumerable<ProductDto>>>> GetAll()
        {
             var result = await _productService.GetAllAsync();
             return StatusCode((int)result.StatusCode, result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ServiceResult<ProductDto>>> GetById(int id)
        {
            var result = await _productService.GetByIdAsync(id);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost]
        [Authorize(Policy = Policies.CanManageProducts)]
        public async Task<ActionResult<ServiceResult<ProductDto>>> Create(CreateProductDto dto)
        {
            var result = await _productService.CreateAsync(dto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = Policies.CanManageProducts)]
        public async Task<ActionResult<ServiceResult<bool>>> Update(int id, UpdateProductDto dto)
        {
            var result = await _productService.UpdateAsync(id, dto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = Policies.CanManageProducts)]
        public async Task<ActionResult<ServiceResult<bool>>> Delete(int id)
        {
            var result = await _productService.DeleteAsync(id);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("search")]
        [AllowAnonymous]
        public async Task<ActionResult<ServiceResult<IPaginate<ProductDto>>>> Search(
            [FromBody] DynamicQuery dynamicQuery,
            [FromQuery] int index = 0,
            [FromQuery] int size = 10)
        {
            var result = await _productService.GetAllByDynamicAsync(dynamicQuery, index, size);
            return StatusCode((int)result.StatusCode, result);
        }
    }
}
