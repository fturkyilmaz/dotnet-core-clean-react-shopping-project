
using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Interfaces;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Interfaces;

namespace ShoppingProject.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<ProductDto> GetByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) throw new Exception($"Product with id {id} not found");
            var ratingDto = product.Rating != null ? new RatingDto { Rate = product.Rating.Rate, Count = product.Rating.Count } : null;
            return new ProductDto(product.Id, product.Title, product.Description, product.Price, product.Category, product.Image, ratingDto);
        }

        public async Task<IEnumerable<ProductDto>> GetAllAsync()
        {
            var products = await _productRepository.GetAllAsync();
            return products.Select(p => 
            {
                var ratingDto = p.Rating != null ? new RatingDto { Rate = p.Rating.Rate, Count = p.Rating.Count } : null;
                return new ProductDto(p.Id, p.Title, p.Description, p.Price, p.Category, p.Image, ratingDto);
            });
        }

        public async Task<ProductDto> CreateAsync(CreateProductDto dto)
        {
            var product = new Product
            {
                Title = dto.Title,
                Description = dto.Description,
                Price = dto.Price,
                Category = dto.Category,
                Image = dto.Image,
                Rating = dto.Rating != null ? new Rating { Rate = dto.Rating.Rate, Count = dto.Rating.Count } : new Rating()
            };
            await _productRepository.AddAsync(product);
            var ratingDto = product.Rating != null ? new RatingDto { Rate = product.Rating.Rate, Count = product.Rating.Count } : null;
            return new ProductDto(product.Id, product.Title, product.Description, product.Price, product.Category, product.Image, ratingDto);
        }

        public async Task UpdateAsync(int id, UpdateProductDto dto)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) throw new Exception($"Product with id {id} not found");
            product.Title = dto.Title;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Category = dto.Category;
            product.Image = dto.Image;
            if (dto.Rating != null)
            {
                product.Rating = new Rating { Rate = dto.Rating.Rate, Count = dto.Rating.Count };
            }
            await _productRepository.UpdateAsync(product);
        }

        public async Task DeleteAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) throw new Exception($"Product with id {id} not found");
            await _productRepository.DeleteAsync(product);
        }
    }
}
