# Vannabox - Astro Fullstack Web Application

Aplikasi web modern, ultra-ringan, dan siap deploy ke Vercel untuk **Vannabox (UMKM Tambak Udang Tegal)**. Dimigrasikan dari versi PHP Native ke arsitektur Fullstack **Astro 4 + Tailwind CSS + Vercel Serverless Adapter**, mempertahankan tampilan visual dan style 100% identik dari versi aslinya.

---

## 🚀 Keunggulan Arsitektur Astro vs PHP & Next.js

1. **Ultra Lightweight & Zero-JS Runtime Default**: Halaman utama dirender statis (Zero JavaScript overhead) untuk performa Core Web Vitals 100/100, jauh lebih ringan dibandingkan Next.js bundle yang memuat React runtime ke browser.
2. **Fullstack Hybrid & Serverless Ready**: Dilengkapi API backend serverless di `/api/contact` yang berjalan langsung di infrastruktur Vercel Serverless Functions.
3. **Style & Asset 1:1 Identik**: Skema warna (Primary Blue, Secondary Green), mode gelap (Dark Mode switch), Font Awesome icons, efek glowing floating, dan animasi latar belakang `hero-pattern` dipertahankan presisi.
4. **Header Keamanan Vercel**: Dilengkapi konfigurasi `vercel.json` dengan standar keamanan OWASP (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`, serta immutable caching untuk asset).

---

## 📁 Struktur Proyek

```
vannabox-astro/
├── public/
│   └── logo.webp                  # Asset logo Vannabox
├── src/
│   ├── components/
│   │   ├── Navbar.astro           # Header navigasi, dark mode switch & hamburger mobile
│   │   ├── Hero.astro             # Hero section dengan statistik mengambang & CTA
│   │   ├── About.astro            # Fitur unggulan tambak & milestone counter
│   │   ├── Products.astro         # Katalog produk (Vaname, Windu, Galah)
│   │   ├── Services.astro         # Layanan rantai dingin, express delivery, garansi
│   │   ├── Contact.astro          # Informasi kontak & formulir pesan interaktif
│   │   └── Footer.astro           # Footer informasi hak cipta & tautan sosial
│   ├── layouts/
│   │   └── Layout.astro           # Layout dasar HTML5, SEO meta tags, & anti-FOUC
│   ├── pages/
│   │   ├── index.astro            # Halaman utama (prerendered static)
│   │   └── api/
│   │       └── contact.ts         # Endpoint serverless backend (prerender: false)
│   └── styles/
│       └── global.css             # Tailwind base & custom animations
├── astro.config.mjs               # Konfigurasi Astro + @astrojs/vercel/serverless
├── tailwind.config.mjs            # Konfigurasi token warna Tailwind
├── tsconfig.json                  # Konfigurasi TypeScript strict
├── vercel.json                    # Konfigurasi deployment & security headers Vercel
└── package.json                   # Dependensi & skrip NPM
```

---

## 🛠️ Menjalankan Secara Lokal

```bash
# Masuk ke folder proyek
cd E:\Development\vannabox-astro

# Menjalankan mode development
npm run dev

# Membangun bundle produksi
npm run build
```

---

## 🚢 Panduan Deploy ke Vercel

### Metode 1: Menggunakan Vercel CLI (Paling Cepat)
```bash
# Pastikan berada di folder E:\Development\vannabox-astro
npx vercel

# Untuk deploy langsung ke production:
npx vercel --prod
```

### Metode 2: Hubungkan via GitHub / GitLab
1. Inisialisasi Git dan push repositori ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial vannabox astro fullstack migration"
   git remote add origin <URL_REPO_ANDA>
   git push -u origin main
   ```
2. Buka [Vercel Dashboard](https://vercel.com/new).
3. Import repositori Anda.
4. Vercel akan otomatis mendeteksi framework **Astro** beserta build command `npm run build` dan output directory `.vercel/output`.
5. Klik **Deploy**. Website akan langsung live dalam hitungan detik!
