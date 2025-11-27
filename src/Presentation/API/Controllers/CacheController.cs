using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Common;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace ShoppingProject.WebApi.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class CacheController : ControllerBase
    {
        private readonly IRedisCacheService _redisCacheService;

        public CacheController(IRedisCacheService redisCacheService)
        {
            _redisCacheService = redisCacheService;
        }

        [HttpGet("{key}")]
        public async Task<IActionResult> Get(string key)
        {
            var value = await _redisCacheService.GetValueAsync(key);
            if (value == null) return NotFound();
            return Ok(value);
        }

        [HttpPost("set")]
        public async Task<IActionResult> Set([FromBody] RedisCacheRequest redisCacheRequestModel)
        {
            await _redisCacheService.SetValueAsync(redisCacheRequestModel.Key, redisCacheRequestModel.Value);
            return Ok();
        }

        [HttpDelete("{key}")]
        public async Task<IActionResult> Delete(string key)
        {
            await _redisCacheService.Clear(key);
            return Ok();
        }
    }
}
