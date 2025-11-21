# 🚀 React E-Ticaret Projesi

Bu proje, FakeStore API kullanılarak geliştirilmiş bir e-ticaret deneyimini sunan bir React uygulamasını içerir. Proje, Axios ile veri çekimi, React Context API ile ürün ve sepet durumunun yönetimi, Bootstrap ile modern tasarım, ve React Toastify ile kullanıcı etkileşimini içerir.

## 🛠 Teknolojiler ve Kütüphaneler

- **ReactJS:** Kullanıcı dostu arayüz ve bileşen tabanlı yapı için tercih edildi.
- **Axios:** FakeStore API'den veri çekimi için kullanıldı.
- **Bootstrap:** CSS ve JS entegrasyonu ile modern ve duyarlı tasarım sağlar.
- **React Context API:** Ürün ve sepet durumunun etkili yönetimi için kullanıldı.
- **React Toastify:** Kullanıcıları bilgilendirmek ve etkileşimi artırmak için bildirimler sağlar.
- **React Router:** Sayfa yönlendirme ve dinamik URL yönetimi için kullanıldı.
- **Redux Toolkit:** Modern Redux ile state yönetimini sağlar.
- **React Query:** API verilerini optimize eden ve performansı artıran bir kütüphane.
- **Tailwind CSS:** Utility-first CSS framework ile modern ve duyarlı tasarım sağlar.
- **Headless UI:** Unstyled, accessible components ile modern ve duyarlı tasarım sağlar.
- **Heroicons:** Beautiful hand-crafted SVG icons ile modern ve duyarlı tasarım sağlar.
- **React Hook Form:** Performant form library ile modern ve duyarlı tasarım sağlar.
- **Zod:** TypeScript-first schema validation ile modern ve duyarlı tasarım sağlar.

## 🌐 Proje İçeriği

Proje, e-ticaret platformlarında yaygın olarak kullanılan temel özellikleri içerir:

- **Ürün Listesi:** FakeStore API'den dinamik olarak çekilen ürünler.
- **Sepet Yönetimi:** Ürün ekleme, çıkarma ve sepetin durumunu gösterme.
- **Bootstrap Tasarımı:** Modern ve kullanıcı dostu bir arayüz.
- **React Query:** API verilerini optimize eden ve performansı artıran bir kütüphane.
- **React Toastify:** Kullanıcı etkileşimini artırmak için bildirimler sağlar.

src/Web/ClientApp/
├── src/
│   ├── api/                    # API client & endpoints
│   │   ├── axios.ts           # Axios instance with JWT interceptors
│   │   ├── queryClient.ts     # React Query configuration
│   │   ├── auth.api.ts        # Authentication API calls
│   │   └── products.api.ts    # Products API calls
│   ├── store/                  # Redux store
│   │   ├── index.ts           # Store configuration
│   │   └── slices/
│   │       ├── authSlice.ts   # Auth state management
│   │       └── cartSlice.ts   # Shopping cart state
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts         # Authentication hook
│   │   └── useProducts.ts     # Products React Query hooks
│   ├── pages/                  # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ProductListPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── CartPage.tsx
│   ├── components/             # Reusable components
│   │   └── ProtectedRoute.tsx
│   ├── App.tsx                 # Main app with routing
│   └── index.css               # Tailwind directives
├── .env                        # Environment variables
└── tailwind.config.js          # Tailwind configuration

📱 Responsive Tasarım
Proje, kullanıcıların farklı cihazlarda rahatça gezinebilmesi için responsive bir tasarım içerir. Mobil, tablet ve masaüstü cihazlarda sorunsuz bir kullanıcı deneyimi sunar.

## 🌈 Katkılar ve Geri Bildirim

Proje geliştirme aşamasındadır ve her türlü katkı ve geri bildirimle geliştirilmeye açıktır. Önerilerinizi veya hataları bildirmek için lütfen Issues sekmesini kullanın.

## 🌐 Proje Ekran Görüntüsü

![](estore.gif)

Geliştirici olarak sizin görüşleriniz ve katkılarınız çok değerlidir. Teşekkür ederim! 🙌
