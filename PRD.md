# PRD - BestiVault
**Product Requirements Document**

## 1. Latar Belakang
Sekelompok teman (besti) rutin membuat dokumentasi foto/video setiap hangout/bermain bersama. File video bisa mencapai ~5GB per dokumentasi. Google Drive (15GB) cepat penuh sehingga butuh solusi penyimpanan terpusat dengan kapasitas besar, gratis (atau biaya minimal), bisa diakses semua anggota (laptop, Android, iOS) untuk menonton dan mengunduh media.

## 2. Tujuan Produk
- Menyediakan tempat penyimpanan bersama untuk foto & video dokumentasi grup.
- Mengurangi ukuran file otomatis saat upload tanpa menurunkan kualitas visual secara signifikan.
- Bisa diakses lintas platform (web, Android, iOS) tanpa perlu install aplikasi native.
- Biaya operasional seminimal mungkin (gratis di awal, scalable jika perlu).

## 3. Target Pengguna
- Grup pertemanan kecil (estimasi 5-15 orang).
- Pengguna non-teknis, butuh UI yang sederhana dan ramah.
- Akses dari berbagai device (laptop Windows/Mac, HP Android, iPhone).

## 4. Lingkup (Scope)

### 4.1 In-Scope (MVP)
- Autentikasi (login/register sederhana, atau akses via invite-link + nama).
- Upload foto & video (multi-file, drag & drop di web).
- Kompresi otomatis di backend setelah upload (tanpa proses manual dari user).
- Galeri media: grid view, filter berdasarkan tanggal/acara/album.
- Pengelompokan media ke dalam "Album" per momen/acara.
- Preview/play video & foto langsung di browser.
- Download file (asli atau hasil kompresi).
- Progress indicator saat upload (penting untuk file besar).
- Responsive design untuk mobile browser (Android & iOS).

### 4.2 Out-of-Scope (Fase Berikutnya)
- Native mobile app (App Store/Play Store).
- Komentar/like pada media.
- Sharing ke luar grup (publik).
- Editing foto/video di dalam app.
- Notifikasi push.

## 5. Kebutuhan Fungsional

| ID | Kebutuhan | Prioritas |
|----|-----------|-----------|
| F1 | User dapat login/registrasi dan masuk ke workspace grup | High |
| F2 | User dapat upload foto (jpg/png/heic) dan video (mp4/mov) | High |
| F3 | Sistem otomatis mengompres video & foto setelah upload | High |
| F4 | User dapat membuat & memberi nama album/momen | Medium |
| F5 | User dapat melihat galeri semua media dalam grid | High |
| F6 | User dapat menonton video & memperbesar foto langsung di app | High |
| F7 | User dapat download media (single & batch/zip) | High |
| F8 | Sistem menampilkan sisa kuota storage yang terpakai | Medium |
| F9 | User dapat menghapus media yang diupload sendiri | Medium |
| F10 | Sistem menampilkan progress upload & status kompresi (processing/done) | Medium |

## 6. Kebutuhan Non-Fungsional
- **Performance**: Upload video 5GB harus bisa berjalan via chunked/resumable upload (tidak gagal di koneksi tidak stabil).
- **Kompatibilitas**: Berfungsi di Chrome/Safari (desktop & mobile), termasuk Safari iOS yang punya batasan tertentu untuk upload besar.
- **Storage cost**: Memanfaatkan tier gratis Cloudflare R2 (storage besar, egress gratis) + Supabase (auth & metadata).
- **Skalabilitas**: Desain agar mudah upgrade ke tier berbayar jika storage gratis penuh.
- **Keamanan**: Hanya anggota grup (invite-only) yang bisa akses; signed URL untuk download/preview.

## 7. Alur Pengguna Utama
1. User login ke web app.
2. User membuat/memilih album (misal: "Trip Bromo Juni 2026").
3. User upload foto/video ke album tersebut.
4. Sistem menyimpan file asli sementara, lalu menjalankan proses kompresi (background job).
5. File hasil kompresi disimpan ke storage utama (R2), file asli sementara dihapus.
6. Media muncul di galeri album, status berubah dari "Processing" ke "Ready".
7. Anggota lain bisa membuka album, menonton/melihat, dan download.

## 8. Teknologi yang Diusulkan
- **Frontend**: Next.js (React) - web app responsif, akses via browser di semua device.
- **Auth & Metadata DB**: Supabase (Postgres + Auth, free tier).
- **File Storage**: Cloudflare R2 (free tier 10GB + biaya storage murah, egress gratis).
- **Kompresi**: FFmpeg dijalankan di background worker (misal via Cloudflare Worker, atau serverless function terpisah).
- **Hosting Frontend**: Vercel (free tier).

## 9. Batasan & Risiko
- Free tier storage (R2/Supabase) tetap ada batas; jika grup sangat aktif, biaya kecil mungkin perlu ditanggung bersama.
- Kompresi video besar butuh waktu proses (tidak instan); perlu status "processing" yang jelas ke user.
- Safari iOS memiliki batasan upload file besar via browser; perlu strategi chunked upload.
- Tidak ada SLA uptime karena menggunakan layanan free tier.

## 10. Metrik Keberhasilan
- Semua anggota grup berhasil migrasi dari Google Drive ke aplikasi ini.
- Tidak ada kendala storage penuh dalam 3 bulan pertama penggunaan.
- Waktu upload & kompresi video 5GB selesai dalam waktu wajar (< 15 menit).
- Semua anggota (iOS & Android) bisa mengakses dan download tanpa kendala.
