# 🤝 Contributing to Volleyball Attendance System

Terima kasih atas minat Anda untuk berkontribusi pada Sistem Absensi Ekstrakurikuler Bola Voli! Kontribusi dari komunitas sangat dihargai dan membantu membuat sistem ini lebih baik.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

Proyek ini mengikuti [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Dengan berpartisipasi, Anda diharapkan mematuhi kode etik ini.

### Our Pledge

- Menciptakan lingkungan yang ramah dan inklusif
- Menghormati sudut pandang dan pengalaman yang berbeda
- Menerima kritik konstruktif dengan baik
- Fokus pada yang terbaik untuk komunitas

## 🚀 Getting Started

### Prerequisites

- Node.js 14+ dan npm
- Git
- Browser modern untuk testing
- Akun GitHub
- Akun Supabase (untuk testing database)

### Quick Start

1. **Fork repository**
   ```bash
   # Fork di GitHub, kemudian clone
   git clone https://github.com/YOUR-USERNAME/volleyball-attendance.git
   cd volleyball-attendance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   # Copy dan edit konfigurasi
   cp js/config.js js/config.local.js
   # Edit js/config.local.js dengan kredensial Supabase Anda
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## 🛠️ Development Setup

### Project Structure

```
volleyball-attendance/
├── index.html              # Halaman utama
├── css/
│   └── style.css          # Stylesheet utama
├── js/
│   ├── config.js          # Konfigurasi aplikasi
│   └── main.js            # JavaScript utama
├── admin/
│   ├── login.html         # Halaman login admin
│   ├── dashboard.html     # Dashboard admin
│   ├── admin.css          # Stylesheet admin
│   ├── admin.js           # JavaScript login
│   └── dashboard.js       # JavaScript dashboard
├── assets/                # Asset gambar dan media
├── docs/                  # Dokumentasi
└── tests/                 # Test files (jika ada)
```

### Environment Configuration

Buat file `js/config.local.js` untuk development:

```javascript
// js/config.local.js
const SUPABASE_CONFIG = {
    url: 'https://your-dev-project.supabase.co',
    anonKey: 'your-dev-anon-key',
    // ... konfigurasi lainnya
};
```

## 📝 Contributing Guidelines

### Types of Contributions

Kami menerima berbagai jenis kontribusi:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🧪 **Tests**
- 🌐 **Translations**

### Before You Start

1. **Check existing issues** - Pastikan belum ada yang mengerjakan
2. **Create an issue** - Diskusikan ide Anda terlebih dahulu
3. **Get assignment** - Tunggu maintainer assign issue ke Anda
4. **Fork and branch** - Buat branch untuk fitur Anda

## 🔄 Pull Request Process

### 1. Create Feature Branch

```bash
# Buat branch dari main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# Atau untuk bug fix
git checkout -b fix/bug-description
```

### 2. Make Changes

- Ikuti coding standards yang ada
- Tulis commit messages yang jelas
- Test perubahan Anda secara menyeluruh

### 3. Commit Changes

```bash
# Stage changes
git add .

# Commit dengan pesan yang descriptive
git commit -m "feat: add export to Excel functionality

- Add ExcelJS library for Excel export
- Implement export button in admin dashboard
- Add proper formatting for attendance data
- Update documentation

Closes #123"
```

### 4. Push and Create PR

```bash
# Push branch ke fork Anda
git push origin feature/your-feature-name
```

Kemudian buat Pull Request di GitHub dengan:
- **Title**: Deskripsi singkat perubahan
- **Description**: Penjelasan detail apa yang diubah dan mengapa
- **Screenshots**: Jika ada perubahan UI
- **Testing**: Cara test perubahan Anda

### 5. Code Review

- Maintainer akan review PR Anda
- Lakukan perubahan yang diminta
- PR akan di-merge setelah approved

## 🐛 Issue Guidelines

### Bug Reports

Gunakan template berikut untuk bug report:

```markdown
**Bug Description**
Deskripsi singkat bug yang ditemukan.

**Steps to Reproduce**
1. Buka halaman...
2. Klik tombol...
3. Isi form dengan...
4. Error muncul

**Expected Behavior**
Apa yang seharusnya terjadi.

**Actual Behavior**
Apa yang benar-benar terjadi.

**Screenshots**
Lampirkan screenshot jika memungkinkan.

**Environment**
- Browser: Chrome 91
- OS: Windows 10
- Device: Desktop

**Additional Context**
Informasi tambahan yang relevan.
```

### Feature Requests

```markdown
**Feature Description**
Deskripsi fitur yang diinginkan.

**Problem Statement**
Masalah apa yang akan diselesaikan fitur ini?

**Proposed Solution**
Bagaimana fitur ini seharusnya bekerja?

**Alternatives Considered**
Solusi alternatif yang sudah dipertimbangkan.

**Additional Context**
Mockup, referensi, atau informasi tambahan.
```

## 💻 Coding Standards

### HTML

```html
<!-- Gunakan semantic HTML -->
<main class="main-content">
    <section class="attendance-form">
        <h2 class="form-title">Form Absensi</h2>
        <!-- ... -->
    </section>
</main>

<!-- Gunakan proper attributes -->
<input 
    type="text" 
    id="studentName" 
    name="studentName" 
    class="form-input" 
    placeholder="Masukkan nama lengkap"
    required
    aria-label="Nama siswa"
>
```

### CSS

```css
/* Gunakan BEM methodology */
.attendance-form {
    /* Block */
}

.attendance-form__input {
    /* Element */
}

.attendance-form__input--error {
    /* Modifier */
}

/* Gunakan CSS custom properties */
:root {
    --primary-color: #2563eb;
    --secondary-color: #3b82f6;
    --text-color: #1f2937;
}

/* Mobile-first approach */
.component {
    /* Mobile styles */
}

@media (min-width: 768px) {
    .component {
        /* Tablet styles */
    }
}

@media (min-width: 1024px) {
    .component {
        /* Desktop styles */
    }
}
```

### JavaScript

```javascript
// Gunakan ES6+ features
const config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000
};

// Async/await untuk promises
async function submitAttendance(data) {
    try {
        const response = await fetch('/api/attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error submitting attendance:', error);
        throw error;
    }
}

// Gunakan proper error handling
function validateForm(formData) {
    const errors = [];
    
    if (!formData.studentName?.trim()) {
        errors.push('Nama siswa harus diisi');
    }
    
    if (!formData.studentClass) {
        errors.push('Kelas harus dipilih');
    }
    
    return errors;
}

// Document dengan JSDoc
/**
 * Submit attendance data to the server
 * @param {Object} attendanceData - The attendance data
 * @param {string} attendanceData.studentName - Student name
 * @param {string} attendanceData.studentClass - Student class
 * @param {string} attendanceData.status - Attendance status
 * @returns {Promise<Object>} Response from server
 */
async function submitAttendance(attendanceData) {
    // Implementation
}
```

### Commit Messages

Gunakan [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: type(scope): description
feat(admin): add export to PDF functionality
fix(form): resolve validation error for special characters
docs(readme): update installation instructions
style(css): improve responsive design for mobile
refactor(js): optimize database query performance
test(unit): add tests for form validation
chore(deps): update dependencies to latest versions
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 🧪 Testing

### Manual Testing

Sebelum submit PR, test hal berikut:

1. **Form Absensi**
   - [ ] Input validation bekerja
   - [ ] Semua status kehadiran bisa dipilih
   - [ ] Data tersimpan ke database
   - [ ] Error handling berfungsi

2. **Admin Dashboard**
   - [ ] Login/logout berfungsi
   - [ ] Data ditampilkan dengan benar
   - [ ] Filter dan pencarian bekerja
   - [ ] Export data berfungsi

3. **Responsive Design**
   - [ ] Mobile (320px - 768px)
   - [ ] Tablet (768px - 1024px)
   - [ ] Desktop (1024px+)

4. **Browser Compatibility**
   - [ ] Chrome
   - [ ] Firefox
   - [ ] Safari
   - [ ] Edge

### Automated Testing (Future)

Kami berencana menambahkan:
- Unit tests dengan Jest
- Integration tests
- E2E tests dengan Playwright
- Visual regression tests

## 📚 Documentation

### Code Documentation

- Gunakan JSDoc untuk functions
- Comment untuk logic yang kompleks
- Update README jika ada perubahan setup

### User Documentation

- Update panduan pengguna jika ada fitur baru
- Tambahkan screenshots untuk fitur UI
- Update FAQ jika diperlukan

## 🏷️ Release Process

1. **Version Bump**: Update version di `package.json`
2. **Changelog**: Update `CHANGELOG.md`
3. **Tag**: Create git tag dengan format `v1.0.0`
4. **Release**: Create GitHub release dengan release notes

## 🎯 Development Roadmap

### Short Term (1-2 months)
- [ ] Unit testing setup
- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] PWA features

### Medium Term (3-6 months)
- [ ] Multi-language support
- [ ] Advanced reporting
- [ ] Email notifications
- [ ] Mobile app

### Long Term (6+ months)
- [ ] AI-powered insights
- [ ] Integration dengan sistem sekolah
- [ ] Advanced analytics
- [ ] Multi-tenant support

## 🆘 Getting Help

Jika Anda butuh bantuan:

1. **Documentation**: Baca README dan guides
2. **Issues**: Search existing issues
3. **Discussions**: GitHub Discussions untuk pertanyaan
4. **Discord**: Join komunitas Discord (jika ada)
5. **Email**: volleyball@school.edu

## 🙏 Recognition

Contributors akan diakui di:
- README.md contributors section
- CHANGELOG.md untuk setiap release
- GitHub contributors page
- Special mentions untuk kontribusi besar

## 📄 License

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah MIT License yang sama dengan proyek ini.

---

**Terima kasih telah berkontribusi! 🎉**

Setiap kontribusi, sekecil apapun, sangat berarti untuk kemajuan proyek ini. Mari bersama-sama membuat sistem absensi yang lebih baik untuk komunitas ekstrakurikuler bola voli! 🏐

