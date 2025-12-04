# Testing: xUnit, Moq, FluentAssertions

## Nedir?

Projede, kodun doğruluğunu, güvenilirliğini ve kalitesini sağlamak için kapsamlı bir test stratejisi benimsenmiştir. Bu strateji, üç ana kütüphane üzerine kuruludur:

*   **xUnit:** .NET için geliştirilmiş, modern ve popüler bir birim testi (unit testing) framework'üdür. Testlerin yazılmasını ve çalıştırılmasını sağlar. Testleri birbirinden izole bir şekilde çalıştırarak daha güvenilir sonuçlar elde edilmesini hedefler.

*   **Moq:** .NET için en yaygın kullanılan "mocking" (taklit etme) kütüphanelerinden biridir. Test edilen kod parçasının bağımlılıklarını (örneğin, veritabanı, harici servisler) sahte nesnelerle (mock objects) değiştirerek, testin sadece o kod parçasının mantığına odaklanmasını sağlar.

*   **FluentAssertions:** Test sonuçlarını doğrulamak (assertion) için kullanılan bir kütüphanedir. Geleneksel `Assert.Equal(expected, actual)` gibi ifadelere kıyasla, `actual.Should().Be(expected)` gibi daha okunaklı ve akıcı (fluent) bir sözdizimi sunar. Bu, testlerin neyi kontrol ettiğinin daha kolay anlaşılmasına yardımcı olur.

## Projede Neden Kullanılıyor?

*   **Kod Kalitesini Artırma:** Testler, yazılan kodun beklendiği gibi çalıştığını doğrular ve gelecekte yapılacak değişikliklerin mevcut işlevselliği bozmamasını (regresyonu önleme) sağlar.
*   **Güvenli Refactoring:** Geniş bir test kapsamı, kodun iç yapısını (refactoring) korkusuzca değiştirmeye olanak tanır. Testler, yapılan değişikliklerin sistemin davranışını değiştirmediğini garanti eder.
*   **Canlı Dokümantasyon:** İyi yazılmış testler, kodun nasıl kullanılması gerektiğine ve ne yapması beklendiğine dair canlı bir dokümantasyon görevi görür.
*   **İzole ve Odaklı Testler:** Moq kullanılarak bağımlılıklar izole edilir, böylece her birim test sadece tek bir sorumluluğu (örneğin, bir MediatR handler'ının iş mantığını) test eder.
*   **Okunabilir ve Anlaşılır Testler:** FluentAssertions, testlerin amaçlarını net bir şekilde ifade eden, neredeyse doğal dil gibi okunabilen doğrulamalar yazmayı sağlar.

## Projedeki Yapılandırma ve Örnekler

Testler, `src/Tests` klasörü altında, test edilen katmanlara paralel bir yapıda (Application, Domain, Infrastructure vb.) organize edilmiştir.

### 1. NuGet Paketleri

Gerekli test kütüphaneleri `ShoppingProject.Tests.csproj` dosyasına eklenmiştir:

```xml
<PackageReference Include="xunit" />
<PackageReference Include="Moq" />
<PackageReference Include="FluentAssertions" />
<PackageReference Include="Microsoft.NET.Test.Sdk" />
```

### 2. Birim Testi (Unit Test) Örneği

Bu örnekte, bir MediatR komut işleyicisinin (CommandHandler) birim testi yapılmaktadır.

```csharp
// src/Tests/Application/Products/Commands/CreateProductCommandHandlerTests.cs

public class CreateProductCommandHandlerTests
{
    private readonly Mock<IApplicationDbContext> _mockContext;
    private readonly Mock<IPublishEndpoint> _mockPublishEndpoint;
    private readonly CreateProductCommandHandler _handler;

    public CreateProductCommandHandlerTests()
    {
        _mockContext = new Mock<IApplicationDbContext>();
        _mockPublishEndpoint = new Mock<IPublishEndpoint>();
        
        // Handler'ı, sahte (mock) bağımlılıklarla oluştur
        _handler = new CreateProductCommandHandler(_mockContext.Object, _mockPublishEndpoint.Object);
    }

    [Fact]
    public async Task Handle_Should_CreateProductAndPublishEvent_WhenCalled()
    {
        // Arrange (Hazırlık)
        var command = new CreateProductCommand { Name = "Test Product", Price = 100 };
        var productsDbSet = new Mock<DbSet<Product>>();
        _mockContext.Setup(c => c.Products).Returns(productsDbSet.Object);

        // Act (Eylem)
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert (Doğrulama)
        
        // Moq ile doğrulama: Add metodu en az bir kez çağrıldı mı?
        productsDbSet.Verify(x => x.Add(It.IsAny<Product>()), Times.Once);
        
        // Moq ile doğrulama: SaveChangesAsync metodu en az bir kez çağrıldı mı?
        _mockContext.Verify(x => x.SaveChangesAsync(CancellationToken.None), Times.Once);
        
        // Moq ile doğrulama: Publish metodu bir ProductCreatedEvent ile çağrıldı mı?
        _mockPublishEndpoint.Verify(x => x.Publish(It.IsAny<ProductCreatedEvent>(), CancellationToken.None), Times.Once);

        // FluentAssertions ile doğrulama: Dönen sonuç 0'dan büyük mü?
        result.Should().BeGreaterThan(0);
    }
}
```
*   **Arrange:** Test için gerekli nesneler ve sahte bağımlılıklar oluşturulur. `_mockContext.Setup(...)` ile `IApplicationDbContext`'in `Products` özelliğine erişildiğinde ne döndüreceği ayarlanır.
*   **Act:** Test edilecek olan metot (`_handler.Handle`) çağrılır.
*   **Assert:** Sonuçların ve etkileşimlerin beklendiği gibi olup olmadığı kontrol edilir. `Verify` ile bir metodun çağrılıp çağrılmadığı, `Should()` ile de sonuçların durumu doğrulanır.

Bu yapı, projenin her bir parçasının izole bir şekilde test edilmesini ve sistemin genel güvenilirliğinin artırılmasını sağlar.
