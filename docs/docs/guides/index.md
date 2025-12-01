---
sidebar_position: 0
---

# Kılavuzlar

ShoppingProject için kapsamlı geliştirme ve deployment kılavuzları.

## 🚀 Başlangıç Kılavuzları

### [Geliştirme Ortamı Kurulumu](./development-setup.md)
Yerel geliştirme ortamınızı kurmak için adım adım kılavuz.

**İçerik:**
- Gerekli araçlar ve bağımlılıklar
- Docker ile altyapı servisleri
- Backend ve Frontend kurulumu
- Ortam değişkenleri yapılandırması
- Sorun giderme

**Hedef Kitle:** Yeni geliştiriciler, yerel geliştirme yapacak herkes

---

### [Production Deployment](./production-deployment.md)
Production ortamına güvenli ve ölçeklenebilir deployment.

**İçerik:**
- Azure App Service deployment
- Kubernetes deployment
- CI/CD pipeline kurulumu
- Güvenlik checklist
- Monitoring ve alerting
- Rollback stratejileri

**Hedef Kitle:** DevOps mühendisleri, production deployment yapacaklar

---

### [Docker Deployment](./docker-deployment.md)
Docker ve Docker Compose kullanarak deployment.

**İçerik:**
- Docker image build
- Docker Compose yapılandırması
- Multi-stage builds
- Container orchestration

**Hedef Kitle:** Container teknolojileri kullananlar

---

## 🧪 Test ve Kalite

### [Testing Kılavuzu](./testing.md)
Kapsamlı test stratejileri ve best practices.

**İçerik:**
- Unit testing (xUnit, Moq, FluentAssertions)
- Integration testing (WebApplicationFactory, Testcontainers)
- E2E testing (Playwright)
- Performance testing (k6)
- Test coverage raporlama
- CI/CD integration

**Hedef Kitle:** Geliştiriciler, QA mühendisleri

---

## 🏗️ Mimari ve Tasarım

### [Clean Architecture Refactoring](./clean-architecture-refactoring.md)
Clean Architecture prensiplerine göre yapılan refactoring değişiklikleri.

**İçerik:**
- Layer separation
- Dependency inversion
- Service relocations
- Best practices

**Hedef Kitle:** Mimari kararlar alan geliştiriciler

---

## 📊 Analytics ve Monitoring

### [Firebase Analytics Setup](./firebase-analytics-setup.md)
Firebase Analytics entegrasyonu ve yapılandırması.

**İçerik:**
- Firebase projesi kurulumu
- iOS ve Android yapılandırması
- Event tracking
- Custom events
- Debug mode

**Hedef Kitle:** Mobile app geliştiricileri

---

### [Analytics Integration](./analytics-integration.md)
Uygulama içi analytics entegrasyonu.

**İçerik:**
- Google Analytics integration
- Custom event tracking
- User properties
- Performance monitoring
- Crash reporting

**Hedef Kitle:** Frontend ve mobile geliştiriciler

---

## 🛠️ Geliştirme Araçları

### [Postman Collection](./postman.md)
API testing için Postman collection kullanımı.

**İçerik:**
- Collection import
- Environment variables
- Authentication
- Test scripts

**Hedef Kitle:** API geliştiricileri, QA

---

### [Code Examples](./code-examples.md)
Yaygın senaryolar için kod örnekleri.

**İçerik:**
- CQRS pattern örnekleri
- Repository pattern
- Event handling
- Custom middleware

**Hedef Kitle:** Tüm geliştiriciler

---

## 📚 Ek Kaynaklar

### Harici Dokümantasyon
- [API Reference](/docs/api-reference) - Detaylı API endpoint dokümantasyonu
- [Architecture](/docs/architecture) - Sistem mimarisi ve tasarım kararları
- [ADR (Architecture Decision Records)](/docs/adr) - Mimari karar kayıtları

### GitHub Resources
- [Issues](https://github.com/yourusername/repo/issues) - Bug raporları ve feature requests
- [Discussions](https://github.com/yourusername/repo/discussions) - Topluluk tartışmaları
- [Wiki](https://github.com/yourusername/repo/wiki) - Ek dokümantasyon

---

## 🤝 Katkıda Bulunma

Dokümantasyona katkıda bulunmak isterseniz:

1. Bu repoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b docs/improvement`)
3. Değişikliklerinizi commit edin (`git commit -am 'Add new guide'`)
4. Branch'inizi push edin (`git push origin docs/improvement`)
5. Pull Request oluşturun

### Dokümantasyon Standartları

- Markdown formatı kullanın
- Kod örnekleri ekleyin
- Türkçe veya İngilizce yazabilirsiniz
- Ekran görüntüleri ekleyin (gerekirse)
- Frontmatter ile sidebar_position belirtin

---

## 📞 Destek

Sorularınız için:
- GitHub Issues açın
- Discussions bölümünü kullanın
- Email: support@shoppingproject.com

---

**Son Güncelleme:** 2025-12-01
