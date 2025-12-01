# Dokümantasyon Organizasyonu - Değişiklik Özeti

## 📁 Yapılan Değişiklikler

### 1. Markdown Dosyaları `docs/docs/guides/` Klasörüne Taşındı

Tüm `.md` dosyaları proje kök dizininden `docs/docs/guides/` klasörüne taşındı ve yeniden adlandırıldı:

| Eski Konum | Yeni Konum | Açıklama |
|------------|-----------|----------|
| `CLEAN_ARCHITECTURE_REFACTORING.md` | `docs/docs/guides/clean-architecture-refactoring.md` | Clean Architecture refactoring kılavuzu |
| `ANALYTICS_INTEGRATION_GUIDE.md` | `docs/docs/guides/analytics-integration.md` | Analytics entegrasyon kılavuzu |
| `FIREBASE_ANALYTICS_SETUP.md` | `docs/docs/guides/firebase-analytics-setup.md` | Firebase kurulum kılavuzu |
| `DOCKER.md` | `docs/docs/guides/docker-deployment.md` | Docker deployment kılavuzu |

### 2. Yeni Kılavuzlar Oluşturuldu

#### `docs/docs/guides/development-setup.md`
**Kapsam:** Yerel geliştirme ortamı kurulumu
- Gereksinimler (.NET 10, Node.js, Docker)
- Adım adım kurulum talimatları
- Ortam değişkenleri yapılandırması
- Varsayılan kullanıcı hesapları
- Geliştirme araçları (Hot Reload, Formatting, Linting)
- Test çalıştırma
- Sorun giderme
- IDE yapılandırması (VS 2022, VS Code, Rider)

#### `docs/docs/guides/production-deployment.md`
**Kapsam:** Production deployment stratejileri
- Azure deployment (App Service, PostgreSQL, Redis, ACR)
- Kubernetes deployment (AKS, manifests, SSL/TLS)
- CI/CD pipeline (GitHub Actions)
- Production checklist (Güvenlik, Performance, Monitoring, Backup)
- Environment variables
- Rollback stratejileri
- Monitoring & Logging (Application Insights, Kusto queries)
- Troubleshooting (CPU, Memory, Database)

#### `docs/docs/guides/testing.md`
**Kapsam:** Kapsamlı test stratejileri
- Test piramidi
- Unit tests (xUnit, FluentAssertions, Moq)
- Integration tests (WebApplicationFactory, Testcontainers)
- E2E tests (Playwright)
- Performance tests (k6)
- Test best practices (AAA pattern, naming, builders, mocking)
- CI/CD integration
- Test coverage raporlama

#### `docs/docs/guides/index.md`
**Kapsam:** Kılavuzlar ana sayfası
- Tüm kılavuzların özeti
- Hedef kitle bilgisi
- Katkıda bulunma rehberi
- Destek bilgileri

### 3. Ana README.md Güncellendi

`README.md` dosyası güncellenerek dokümantasyon referansları `docs/docs/guides/` klasörünü işaret edecek şekilde düzenlendi.

**Değişiklik:**
```markdown
See detailed docs in the [`docs/`](./docs/docs/guides/) folder:
- [Development Setup](./docs/docs/guides/development-setup.md)
- [Production Deployment](./docs/docs/guides/production-deployment.md)
- [Testing Guide](./docs/docs/guides/testing.md)
- ...
```

## 📊 Dokümantasyon Yapısı

```
docs/
├── docs/
│   ├── guides/
│   │   ├── index.md                          # 🆕 Kılavuzlar ana sayfası
│   │   ├── development-setup.md              # 🆕 Geliştirme kurulumu
│   │   ├── production-deployment.md          # 🆕 Production deployment
│   │   ├── testing.md                        # 🆕 Test kılavuzu
│   │   ├── clean-architecture-refactoring.md # ✅ Taşındı
│   │   ├── analytics-integration.md          # ✅ Taşındı
│   │   ├── firebase-analytics-setup.md       # ✅ Taşındı
│   │   ├── docker-deployment.md              # ✅ Taşındı
│   │   ├── code-examples.md                  # Mevcut
│   │   └── postman.md                        # Mevcut
│   ├── adr/                                  # Architecture Decision Records
│   ├── api/                                  # API dokümantasyonu
│   ├── api-reference.md
│   ├── architecture.md
│   └── ...
└── README.md                                 # Docs ana sayfası
```

## 🎯 Faydalar

### 1. Merkezi Dokümantasyon
- Tüm kılavuzlar tek bir yerde (`docs/docs/guides/`)
- Kolay bulunabilirlik
- Tutarlı yapı

### 2. Docusaurus Entegrasyonu
- Sidebar otomatik oluşturma
- Arama fonksiyonelliği
- Versiyonlama desteği
- Responsive tasarım

### 3. Geliştirici Deneyimi
- Kapsamlı başlangıç kılavuzları
- Adım adım talimatlar
- Kod örnekleri
- Sorun giderme bölümleri

### 4. DevOps Desteği
- Production deployment checklist
- CI/CD pipeline örnekleri
- Monitoring ve alerting
- Rollback stratejileri

### 5. Kalite Güvencesi
- Test stratejileri
- Coverage hedefleri
- Best practices
- CI/CD integration

## 📝 Frontmatter Kullanımı

Tüm yeni kılavuzlarda Docusaurus frontmatter eklendi:

```yaml
---
sidebar_position: 1
---
```

Bu, sidebar'da otomatik sıralama sağlar:
- 0: index.md (Kılavuzlar ana sayfası)
- 1: development-setup.md
- 2: production-deployment.md
- 3: testing.md

## 🔄 Sonraki Adımlar

### Önerilen İyileştirmeler

1. **Görsel İçerik Ekleyin**
   - Mimari diyagramlar
   - Ekran görüntüleri
   - Flow chartlar

2. **Video Kılavuzları**
   - Kurulum videoları
   - Deployment demoları
   - Troubleshooting videoları

3. **Interaktif Örnekler**
   - CodeSandbox entegrasyonu
   - Live API demos
   - Swagger UI embed

4. **Çoklu Dil Desteği**
   - İngilizce versiyonlar
   - i18n yapılandırması

5. **Versiyonlama**
   - Docusaurus versioning
   - Changelog entegrasyonu
   - Migration guides

## 🚀 Docusaurus Çalıştırma

Dokümantasyon sitesini yerel olarak çalıştırmak için:

```bash
cd docs
npm install
npm start
```

Site `http://localhost:3000` adresinde açılacak.

## 📚 Ek Kaynaklar

- [Docusaurus Docs](https://docusaurus.io/docs)
- [Markdown Guide](https://www.markdownguide.org/)
- [Mermaid Diagrams](https://mermaid-js.github.io/)

---

**Oluşturulma Tarihi:** 2025-12-01  
**Son Güncelleme:** 2025-12-01  
**Versiyon:** 1.0.0
