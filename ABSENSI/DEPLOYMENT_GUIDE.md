# 🚀 Panduan Deployment Website Absensi Bola Voli

Panduan lengkap untuk mendeploy website absensi ekstrakurikuler bola voli ke GitHub dan Vercel.

## 📋 Prasyarat

- Akun GitHub (gratis di [github.com](https://github.com))
- Akun Vercel (gratis di [vercel.com](https://vercel.com))
- Akun Supabase (gratis di [supabase.com](https://supabase.com))
- Git terinstall di komputer
- Browser modern

## 🗄️ Langkah 1: Setup Database Supabase

**PENTING**: Setup database Supabase terlebih dahulu sebelum deployment!

1. Ikuti panduan lengkap di file `SUPABASE_SETUP.md`
2. Pastikan tabel `attendance` sudah dibuat
3. Catat Project URL dan API Key Anda
4. Update file `js/config.js` dengan kredensial Supabase Anda

## 📁 Langkah 2: Upload ke GitHub

### A. Buat Repository GitHub

1. Login ke [GitHub](https://github.com)
2. Klik tombol "+" di pojok kanan atas
3. Pilih "New repository"
4. Isi detail repository:
   - **Repository name**: `volleyball-attendance` (atau nama lain)
   - **Description**: `Sistem absensi digital untuk ekstrakurikuler bola voli`
   - **Visibility**: Public (untuk GitHub Pages gratis)
   - ✅ Centang "Add a README file"
5. Klik "Create repository"

### B. Clone Repository ke Komputer

```bash
# Clone repository yang baru dibuat
git clone https://github.com/USERNAME/volleyball-attendance.git
cd volleyball-attendance
```

### C. Copy File Website

1. Copy semua file website ke folder repository:
   ```bash
   # Copy semua file dari project ke repository
   cp -r /path/to/volleyball-attendance/* ./
   ```

2. Atau manual copy file-file berikut:
   - `index.html`
   - Folder `css/`
   - Folder `js/`
   - Folder `admin/`
   - `package.json`
   - `vercel.json`
   - `README.md`
   - `SUPABASE_SETUP.md`
   - `DEPLOYMENT_GUIDE.md`

### D. Commit dan Push ke GitHub

```bash
# Tambahkan semua file
git add .

# Commit dengan pesan
git commit -m "Initial commit: Volleyball attendance system"

# Push ke GitHub
git push origin main
```

## 🌐 Langkah 3: Deploy ke Vercel

### A. Connect GitHub ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Klik "Sign up" atau "Login"
3. Pilih "Continue with GitHub"
4. Authorize Vercel untuk mengakses GitHub Anda

### B. Import Project

1. Di dashboard Vercel, klik "New Project"
2. Pilih repository `volleyball-attendance` dari daftar
3. Klik "Import"

### C. Configure Project

1. **Project Name**: Biarkan default atau ubah sesuai keinginan
2. **Framework Preset**: Pilih "Other" atau "Static Site"
3. **Root Directory**: Biarkan kosong (menggunakan root)
4. **Build Command**: Kosongkan atau isi `npm run build`
5. **Output Directory**: Kosongkan (menggunakan root)
6. **Install Command**: `npm install`

### D. Environment Variables (Opsional)

Jika ingin menggunakan environment variables untuk keamanan:

1. Klik "Environment Variables"
2. Tambahkan:
   - `SUPABASE_URL`: Project URL Supabase Anda
   - `SUPABASE_ANON_KEY`: Anon key Supabase Anda

### E. Deploy

1. Klik "Deploy"
2. Tunggu proses deployment selesai (2-3 menit)
3. Setelah selesai, Anda akan mendapat URL seperti:
   `https://volleyball-attendance-xxx.vercel.app`

## 🔧 Langkah 4: Konfigurasi Domain (Opsional)

### A. Custom Domain di Vercel

1. Di dashboard project Vercel, klik "Settings"
2. Pilih "Domains"
3. Tambahkan domain custom Anda
4. Ikuti instruksi DNS yang diberikan

### B. GitHub Pages (Alternatif)

Jika ingin menggunakan GitHub Pages:

1. Di repository GitHub, klik "Settings"
2. Scroll ke "Pages"
3. Source: "Deploy from a branch"
4. Branch: "main" / "master"
5. Folder: "/ (root)"
6. Klik "Save"
7. Website akan tersedia di: `https://USERNAME.github.io/volleyball-attendance`

## ✅ Langkah 5: Testing Deployment

### A. Test Website

1. Buka URL deployment Anda
2. Test form absensi:
   - Isi nama siswa
   - Pilih kelas
   - Pilih status kehadiran
   - Klik "Kirim Absensi"
   - Pastikan muncul notifikasi sukses

### B. Test Admin Dashboard

1. Klik tombol "Admin" di navigasi
2. Login dengan:
   - Username: `admin`
   - Password: `volleyball2024`
3. Pastikan dashboard terbuka
4. Cek apakah data absensi muncul di tabel

### C. Test Database Connection

1. Buka Supabase dashboard
2. Klik "Table Editor"
3. Pilih tabel "attendance"
4. Pastikan data test muncul di sini

## 🔄 Langkah 6: Update dan Maintenance

### A. Update Website

Untuk update website:

```bash
# Edit file yang diperlukan
# Kemudian commit dan push

git add .
git commit -m "Update: [deskripsi perubahan]"
git push origin main
```

Vercel akan otomatis deploy ulang setelah push ke GitHub.

### B. Update Database

Untuk update struktur database:

1. Buka Supabase SQL Editor
2. Jalankan query SQL untuk perubahan
3. Update file `js/config.js` jika diperlukan
4. Commit dan push perubahan

### C. Monitoring

Monitor hal berikut secara berkala:

1. **Vercel Analytics**: Usage dan performance
2. **Supabase Dashboard**: Database usage dan logs
3. **GitHub Actions**: Build status (jika menggunakan)

## 🛡️ Keamanan Production

### A. Ganti Password Default

**PENTING**: Ganti password admin default!

1. Edit file `js/config.js`
2. Ubah password di `ADMIN_CONFIG.password`
3. Commit dan push perubahan

### B. Environment Variables

Untuk keamanan lebih baik, gunakan environment variables:

1. Di Vercel dashboard, masuk ke project settings
2. Tambahkan environment variables
3. Update `js/config.js` untuk membaca dari environment

### C. HTTPS Only

Pastikan website hanya bisa diakses via HTTPS:

1. Vercel otomatis menyediakan HTTPS
2. Untuk custom domain, pastikan SSL certificate aktif

## 📊 Monitoring dan Analytics

### A. Vercel Analytics

1. Di dashboard Vercel, klik "Analytics"
2. Monitor page views, performance, dan errors

### B. Supabase Monitoring

1. Di dashboard Supabase, monitor:
   - Database usage
   - API requests
   - Active connections

### C. Custom Analytics (Opsional)

Tambahkan Google Analytics atau analytics lain:

1. Daftar di Google Analytics
2. Tambahkan tracking code ke `index.html`
3. Monitor traffic dan user behavior

## 🆘 Troubleshooting Deployment

### Masalah Umum

**1. Build Failed di Vercel**
```
Error: Command "npm run build" failed
```
**Solusi**:
- Pastikan `package.json` benar
- Coba deploy tanpa build command
- Cek logs error di Vercel dashboard

**2. Database Connection Error**
```
Error: Failed to connect to Supabase
```
**Solusi**:
- Periksa URL dan API key di `js/config.js`
- Pastikan Supabase project aktif
- Cek RLS policies

**3. 404 Error di GitHub Pages**
```
404 - File not found
```
**Solusi**:
- Pastikan `index.html` ada di root directory
- Cek branch dan folder settings di GitHub Pages
- Tunggu beberapa menit untuk propagasi

**4. Admin Login Tidak Berfungsi**
```
Invalid credentials
```
**Solusi**:
- Periksa username/password di `js/config.js`
- Clear browser cache
- Cek console browser untuk error

### Debug Tips

1. **Browser Console**: Buka F12 untuk lihat error JavaScript
2. **Network Tab**: Monitor API requests dan responses
3. **Vercel Logs**: Cek function logs di dashboard
4. **Supabase Logs**: Monitor database queries dan errors

## 📞 Support

Jika mengalami masalah deployment:

1. **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
2. **GitHub Docs**: [docs.github.com](https://docs.github.com)
3. **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
4. **Community**: Stack Overflow, Discord communities

## 🎯 Tips Optimasi

### A. Performance

1. **Compress Images**: Gunakan format WebP untuk gambar
2. **Minify CSS/JS**: Gunakan tools minification
3. **CDN**: Vercel otomatis menggunakan CDN global

### B. SEO

1. **Meta Tags**: Tambahkan meta description dan keywords
2. **Open Graph**: Tambahkan OG tags untuk social sharing
3. **Sitemap**: Generate sitemap.xml

### C. User Experience

1. **Loading States**: Tambahkan loading indicators
2. **Error Handling**: Improve error messages
3. **Offline Support**: Implement service worker

## 🏆 Best Practices

1. **Regular Backups**: Backup database secara berkala
2. **Version Control**: Gunakan semantic versioning
3. **Testing**: Test di berbagai browser dan device
4. **Documentation**: Update dokumentasi setiap perubahan
5. **Security**: Regular security updates dan monitoring

---

**Deployment berhasil! 🎉 Website absensi bola voli siap digunakan secara online.**

## 📋 Checklist Deployment

- [ ] Database Supabase sudah setup
- [ ] File website sudah di-upload ke GitHub
- [ ] Project sudah di-deploy ke Vercel
- [ ] Website bisa diakses via URL deployment
- [ ] Form absensi berfungsi normal
- [ ] Admin dashboard bisa diakses
- [ ] Data tersimpan ke database
- [ ] Password admin sudah diganti
- [ ] Testing di berbagai device selesai
- [ ] Dokumentasi sudah lengkap

**Selamat! Website absensi ekstrakurikuler bola voli Anda sudah online! 🏐**

