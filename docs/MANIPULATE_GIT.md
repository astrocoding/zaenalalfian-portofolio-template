# Panduan Manipulasi Tanggal Commit Git (Git Timestamp Manipulation)

Di Git, setiap commit memiliki dua jenis timestamp (stempel waktu):
1. **Author Date** (`GIT_AUTHOR_DATE`): Waktu ketika perubahan kode pertama kali dibuat. *Grafik kontribusi (contribution graph / green squares) di GitHub menggunakan Author Date.*
2. **Committer Date** (`GIT_COMMITTER_DATE`): Waktu ketika commit tersebut secara resmi dibuat/diterapkan ke dalam repository.

---

## ⚠️ Catatan Penting untuk Pengguna Zsh Shell (macOS Default)

Di terminal **zsh**, karakter kurung siku `[` dan `]` (misal: `[id]`, `[slug]`, `[...nextauth]`) dianggap sebagai *glob wildcard pattern*. Jika tidak dibungkus dengan tanda kutip tunggal `'...'`, zsh akan mengembalikan error: `zsh: no matches found`.

**Solusi:** Selalu bungkus path yang memiliki kurung siku dengan tanda kutip tunggal:
`git add 'app/admin/docs/[id]/edit/page.tsx'`

---

## 1. Membuat Commit Baru dengan Tanggal Masa Lalu (Backdate)

```bash
GIT_AUTHOR_DATE="2026-01-15 10:30:00" GIT_COMMITTER_DATE="2026-01-15 10:30:00" git commit -m "Pesan commit kamu"
```

---

## 2. Script Eksekusi Khusus untuk Step yang Sempat Failed (Step 10, 13, 16, 18, 19, 20, 21, 23)

Jika kamu ingin mengeksekusi sisa file yang belum ter-commit akibat error `zsh: no matches found`, copy & paste blok perintah di bawah ini langsung ke terminal:

```bash
# Step 10: 6 Februari 2026 pukul 08:30 pagi
git add 'app/projects/[slug]/page.tsx'
GIT_AUTHOR_DATE="2026-02-06 08:30:00" GIT_COMMITTER_DATE="2026-02-06 08:30:00" git commit -m "feat(projects): implement dynamic project detail case study page with SSG fallback"

# Step 13: 27 Februari 2026 pukul 09:30 pagi
git add 'app/blogs/[category]/[slug]/page.tsx'
GIT_AUTHOR_DATE="2026-02-27 09:30:00" GIT_COMMITTER_DATE="2026-02-27 09:30:00" git commit -m "feat(blog): add dynamic blog post page with table of contents and reading progress"

# Step 16: 8 Maret 2026 pukul 07:00 pagi
git add lib/auth.ts 'app/api/auth/[...nextauth]/route.ts' components/admin/SessionProviderWrapper.tsx
GIT_AUTHOR_DATE="2026-03-08 07:00:00" GIT_COMMITTER_DATE="2026-03-08 07:00:00" git commit -m "feat(auth): configure NextAuth credentials authentication provider and session JWT handler"

# Step 18: 12 Maret 2026 pukul 09:00 pagi
git add prisma/migrations/20260723135319_add_users_and_docs_models/migration.sql components/admin/UserForm.tsx app/admin/users/page.tsx app/admin/users/new/page.tsx 'app/admin/users/[id]/edit/page.tsx'
GIT_AUTHOR_DATE="2026-03-12 09:00:00" GIT_COMMITTER_DATE="2026-03-12 09:00:00" git commit -m "feat(admin): add user management model migration and CRUD views for admin users"

# Step 19: 12 Maret 2026 pukul 10:00 pagi
git add components/admin/ProjectForm.tsx app/admin/projects/page.tsx app/admin/projects/new/page.tsx 'app/admin/projects/[id]/edit/page.tsx'
GIT_AUTHOR_DATE="2026-03-12 10:00:00" GIT_COMMITTER_DATE="2026-03-12 10:00:00" git commit -m "feat(admin): build showcase project management CRUD views for creation and updates"

# Step 20: 15 Maret 2026 pukul 11:00 pagi
git add components/admin/BlogForm.tsx app/admin/blogs/page.tsx app/admin/blogs/new/page.tsx 'app/admin/blogs/[id]/edit/page.tsx'
GIT_AUTHOR_DATE="2026-03-15 11:00:00" GIT_COMMITTER_DATE="2026-03-15 11:00:00" git commit -m "feat(admin): implement blog post management CRUD views with category filters"

# Step 21: 15 Maret 2026 pukul 12:00 siang
git add app/admin/docs/page.tsx app/admin/docs/new/page.tsx 'app/admin/docs/[id]/edit/page.tsx'
GIT_AUTHOR_DATE="2026-03-15 12:00:00" GIT_COMMITTER_DATE="2026-03-15 12:00:00" git commit -m "feat(admin): add documentation management CRUD views for technical guides"

# Step 23: 21 Maret 2026 pukul 09:00 pagi
git add prisma/migrations/20260723143101_add_experience_model/migration.sql components/admin/ExperienceForm.tsx components/sections/ExperienceSection.tsx app/admin/experiences/page.tsx app/admin/experiences/new/page.tsx 'app/admin/experiences/[id]/edit/page.tsx'
GIT_AUTHOR_DATE="2026-03-21 09:00:00" GIT_COMMITTER_DATE="2026-03-21 09:00:00" git commit -m "feat(experience): add Experience database model migration and admin CRUD management portal"
```

---

## 3. Master Script Eksekusi 25 Commit Terkoreksi (Untuk Fresh Commit / Re-commit)

Berikut adalah 25 perintah lengkap yang sudah dikoreksi dengan tanda kutip `'...'` pada seluruh path yang mengandung kurung siku:

```bash
# 1. 22 Januari 2026 pukul 10:00 pagi
git add package.json package-lock.json .gitignore src/styles/variables.css app/globals.css
GIT_AUTHOR_DATE="2026-01-22 10:00:00" GIT_COMMITTER_DATE="2026-01-22 10:00:00" git commit -m "chore: initialize Next.js 16 project structure and Japanese Minimalist design tokens"

# 2. 22 Januari 2026 pukul 10:30 pagi
git add components/ui/Container.tsx components/ui/Typography.tsx components/ui/index.ts components/layout/Footer.tsx
GIT_AUTHOR_DATE="2026-01-22 10:30:00" GIT_COMMITTER_DATE="2026-01-22 10:30:00" git commit -m "feat(ui): implement responsive Container and Typography components with Wabi-Sabi styling"

# 3. 22 Januari 2026 pukul 10:40 pagi
git add components/ui/Button.tsx components/ui/Badge.tsx components/ui/Card.tsx components/ui/Motion.tsx components/ui/SectionWrapper.tsx
GIT_AUTHOR_DATE="2026-01-22 10:40:00" GIT_COMMITTER_DATE="2026-01-22 10:40:00" git commit -m "feat(ui): add core UI button, card, badge, and section wrapper components"

# 4. 27 Januari 2026 pukul 11:00 pagi
git add components/layout/Navbar.tsx components/layout/MainLayout.tsx components/layout/index.ts app/layout.tsx
GIT_AUTHOR_DATE="2026-01-27 11:00:00" GIT_COMMITTER_DATE="2026-01-27 11:00:00" git commit -m "feat(layout): implement sticky header Navbar with responsive drawer and main layout wrapper"

# 5. 27 Januari 2026 pukul 13:00 siang
git add components/sections/HeroSection.tsx
GIT_AUTHOR_DATE="2026-01-27 13:00:00" GIT_COMMITTER_DATE="2026-01-27 13:00:00" git commit -m "feat(home): build Hero section with craftsmanship copy, code snippet card, and key metrics"

# 6. 31 Januari 2026 pukul 12:00 siang
git add components/sections/AboutSection.tsx components/sections/SkillsSection.tsx
GIT_AUTHOR_DATE="2026-01-31 12:00:00" GIT_COMMITTER_DATE="2026-01-31 12:00:00" git commit -m "feat(home): implement About & Engineering Philosophy section and Skills matrix grid"

# 7. 31 Januari 2026 pukul 12:30 siang
git add components/sections/ContactSection.tsx components/seo/JsonLd.tsx app/robots.ts app/sitemap.ts
GIT_AUTHOR_DATE="2026-01-31 12:30:00" GIT_COMMITTER_DATE="2026-01-31 12:30:00" git commit -m "feat(seo): add contact section, JsonLd schema markup, robots.txt, and sitemap generation"

# 8. 6 Februari 2026 pukul 08:00 pagi
git add prisma/schema.prisma prisma/migrations/20260723132830_init_portfolio_schema/migration.sql lib/prisma.ts
GIT_AUTHOR_DATE="2026-02-06 08:00:00" GIT_COMMITTER_DATE="2026-02-06 08:00:00" git commit -m "feat(db): setup Prisma ORM schema with PostgreSQL driver adapter and initial migrations"

# 9. 6 Februari 2026 pukul 08:15 pagi
git add components/project/ProjectHeader.tsx components/project/ProjectGallery.tsx components/project/ProjectCaseStudy.tsx components/project/index.ts components/sections/FeaturedProjectsSection.tsx
GIT_AUTHOR_DATE="2026-02-06 08:15:00" GIT_COMMITTER_DATE="2026-02-06 08:15:00" git commit -m "feat(projects): add project showcase components, image gallery modal, and case study layout"

# 10. 6 Februari 2026 pukul 08:30 pagi
git add 'app/projects/[slug]/page.tsx'
GIT_AUTHOR_DATE="2026-02-06 08:30:00" GIT_COMMITTER_DATE="2026-02-06 08:30:00" git commit -m "feat(projects): implement dynamic project detail case study page with SSG fallback"

# 11. 27 Februari 2026 pukul 09:00 pagi
git add content/blogs/architecture/nextjs-16-prisma-7-driver-adapters.md content/blogs/design/japanese-minimalist-ui-design-clarity.md lib/blogs.ts
GIT_AUTHOR_DATE="2026-02-27 09:00:00" GIT_COMMITTER_DATE="2026-02-27 09:00:00" git commit -m "feat(blog): add static blog markdown content and file parser helper library"

# 12. 27 Februari 2026 pukul 09:18 pagi
git add components/blog/BlogHeader.tsx components/blog/MarkdownRenderer.tsx components/blog/RelatedArticles.tsx components/blog/index.ts components/sections/LatestBlogsSection.tsx
GIT_AUTHOR_DATE="2026-02-27 09:18:00" GIT_COMMITTER_DATE="2026-02-27 09:18:00" git commit -m "feat(blog): implement markdown article renderer, header metadata, and blog listing section"

# 13. 27 Februari 2026 pukul 09:30 pagi
git add 'app/blogs/[category]/[slug]/page.tsx'
GIT_AUTHOR_DATE="2026-02-27 09:30:00" GIT_COMMITTER_DATE="2026-02-27 09:30:00" git commit -m "feat(blog): add dynamic blog post page with table of contents and reading progress"

# 14. 1 Maret 2026 pukul 10:00 pagi
git add lib/docs.ts
GIT_AUTHOR_DATE="2026-03-01 10:00:00" GIT_COMMITTER_DATE="2026-03-01 10:00:00" git commit -m "feat(docs): add documentation data fetching library and architectural guide schema"

# 15. 1 Maret 2026 pukul 11:00 pagi
git add components/admin/DocForm.tsx
GIT_AUTHOR_DATE="2026-03-01 11:00:00" GIT_COMMITTER_DATE="2026-03-01 11:00:00" git commit -m "feat(docs): create Markdown documentation editor form with live preview"

# 16. 8 Maret 2026 pukul 07:00 pagi
git add lib/auth.ts 'app/api/auth/[...nextauth]/route.ts' components/admin/SessionProviderWrapper.tsx
GIT_AUTHOR_DATE="2026-03-08 07:00:00" GIT_COMMITTER_DATE="2026-03-08 07:00:00" git commit -m "feat(auth): configure NextAuth credentials authentication provider and session JWT handler"

# 17. 8 Maret 2026 pukul 07:30 pagi
git add app/admin/login/page.tsx app/admin/layout.tsx components/admin/AdminSidebar.tsx
GIT_AUTHOR_DATE="2026-03-08 07:30:00" GIT_COMMITTER_DATE="2026-03-08 07:30:00" git commit -m "feat(admin): implement secure admin login portal, sidebar navigation, and layout wrapper"

# 18. 12 Maret 2026 pukul 09:00 pagi
git add prisma/migrations/20260723135319_add_users_and_docs_models/migration.sql components/admin/UserForm.tsx app/admin/users/page.tsx app/admin/users/new/page.tsx 'app/admin/users/[id]/edit/page.tsx'
GIT_AUTHOR_DATE="2026-03-12 09:00:00" GIT_COMMITTER_DATE="2026-03-12 09:00:00" git commit -m "feat(admin): add user management model migration and CRUD views for admin users"

# 19. 12 Maret 2026 pukul 10:00 pagi
git add components/admin/ProjectForm.tsx app/admin/projects/page.tsx app/admin/projects/new/page.tsx 'app/admin/projects/[id]/edit/page.tsx'
GIT_AUTHOR_DATE="2026-03-12 10:00:00" GIT_COMMITTER_DATE="2026-03-12 10:00:00" git commit -m "feat(admin): build showcase project management CRUD views for creation and updates"

# 20. 15 Maret 2026 pukul 11:00 pagi
git add components/admin/BlogForm.tsx app/admin/blogs/page.tsx app/admin/blogs/new/page.tsx 'app/admin/blogs/[id]/edit/page.tsx'
GIT_AUTHOR_DATE="2026-03-15 11:00:00" GIT_COMMITTER_DATE="2026-03-15 11:00:00" git commit -m "feat(admin): implement blog post management CRUD views with category filters"

# 21. 15 Maret 2026 pukul 12:00 siang
git add app/admin/docs/page.tsx app/admin/docs/new/page.tsx 'app/admin/docs/[id]/edit/page.tsx'
GIT_AUTHOR_DATE="2026-03-15 12:00:00" GIT_COMMITTER_DATE="2026-03-15 12:00:00" git commit -m "feat(admin): add documentation management CRUD views for technical guides"

# 22. 20 Maret 2026 pukul 13:00 siang
git add app/api/upload/route.ts components/admin/ImageUploader.tsx prisma/migrations/20260723141108_add_project_images_array/migration.sql
GIT_AUTHOR_DATE="2026-03-20 13:00:00" GIT_COMMITTER_DATE="2026-03-20 13:00:00" git commit -m "feat(media): implement Sharp image auto-compression to WebP and drag-and-drop multi uploader"

# 23. 21 Maret 2026 pukul 09:00 pagi
git add prisma/migrations/20260723143101_add_experience_model/migration.sql components/admin/ExperienceForm.tsx components/sections/ExperienceSection.tsx app/admin/experiences/page.tsx app/admin/experiences/new/page.tsx 'app/admin/experiences/[id]/edit/page.tsx'
GIT_AUTHOR_DATE="2026-03-21 09:00:00" GIT_COMMITTER_DATE="2026-03-21 09:00:00" git commit -m "feat(experience): add Experience database model migration and admin CRUD management portal"

# 24. 21 Maret 2026 pukul 09:30 pagi
git add app/actions/admin.ts prisma/migrations/migration_lock.toml prisma/seed.ts app/admin/page.tsx
GIT_AUTHOR_DATE="2026-03-21 09:30:00" GIT_COMMITTER_DATE="2026-03-21 09:30:00" git commit -m "feat(actions): implement Server Actions for admin CRUD and seed production experience data"

# 25. 25 Maret 2026 pukul 10:00 pagi
git add app/page.tsx app/about/page.tsx components/sections/index.ts -f docs/MANIPULATE_GIT.md
GIT_AUTHOR_DATE="2026-03-25 10:00:00" GIT_COMMITTER_DATE="2026-03-25 10:00:00" git commit -m "feat(home): integrate database queries into landing page, dedicated about route, and scroll spy navbar"

# 26. 29 Maret 2026 pukul 19:00 malam
git add .
GIT_AUTHOR_DATE="2026-03-29 19:00:00" GIT_COMMITTER_DATE="2026-03-29 19:00:00" git commit -m "fix(eslint): resolve all ESLint errors, type augmentations, and React 19 hook warnings"
```

---

## 4. Script Eksekusi 9 Commit Mei — Juni 2026 (Terstruktur & Akurat)

Berikut adalah urutan 9 commit khusus untuk 26 berkas yang telah diperbarui dan baru, sesuai dengan jadwal waktu Mei - Juni 2026:

```bash
# 1. 27 Mei 2026 pukul 13:20:00
git add components/ui/Badge.tsx components/ui/CardCornerSeigaiha.tsx components/ui/SectionWrapper.tsx components/ui/index.ts
GIT_AUTHOR_DATE="2026-05-27 13:20:00" GIT_COMMITTER_DATE="2026-05-27 13:20:00" git commit -m "feat(ui): update core badge, section wrapper, and Japanese Seigaiha pattern components"

# 2. 31 Mei 2026 pukul 09:00:00
git add components/layout/Navbar.tsx components/layout/Footer.tsx
GIT_AUTHOR_DATE="2026-05-31 09:00:00" GIT_COMMITTER_DATE="2026-05-31 09:00:00" git commit -m "feat(layout): refine navbar brand title, smooth scroll targets, and footer layout"

# 3. 31 Mei 2026 pukul 09:21:00
git add components/sections/HeroSection.tsx
GIT_AUTHOR_DATE="2026-05-31 09:21:00" GIT_COMMITTER_DATE="2026-05-31 09:21:00" git commit -m "feat(hero): implement animated counter calc metrics, zen logo, and bio copy updates"

# 4. 31 Mei 2026 pukul 10:00:00
git add components/sections/ExperienceSection.tsx components/sections/SkillsSection.tsx components/sections/FeaturedProjectsSection.tsx components/sections/LatestBlogsSection.tsx components/sections/ContactSection.tsx
GIT_AUTHOR_DATE="2026-05-31 10:00:00" GIT_COMMITTER_DATE="2026-05-31 10:00:00" git commit -m "feat(sections): update technical capabilities, background kanji accents, and section layouts"

# 5. 1 Juni 2026 pukul 07:00:00
git add components/blog/BlogHeader.tsx app/about/page.tsx
GIT_AUTHOR_DATE="2026-06-01 07:00:00" GIT_COMMITTER_DATE="2026-06-01 07:00:00" git commit -m "feat(pages): update blog article header role titles and dedicated about page bio card"

# 6. 1 Juni 2026 pukul 07:30:00
git add components/admin/AdminSidebar.tsx components/admin/UserForm.tsx components/admin/ProjectForm.tsx components/admin/BlogForm.tsx components/admin/DocForm.tsx components/admin/ExperienceForm.tsx
GIT_AUTHOR_DATE="2026-06-01 07:30:00" GIT_COMMITTER_DATE="2026-06-01 07:30:00" git commit -m "feat(admin): update admin management forms and sidebar navigation links"

# 7. 1 Juni 2026 pukul 07:35:00
git add app/admin/layout.tsx app/admin/login/page.tsx
GIT_AUTHOR_DATE="2026-06-01 07:35:00" GIT_COMMITTER_DATE="2026-06-01 07:35:00" git commit -m "feat(admin): refine admin portal layout wrapper and login view authentication UI"

# 8. 1 Juni 2026 pukul 07:41:00
git add app/api/profile/route.ts components/ui/GithubContributionGraph.tsx prisma/seed.ts
GIT_AUTHOR_DATE="2026-06-01 07:41:00" GIT_COMMITTER_DATE="2026-06-01 07:41:00" git commit -m "feat(github): add profile API route and dynamic GitHub contribution graph database integration"

# 9. 3 Juni 2026 pukul 09:00:00
git add components/seo/JsonLd.tsx -f docs/MANIPULATE_GIT.md .env .env.example
GIT_AUTHOR_DATE="2026-06-03 09:00:00" GIT_COMMITTER_DATE="2026-06-03 09:00:00" git commit -m "docs(git): update SEO JsonLd schema role titles and git timestamp manipulation guide"
```


