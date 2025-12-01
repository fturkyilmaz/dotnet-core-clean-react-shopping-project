slug: clean-ecommerce-api-dotnet-react title: Dotnet Core, Clean Architecture ve React ile Yüksek Performanslı E-Ticaret Projesi Geliştirme authors: furkanturkyilmaz tags: [clean-architecture, dotnet, nosql-modeling]

Bu yazı, en son .NET teknolojileri, Temiz Mimari (Clean Architecture) ve React'i bir araya getirdiğim e-ticaret (alışveriş) projemin mimari kararlarını, performans optimizasyonlarını ve teknik zorluklarını detaylıca incelemektedir. Projenin temel amacı, ölçeklenebilir, test edilebilir ve sürdürülebilir bir mikroservis/monolit (monolith) yapısı kurmaktı.

Proje Özeti ve Neden Clean Architecture?

Modern e-ticaret uygulamaları yüksek trafik ve sürekli değişen iş kuralları gerektirir. Bu nedenle, iş mantığının veritabanı veya kullanıcı arayüzünden bağımsız olmasını garanti eden Clean Architecture modelini benimsedim. .NET Core 8+ altyapısı üzerinde kurulan bu yapı, geliştirme hızını korurken aynı zamanda uzun vadeli teknik borcu en aza indirmeyi hedefliyor.

<!-- truncate -->

Veri Modellemesi: İlişkisel Olmayan Yaklaşım (NoSQL)

Geleneksel ilişkisel veritabanları yerine, sepet (Cart) ve ürün katalogları gibi yüksek okuma/yazma hızına ihtiyaç duyan kritik alanlar için NoSQL Veri Modellemesi stratejisini kullandım. Özellikle sepet yönetimi (Cart Service), performans ve esneklik için NoSQL prensipleriyle tasarlandı. Partition Key seçimi, veri dağılımını optimize ederek Cosmos DB'de çapraz bölüm sorgularını minimuma indirmeyi başardı.

Teknik Uygulama Detayları

Projenin backend'i tamamen .NET 8 ile geliştirildi. Aşağıdaki temel teknik kararlar, projenin performans ve sürdürülebilirlik hedeflerine ulaşmasında kritik rol oynadı:

CQRS ve MediatR: API uç noktaları, Command-Query Responsibility Segregation (CQRS) desenini uygulamak için MediatR kütüphanesi aracılığıyla ayrıldı. Bu, okuma ve yazma işlemlerinin birbirinden bağımsız olarak ölçeklenmesini sağladı.

Test Edilebilirlik: Clean Architecture sayesinde, iş mantığının (Domain ve Application katmanları) %90'ın üzerinde test kapsamına ulaşması kolaylaştı.

Ön Yüz (Frontend): Kullanıcı arayüzü, modern state management yaklaşımlarını (örneğin React Query) kullanarak backend ile etkileşime giren, hızlı ve modüler React bileşenleriyle oluşturuldu.

Bu yazıda, bu kararların her birini derinlemesine inceleyecek, kod örnekleri sunacak ve projenin genel mimari diyagramını paylaşacağım. Keyifli okumalar!