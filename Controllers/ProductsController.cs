using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Service;

namespace ShoppingProject.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(RedisCacheService cache) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        string key = $"product:{id}";

        var product = await cache.GetAsync<Product>(key);
        if (product != null)
            return Ok(product);

        // Simulate DB fetch
        product = new Product { Id = id, Name = $"Product {id}" };

        await cache.SetAsync(key, product, TimeSpan.FromMinutes(1));

        return Ok(product);
    }
}

public record Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
}