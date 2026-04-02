# Güvenlik ve Kod Kalitesi Analiz Raporu

**Proje:** Shopping Project
**Tarih:** 2026-03-05
**Analiz Tipi:** Backend (.NET) + Frontend (React) Güvenlik Taraması

---

## 🔴 KRİTİK Güvenlik Sorunları (Acil Düzeltilmeli)

### 1. Hardcoded JWT Secrets
| Dosya | Satır | Sorun |
|-------|-------|-------|
| [`appsettings.json`](/src/Presentation/API/appsettings.json:38) | 38 | JWT secret production config'de hardcoded |
| [`appsettings.Development.json`](/src/Presentation/API/appsettings.Development.json:49) | 49 | Development config'de aynı hardcoded secret |

**Risk:** JWT imzalama anahtarı sızarsa tüm token'lar geçersiz olur ve saldırganlar kendi token'larını oluşturabilir.

**Öneri:** JWT secret'ı environment variable veya Azure Key Vault/AWS Secrets Manager'da saklayın.

### 2. Hardcoded API Keys
| Dosya | Satır | Sorun |
|-------|-------|-------|
| [`appsettings.json`](/src/Presentation/API/appsettings.json:50) | 50 | API key: `"your-secret-api-key-here"` |
| [`appsettings.Development.json`](/src/Presentation/API/appsettings.Development.json:61) | 61 | API key hardcoded |

**Risk:** API key açığa çıkarsa yetkisiz erişim sağlanabilir.

### 3. Database Şifreleri Açıkta
| Dosya | Satır | Sorun |
|-------|-------|-------|
| [`appsettings.json`](/src/Presentation/API/appsettings.json:57-61) | 57-61 | PostgreSQL şifre `postgres` olarak hardcoded |
| [`appsettings.Development.json`](/src/Presentation/API/appsettings.Development.json:11) | 11 | Development config'de aynı şifre |

**Risk:** Database credentials production'da açık.

### 4. RabbitMQ Credentials Açıkta
| Dosya | Satır | Sorun |
|-------|-------|-------|
| [`appsettings.json`](/src/Presentation/API/appsettings.json:61) | 61 | RabbitMQ: `amqp://guest:guest@localhost:5672` |

### 5. CORS Güvenlik Açığı
| Dosya | Satır | Sorun |
|-------|-------|-------|
| [`DependencyInjection.cs`](/src/Presentation/API/DependencyInjection.cs:74-78) | 74-78 | `.AllowAnyHeader().AllowAnyMethod().AllowCredentials()` |

**Risk:** Bu kombinasyon CSRF ataklarına açık. Aşırı izin verici CORS yapılandırması.

**Öneri:** Sadece belirli origin'lere izin verin:
```csharp
policy.WithOrigins("https://yourdomain.com")
      .WithHeaders("Content-Type", "Authorization")
      .WithMethods("GET", "POST", "PUT", "DELETE")
      .AllowCredentials();
```

### 6. JWT Token localStorage'da (XSS Riski)
| Dosya | Satır | Sorun |
|-------|-------|-------|
| [`httpClient.ts`](/src/Presentation/Web/src/infrastructure/api/httpClient.ts:17-18) | 17-18 | `localStorage.getItem(TOKEN_KEY)` |

**Risk:** XSS saldırısı durumunda token'lar çalınabilir.

**Öneri:** HttpOnly cookie kullanın:
```typescript
// Backend'de cookie set etme
Response.Cookies.Append("access_token", token, new CookieOptions
{
    HttpOnly = true,
    Secure = true,
    SameSite = SameSiteMode.Strict,
    Expires = DateTime.UtcNow.AddMinutes(60)
});
```

---

## 🟠 YÜKSEK Öncelikli Sorunlar

### 1. CSRF Koruması Yok
- **Tüm Controller'lar** - `ValidateAntiForgeryToken` attribute'u ve antiforgery middleware yok

**Öneri:**
```csharp
services.AddAntiforgery(options =>
{
    options.HeaderName = "X-XSRF-TOKEN";
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});
```

### 2. HttpOnly/Secure Cookie Yok
- **Tüm proje** - Sadece Bearer token kullanılıyor, cookie güvenlik ayarı yok

### 3. Hassas Veri Loglama
| Dosya | Satır | Sorun |
|-------|-------|-------|
| [`PushTokenRepository.cs`](/src/Infrastructure/Services/PushTokenRepository.cs:19) | 19 | Push token plaintext loglanıyor |

**Öneri:** Hassas verileri loglamayın veya maskeleyin.

### 4. AllowedHosts Wildcard
| Dosya | Satır | Sorun |
|-------|-------|-------|
| [`appsettings.json`](/src/Presentation/API/appsettings.json:52) | 52 | `"AllowedHosts": "*"` |

### 5. İnput Doğrulama Eksikliği
- **Tüm Formlar** - Kullanıcı input'ları gönderilmeden önce sanitize edilmiyor

---

## 🟡 ORTA Öncelikli Sorunlar

| Sorun | Dosya | Satır | Açıklama |
|-------|-------|-------|----------|
| Zayıf JWT Konfigürasyonu | `DependencyInjection.cs` | 188-199 | `ClockSkew` ayarı yok |
| Redis Şifresiz Bağlantı | `appsettings.json` | 60 | Redis authentication yok |
| Email SSL Kapalı | `appsettings.Development.json` | 100 | `"EnableSsl": false` |
| Hangfire Dashboard Açık | `appsettings.json` | 48 | Authentication yok |
| Rate Limiting Sadece IP | `RateLimitingConfiguration.cs` | 13 | Device fingerprinting yok |

---

## 📋 Profesyonel Olmayan Kod Pratikleri

### 🌍 Karışık Dil Kullanımı (Türkçe/İngilizce)

| Dosya | Satır | Sorun |
|-------|-------|-------|
| [`Program.cs`](/src/Presentation/API/Program.cs:78) | 78 | `// v7+ için: sadece async bağlantı mevcut` |
| [`OutboxProcessorService.cs`](/src/Infrastructure/BackgroundJobs/OutboxProcessorService.cs:59) | 59 | `// DB'den raw kolonları çekiyoruz` |
| [`EmailService.cs`](/src/Infrastructure/Services/EmailService.cs:64) | 64 | `// SMTP bağlantı hataları için loglama` |
| [`RegisterCommandValidator.cs`](/src/Application/Identity/Commands/Register/RegisterCommandValidator.cs:11-19) | 11-19 | Türkçe hata mesajları |

**Öneri:** Tüm kod yorumları ve error mesajları İngilizce olmalı.

### 🔄 Tekrar Eden Validatörler

| Dosya | Sorun |
|-------|-------|
| [`RegisterCommandValidator.cs`](/src/Application/Identity/Commands/Register/RegisterCommandValidator.cs) | Türkçe mesajlar, zayıf kurallar |
| [`IdentityValidators.cs`](/src/Application/Validators/IdentityValidators.cs) | İngilizce mesajlar, daha güçlü kurallar |

**Sorun:** Aynı işlevsellik için iki farklı validator var.

### 📝 Dead Code / Kullanılmayan Import'lar

| Dosya | Sorun |
|-------|-------|
| `AuthResponse.cs` | Duplicate sınıf |
| `PaginatedList.cs` | Birden fazla yerde tanımlı |

### 🐛 Console.log Production'da

| Dosya | Satır | Sorun |
|-------|-------|-------|
| [`signalRService.ts`](/src/Presentation/Web/src/services/signalRService.ts:25-104) | 25-104 | Birden fazla console.log |
| [`SyncManager.ts`](/src/Presentation/App/src/infrastructure/services/SyncManager.ts:61) | 61 | Production logları |

---

## ✅ Önerilen Düzeltme Öncelikleri

### Hemen (Kritik)
1. Tüm hardcoded secrets environment variable'lara taşının
2. JWT token'lar HttpOnly cookie'ye alınsın
3. CORS yapılandırması kısıtlandırılsın
4. Database şifreleri Key Vault'dan okunsun

### Kısa Vadeli (Yüksek)
1. CSRF koruması eklensin
2. Push token'lar loglanmasın
3. Input validasyonları güçlendirilsin
4. AllowedHosts kısıtlandırılsın

### Orta Vadeli (Orta)
1. Redis authentication eklensin
2. Email SSL aktif edilsin
3. Hangfire dashboard authentication eklensin

### Uzun Vadeli (Düşük)
1. Tüm yorumlar İngilizce'ye çevrilsin
2. Duplicate kodlar temizlensin
3. Console.log'lar production'da kaldırılsın

---

## 📊 Risk Özeti

| Seviye | Sayı | Açıklama |
|--------|------|----------|
| 🔴 Kritik | 6 | Hemen düzeltilmeli |
| 🟠 Yüksek | 5 | Kısa vadede düzeltilmeli |
| 🟡 Orta | 5 | Orta vadede düzeltilmeli |
| 🟢 Düşük | 4 | Uzun vadede düzeltilmeli |

**Toplam Risk:** 20 güvenlik/kalite sorunu bulundu.
