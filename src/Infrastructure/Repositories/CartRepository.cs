
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Interfaces;
using ShoppingProject.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ShoppingProject.Infrastructure.Repositories
{
    public class CartRepository : GenericRepository<Cart>, ICartRepository
    {
        public CartRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
