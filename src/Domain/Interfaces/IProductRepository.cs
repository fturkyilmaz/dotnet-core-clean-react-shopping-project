using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Domain.Interfaces;

public interface IProductRepository : IGenericRepository<Product>
{
    // Custom methods for Product if needed, otherwise generic ones cover most cases
}
