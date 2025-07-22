# 🗄️ Panduan Setup Supabase

Panduan lengkap untuk mengkonfigurasi database Supabase untuk Sistem Absensi Ekstrakurikuler Bola Voli.

## 📋 Prasyarat

- Akun Supabase (gratis di [supabase.com](https://supabase.com))
- Akses internet
- Browser modern

## 🚀 Langkah-langkah Setup

### 1. Buat Akun Supabase

1. Kunjungi [supabase.com](https://supabase.com)
2. Klik "Start your project"
3. Sign up dengan GitHub, Google, atau email
4. Verifikasi email jika diperlukan

### 2. Buat Project Baru

1. Di dashboard Supabase, klik "New Project"
2. Pilih organization (atau buat baru)
3. Isi detail project:
   - **Name**: `volleyball-attendance`
   - **Database Password**: Buat password yang kuat (simpan dengan aman!)
   - **Region**: Pilih yang terdekat dengan lokasi Anda
4. Klik "Create new project"
5. Tunggu proses setup selesai (2-3 menit)

### 3. Konfigurasi Database

#### A. Buat Tabel Attendance

1. Di dashboard project, klik "SQL Editor" di sidebar
2. Klik "New query"
3. Copy dan paste SQL berikut:

```sql
-- Buat tabel attendance
CREATE TABLE attendance (
  id BIGSERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  attendance_status TEXT NOT NULL CHECK (attendance_status IN ('hadir', 'izin', 'sakit', 'alpa')),
  reason TEXT,
  date DATE NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buat index untuk performa
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student ON attendance(student_name);
CREATE INDEX idx_attendance_status ON attendance(attendance_status);
CREATE INDEX idx_attendance_class ON attendance(student_class);
CREATE INDEX idx_attendance_timestamp ON attendance(timestamp);

-- Buat function untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Buat trigger untuk auto-update timestamp
CREATE TRIGGER update_attendance_updated_at 
    BEFORE UPDATE ON attendance 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Tambahkan comment untuk dokumentasi
COMMENT ON TABLE attendance IS 'Tabel untuk menyimpan data absensi siswa ekstrakurikuler bola voli';
COMMENT ON COLUMN attendance.id IS 'Primary key, auto-increment';
COMMENT ON COLUMN attendance.student_name IS 'Nama lengkap siswa';
COMMENT ON COLUMN attendance.student_class IS 'Kelas siswa (contoh: X-1, XI-2)';
COMMENT ON COLUMN attendance.attendance_status IS 'Status kehadiran: hadir, izin, sakit, alpa';
COMMENT ON COLUMN attendance.reason IS 'Keterangan tambahan (wajib untuk izin/sakit)';
COMMENT ON COLUMN attendance.date IS 'Tanggal absensi (YYYY-MM-DD)';
COMMENT ON COLUMN attendance.timestamp IS 'Waktu submit absensi';
COMMENT ON COLUMN attendance.session_id IS 'ID sesi latihan';
```

4. Klik "Run" untuk menjalankan query
5. Pastikan muncul pesan "Success. No rows returned"

#### B. Setup Row Level Security (RLS)

1. Masih di SQL Editor, buat query baru:

```sql
-- Aktifkan Row Level Security
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Policy untuk INSERT - semua orang bisa menambah data
CREATE POLICY "Enable insert for all users" ON attendance
FOR INSERT WITH CHECK (true);

-- Policy untuk SELECT - semua orang bisa membaca data
CREATE POLICY "Enable read access for all users" ON attendance
FOR SELECT USING (true);

-- Policy untuk UPDATE - hanya admin yang bisa update (opsional)
CREATE POLICY "Enable update for authenticated users only" ON attendance
FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy untuk DELETE - hanya admin yang bisa delete (opsional)
CREATE POLICY "Enable delete for authenticated users only" ON attendance
FOR DELETE USING (auth.role() = 'authenticated');
```

2. Klik "Run" untuk menjalankan query

#### C. Buat Tabel Students (Opsional)

Untuk menyimpan data siswa yang terdaftar:

```sql
-- Buat tabel students (opsional)
CREATE TABLE students (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  student_id TEXT UNIQUE,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_students_name ON students(name);
CREATE INDEX idx_students_class ON students(class);
CREATE INDEX idx_students_id ON students(student_id);

-- Trigger untuk auto-update timestamp
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS untuk tabel students
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON students
FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON students
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON students
FOR UPDATE USING (auth.role() = 'authenticated');
```

### 4. Dapatkan Kredensial API

1. Di dashboard project, klik "Settings" di sidebar
2. Klik "API" di submenu
3. Copy informasi berikut:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: Key yang panjang dimulai dengan `eyJ...`

### 5. Konfigurasi Website

1. Buka file `js/config.js` di project website
2. Ganti konfigurasi dengan kredensial Anda:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-project-id.supabase.co', // Ganti dengan Project URL Anda
    anonKey: 'eyJ...', // Ganti dengan anon public key Anda
    
    tables: {
        attendance: 'attendance',
        students: 'students',
        sessions: 'sessions'
    }
};
```

3. Simpan file

### 6. Test Koneksi

1. Buka website di browser
2. Coba isi form absensi
3. Periksa di Supabase dashboard:
   - Klik "Table Editor" di sidebar
   - Pilih tabel "attendance"
   - Data baru harus muncul di sini

## 📊 Struktur Data

### Tabel `attendance`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | BIGSERIAL | ✅ | Primary key (auto) |
| `student_name` | TEXT | ✅ | Nama lengkap siswa |
| `student_class` | TEXT | ✅ | Kelas siswa |
| `attendance_status` | TEXT | ✅ | hadir/izin/sakit/alpa |
| `reason` | TEXT | ❌ | Keterangan tambahan |
| `date` | DATE | ✅ | Tanggal absensi |
| `timestamp` | TIMESTAMPTZ | ✅ | Waktu submit (auto) |
| `session_id` | TEXT | ✅ | ID sesi latihan |
| `created_at` | TIMESTAMPTZ | ✅ | Waktu dibuat (auto) |
| `updated_at` | TIMESTAMPTZ | ✅ | Waktu diupdate (auto) |

### Contoh Data

```json
{
  "id": 1,
  "student_name": "Ahmad Rizki",
  "student_class": "X-1",
  "attendance_status": "hadir",
  "reason": null,
  "date": "2024-01-15",
  "timestamp": "2024-01-15T10:30:00+07:00",
  "session_id": "session_2024-01-15",
  "created_at": "2024-01-15T10:30:00+07:00",
  "updated_at": "2024-01-15T10:30:00+07:00"
}
```

## 🔒 Keamanan Database

### Row Level Security (RLS)

RLS sudah diaktifkan dengan policy:
- **INSERT**: Semua user bisa menambah data
- **SELECT**: Semua user bisa membaca data
- **UPDATE/DELETE**: Hanya authenticated user (admin)

### Best Practices

1. **Jangan Share API Keys**: Jangan commit API keys ke public repository
2. **Use Environment Variables**: Gunakan environment variables untuk production
3. **Regular Backup**: Backup database secara berkala
4. **Monitor Usage**: Pantau penggunaan database di dashboard
5. **Update Policies**: Review dan update RLS policies sesuai kebutuhan

## 📈 Monitoring & Maintenance

### Dashboard Supabase

Monitor hal berikut di dashboard:
- **Database Usage**: Penggunaan storage dan bandwidth
- **API Requests**: Jumlah request per hari
- **Active Connections**: Koneksi database aktif
- **Logs**: Error logs dan activity logs

### Query Optimization

Untuk performa optimal:

```sql
-- Cek query yang lambat
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Analyze table untuk update statistics
ANALYZE attendance;

-- Vacuum untuk cleanup
VACUUM ANALYZE attendance;
```

### Backup Data

```sql
-- Export data ke CSV
COPY attendance TO '/tmp/attendance_backup.csv' DELIMITER ',' CSV HEADER;

-- Atau gunakan pg_dump untuk full backup
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

## 🆘 Troubleshooting

### Masalah Umum

**1. Connection Error**
```
Error: Failed to connect to database
```
**Solusi**: 
- Periksa Project URL dan API Key
- Pastikan project Supabase aktif
- Cek koneksi internet

**2. Permission Denied**
```
Error: new row violates row-level security policy
```
**Solusi**:
- Periksa RLS policies
- Pastikan policy untuk INSERT sudah benar
- Cek authentication status

**3. Table Not Found**
```
Error: relation "attendance" does not exist
```
**Solusi**:
- Pastikan tabel sudah dibuat
- Periksa nama tabel di konfigurasi
- Jalankan ulang SQL create table

**4. Invalid Data Type**
```
Error: invalid input syntax for type date
```
**Solusi**:
- Periksa format tanggal (YYYY-MM-DD)
- Validasi data sebelum insert
- Gunakan proper date formatting

### Debug Queries

```sql
-- Cek struktur tabel
\d attendance

-- Cek data terbaru
SELECT * FROM attendance ORDER BY created_at DESC LIMIT 10;

-- Cek statistik tabel
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables 
WHERE tablename = 'attendance';

-- Cek index usage
SELECT 
  indexrelname,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE relname = 'attendance';
```

## 📞 Support

Jika mengalami masalah:

1. **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
2. **Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
3. **Discord**: [discord.supabase.com](https://discord.supabase.com)

## 🎯 Tips & Tricks

### 1. Optimasi Performa
- Gunakan index pada kolom yang sering di-query
- Limit hasil query untuk data besar
- Gunakan pagination untuk tabel besar

### 2. Data Validation
- Selalu validasi data di frontend dan backend
- Gunakan CHECK constraints untuk data integrity
- Implement proper error handling

### 3. Monitoring
- Set up alerts untuk usage limits
- Monitor slow queries
- Regular health checks

### 4. Scaling
- Supabase free tier: 500MB storage, 2GB bandwidth
- Upgrade ke Pro jika diperlukan
- Consider read replicas untuk high traffic

---

**Setup berhasil! 🎉 Website absensi siap digunakan dengan database Supabase.**

