# 🏐 Sistem Absensi Ekstrakurikuler Bola Voli

Sistem absensi digital modern untuk ekstrakurikuler bola voli dengan dashboard admin terintegrasi. Dibangun dengan HTML, CSS, JavaScript, dan Supabase sebagai backend.

## ✨ Fitur Utama

### 🎯 Untuk Siswa
- **Form Absensi Digital**: Interface modern dan user-friendly
- **4 Status Kehadiran**: Hadir, Izin, Sakit, Alpa
- **Responsive Design**: Kompatibel dengan desktop dan mobile
- **Real-time Statistics**: Statistik kehadiran yang update otomatis
- **Validasi Duplikasi**: Mencegah absensi ganda dalam satu hari

### 👨‍💼 Untuk Admin
- **Dashboard Komprehensif**: Rangkuman lengkap data absensi
- **Sistem Login Aman**: Autentikasi admin dengan session management
- **Filter & Pencarian**: Filter berdasarkan status, tanggal, dan nama siswa
- **Export Data**: Export ke CSV, Excel, dan PDF
- **Statistik Lanjutan**: Analisis tren kehadiran dan metrik performa
- **Real-time Updates**: Data terupdate secara otomatis

## 🎨 Desain & UI/UX

- **Tema Biru-Putih**: Desain modern dengan skema warna biru dan putih
- **Animasi Smooth**: Transisi dan animasi yang halus
- **Micro-interactions**: Detail interaksi yang meningkatkan user experience
- **Accessibility**: Desain yang memperhatikan aksesibilitas
- **Mobile-First**: Responsive design yang mengutamakan mobile experience

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel, GitHub Pages
- **Icons**: Font Awesome 6
- **Fonts**: Inter (Google Fonts)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/volleyball-attendance.git
cd volleyball-attendance
```

### 2. Setup Supabase

1. Buat akun di [Supabase](https://supabase.com)
2. Buat project baru
3. Buat tabel `attendance` dengan struktur berikut:

```sql
CREATE TABLE attendance (
  id BIGSERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  attendance_status TEXT NOT NULL CHECK (attendance_status IN ('hadir', 'izin', 'sakit', 'alpa')),
  reason TEXT,
  date DATE NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT NOT NULL
);

-- Index untuk performa
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student ON attendance(student_name);
CREATE INDEX idx_attendance_status ON attendance(attendance_status);
```

4. Aktifkan Row Level Security (RLS):

```sql
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Policy untuk insert (semua orang bisa insert)
CREATE POLICY "Enable insert for all users" ON attendance
FOR INSERT WITH CHECK (true);

-- Policy untuk select (semua orang bisa read)
CREATE POLICY "Enable read access for all users" ON attendance
FOR SELECT USING (true);
```

### 3. Konfigurasi

Edit file `js/config.js` dan ganti dengan kredensial Supabase Anda:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-project-id.supabase.co',
    anonKey: 'your-anon-key-here',
    // ...
};
```

### 4. Testing Lokal

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka browser dan akses `http://localhost:3000`

## 🌐 Deployment

### Deploy ke Vercel

1. Push code ke GitHub repository
2. Connect repository ke [Vercel](https://vercel.com)
3. Deploy otomatis akan berjalan
4. Website akan tersedia di URL Vercel Anda

### Deploy ke GitHub Pages

1. Aktifkan GitHub Pages di repository settings
2. Pilih source branch (biasanya `main` atau `gh-pages`)
3. Website akan tersedia di `https://your-username.github.io/volleyball-attendance`

## 👨‍💼 Panduan Admin

### Login Admin

- **URL**: `/admin/login.html`
- **Username**: `admin` (default)
- **Password**: `volleyball2024` (default)

⚠️ **PENTING**: Ganti password default di file `js/config.js` sebelum deployment!

### Fitur Dashboard Admin

1. **Statistik Real-time**: Total siswa, kehadiran, dan tingkat absensi
2. **Tabel Data Lengkap**: Semua record absensi dengan filter dan pencarian
3. **Export Data**: 
   - CSV untuk Excel
   - PDF untuk laporan
   - Print untuk cetak langsung
4. **Filter Lanjutan**:
   - Filter berdasarkan status kehadiran
   - Filter berdasarkan rentang tanggal
   - Pencarian berdasarkan nama siswa
5. **Analisis Lanjutan**:
   - Tren kehadiran bulanan
   - Hari paling aktif
   - Rata-rata kehadiran harian

## 📱 Panduan Penggunaan Siswa

### Cara Absensi

1. Buka website absensi
2. Klik tombol "Mulai Absensi" atau scroll ke form
3. Isi data:
   - **Nama Lengkap**: Nama siswa
   - **Kelas**: Pilih kelas dari dropdown
   - **Status Kehadiran**: Pilih salah satu (Hadir/Izin/Sakit/Alpa)
   - **Keterangan**: Isi jika status Izin atau Sakit (opsional untuk lainnya)
4. Klik "Kirim Absensi"
5. Tunggu konfirmasi berhasil

### Aturan Absensi

- ✅ Satu siswa hanya bisa absen sekali per hari
- ✅ Keterangan wajib diisi untuk status Izin dan Sakit
- ✅ Data tersimpan otomatis ke database
- ✅ Tidak bisa mengubah absensi yang sudah terkirim

## 🔧 Kustomisasi

### Mengubah Tema Warna

Edit variabel CSS di `css/style.css`:

```css
:root {
    --primary-blue: #2563eb;    /* Warna biru utama */
    --secondary-blue: #3b82f6;  /* Warna biru sekunder */
    --light-blue: #dbeafe;      /* Warna biru muda */
    /* ... */
}
```

### Menambah Kelas

Edit dropdown kelas di `index.html`:

```html
<select id="studentClass" name="studentClass" class="form-select" required>
    <option value="">Pilih Kelas</option>
    <option value="X-1">X-1</option>
    <!-- Tambahkan kelas baru di sini -->
</select>
```

### Mengubah Informasi Sekolah

Edit konfigurasi di `js/config.js`:

```javascript
const APP_CONFIG = {
    schoolName: 'SMA Negeri 1',
    clubName: 'Ekstrakurikuler Bola Voli',
    contact: {
        email: 'volleyball@school.edu',
        phone: '(021) 1234-5678',
        address: 'Sekolah ABC, Jakarta'
    }
};
```

## 🔒 Keamanan

### Fitur Keamanan

- **Input Validation**: Validasi semua input form
- **XSS Protection**: Perlindungan dari Cross-Site Scripting
- **CSRF Protection**: Perlindungan dari Cross-Site Request Forgery
- **Session Management**: Manajemen session admin yang aman
- **Rate Limiting**: Pembatasan request untuk mencegah spam

### Best Practices

1. **Ganti Password Default**: Selalu ganti password admin default
2. **HTTPS Only**: Gunakan HTTPS untuk deployment production
3. **Regular Updates**: Update dependencies secara berkala
4. **Backup Data**: Backup database secara rutin
5. **Monitor Access**: Monitor akses admin secara berkala

## 📊 Database Schema

### Tabel `attendance`

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key, auto-increment |
| `student_name` | TEXT | Nama lengkap siswa |
| `student_class` | TEXT | Kelas siswa |
| `attendance_status` | TEXT | Status: hadir/izin/sakit/alpa |
| `reason` | TEXT | Keterangan (nullable) |
| `date` | DATE | Tanggal absensi |
| `timestamp` | TIMESTAMPTZ | Waktu submit (auto) |
| `session_id` | TEXT | ID sesi latihan |

## 🐛 Troubleshooting

### Masalah Umum

**1. Data tidak tersimpan**
- Periksa koneksi internet
- Pastikan konfigurasi Supabase benar
- Cek console browser untuk error

**2. Admin tidak bisa login**
- Pastikan username/password benar
- Clear browser cache
- Periksa console untuk error JavaScript

**3. Website tidak responsive**
- Clear browser cache
- Periksa CSS loading
- Test di browser berbeda

**4. Export tidak berfungsi**
- Pastikan ada data untuk diekspor
- Periksa browser permissions
- Coba browser berbeda

### Debug Mode

Untuk debugging, buka Developer Tools (F12) dan periksa:
- **Console**: Error JavaScript
- **Network**: Request/response API
- **Application**: Local storage data

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Jika mengalami masalah atau butuh bantuan:

- **Email**: volleyball@school.edu
- **Phone**: (021) 1234-5678
- **GitHub Issues**: [Create Issue](https://github.com/your-username/volleyball-attendance/issues)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend as a Service
- [Vercel](https://vercel.com) - Deployment platform
- [Font Awesome](https://fontawesome.com) - Icons
- [Google Fonts](https://fonts.google.com) - Typography
- [Inter Font](https://rsms.me/inter/) - Modern font family

---

**Made with ❤️ for Volleyball Club**

