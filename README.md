<p align="center">
  <img src="./public/zen.svg" alt="Zaenal Alfian Portfolio Logo" width="120" height="120" />
</p>

<h1 align="center">Zaenal Alfian — Personal Portfolio & Editorial Platform</h1>

<p align="center">
  Platform portfolio personal & sistem publikasi editorial berperforma tinggi berbasis Next.js 16, React 19, Tailwind CSS v4, dan Prisma 7 ORM dengan estetika Wabi-Sabi & Minimalism Jepang.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/NextAuth.js-4-5A29E4?logo=nextdotjs" alt="NextAuth" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## ✨ Fitur

- **Estetika Wabi-Sabi & Japanese Minimalism** — Desain UI/UX eksklusif dengan pola Seigaiha, perpaduan font Serif/Sans/Mono, serta mikro-animasi halus berbasis Framer Motion.
- **Showcase Proyek (`/projects`)** — Galeri proyek interaktif dengan filter kategori, pagination (8 item/halaman), slider carousel screenshot (Embla Carousel), serta tautan repositori & live production app.
- **Artikel & Technical Insights (`/blogs`)** — Artikel teknis seputar frontend engineering dan arsitektur sistem dengan estimasi waktu baca, filter kategori, dan pagination (6 item/halaman).
- **Dokumentasi & Panduan Arsitektur (`/docs`)** — Sistem panduan teknis dan arsitektur perangkat lunak dengan judul interaktif dan pagination (6 item/halaman).
- **Riwayat Pendidikan & Akademik (`/education`)** — Timeline kualifikasi akademik, IPK/GPA, gelar, serta keahlian utama berbasis database dinamis.
- **Perjalanan Profesional (`/experiences`)** — Timeline pengalaman karir, tanggung jawab pekerjaan, dan badge keahlian teknis.
- **Skillsets Teknis (`/skillsets`)** — Kategori keahlian teknis (Frontend Engineering, Backend & Database, Architecture & DevOps, Tools & Methodologies).
- **Portal Admin & CMS (`/admin`)** — Portal manajemen backend terproteksi autentikasi NextAuth.js untuk CRUD proyek, artikel blog, dokumentasi, pengalaman kerja, pendidikan, skillsets, profil, dan akun admin.
- **Rich Text & Editor Markdown** — Editor artikel Tiptap 3 terintegrasi dengan pemrosesan gambar Sharp WebP otomatis.
- **Optimasi Gambar & Direct Serving** — Gambar terkompresi WebP otomatis disajikan cepat via direct static serving tanpa error 400.
- **SEO & Performance Optimization** — Metadata OpenGraph lengkap, canonical URLs, sitemap.xml otomatis, robots.txt, dan lazy-loading dynamic imports.

---

## 🛠 Tech Stack

| Layer | Teknologi | Versi |
|---|---|---|
| Framework | [Next.js (App Router)](https://nextjs.org) | ^16.2 |
| UI Library | [React](https://react.dev) | ^19.2 |
| Bahasa | [TypeScript](https://www.typescriptlang.org) | ^5.0 |
| Styling | [Tailwind CSS](https://tailwindcss.com) + PostCSS | ^4.0 |
| Database | [PostgreSQL](https://www.postgresql.org) | 15+ |
| ORM Provider | [Prisma ORM](https://www.prisma.io) (`@prisma/adapter-pg`) | ^7.9 |
| Autentikasi Admin | [NextAuth.js](https://next-auth.js.org) (Credentials Provider) | ^4.24 |
| Password Hashing | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | ^3.0 |
| Rich Text Editor | [Tiptap 3](https://tiptap.dev) (`@tiptap/react`, `tiptap-markdown`) | ^3.28 |
| Pemrosesan Gambar | [Sharp](https://sharp.pixelplumbing.com) (WebP conversion) | ^0.35 |
| Animasi & Transisi | [Framer Motion](https://www.framer.com/motion/) | ^12.42 |
| Carousel Screenshot | [Embla Carousel React](https://www.embla-carousel.com) | ^8.6 |
| Ikon | [Lucide React](https://lucide.dev) | ^1.26 |
| Parser Markdown | `remark`, `remark-html`, `gray-matter`, `next-mdx-remote` | — |

---

## 🚀 Instalasi & Konfigurasi

### Prasyarat

Pastikan sistem Anda sudah terpasang:

- **Node.js** `>= 20.x`
- **npm** `>= 10.x` atau **pnpm** / **bun**
- **PostgreSQL** `>= 15` (database server lokal atau cloud seperti Supabase/Prisma Postgres)

---

### 1. Clone Repository

```bash
git clone https://github.com/astrocoding/zaenalalfian-porto.git
cd zaenalalfian-porto
```

---

### 2. Install Dependency JavaScript

```bash
npm install
```

---

### 3. Konfigurasi Environment

Buat file `.env` dari template contoh:

```bash
cp .env.example .env
```

Kemudian sesuaikan konfigurasi file `.env`:

```env
# Node Environment
NODE_ENV=development

# URL Utama Aplikasi
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# Connection String PostgreSQL Database
DATABASE_URL="postgresql://portfolio_user:strong_password@localhost:5432/portfolio_db"
```

---

### 4. Migrasi Database & Generate Client

Jalankan pengsinkronan skema skema Prisma ke PostgreSQL dan generate Prisma Client:

```bash
npx prisma db push --config=prisma.config.ts
npx prisma generate --config=prisma.config.ts
```

---

### 5. Seed Data Awal

Populasikan akun admin default, data kontak, riwayat pendidikan, pengalaman kerja, dan skillsets awal:

```bash
npm run seed
```

> **Akun Default Admin setelah Seeding:**
>
> | Role | Email | Password |
> |---|---|---|
> | Admin Portal | `admin@zaenalalfian.dev` | `adminpassword123` |

---

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📁 Struktur Proyek

```
zaenalalfian-porto/
├── app/
│   ├── (public pages)/       # Landing page (/), /projects, /blogs, /docs, /experiences, /education
│   ├── actions/              # Server Actions (CRUD Proyek, Blogs, Docs, Experience, Education, Profile)
│   ├── admin/                # Portal Admin CMS (/admin, /admin/projects, /admin/blogs, dll)
│   ├── api/                  # API Endpoints (Upload image Sharp, Auth NextAuth, Profile)
│   ├── generated/prisma/     # Prisma Client Output Build
│   ├── globals.css           # Styling global & Tailwind CSS v4 directives
│   ├── layout.tsx            # Root Layout & Font Optimization (next/font/google)
│   ├── robots.ts             # Dynamic robots.txt generator
│   └── sitemap.ts            # Dynamic sitemap.xml generator
├── components/
│   ├── admin/                # Komponen Form & Dashboard Admin (EducationForm, BlogForm, dll)
│   ├── blog/                 # Komponen Tampilan Blog (BlogHeader, MarkdownRenderer, dll)
│   ├── docs/                 # Komponen Tampilan Dokumentasi (DocsPageLayout, dll)
│   ├── layout/               # Navbar, Footer, MainLayout
│   ├── project/              # Komponen Tampilan Proyek (ProjectHeader, ProjectGallery)
│   ├── sections/             # Section Landing Page (Hero, About, Skills, Projects, Blogs, Contact)
│   └── ui/                   # Reusable Design System Tokens (Button, Card, Badge, Container)
├── lib/
│   ├── auth.ts               # Konfigurasi NextAuth Credentials Provider
│   ├── blogs.ts              # Fetcher & image optimizer artikel blog
│   ├── docs.ts               # Fetcher panduan dokumentasi
│   ├── github.ts             # GitHub API Commit counter fetcher
│   ├── prisma.ts             # Prisma Client Client Singleton & Cache Invalidator
│   ├── seo.ts                # Canonical URL generator & image normalizer
│   └── slug.server.ts        # Generator Slug unik server-side
├── prisma/
│   ├── migrations/           # Riwayat migrasi database
│   ├── schema.prisma         # Definisi model & skema database Prisma
│   └── seed.ts               # Database Seeder utama (Admin, Education, Experience, Skillsets)
├── public/                   # Asset statis, logo SVG (zen.svg), dan gambar upload (/upload/img/)
├── README.md                 # Dokumentasi utama repositori
├── next.config.ts            # Konfigurasi Next.js, compiler, & remote image patterns
├── package.json              # Dependency & NPM scripts
└── tsconfig.json             # Konfigurasi TypeScript
```

---

## 📦 Perintah yang Tersedia

### NPM Scripts

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Jalankan Next.js development server dengan Hot Reload |
| `npm run build` | Build bundle produksi Next.js |
| `npm run start` | Jalankan server produksi hasil build |
| `npm run seed` | Seed data awal ke database PostgreSQL |
| `npm run lint` | Jalankan ESLint untuk memeriksa kualitas kode |

### Prisma CLI Commands

| Perintah | Deskripsi |
|---|---|
| `npx prisma db push` | Synchronize skema Prisma ke database PostgreSQL |
| `npx prisma generate` | Generate ulang Prisma Client TypeScript definitions |
| `npx prisma studio` | Buka Prisma Studio GUI browser di port 5555 |

---

## 🔐 Portal Admin & Keamanan

| Fitur | Deskripsi |
|---|---|
| **Akses Admin** | Portal Admin terletak di `/admin` dan terproteksi NextAuth.js Session |
| **Enkripsi Password** | Password admin dienkripsi menggunakan `bcryptjs` (salt rounds 10) |
| **Keamanan Upload** | Upload gambar memverifikasi ekstensi, tipe MIME, dan dikompresi otomatis ke format WebP via `sharp` |

---

## 🧪 Testing & Linting

Proyek ini dilengkapi dengan TypeScript strict mode dan ESLint.

```bash
# Verifikasi tipe TypeScript
npx tsc --noEmit

# Verifikasi ESLint
npm run lint
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.

---

<p align="center">
  Dibuat dengan 🔥 oleh <a href="https://github.com/astrocoding">Zaenal Alfian</a>
</p>
