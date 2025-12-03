using System.Net;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.WebApi.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize(Policy = Policies.RequireAdministratorRole)]
    public class CacheController : ControllerBase
    {
        private readonly IRedisCacheService _redisCacheService;

        public CacheController(IRedisCacheService redisCacheService)
        {
            _redisCacheService = redisCacheService;
        }

        [HttpGet("{key}")]
        [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ServiceResult<string>>> Get(string key)
        {
            var value = await _redisCacheService.GetValueAsync(key);
            if (value == null)
                return ServiceResult<string>.Fail("Cache key not found", HttpStatusCode.NotFound);

            return ServiceResult<string>.Success(value);
        }

        [HttpPost("set")]
        [ProducesResponseType(typeof(ServiceResult<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ServiceResult<bool>), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ServiceResult<bool>>> Set(
            [FromBody] RedisCacheRequest redisCacheRequestModel
        )
        {
            if (string.IsNullOrWhiteSpace(redisCacheRequestModel.Key))
                return ServiceResult<bool>.Fail("Key cannot be empty", HttpStatusCode.BadRequest);

            await _redisCacheService.SetValueAsync(
                redisCacheRequestModel.Key,
                redisCacheRequestModel.Value
            );
            return ServiceResult<bool>.Success(true);
        }

        [HttpDelete("{key}")]
        [ProducesResponseType(typeof(ServiceResult<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ServiceResult<bool>), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ServiceResult<bool>>> Delete(string key)
        {
            var existing = await _redisCacheService.GetValueAsync(key);
            if (existing == null)
                return ServiceResult<bool>.Fail("Cache key not found", HttpStatusCode.NotFound);

            await _redisCacheService.Clear(key);
            return ServiceResult<bool>.Success(true);
        }
    }
}
