using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Interfaces
{
    public interface ICartService
    {
        Task<CartDto> GetByIdAsync(int id);
        Task<IEnumerable<CartDto>> GetAllAsync();
        Task<CartDto> CreateAsync(CreateCartDto dto);
        Task UpdateAsync(int id, UpdateCartDto dto);
        Task DeleteAsync(int id);
    }
}
