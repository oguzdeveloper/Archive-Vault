<div align="center">

<img src="https://img.shields.io/badge/ArchiveVault-Local--First-6366f1?style=for-the-badge&logo=archive&logoColor=white" alt="ArchiveVault" />

# ArchiveVault

### Your Personal Web Archive — Offline, Private, Forever Yours

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/MIT-green?style=flat-square&label=License)](LICENSE)

**EN** | Save any webpage as a fully self-contained local archive. Search, tag, organize, annotate — all offline. Your data never touches a server.

**TR** | Herhangi bir web sayfasını tamamen bağımsız bir yerel arşiv olarak kaydedin. Arayın, etiketleyin, düzenleyin, not alın — hepsi çevrimdışı. Veriniz asla bir sunucuya gitmez.

---

</div>

<br/>

## Why ArchiveVault? | Neden ArchiveVault?

<table>
<tr>
<td width="50%">

### EN

The internet is ephemeral. Pages disappear, articles get paywalled, content changes without notice. **ArchiveVault** solves this by letting you save a permanent, offline copy of any webpage — stored entirely on your own machine.

Unlike cloud bookmark managers, there's **no account**, **no subscription**, **no tracking**. Unlike browser bookmarks, your saved pages actually contain the content — not just a link that might break tomorrow.

</td>
<td width="50%">

### TR

İnternet geçicidir. Sayfalar kaybolur, makaleler ücretli hale gelir, içerik habersiz değişir. **ArchiveVault** herhangi bir web sayfasının kalıcı, çevrimdışı bir kopyasını kaydetmenizi sağlar — tamamen kendi makinenizde.

Bulut tabanlı yer imi yöneticilerinden farklı olarak **hesap yok**, **abonelik yok**, **takip yok**. Tarayıcı yer imlerinden farklı olarak, kaydettiğiniz sayfalar gerçekten içeriği barındırır — yarın kırılabilecek bir link değil.

</td>
</tr>
</table>

---

## Features | Özellikler

<table>
<tr>
<td width="50%">

### EN

- **Single-File Archiving** — Saves entire pages as one HTML file with CSS & images inlined as base64
- **Smart Tags** — Color-coded tags for flexible categorization
- **Folders** — Hierarchical folder structure for organization
- **Personal Notes** — Annotate any bookmark with your own notes
- **Full-Text Search** — Search across page titles, URLs, full page content, and your notes simultaneously
- **Offline Access** — View any archived page without internet connection
- **Bilingual UI** — Switch between Turkish and English with one click
- **Zero Database** — Plain JSON files, copy your `data/` folder to migrate anywhere
- **Dark UI** — Modern, clean dark interface designed for focus

</td>
<td width="50%">

### TR

- **Tek Dosya Arşivleme** — Sayfaları CSS ve görseller base64 olarak gömülü tek HTML dosyasına kaydeder
- **Akıllı Etiketler** — Esnek sınıflandırma için renkli etiketler
- **Klasörler** — Organizasyon için hiyerarşik klasör yapısı
- **Kişisel Notlar** — Herhangi bir yer imine kendi notlarınızı ekleyin
- **Tam Metin Arama** — Başlık, URL, sayfa içeriği ve notlarınız arasında eş zamanlı arama
- **Çevrimdışı Erişim** — Arşivlenmiş sayfaları internet bağlantısı olmadan görüntüleyin
- **İki Dilli Arayüz** — Tek tıkla Türkçe ve İngilizce arasında geçiş yapın
- **Veritabanı Yok** — Düz JSON dosyaları, `data/` klasörünü kopyalayarak taşıyın
- **Karanlık Tema** — Odaklanma için tasarlanmış modern, temiz arayüz

</td>
</tr>
</table>

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety |
| Styling | TailwindCSS | Utility-first CSS |
| Icons | Lucide React | Beautiful consistent icons |
| Storage | JSON files | No database server needed |
| HTML Parser | Cheerio | DOM manipulation on server |
| Content Extractor | @mozilla/readability | Article text extraction |
| DOM Engine | jsdom | Server-side DOM for Readability |

---

## Quick Start | Hızlı Başlangıç

```bash
git clone https://github.com/oguzdeveloper/archivevault.git
cd archivevault
npm install
npm run dev
```

Open / Açın → [http://localhost:3000](http://localhost:3000)

---

## Usage | Kullanım

<table>
<tr>
<td width="50%">

### EN

1. **Add a URL** — Click the "Add" button, paste any URL
2. **Wait for archiving** — The page is fetched, all assets are inlined, and a self-contained HTML file is saved
3. **Organize** — Assign tags and/or a folder to categorize
4. **Add notes** — Click edit to attach personal notes
5. **Search** — Type in the search bar to find across all content
6. **View offline** — Click the archive icon on any card to view the saved version
7. **Switch language** — Click the globe button in the toolbar

</td>
<td width="50%">

### TR

1. **URL Ekleyin** — "Ekle" butonuna tıklayın, herhangi bir URL yapıştırın
2. **Arşivlemeyi bekleyin** — Sayfa indirilir, tüm kaynaklar gömülür, bağımsız bir HTML dosyası kaydedilir
3. **Düzenleyin** — Kategorize etmek için etiket ve/veya klasör atayın
4. **Not ekleyin** — Düzenle'ye tıklayarak kişisel notlarınızı ekleyin
5. **Arama yapın** — Arama çubuğuna yazarak tüm içerikler arasında arama yapın
6. **Çevrimdışı görüntüleyin** — Herhangi bir karttaki arşiv ikonuna tıklayarak kaydedilmiş versiyonu görün
7. **Dil değiştirin** — Araç çubuğundaki küre butonuna tıklayın

</td>
</tr>
</table>

---

## How It Works | Nasıl Çalışır

```
URL Input → Fetch HTML → Parse with Cheerio → Inline CSS → Inline Images (base64)
    ↓
Save as single HTML file → Extract text via Readability → Store metadata in JSON
    ↓
Full-text searchable → Viewable offline → Organized with tags & folders
```

**EN**: When you submit a URL, the server downloads the page, fetches all linked stylesheets and embeds them as `<style>` blocks, converts all images to base64 data URIs, and saves everything as a single portable HTML file. Simultaneously, Mozilla's Readability extracts the main text content for full-text search indexing.

**TR**: Bir URL gönderdiğinizde sunucu sayfayı indirir, tüm bağlantılı stil dosyalarını alıp `<style>` blokları olarak gömer, tüm görselleri base64 data URI'lerine dönüştürür ve her şeyi tek bir taşınabilir HTML dosyası olarak kaydeder. Eş zamanlı olarak Mozilla Readability ana metin içeriğini tam metin arama indekslemesi için çıkarır.

---

## Project Structure | Proje Yapısı

```
archivevault/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── bookmarks/      # CRUD + archive serving
│   │   │   ├── tags/           # Tag management
│   │   │   └── folders/        # Folder management
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main dashboard (client component)
│   │   └── globals.css         # Global styles + CSS variables
│   ├── components/
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── BookmarkCard.tsx    # Bookmark display card
│   │   ├── AddBookmarkDialog.tsx
│   │   ├── EditBookmarkDialog.tsx
│   │   └── SearchBar.tsx
│   ├── lib/
│   │   ├── db.ts              # JSON file-based data store
│   │   ├── archiver.ts        # URL fetcher & single-file archiver
│   │   ├── i18n.ts            # Translations (TR/EN)
│   │   └── utils.ts           # Helpers (cn, formatDate, getDomain)
│   └── types/
│       └── index.ts           # TypeScript interfaces
├── data/                       # JSON store (auto-created, gitignored)
├── archives/                   # Saved HTML files (auto-created, gitignored)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

---

## Data Storage | Veri Depolama

**EN**: All data lives in `data/store.json` — a single, human-readable JSON file. Archived pages are saved as individual HTML files in `archives/{id}/index.html`. No database server, no migrations, no ORM. To backup: just copy the `data/` and `archives/` folders.

**TR**: Tüm veri `data/store.json` dosyasında yaşar — tek, okunabilir bir JSON dosyası. Arşivlenen sayfalar `archives/{id}/index.html` olarak kaydedilir. Veritabanı sunucusu yok, migrasyon yok, ORM yok. Yedeklemek için: sadece `data/` ve `archives/` klasörlerini kopyalayın.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bookmarks?search=&folder_id=&tag_id=` | List/filter bookmarks |
| `POST` | `/api/bookmarks` | Create & archive a new bookmark |
| `GET` | `/api/bookmarks/[id]` | Get single bookmark |
| `PATCH` | `/api/bookmarks/[id]` | Update title, notes, folder, tags |
| `DELETE` | `/api/bookmarks/[id]` | Delete bookmark & archive |
| `GET` | `/api/bookmarks/[id]/archive` | Serve archived HTML |
| `GET` | `/api/tags` | List all tags |
| `POST` | `/api/tags` | Create a tag |
| `GET` | `/api/folders` | List all folders |
| `POST` | `/api/folders` | Create a folder |
| `DELETE` | `/api/folders?id=` | Delete a folder |

---

## Contributing | Katkıda Bulunma

```bash
# Fork & clone
git clone https://github.com/YOUR_FORK/archivevault.git

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

PRs welcome. Please follow existing code style.

---

## License | Lisans

[MIT](LICENSE) - Made by [@oguzdeveloper](https://github.com/oguzdeveloper)
