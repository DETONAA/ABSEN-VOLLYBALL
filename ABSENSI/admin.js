// Admin Authentication and Login System

// Initialize admin system
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in and redirect if on login page
    if (window.location.pathname.includes('login.html') && isAdminLoggedIn()) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Check if user is not logged in and redirect if on dashboard page
    if (window.location.pathname.includes('dashboard.html') && !isAdminLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize login form if on login page
    if (window.location.pathname.includes('login.html')) {
        initializeLoginForm();
    }
    
    // Initialize dashboard if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
    }
});

// Initialize login form
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Check for remember me
    const rememberMe = localStorage.getItem('volleyball_remember_admin');
    if (rememberMe === 'true') {
        const usernameField = document.getElementById('username');
        const rememberCheckbox = document.getElementById('rememberMe');
        if (usernameField && rememberCheckbox) {
            usernameField.value = ADMIN_CONFIG.username;
            rememberCheckbox.checked = true;
        }
    }
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('.login-button');
    
    // Show loading state
    setLoadingState(submitButton, true);
    
    try {
        const username = formData.get('username').trim();
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe') === 'on';
        
        // Validate credentials
        if (!username || !password) {
            throw new Error('Username dan password harus diisi.');
        }
        
        // Simulate login delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check credentials
        if (username === ADMIN_CONFIG.username && password === ADMIN_CONFIG.password) {
            // Set login session
            localStorage.setItem(ADMIN_CONFIG.sessionKey, 'true');
            localStorage.setItem('volleyball_admin_login_time', new Date().toISOString());
            
            // Handle remember me
            if (rememberMe) {
                localStorage.setItem('volleyball_remember_admin', 'true');
            } else {
                localStorage.removeItem('volleyball_remember_admin');
            }
            
            // Log successful login
            console.log('Admin login successful');
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            throw new Error('Username atau password salah.');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showErrorModal(error.message);
    } finally {
        setLoadingState(submitButton, false);
    }
}

// Initialize dashboard
function initializeDashboard() {
    // Update current date
    updateCurrentDate();
    
    // Load dashboard data
    loadDashboardData();
    
    // Set up auto-refresh
    setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    
    // Initialize filters
    initializeFilters();
}

// Update current date display
function updateCurrentDate() {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        currentDateElement.textContent = now.toLocaleDateString('id-ID', options);
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        let attendanceRecords = [];
        
        // Get data from Supabase or local storage
        if (window.attendanceSystem && window.attendanceSystem.supabase()) {
            const supabase = window.attendanceSystem.supabase();
            const { data, error } = await supabase
                .from(SUPABASE_CONFIG.tables.attendance)
                .select('*')
                .order('timestamp', { ascending: false });
            
            if (!error && data) {
                attendanceRecords = data;
            }
        } else {
            attendanceRecords = window.attendanceSystem ? 
                window.attendanceSystem.getLocalAttendanceRecords() : [];
        }
        
        // Update statistics
        updateDashboardStatistics(attendanceRecords);
        
        // Update attendance table
        updateAttendanceTable(attendanceRecords);
        
        // Update quick stats
        updateQuickStats(attendanceRecords);
        
        // Update recent activity
        updateRecentActivity(attendanceRecords);
        
        // Update last update time
        updateLastUpdateTime();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showErrorModal('Gagal memuat data dashboard.');
    }
}

// Update dashboard statistics
function updateDashboardStatistics(records) {
    // Calculate statistics
    const totalStudents = new Set(records.map(r => r.student_name)).size;
    const totalPresent = records.filter(r => r.attendance_status === 'hadir').length;
    const totalPermission = records.filter(r => r.attendance_status === 'izin').length;
    const totalSick = records.filter(r => r.attendance_status === 'sakit').length;
    const totalAbsent = records.filter(r => r.attendance_status === 'alpa').length;
    
    let attendancePercentage = 0;
    if (records.length > 0) {
        attendancePercentage = Math.round((totalPresent / records.length) * 100);
    }
    
    // Update DOM elements with animation
    animateStatNumber('totalStudents', totalStudents);
    animateStatNumber('totalPresent', totalPresent);
    animateStatNumber('totalPermission', totalPermission);
    animateStatNumber('totalSick', totalSick);
    animateStatNumber('totalAbsent', totalAbsent);
    animateStatNumber('attendancePercentage', attendancePercentage, '%');
}

// Animate stat numbers
function animateStatNumber(elementId, targetValue, suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.round(currentValue + (targetValue - currentValue) * progress);
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Update attendance table
function updateAttendanceTable(records) {
    const tableBody = document.getElementById('attendanceTableBody');
    if (!tableBody) return;
    
    if (records.length === 0) {
        tableBody.innerHTML = `
            <tr class="table-empty">
                <td colspan="7">
                    <i class="fas fa-inbox"></i>
                    <h3>Belum Ada Data</h3>
                    <p>Belum ada data absensi yang tercatat.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Apply filters
    const filteredRecords = applyTableFilters(records);
    
    // Pagination
    const recordsPerPage = 10;
    const currentPage = window.currentPage || 1;
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex);
    
    // Generate table rows
    const tableRows = paginatedRecords.map((record, index) => {
        const rowNumber = startIndex + index + 1;
        const date = new Date(record.timestamp || record.date);
        const formattedDate = date.toLocaleDateString('id-ID');
        const formattedTime = date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        return `
            <tr>
                <td>${rowNumber}</td>
                <td>${record.student_name}</td>
                <td>${record.student_class}</td>
                <td>
                    <span class="status-badge status-${record.attendance_status}">
                        ${record.attendance_status}
                    </span>
                </td>
                <td>${record.reason || '-'}</td>
                <td>${formattedDate}</td>
                <td>${formattedTime}</td>
            </tr>
        `;
    }).join('');
    
    tableBody.innerHTML = tableRows;
    
    // Update pagination
    updatePagination(filteredRecords.length, recordsPerPage, currentPage);
}

// Apply table filters
function applyTableFilters(records) {
    let filteredRecords = [...records];
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter && statusFilter.value) {
        filteredRecords = filteredRecords.filter(r => 
            r.attendance_status === statusFilter.value
        );
    }
    
    // Date filter
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter && dateFilter.value) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        switch (dateFilter.value) {
            case 'today':
                filteredRecords = filteredRecords.filter(r => 
                    r.date === today || 
                    new Date(r.timestamp).toISOString().split('T')[0] === today
                );
                break;
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredRecords = filteredRecords.filter(r => 
                    new Date(r.timestamp || r.date) >= weekAgo
                );
                break;
            case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                filteredRecords = filteredRecords.filter(r => 
                    new Date(r.timestamp || r.date) >= monthAgo
                );
                break;
        }
    }
    
    // Search filter
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value.trim()) {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filteredRecords = filteredRecords.filter(r => 
            r.student_name.toLowerCase().includes(searchTerm) ||
            r.student_class.toLowerCase().includes(searchTerm)
        );
    }
    
    return filteredRecords;
}

// Initialize filters
function initializeFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            window.currentPage = 1;
            loadDashboardData();
        });
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', () => {
            window.currentPage = 1;
            loadDashboardData();
        });
    }
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                window.currentPage = 1;
                loadDashboardData();
            }, 500);
        });
    }
}

// Update pagination
function updatePagination(totalRecords, recordsPerPage, currentPage) {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const pagination = document.getElementById('tablePagination');
    const paginationInfo = document.getElementById('paginationInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (pagination && totalPages > 1) {
        pagination.style.display = 'flex';
        
        if (paginationInfo) {
            paginationInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
        }
        
        if (prevBtn) {
            prevBtn.disabled = currentPage <= 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentPage >= totalPages;
        }
    } else if (pagination) {
        pagination.style.display = 'none';
    }
}

// Change page
function changePage(direction) {
    const currentPage = window.currentPage || 1;
    window.currentPage = Math.max(1, currentPage + direction);
    loadDashboardData();
}

// Update quick stats
function updateQuickStats(records) {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const todayRecords = records.filter(r => 
        r.date === today || 
        new Date(r.timestamp).toISOString().split('T')[0] === today
    );
    
    const weekRecords = records.filter(r => 
        new Date(r.timestamp || r.date) >= weekAgo
    );
    
    const monthRecords = records.filter(r => 
        new Date(r.timestamp || r.date) >= monthAgo
    );
    
    const uniqueDates = new Set(records.map(r => 
        r.date || new Date(r.timestamp).toISOString().split('T')[0]
    ));
    
    const dailyAverage = uniqueDates.size > 0 ? 
        Math.round(records.length / uniqueDates.size) : 0;
    
    // Update elements
    updateQuickStatElement('todayTotal', todayRecords.length);
    updateQuickStatElement('weekTotal', weekRecords.length);
    updateQuickStatElement('monthTotal', monthRecords.length);
    updateQuickStatElement('dailyAverage', dailyAverage);
}

// Update quick stat element
function updateQuickStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Update recent activity
function updateRecentActivity(records) {
    const recentActivityContainer = document.getElementById('recentActivity');
    if (!recentActivityContainer) return;
    
    const recentRecords = records
        .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date))
        .slice(0, 5);
    
    if (recentRecords.length === 0) {
        recentActivityContainer.innerHTML = `
            <div class="activity-empty">
                <i class="fas fa-clock"></i>
                <p>Belum ada aktivitas terbaru</p>
            </div>
        `;
        return;
    }
    
    const activityHTML = recentRecords.map(record => {
        const date = new Date(record.timestamp || record.date);
        const timeAgo = getTimeAgo(date);
        
        return `
            <div class="activity-item">
                <div class="activity-icon status-${record.attendance_status}">
                    <i class="fas fa-${getStatusIcon(record.attendance_status)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${record.student_name}</div>
                    <div class="activity-description">
                        ${record.attendance_status} - ${record.student_class}
                    </div>
                    <div class="activity-time">${timeAgo}</div>
                </div>
            </div>
        `;
    }).join('');
    
    recentActivityContainer.innerHTML = activityHTML;
}

// Get status icon
function getStatusIcon(status) {
    const icons = {
        'hadir': 'check-circle',
        'izin': 'info-circle',
        'sakit': 'thermometer-half',
        'alpa': 'times-circle'
    };
    return icons[status] || 'question-circle';
}

// Get time ago string
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Baru saja';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} menit yang lalu`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} jam yang lalu`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} hari yang lalu`;
    }
}

// Update last update time
function updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        const now = new Date();
        lastUpdateElement.textContent = now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Export functions
function exportToCSV() {
    try {
        const records = window.attendanceSystem ? 
            window.attendanceSystem.getLocalAttendanceRecords() : [];
        
        if (records.length === 0) {
            showErrorModal('Tidak ada data untuk diekspor.');
            return;
        }
        
        const csvContent = generateCSV(records);
        downloadFile(csvContent, 'absensi-volleyball.csv', 'text/csv');
        showSuccessModal('Data berhasil diekspor ke CSV.');
    } catch (error) {
        console.error('Export CSV error:', error);
        showErrorModal('Gagal mengekspor data ke CSV.');
    }
}

function exportToExcel() {
    showErrorModal('Fitur export Excel akan segera tersedia.');
}

function exportToPDF() {
    showErrorModal('Fitur export PDF akan segera tersedia.');
}

function printReport() {
    window.print();
}

// Generate CSV content
function generateCSV(records) {
    const headers = ['No', 'Nama Siswa', 'Kelas', 'Status', 'Keterangan', 'Tanggal', 'Waktu'];
    const csvRows = [headers.join(',')];
    
    records.forEach((record, index) => {
        const date = new Date(record.timestamp || record.date);
        const formattedDate = date.toLocaleDateString('id-ID');
        const formattedTime = date.toLocaleTimeString('id-ID');
        
        const row = [
            index + 1,
            `"${record.student_name}"`,
            `"${record.student_class}"`,
            `"${record.attendance_status}"`,
            `"${record.reason || '-'}"`,
            `"${formattedDate}"`,
            `"${formattedTime}"`
        ];
        csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
}

// Download file
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    if (passwordInput && toggleIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            toggleIcon.className = 'fas fa-eye';
        }
    }
}

// Logout function
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem(ADMIN_CONFIG.sessionKey);
        localStorage.removeItem('volleyball_admin_login_time');
        window.location.href = 'login.html';
    }
}

// Check if admin is logged in
function isAdminLoggedIn() {
    const isLoggedIn = localStorage.getItem(ADMIN_CONFIG.sessionKey) === 'true';
    const loginTime = localStorage.getItem('volleyball_admin_login_time');
    
    // Check session timeout (24 hours)
    if (isLoggedIn && loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            // Session expired
            localStorage.removeItem(ADMIN_CONFIG.sessionKey);
            localStorage.removeItem('volleyball_admin_login_time');
            return false;
        }
    }
    
    return isLoggedIn;
}

// Set loading state for buttons
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
        const loader = button.querySelector('.button-loader');
        const text = button.querySelector('span');
        if (loader) loader.style.display = 'block';
        if (text) text.style.display = 'none';
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        const loader = button.querySelector('.button-loader');
        const text = button.querySelector('span');
        if (loader) loader.style.display = 'none';
        if (text) text.style.display = 'inline';
    }
}

// Show success modal
function showSuccessModal(message) {
    const successMessageElement = document.getElementById('successMessage');
    if (successMessageElement) {
        successMessageElement.textContent = message;
    }
    showModal('successModal');
}

// Show error modal
function showErrorModal(message) {
    const errorMessageElement = document.getElementById('errorMessage');
    if (errorMessageElement) {
        errorMessageElement.textContent = message;
    }
    showModal('errorModal');
}

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Auto close success modal
        if (modalId === 'successModal') {
            setTimeout(() => {
                closeModal();
            }, 3000);
        }
    }
}

// Close modal
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal();
    }
});

// Handle escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Initialize current page
window.currentPage = 1;

