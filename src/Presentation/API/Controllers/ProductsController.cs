using System.Net;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Products.Commands.CreateProduct;
using ShoppingProject.Application.Products.Commands.DeleteProduct;
using ShoppingProject.Application.Products.Commands.UpdateProduct;
using ShoppingProject.Application.Products.Queries.GetProductById;
using ShoppingProject.Application.Products.Queries.GetProducts;
using ShoppingProject.Application.Products.Queries.SearchProducts;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Infrastructure.Constants;

namespace ShoppingProject.WebApi.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly IOutputCacheStore _outputCacheStore;

        public ProductsController(ISender sender, IOutputCacheStore outputCacheStore)
        {
            _sender = sender;
            _outputCacheStore = outputCacheStore;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(PolicyName = "ProductsList")]
        [ProducesResponseType(typeof(ServiceResult<List<ProductDto>>), StatusCodes.Status200OK)]
        public async Task<ActionResult<ServiceResult<List<ProductDto>>>> GetAll()
        {
            var products = await _sender.Send(new GetProductsQuery());
            return ServiceResult<List<ProductDto>>.Success(products);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [OutputCache(PolicyName = "ProductDetail")]
        [ProducesResponseType(typeof(ServiceResult<ProductDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ServiceResult<ProductDto>), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ServiceResult<ProductDto>>> GetById(int id)
        {
            var product = await _sender.Send(new GetProductByIdQuery(id));
            if (product == null)
                return ServiceResult<ProductDto>.Fail("Product not found", HttpStatusCode.NotFound);

            return ServiceResult<ProductDto>.Success(product);
        }

        [HttpPost]
        [Authorize(Policy = Policies.CanManageProducts)]
        [ProducesResponseType(typeof(ServiceResult<int>), StatusCodes.Status201Created)]
        public async Task<ActionResult<ServiceResult<int>>> Create(
            CreateProductCommand command,
            CancellationToken token
        )
        {
            var id = await _sender.Send(command);
            await _outputCacheStore.EvictByTagAsync(AppConstants.CacheTags.Products, token);

            var location = Url.Action(nameof(GetById), new { id });
            return ServiceResult<int>.SuccessAsCreated(id, location!);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = Policies.CanManageProducts)]
        [ProducesResponseType(typeof(ServiceResult<bool>), StatusCodes.Status204NoContent)]
        public async Task<ActionResult<ServiceResult<bool>>> Update(
            int id,
            UpdateProductCommand command,
            CancellationToken token
        )
        {
            if (id != command.Id)
                return ServiceResult<bool>.Fail("Id mismatch", HttpStatusCode.BadRequest);

            await _sender.Send(command);
            await _outputCacheStore.EvictByTagAsync(AppConstants.CacheTags.Products, token);

            return ServiceResult<bool>.Success(true, HttpStatusCode.NoContent);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = Policies.CanManageProducts)]
        [ProducesResponseType(typeof(ServiceResult<bool>), StatusCodes.Status204NoContent)]
        public async Task<ActionResult<ServiceResult<bool>>> Delete(int id, CancellationToken token)
        {
            await _sender.Send(new DeleteProductCommand(id));
            await _outputCacheStore.EvictByTagAsync(AppConstants.CacheTags.Products, token);

            return ServiceResult<bool>.Success(true, HttpStatusCode.NoContent);
        }

        [HttpPost("search")]
        [AllowAnonymous]
        [ProducesResponseType(
            typeof(ServiceResult<IPaginate<ProductDto>>),
            StatusCodes.Status200OK
        )]
        public async Task<ActionResult<ServiceResult<IPaginate<ProductDto>>>> Search(
            [FromBody] DynamicQuery dynamicQuery,
            [FromQuery] int index = 0,
            [FromQuery] int size = 10
        )
        {
            var result = await _sender.Send(new SearchProductsQuery(dynamicQuery, index, size));
            return ServiceResult<IPaginate<ProductDto>>.Success(result);
        }
    }
}
