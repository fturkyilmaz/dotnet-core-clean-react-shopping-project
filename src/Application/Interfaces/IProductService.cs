using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Domain.Common;

namespace ShoppingProject.Application.Interfaces
{
    public interface IProductService
    {
        Task<ServiceResult<ProductDto>> GetByIdAsync(int id);
        Task<ServiceResult<IEnumerable<ProductDto>>> GetAllAsync();
        Task<ServiceResult<IPaginate<ProductDto>>> GetAllByDynamicAsync(DynamicQuery dynamicQuery, int index = 0, int size = 10);
        Task<ServiceResult<ProductDto>> CreateAsync(CreateProductDto dto);
        Task<ServiceResult<bool>> UpdateAsync(int id, UpdateProductDto dto);
        Task<ServiceResult<bool>> DeleteAsync(int id);
    }
}
