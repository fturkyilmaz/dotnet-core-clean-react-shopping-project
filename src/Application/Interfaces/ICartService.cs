using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Interfaces
{
    public interface ICartService
    {
        Task<ServiceResult<CartDto>> GetByIdAsync(int id);
        Task<ServiceResult<IEnumerable<CartDto>>> GetAllAsync();
        Task<ServiceResult<CartDto>> CreateAsync(CreateCartDto dto);
        Task<ServiceResult<bool>> UpdateAsync(int id, UpdateCartDto dto);
        Task<ServiceResult<bool>> DeleteAsync(int id);
    }
}
