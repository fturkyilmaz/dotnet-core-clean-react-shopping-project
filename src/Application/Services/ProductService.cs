
using AutoMapper;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Interfaces;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Interfaces;
using System.Net;

namespace ShoppingProject.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<ServiceResult<ProductDto>> CreateAsync(CreateProductDto dto)
        {
            var product = _mapper.Map<Product>(dto);
            await _productRepository.AddAsync(product);
            var productDto = _mapper.Map<ProductDto>(product);
            return ServiceResult<ProductDto>.SuccessAsCreated(productDto, $"/api/products/{product.Id}");
        }

        public async Task<ServiceResult<bool>> UpdateAsync(int id, UpdateProductDto dto)
        {
            var product = await _productRepository.GetAsync(p => p.Id == id);
            if (product == null) return ServiceResult<bool>.Fail($"Product with id {id} not found", HttpStatusCode.NotFound);
            
            _mapper.Map(dto, product);
            await _productRepository.UpdateAsync(product);
            return ServiceResult<bool>.Success(true, HttpStatusCode.NoContent);
        }

        public async Task<ServiceResult<bool>> DeleteAsync(int id)
        {
            var product = await _productRepository.GetAsync(p => p.Id == id);
            if (product == null) return ServiceResult<bool>.Fail($"Product with id {id} not found", HttpStatusCode.NotFound);
            await _productRepository.DeleteAsync(product);
            return ServiceResult<bool>.Success(true, HttpStatusCode.NoContent);
        }

        public async Task<ServiceResult<ProductDto>> GetByIdAsync(int id)
        {
            var product = await _productRepository.GetAsync(p => p.Id == id);
            if (product == null) return ServiceResult<ProductDto>.Fail($"Product with id {id} not found", HttpStatusCode.NotFound);
            return ServiceResult<ProductDto>.Success(_mapper.Map<ProductDto>(product));
        }

        public async Task<ServiceResult<IEnumerable<ProductDto>>> GetAllAsync()
        {
            var products = await _productRepository.GetListAsync();
            return ServiceResult<IEnumerable<ProductDto>>.Success(_mapper.Map<IEnumerable<ProductDto>>(products.Items));
        }

        public async Task<ServiceResult<IPaginate<ProductDto>>> GetAllByDynamicAsync(DynamicQuery dynamicQuery, int index = 0, int size = 10)
        {
            var products = await _productRepository.GetListByDynamicAsync(dynamicQuery, index: index, size: size);
            return ServiceResult<IPaginate<ProductDto>>.Success(_mapper.Map<IPaginate<ProductDto>>(products));
        }
    }
}
