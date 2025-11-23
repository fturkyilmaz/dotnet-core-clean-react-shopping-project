using Microsoft.EntityFrameworkCore;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Common.Interfaces;

public interface IReadOnlyApplicationDbContext
{
    IQueryable<Product> Products { get; }
    IQueryable<Cart> Carts { get; }
    // Add other entities as needed
}
