
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
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IMapper _mapper;

        public CartService(ICartRepository cartRepository, IMapper mapper)
        {
            _cartRepository = cartRepository;
            _mapper = mapper;
        }


        public async Task<ServiceResult<CartDto>> CreateAsync(CreateCartDto dto)
        {
            var cart = _mapper.Map<Cart>(dto);
            await _cartRepository.AddAsync(cart);
            var cartDto = _mapper.Map<CartDto>(cart);
            return ServiceResult<CartDto>.SuccessAsCreated(cartDto, $"/api/carts/{cart.Id}");
        }

        public async Task<ServiceResult<bool>> UpdateAsync(int id, UpdateCartDto dto)
        {
            var cart = await _cartRepository.GetAsync(c => c.Id == id);
            if (cart == null) return ServiceResult<bool>.Fail($"Cart with id {id} not found", HttpStatusCode.NotFound);
            
            _mapper.Map(dto, cart);
            await _cartRepository.UpdateAsync(cart);
            return ServiceResult<bool>.Success(true, HttpStatusCode.NoContent);
        }

        public async Task<ServiceResult<bool>> DeleteAsync(int id)
        {
            var cart = await _cartRepository.GetAsync(c => c.Id == id);
            if (cart == null) return ServiceResult<bool>.Fail($"Cart with id {id} not found", HttpStatusCode.NotFound);
            await _cartRepository.DeleteAsync(cart);
            return ServiceResult<bool>.Success(true, HttpStatusCode.NoContent);
        }

        public async Task<ServiceResult<CartDto>> GetByIdAsync(int id)
        {
            var cart = await _cartRepository.GetAsync(c => c.Id == id);
            if (cart == null) return ServiceResult<CartDto>.Fail($"Cart with id {id} not found", HttpStatusCode.NotFound);
            return ServiceResult<CartDto>.Success(_mapper.Map<CartDto>(cart));
        }

        public async Task<ServiceResult<IEnumerable<CartDto>>> GetAllAsync()
        {
            var carts = await _cartRepository.GetListAsync();
            return ServiceResult<IEnumerable<CartDto>>.Success(_mapper.Map<IEnumerable<CartDto>>(carts.Items));
        }

        public async Task<ServiceResult<IPaginate<CartDto>>> GetListByDynamicAsync(DynamicQuery dynamicQuery, int index = 0, int size = 10)
        {
            var carts = await _cartRepository.GetListByDynamicAsync(dynamicQuery, index: index, size: size);
            return ServiceResult<IPaginate<CartDto>>.Success(_mapper.Map<IPaginate<CartDto>>(carts));
        }
    }
}
