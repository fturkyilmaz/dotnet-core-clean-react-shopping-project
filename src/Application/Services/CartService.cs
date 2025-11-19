
using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Interfaces;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Interfaces;

namespace ShoppingProject.Application.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;

        public CartService(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

        public async Task<CartDto> GetByIdAsync(int id)
        {
            var cart = await _cartRepository.GetByIdAsync(id);
            if (cart == null) throw new Exception($"Cart with id {id} not found");
            return new CartDto(cart.Id, cart.Title, cart.Price, cart.Image, cart.Quantity);
        }

        public async Task<IEnumerable<CartDto>> GetAllAsync()
        {
            var carts = await _cartRepository.GetAllAsync();
            return carts.Select(c => new CartDto(c.Id, c.Title, c.Price, c.Image, c.Quantity));
        }

        public async Task<CartDto> CreateAsync(CreateCartDto dto)
        {
            var cart = new Cart
            {
                Title = dto.Title,
                Price = dto.Price,
                Image = dto.Image,
                Quantity = dto.Quantity
            };
            await _cartRepository.AddAsync(cart);
            return new CartDto(cart.Id, cart.Title, cart.Price, cart.Image, cart.Quantity);
        }

        public async Task UpdateAsync(int id, UpdateCartDto dto)
        {
            var cart = await _cartRepository.GetByIdAsync(id);
            if (cart == null) throw new Exception($"Cart with id {id} not found");
            cart.Title = dto.Title;
            cart.Price = dto.Price;
            cart.Image = dto.Image;
            cart.Quantity = dto.Quantity;
            await _cartRepository.UpdateAsync(cart);
        }

        public async Task DeleteAsync(int id)
        {
            var cart = await _cartRepository.GetByIdAsync(id);
            if (cart == null) throw new Exception($"Cart with id {id} not found");
            await _cartRepository.DeleteAsync(cart);
        }
    }
}
