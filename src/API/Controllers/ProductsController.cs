using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Products.Commands.CreateProduct;
using ShoppingProject.Application.Products.Commands.DeleteProduct;
using ShoppingProject.Application.Products.Commands.UpdateProduct;
using ShoppingProject.Application.Products.Queries.GetProductById;
using ShoppingProject.Application.Products.Queries.GetProducts;
using ShoppingProject.Application.Products.Queries.SearchProducts;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.WebApi.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ISender _sender;

        public ProductsController(ISender sender)
        {
            _sender = sender;
        }

        [HttpGet]
        [AllowAnonymous]
        [Microsoft.AspNetCore.OutputCaching.OutputCache(PolicyName = "ProductsList")]
        public async Task<ActionResult<List<ProductDto>>> GetAll()
        {
            var products = await _sender.Send(new GetProductsQuery());
            return Ok(products);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [Microsoft.AspNetCore.OutputCaching.OutputCache(PolicyName = "ProductDetail")]
        public async Task<ActionResult<ProductDto>> GetById(int id)
        {
            var product = await _sender.Send(new GetProductByIdQuery(id));
            return Ok(product);
        }

        [HttpPost]
        [Authorize(Policy = Policies.CanManageProducts)]
        public async Task<ActionResult<int>> Create(CreateProductCommand command)
        {
            var id = await _sender.Send(command);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = Policies.CanManageProducts)]
        public async Task<IActionResult> Update(int id, UpdateProductCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            await _sender.Send(command);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = Policies.CanManageProducts)]
        public async Task<IActionResult> Delete(int id)
        {
            await _sender.Send(new DeleteProductCommand(id));
            return NoContent();
        }

        [HttpPost("search")]
        [AllowAnonymous]
        public async Task<ActionResult<IPaginate<ProductDto>>> Search(
            [FromBody] DynamicQuery dynamicQuery,
            [FromQuery] int index = 0,
            [FromQuery] int size = 10
        )
        {
            var result = await _sender.Send(new SearchProductsQuery(dynamicQuery, index, size));
            return Ok(result);
        }

        [HttpGet("secure-test")]
        [ShoppingProject.WebApi.Attributes.ApiKey]
        public IActionResult SecureTest()
        {
            return Ok("Authenticated with API Key");
        }
    }
}
