# Kerajaan Bahasa Arab — Website Petualangan Belajar

Website pembelajaran Bahasa Arab kelas IV MI dengan alur cerita interaktif:
1. Siswa membuka pintu gerbang kerajaan.
2. Siswa menjadi tokoh musafir yang berjalan menyeberangi jembatan di atas sungai.
3. Siswa menjawab 5 pertanyaan dari penjaga gerbang.
4. Setelah lulus, siswa masuk ke kerajaan dan dapat menjelajahi 6 ruang materi.
5. Efek suara gerbang, langkah, jawaban benar/salah, dan nada kemenangan dibuat secara lokal dengan Web Audio API.

## Fitur
- Desain responsif desktop, tablet, dan ponsel.
- Animasi gerbang terbuka dan tokoh berjalan.
- Air sungai bergerak dengan animasi CSS.
- Kuis masuk kerajaan, 5 pertanyaan pilihan ganda, 1 kunci untuk tiap jawaban benar; jawaban salah dapat dicoba kembali.
- Tombol on/off suara.
- Enam ruang materi Bahasa Arab kelas IV MI.
- Kosakata Arab, terjemahan, contoh kalimat, dan misi menulis.
- Tidak membutuhkan database, login, API key, atau framework.

## Menjalankan secara lokal
1. Ekstrak ZIP.
2. Buka folder `kerajaan-bahasa-arab`.
3. Buka `index.html` di Chrome, Edge, Firefox, atau Safari.
4. Tekan tombol gerbang untuk memulai.
5. Browser biasanya baru mengizinkan audio setelah interaksi pengguna pertama. Tekan gerbang untuk mengaktifkan suara.

## Deploy ke GitHub Pages
1. Buat repository baru di https://github.com, misalnya `kerajaan-bahasa-arab`.
2. Upload seluruh isi folder ini ke root repository (index.html harus berada di root).
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
6. Tunggu sampai GitHub Pages menampilkan URL publik.

## Deploy ke Vercel
1. Login ke https://vercel.com dengan akun GitHub.
2. Pilih **Add New → Project**, lalu impor repository.
3. Framework Preset: **Other**.
4. Build Command kosongkan / jangan isi.
5. Output Directory gunakan default atau `.`.
6. Klik **Deploy**.

File `vercel.json` sudah disertakan sebagai konfigurasi situs statis.

## Cara mengajar menggunakan website
- Guru dapat membuka situs melalui laptop yang tersambung ke proyektor.
- Minta siswa bergantian mengetuk gerbang.
- Ajak siswa membaca instruksi perjalanan dan memperhatikan animasi jembatan serta sungai.
- Saat kuis, siswa dapat berdiskusi sebelum memilih jawaban.
- Setelah berhasil masuk, pilih ruang materi sesuai topik pembelajaran.
- Gunakan misi Kitabah sebagai kegiatan menulis tangan lanjutan.

## Suara
Efek suara dibuat menggunakan Web Audio API, sehingga tidak memerlukan file MP3 atau layanan eksternal. Efek suara meliputi nada pembuka, suara pintu berderit, bunyi air sederhana, nada jawaban benar/salah, dan nada kemenangan. Suara dapat dimatikan melalui tombol 🔊. Browser dapat meminta interaksi pengguna sebelum suara dapat diputar.

## Struktur folder
```text
kerajaan-bahasa-arab/
├── index.html
├── style.css
├── script.js
├── vercel.json
├── README.md
└── assets/
    └── (folder siap untuk aset gambar tambahan)
```

## Catatan
Website menggunakan HTML, CSS, dan JavaScript murni. Materi enam tema diringkas dari materi Bahasa Arab MI kelas IV yang menjadi konteks proyek. Guru tetap disarankan mencocokkan kembali harakat dan susunan kalimat dengan buku ajar sebelum digunakan sebagai penilaian resmi.
