using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Api.Services
{
    /// <summary>
    /// Ürünlerle ilgili iş mantığını tanımlayan asenkron arayüz.
    /// </summary>
    public interface IProductService
    {
        // Tüm ürünleri asenkron olarak listeler
        Task<IEnumerable<Product>> GetAllAsync();

        // Belirli bir ID'ye sahip ürünü asenkron olarak getirir
        Task<Product> GetByIdAsync(int id);

        // Yeni bir ürünü asenkron olarak oluşturur
        Task<Product> CreateAsync(Product product);

        // Varolan bir ürünü asenkron olarak günceller (Güncellenen ürünü döndürür, bulunamazsa null)
        Task<Product> UpdateAsync(int id, Product product);

        // Belirli bir ID'ye sahip ürünü asenkron olarak siler
        Task<bool> DeleteAsync(int id);
    }
}