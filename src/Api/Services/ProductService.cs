using ShoppingProject.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace ShoppingProject.Api.Services
{
    /// <summary>
    /// Ürün Servis Arayüzünün uygulanması. Veritabanı işlemlerini simüle eder.
    /// </summary>
    public class ProductService : IProductService
    {
        // Geçici veri depolamak için statik bir liste (Veritabanı yerine geçiyor)
        private static readonly List<Product> _products = new List<Product>
        {
            new Product { Id = 1, Title = "Laptop", Price = 1200.50m, Rating = new Rating { Rate = 4.5, Count = 15 } },
            new Product { Id = 2, Title = "Mouse", Price = 25.99m, Rating = new Rating { Rate = 4.0, Count = 500 } },
            new Product { Id = 3, Title = "Keyboard", Price = 75.00m, Rating = new Rating { Rate = 4.2, Count = 200 } }
        };

        private static int _nextId = 4; 

        /// <summary>
        /// Tüm ürünleri asenkron olarak getirir. 500ms gecikme ile veritabanı sorgusunu simüle eder.
        /// </summary>
        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            // Veritabanı/ağ gecikmesini simüle etmek için bekliyoruz.
            await Task.Delay(500); 
            return _products;
        }

        /// <summary>
        /// ID'ye göre ürünü asenkron olarak getirir. 300ms gecikme ile simüle eder.
        /// </summary>
        public async Task<Product> GetByIdAsync(int id)
        {
            await Task.Delay(300);
            return _products.FirstOrDefault(p => p.Id == id);
        }

        /// <summary>
        /// Yeni bir ürünü asenkron olarak oluşturur. 600ms gecikme ile simüle eder.
        /// </summary>
        public async Task<Product> CreateAsync(Product product)
        {
            await Task.Delay(600);
            product.Id = _nextId++;
            _products.Add(product);
            return product;
        }

        /// <summary>
        /// Varolan bir ürünü asenkron olarak günceller. 550ms gecikme ile simüle eder.
        /// </summary>
        public async Task<Product> UpdateAsync(int id, Product product)
        {
            await Task.Delay(550);
            var existingProduct = _products.FirstOrDefault(p => p.Id == id);
            
            if (existingProduct == null)
            {
                return null;
            }
            
            existingProduct.Title = product.Title;
            existingProduct.Price = product.Price;
            existingProduct.Rating = product.Rating;

            return existingProduct;
        }

        /// <summary>
        /// Belirtilen ID'ye sahip ürünü asenkron olarak siler. 400ms gecikme ile simüle eder.
        /// </summary>
        public async Task<bool> DeleteAsync(int id)
        {
            await Task.Delay(400);
            var productToRemove = _products.FirstOrDefault(p => p.Id == id);
            
            if (productToRemove == null)
            {
                return false;
            }
            
            _products.Remove(productToRemove);
            return true;
        }
    }
}