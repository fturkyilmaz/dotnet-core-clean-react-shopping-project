using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Common;
using Microsoft.AspNetCore.Mvc;

namespace ShoppingProject.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CacheController : ControllerBase
    {
        private readonly IRedisCacheService _redisCacheService;

        public CacheController(IRedisCacheService redisCacheService)
        {
            _redisCacheService = redisCacheService;
        }

        [HttpGet("cache/{key}")]
        public async Task<IActionResult> Get(string key)
        {
            return Ok(await _redisCacheService.GetValueAsync(key));
        }

        [HttpPost("cache/set")]
        public async Task<IActionResult> Set([FromBody] RedisCacheRequest redisCacheRequestModel)
        {
            await _redisCacheService.SetValueAsync(redisCacheRequestModel.Key, redisCacheRequestModel.Value);
            return Ok();
        }

        [HttpDelete("cache/{key}")]
        public async Task<IActionResult> Delete(string key)
        {
            await _redisCacheService.Clear(key);
            return Ok();
        }
    }
}
