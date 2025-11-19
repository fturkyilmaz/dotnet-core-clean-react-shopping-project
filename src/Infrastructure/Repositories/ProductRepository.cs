using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Interfaces;
using ShoppingProject.Infrastructure.Data;

namespace ShoppingProject.Infrastructure.Repositories;

public class ProductRepository : GenericRepository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context) : base(context)
    {
        
    }
}