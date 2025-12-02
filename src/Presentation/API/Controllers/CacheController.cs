using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Domain.Common;
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
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Get(string key)
        {
            var value = await _redisCacheService.GetValueAsync(key);
            if (value == null)
                return NotFound();
            return Ok(value);
        }

        [HttpPost("set")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Set([FromBody] RedisCacheRequest redisCacheRequestModel)
        {
            await _redisCacheService.SetValueAsync(
                redisCacheRequestModel.Key,
                redisCacheRequestModel.Value
            );
            return Ok();
        }

        [HttpDelete("{key}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Delete(string key)
        {
            await _redisCacheService.Clear(key);
            return Ok();
        }
    }
}
