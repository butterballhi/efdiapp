# DESIGN - BestiVault
**Design Document & Style Guide**

## 1. Konsep Visual
Tema: **"Sweet Pastel Friendship"** - ceria, hangat, dan terasa personal seperti scrapbook digital persahabatan. Cocok untuk grup perempuan yang ingin menyimpan kenangan dengan tampilan yang lembut dan menyenangkan.

## 2. Palet Warna

### Warna Utama
| Nama | Hex | Penggunaan |
|------|-----|------------|
| Pink Pastel | `#FFD6E8` | Background aksen, card highlight |
| Lavender Pastel | `#E5D4F5` | Background sekunder, hover state |
| Yellow Pastel | `#FFF3B0` | Highlight, badge, notifikasi |
| Peach Pastel | `#FFE0CC` | Tombol sekunder, tag album |
| Mint Pastel | `#D4F5E9` | Status sukses, indikator "Ready" |

### Warna Pendukung
| Nama | Hex | Penggunaan |
|------|-----|------------|
| Putih Krem | `#FFFBF5` | Background utama |
| Abu Lembut | `#7A7270` | Teks sekunder |
| Coklat Hangat | `#4A3F3D` | Teks utama (kontras cukup) |
| Pink Tegas | `#FF8FB1` | Tombol utama (CTA), aksen aktif |
| Ungu Tegas | `#B89FE8` | Link, ikon interaktif |

### Warna Status
| Status | Warna | Hex |
|--------|-------|-----|
| Processing/Upload | Yellow Pastel | `#FFF3B0` dengan teks `#8A7A00` |
| Ready/Selesai | Mint Pastel | `#D4F5E9` dengan teks `#2E8B6E` |
| Error/Gagal | Pink lebih tegas | `#FFCAD4` dengan teks `#C2185B` |

## 3. Tipografi
- **Heading**: "Poppins" atau "Fredoka" - bulat, ramah, sedikit playful.
- **Body Text**: "Nunito" atau "Inter" - mudah dibaca, lembut.
- **Ukuran**:
  - H1: 28-32px, bold
  - H2: 22-24px, semi-bold
  - Body: 14-16px, regular
  - Caption/label: 12px, medium

## 4. Komponen UI

### 4.1 Navbar / Header
- Background putih krem dengan border bawah pink pastel tipis.
- Logo + nama app di kiri (misal dengan ikon polaroid/kamera bergaya doodle).
- Avatar user & menu di kanan, berbentuk bulat dengan border pink.

### 4.2 Album Card
- Bentuk rounded corner besar (radius 16-20px).
- Cover berupa thumbnail foto/video pertama dalam album.
- Overlay gradient pastel (pink ke lavender) tipis di bagian bawah untuk judul album.
- Badge jumlah item di pojok (background yellow pastel).
- Shadow lembut (soft drop shadow, tidak tajam).

### 4.3 Galeri Grid
- Grid responsif (3-4 kolom desktop, 2 kolom mobile).
- Setiap item rounded corner 12px, gap antar item 8-12px.
- Hover (desktop): scale sedikit + overlay tombol play/download.
- Badge status (Processing/Ready) di pojok kanan atas tiap item.

### 4.4 Tombol
- **Primary button** (Upload, Download): background pink tegas `#FF8FB1`, teks putih, rounded full/pill shape.
- **Secondary button**: outline ungu pastel, teks ungu tegas.
- Hover: sedikit lebih gelap + scale 1.02.

### 4.5 Upload Area
- Drag & drop zone dengan border dashed lavender pastel.
- Background lavender pastel transparan saat drag-over.
- Ikon awan/upload bergaya doodle/line-art lembut.
- Progress bar dengan gradient pink ke yellow pastel.

### 4.6 Video/Photo Viewer (Modal/Lightbox)
- Background overlay gelap semi-transparan (agar fokus ke media, kontras dengan tema pastel di luar modal).
- Tombol close, download, navigasi (prev/next) berbentuk bulat pastel dengan ikon kontras.
- Info media (uploader, tanggal) di bagian bawah dengan teks lembut.

## 5. Ikonografi & Ilustrasi
- Gunakan ikon line-art rounded (misal dari Lucide/Feather dengan stroke lebih tebal).
- Aksen ilustrasi: bintang kecil, hati, bunga sederhana, awan - sebagai elemen dekoratif di empty state.
- Empty state (belum ada album/foto): ilustrasi pastel dengan teks ramah, misal "Belum ada momen di sini, yuk upload kenangan pertama kalian! ✨"

## 6. Mood & Tone Penulisan UI
- Bahasa kasual, hangat, dan personal (bukan formal/korporat).
- Contoh microcopy:
  - Upload sukses: "Yeay! Foto kalian udah disimpan~"
  - Processing: "Sedang diproses, sabar ya, sebentar lagi siap ditonton!"
  - Storage hampir penuh: "Penyimpanan udah mau penuh nih, yuk cek album lama!"

## 7. Layout Halaman

### 7.1 Halaman Utama (Dashboard Album)
- Header dengan greeting ("Halo, [Nama]!") + total storage terpakai (progress bar pastel).
- Grid album dengan tombol "+ Buat Album Baru" sebagai card pertama (border dashed).

### 7.2 Halaman Album Detail
- Header album (nama, tanggal dibuat, jumlah item, tombol "Download Semua").
- Tombol upload mengambang (floating action button) di pojok kanan bawah, warna pink tegas.
- Grid galeri media.

### 7.3 Halaman Login/Register
- Background gradient lembut pink ke lavender.
- Card form putih krem di tengah, rounded besar, shadow soft.
- Ilustrasi dekoratif (misal dua karakter doodle berpelukan) di sisi card pada layar lebar.

## 8. Responsive & Mobile Considerations
- Mobile-first: semua elemen interaktif minimal area sentuh 44x44px.
- Bottom navigation bar opsional untuk mobile (ikon: Home/Album, Upload, Profile).
- Pastikan kontras teks tetap memenuhi standar keterbacaan (WCAG AA) meski menggunakan warna pastel - gunakan teks coklat hangat (`#4A3F3D`) di atas background pastel, bukan putih.

## 9. Referensi Mood
Kombinasi warna terinspirasi dari estetika "soft girl", scrapbook digital, dan aplikasi seperti VSCO/Polarsteps namun dengan sentuhan lebih playful dan personal untuk grup pertemanan.
