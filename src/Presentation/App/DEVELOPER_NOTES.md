# Geliştirici Notları — Tema ve API Tip Güvenliği

Aşağıda iki öneri kısa ve uygulanabilir adımlarla özetlenmiştir: tema/renglerin merkezi yönetimi (Tailwind) ve backend DTO'ları ile frontend TypeScript tiplerinin senkronizasyonu (OpenAPI).

## 1) Tema ve Renk Yönetimi (Tailwind)

- Amaç: Proje genelinde `className="bg-blue-600 dark:bg-blue-700"` gibi doğrudan renk kullanımını azaltıp, semantik isimlerle (`bg-primary`) kullanmak.

- Örnek `tailwind.config.js` içinde `theme.extend.colors` tanımı:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // light mode primary (blue-600)
          700: '#1e40af', // dark mode primary (blue-700)
        },
        secondary: '#6b7280',
        background: '#ffffff',
        'background-dark': '#0f172a',
      },
    },
  },
  plugins: [],
};
```

- Kullanım (component içinde):

```jsx
// Eski:
// <div className="bg-blue-600 dark:bg-blue-700">...

// Yeni (semantik):
<div className="bg-primary dark:bg-primary-700">...
```

- İpuçları:
  - Temayı değiştirmek için tek yer `tailwind.config.js` olur.
  - Eğer NativeWind gibi React Native için Tailwind benzeri bir kütüphane kullanıyorsanız, aynı renk değişkenlerini `tailwind.config.js` içinde tanımlayın.

## 2) API İstekleri ve Tip Güvenliği

- Amaç: Backend DTO'ları ile frontend TypeScript tiplerinin senkron kalmasını sağlamak.

- Kolay seçenek: `openapi-typescript` veya `openapi-generator` kullanarak TypeScript client veya tip dosyası üretmek.

- `openapi-typescript` örneği (daha hafif, sadece tip üretir):

```bash
npm install -D openapi-typescript
npx openapi-typescript https://api.example.com/swagger/v1/swagger.json --output src/api/types/generated.d.ts
```

- `openapi-generator` ile tam bir TS client (axios kullanan):

```bash
# openapi-generator-cli küresel olarak ya da npx ile kullanılabilir
npx @openapitools/openapi-generator-cli generate \
  -i https://api.example.com/swagger/v1/swagger.json \
  -g typescript-axios \
  -o src/api/client
```

- Entegrasyon önerileri:
  - CI pipeline'ınıza bir adım ekleyin: OpenAPI spec değiştiğinde yeni tip/client otomatik oluşturulsun ve commit edilsin (veya PR açılsın).
  - Üretilen tipleri elle düzenlemeyin; custom kod gerekiyorsa wrapper katmanı yazın.

## 3) ESLint kuralı (uygulandı)

- Mobil uygulama için `no-restricted-imports` kuralı eklendi: `react-native`'den `TouchableOpacity` doğrudan import edilemez. `src/components/AccessibleTouchable` kullanılmalı.

Eğer isterseniz, bu dosyayı güncelleyip CI'de `npm run lint` çalıştıracak şekilde `package.json` içine `lint` script'i ekleyebilirim.
