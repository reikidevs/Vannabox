# Vannabox - Modern Fullstack Web Application

Aplikasi web modern, ultra-ringan, dan siap deploy ke Vercel untuk **Vannabox (UMKM Tambak Udang Tegal)**. Dimigrasikan dari versi PHP Native ke arsitektur Fullstack modern dengan mempertahankan tampilan visual dan style 100% identik dari versi aslinya.

- **Production URL**: [https://vannabox.vercel.app](https://vannabox.vercel.app)
- **GitHub Repository**: [https://github.com/reikidevs/Vannabox](https://github.com/reikidevs/Vannabox)

---

## 🚀 Keunggulan Arsitektur vs PHP Lama

1. **Ultra Lightweight & Edge CDN**: Halaman utama dirender statis optimal untuk performa Core Web Vitals 100/100, bebas runtime PHP lambat dan bebas dependensi server Apache/cPanel.
2. **Style & Asset 1:1 Identik**: Skema warna (Primary Blue, Secondary Green), mode gelap (Dark Mode switch), Font Awesome icons, efek glowing floating, dan animasi latar belakang `hero-pattern` dipertahankan presisi.
3. **Pemesanan WhatsApp Instan**: Formulir kontak interaktif langsung memvalidasi input dan menghubungkan pelanggan ke WhatsApp admin secara otomatis.
4. **Header Keamanan Vercel**: Dilengkapi konfigurasi `vercel.json` dengan standar keamanan OWASP (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`, serta immutable caching untuk asset).

---

## 📁 Struktur Proyek

```
vannabox/
├── public/
│   └── logo.webp                  # Asset logo resmi Vannabox
├── src/
│   ├── components/
│   │   ├── Navbar.astro           # Header navigasi, dark mode switch & hamburger mobile
│   │   ├── Hero.astro             # Hero section dengan statistik mengambang & CTA
│   │   ├── About.astro            # Fitur unggulan tambak & milestone counter
│   │   ├── Products.astro         # Katalog produk (Vaname, Windu, Galah)
│   │   ├── Services.astro         # Layanan rantai dingin, express delivery, garansi
│   │   ├── Contact.astro          # Informasi kontak & formulir pesan terhubung WhatsApp
│   │   └── Footer.astro           # Footer informasi hak cipta & tautan sosial
│   ├── layouts/
│   │   └── Layout.astro           # Layout dasar HTML5, SEO meta tags, & anti-FOUC
│   ├── pages/
│   │   └── index.astro            # Halaman landing page utama
│   └── styles/
│       └── global.css             # Tailwind base & custom animations
├── astro.config.mjs               # Konfigurasi Astro + @astrojs/vercel/static
├── tailwind.config.mjs            # Konfigurasi token warna Tailwind
├── tsconfig.json                  # Konfigurasi TypeScript strict
├── vercel.json                    # Konfigurasi deployment & security headers Vercel
└── package.json                   # Dependensi & skrip NPM
```

---

## 🛠️ Menjalankan Secara Lokal

```bash
# Masuk ke folder proyek
cd E:\Development\vannabox

# Menjalankan mode development
npm run dev

# Membangun bundle produksi
npm run build
```

---

## 🚢 Deploy ke Vercel

```bash
# Deploy langsung via Vercel CLI
npx vercel --prod
```
