// Dashboard specific JavaScript functions

// Dashboard initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAdminLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize dashboard components
    initializeDashboardComponents();
    
    // Load initial data
    loadInitialDashboardData();
    
    // Set up real-time updates
    setupRealTimeUpdates();
    
    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts();
});

// Initialize dashboard components
function initializeDashboardComponents() {
    // Initialize date picker if needed
    initializeDatePicker();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize responsive table
    initializeResponsiveTable();
    
    // Initialize chart if needed
    initializeCharts();
}

// Load initial dashboard data
async function loadInitialDashboardData() {
    try {
        showLoadingState();
        
        // Load attendance data
        await loadDashboardData();
        
        // Load additional statistics
        await loadAdvancedStatistics();
        
        hideLoadingState();
    } catch (error) {
        console.error('Error loading initial data:', error);
        hideLoadingState();
        showErrorModal('Gagal memuat data dashboard.');
    }
}

// Setup real-time updates
function setupRealTimeUpdates() {
    // Update every 30 seconds
    setInterval(async () => {
        try {
            await loadDashboardData();
        } catch (error) {
            console.error('Error in real-time update:', error);
        }
    }, 30000);
    
    // Update time display every second
    setInterval(updateTimeDisplay, 1000);
}

// Initialize keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + R: Refresh data
        if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
            event.preventDefault();
            loadDashboardData();
        }
        
        // Ctrl/Cmd + E: Export CSV
        if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
            event.preventDefault();
            exportToCSV();
        }
        
        // Ctrl/Cmd + P: Print
        if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
            event.preventDefault();
            printReport();
        }
        
        // Escape: Close modals
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

// Initialize date picker
function initializeDatePicker() {
    // Add custom date range picker if needed
    const dateRangeContainer = document.createElement('div');
    dateRangeContainer.className = 'date-range-picker';
    dateRangeContainer.innerHTML = `
        <input type="date" id="startDate" class="filter-select">
        <span>sampai</span>
        <input type="date" id="endDate" class="filter-select">
        <button onclick="applyDateRange()" class="filter-button">
            <i class="fas fa-filter"></i>
            Filter
        </button>
    `;
    
    // Insert after existing filters
    const tableFilters = document.querySelector('.table-filters');
    if (tableFilters) {
        tableFilters.appendChild(dateRangeContainer);
    }
}

// Apply date range filter
function applyDateRange() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    
    if (startDate && endDate) {
        window.dateRangeFilter = { startDate, endDate };
        window.currentPage = 1;
        loadDashboardData();
    }
}

// Initialize tooltips
function initializeTooltips() {
    // Add tooltips to stat cards
    const statCards = document.querySelectorAll('.dashboard-stat-card');
    statCards.forEach(card => {
        const label = card.querySelector('.dashboard-stat-label')?.textContent;
        if (label) {
            card.title = `Statistik ${label}`;
        }
    });
}

// Initialize responsive table
function initializeResponsiveTable() {
    const table = document.getElementById('attendanceTable');
    if (table) {
        // Add responsive wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
        
        // Add mobile-friendly headers
        addMobileHeaders();
    }
}

// Add mobile headers for responsive design
function addMobileHeaders() {
    const table = document.getElementById('attendanceTable');
    if (!table) return;
    
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
    
    // Add data attributes for mobile display
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    cells.forEach((cell, index) => {
                        if (headers[index]) {
                            cell.setAttribute('data-label', headers[index]);
                        }
                    });
                });
            }
        });
    });
    
    observer.observe(table.querySelector('tbody'), { childList: true });
}

// Initialize charts
function initializeCharts() {
    // Create attendance trend chart
    createAttendanceTrendChart();
    
    // Create status distribution chart
    createStatusDistributionChart();
}

// Create attendance trend chart
function createAttendanceTrendChart() {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    chartContainer.innerHTML = `
        <div class="sidebar-card">
            <h3 class="sidebar-title">
                <i class="fas fa-chart-line"></i>
                Tren Kehadiran
            </h3>
            <canvas id="attendanceTrendChart" width="300" height="200"></canvas>
        </div>
    `;
    
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (sidebar) {
        sidebar.appendChild(chartContainer);
    }
}

// Create status distribution chart
function createStatusDistributionChart() {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    chartContainer.innerHTML = `
        <div class="sidebar-card">
            <h3 class="sidebar-title">
                <i class="fas fa-chart-pie"></i>
                Distribusi Status
            </h3>
            <canvas id="statusDistributionChart" width="300" height="200"></canvas>
        </div>
    `;
    
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (sidebar) {
        sidebar.appendChild(chartContainer);
    }
}

// Load advanced statistics
async function loadAdvancedStatistics() {
    try {
        const records = window.attendanceSystem ? 
            window.attendanceSystem.getLocalAttendanceRecords() : [];
        
        // Calculate advanced metrics
        const metrics = calculateAdvancedMetrics(records);
        
        // Update advanced stats display
        updateAdvancedStatsDisplay(metrics);
        
    } catch (error) {
        console.error('Error loading advanced statistics:', error);
    }
}

// Calculate advanced metrics
function calculateAdvancedMetrics(records) {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    // Monthly attendance rate
    const monthlyRecords = records.filter(r => {
        const recordDate = new Date(r.timestamp || r.date);
        return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear;
    });
    
    const monthlyAttendanceRate = monthlyRecords.length > 0 ? 
        Math.round((monthlyRecords.filter(r => r.attendance_status === 'hadir').length / monthlyRecords.length) * 100) : 0;
    
    // Most active day
    const dayCount = {};
    records.forEach(r => {
        const day = new Date(r.timestamp || r.date).toLocaleDateString('id-ID', { weekday: 'long' });
        dayCount[day] = (dayCount[day] || 0) + 1;
    });
    
    const mostActiveDay = Object.keys(dayCount).reduce((a, b) => 
        dayCount[a] > dayCount[b] ? a : b, 'Senin'
    );
    
    // Average daily attendance
    const uniqueDates = new Set(records.map(r => 
        (r.date || new Date(r.timestamp).toISOString().split('T')[0])
    ));
    
    const avgDailyAttendance = uniqueDates.size > 0 ? 
        Math.round(records.filter(r => r.attendance_status === 'hadir').length / uniqueDates.size) : 0;
    
    return {
        monthlyAttendanceRate,
        mostActiveDay,
        avgDailyAttendance,
        totalSessions: uniqueDates.size
    };
}

// Update advanced stats display
function updateAdvancedStatsDisplay(metrics) {
    // Add advanced metrics to sidebar if not exists
    const advancedStatsCard = document.getElementById('advancedStats');
    if (!advancedStatsCard) {
        createAdvancedStatsCard(metrics);
    } else {
        updateAdvancedStatsCard(metrics);
    }
}

// Create advanced stats card
function createAdvancedStatsCard(metrics) {
    const cardHTML = `
        <div class="sidebar-card" id="advancedStats">
            <h3 class="sidebar-title">
                <i class="fas fa-analytics"></i>
                Analisis Lanjutan
            </h3>
            <div class="quick-stats">
                <div class="quick-stat">
                    <span class="quick-stat-label">Kehadiran Bulan Ini</span>
                    <span class="quick-stat-value">${metrics.monthlyAttendanceRate}%</span>
                </div>
                <div class="quick-stat">
                    <span class="quick-stat-label">Hari Teraktif</span>
                    <span class="quick-stat-value">${metrics.mostActiveDay}</span>
                </div>
                <div class="quick-stat">
                    <span class="quick-stat-label">Rata-rata Harian</span>
                    <span class="quick-stat-value">${metrics.avgDailyAttendance}</span>
                </div>
                <div class="quick-stat">
                    <span class="quick-stat-label">Total Sesi</span>
                    <span class="quick-stat-value">${metrics.totalSessions}</span>
                </div>
            </div>
        </div>
    `;
    
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (sidebar) {
        sidebar.insertAdjacentHTML('beforeend', cardHTML);
    }
}

// Update advanced stats card
function updateAdvancedStatsCard(metrics) {
    const card = document.getElementById('advancedStats');
    if (!card) return;
    
    const stats = card.querySelectorAll('.quick-stat-value');
    if (stats.length >= 4) {
        stats[0].textContent = metrics.monthlyAttendanceRate + '%';
        stats[1].textContent = metrics.mostActiveDay;
        stats[2].textContent = metrics.avgDailyAttendance;
        stats[3].textContent = metrics.totalSessions;
    }
}

// Enhanced table filtering with date range
function applyTableFilters(records) {
    let filteredRecords = [...records];
    
    // Apply existing filters
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter && statusFilter.value) {
        filteredRecords = filteredRecords.filter(r => 
            r.attendance_status === statusFilter.value
        );
    }
    
    // Date range filter
    if (window.dateRangeFilter) {
        const { startDate, endDate } = window.dateRangeFilter;
        filteredRecords = filteredRecords.filter(r => {
            const recordDate = r.date || new Date(r.timestamp).toISOString().split('T')[0];
            return recordDate >= startDate && recordDate <= endDate;
        });
    } else {
        // Apply regular date filter
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
    }
    
    // Search filter
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value.trim()) {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filteredRecords = filteredRecords.filter(r => 
            r.student_name.toLowerCase().includes(searchTerm) ||
            r.student_class.toLowerCase().includes(searchTerm) ||
            r.attendance_status.toLowerCase().includes(searchTerm)
        );
    }
    
    return filteredRecords;
}

// Enhanced export functions
function exportToExcel() {
    try {
        const records = window.attendanceSystem ? 
            window.attendanceSystem.getLocalAttendanceRecords() : [];
        
        if (records.length === 0) {
            showErrorModal('Tidak ada data untuk diekspor.');
            return;
        }
        
        // Create Excel-compatible CSV with BOM
        const csvContent = '\ufeff' + generateEnhancedCSV(records);
        downloadFile(csvContent, 'absensi-volleyball.csv', 'text/csv;charset=utf-8;');
        showSuccessModal('Data berhasil diekspor ke Excel.');
    } catch (error) {
        console.error('Export Excel error:', error);
        showErrorModal('Gagal mengekspor data ke Excel.');
    }
}

function exportToPDF() {
    try {
        const records = window.attendanceSystem ? 
            window.attendanceSystem.getLocalAttendanceRecords() : [];
        
        if (records.length === 0) {
            showErrorModal('Tidak ada data untuk diekspor.');
            return;
        }
        
        generatePDFReport(records);
        showSuccessModal('Laporan PDF berhasil dibuat.');
    } catch (error) {
        console.error('Export PDF error:', error);
        showErrorModal('Gagal membuat laporan PDF.');
    }
}

// Generate enhanced CSV with statistics
function generateEnhancedCSV(records) {
    const headers = ['No', 'Nama Siswa', 'Kelas', 'Status', 'Keterangan', 'Tanggal', 'Waktu'];
    const csvRows = [];
    
    // Add title and date
    csvRows.push('LAPORAN ABSENSI EKSTRAKURIKULER BOLA VOLI');
    csvRows.push(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`);
    csvRows.push('');
    
    // Add statistics
    const stats = calculateBasicStatistics(records);
    csvRows.push('RINGKASAN STATISTIK');
    csvRows.push(`Total Siswa,${stats.totalStudents}`);
    csvRows.push(`Total Hadir,${stats.totalPresent}`);
    csvRows.push(`Total Izin,${stats.totalPermission}`);
    csvRows.push(`Total Sakit,${stats.totalSick}`);
    csvRows.push(`Total Alpa,${stats.totalAbsent}`);
    csvRows.push(`Tingkat Kehadiran,${stats.attendanceRate}%`);
    csvRows.push('');
    
    // Add data table
    csvRows.push('DATA ABSENSI LENGKAP');
    csvRows.push(headers.join(','));
    
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

// Calculate basic statistics
function calculateBasicStatistics(records) {
    const totalStudents = new Set(records.map(r => r.student_name)).size;
    const totalPresent = records.filter(r => r.attendance_status === 'hadir').length;
    const totalPermission = records.filter(r => r.attendance_status === 'izin').length;
    const totalSick = records.filter(r => r.attendance_status === 'sakit').length;
    const totalAbsent = records.filter(r => r.attendance_status === 'alpa').length;
    
    const attendanceRate = records.length > 0 ? 
        Math.round((totalPresent / records.length) * 100) : 0;
    
    return {
        totalStudents,
        totalPresent,
        totalPermission,
        totalSick,
        totalAbsent,
        attendanceRate
    };
}

// Generate PDF report (simplified version)
function generatePDFReport(records) {
    const printWindow = window.open('', '_blank');
    const stats = calculateBasicStatistics(records);
    
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Laporan Absensi Volleyball</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .stats { margin-bottom: 30px; }
                .stats table { width: 100%; border-collapse: collapse; }
                .stats th, .stats td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .stats th { background-color: #f2f2f2; }
                .data-table { width: 100%; border-collapse: collapse; font-size: 12px; }
                .data-table th, .data-table td { border: 1px solid #ddd; padding: 6px; text-align: left; }
                .data-table th { background-color: #f2f2f2; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>LAPORAN ABSENSI</h1>
                <h2>EKSTRAKURIKULER BOLA VOLI</h2>
                <p>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}</p>
            </div>
            
            <div class="stats">
                <h3>Ringkasan Statistik</h3>
                <table>
                    <tr><th>Total Siswa</th><td>${stats.totalStudents}</td></tr>
                    <tr><th>Total Hadir</th><td>${stats.totalPresent}</td></tr>
                    <tr><th>Total Izin</th><td>${stats.totalPermission}</td></tr>
                    <tr><th>Total Sakit</th><td>${stats.totalSick}</td></tr>
                    <tr><th>Total Alpa</th><td>${stats.totalAbsent}</td></tr>
                    <tr><th>Tingkat Kehadiran</th><td>${stats.attendanceRate}%</td></tr>
                </table>
            </div>
            
            <div class="data">
                <h3>Data Absensi Lengkap</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Siswa</th>
                            <th>Kelas</th>
                            <th>Status</th>
                            <th>Keterangan</th>
                            <th>Tanggal</th>
                            <th>Waktu</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${records.map((record, index) => {
                            const date = new Date(record.timestamp || record.date);
                            const formattedDate = date.toLocaleDateString('id-ID');
                            const formattedTime = date.toLocaleTimeString('id-ID');
                            
                            return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${record.student_name}</td>
                                    <td>${record.student_class}</td>
                                    <td>${record.attendance_status}</td>
                                    <td>${record.reason || '-'}</td>
                                    <td>${formattedDate}</td>
                                    <td>${formattedTime}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// Update time display
function updateTimeDisplay() {
    const timeElements = document.querySelectorAll('.current-time');
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID');
    
    timeElements.forEach(element => {
        element.textContent = timeString;
    });
}

// Show/hide loading state
function showLoadingState() {
    const loadingElements = document.querySelectorAll('.loading-indicator');
    loadingElements.forEach(element => {
        element.style.display = 'block';
    });
}

function hideLoadingState() {
    const loadingElements = document.querySelectorAll('.loading-indicator');
    loadingElements.forEach(element => {
        element.style.display = 'none';
    });
}

// Clear all filters
function clearAllFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('dateFilter').value = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    
    window.dateRangeFilter = null;
    window.currentPage = 1;
    
    loadDashboardData();
}

// Add clear filters button
document.addEventListener('DOMContentLoaded', function() {
    const tableFilters = document.querySelector('.table-filters');
    if (tableFilters) {
        const clearButton = document.createElement('button');
        clearButton.className = 'filter-button clear-filters';
        clearButton.innerHTML = '<i class="fas fa-times"></i> Clear';
        clearButton.onclick = clearAllFilters;
        tableFilters.appendChild(clearButton);
    }
});

// Auto-save filter preferences
function saveFilterPreferences() {
    const preferences = {
        statusFilter: document.getElementById('statusFilter')?.value || '',
        dateFilter: document.getElementById('dateFilter')?.value || '',
        searchInput: document.getElementById('searchInput')?.value || ''
    };
    
    localStorage.setItem('volleyball_admin_filters', JSON.stringify(preferences));
}

// Load filter preferences
function loadFilterPreferences() {
    try {
        const preferences = JSON.parse(localStorage.getItem('volleyball_admin_filters') || '{}');
        
        if (preferences.statusFilter) {
            const statusFilter = document.getElementById('statusFilter');
            if (statusFilter) statusFilter.value = preferences.statusFilter;
        }
        
        if (preferences.dateFilter) {
            const dateFilter = document.getElementById('dateFilter');
            if (dateFilter) dateFilter.value = preferences.dateFilter;
        }
        
        if (preferences.searchInput) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = preferences.searchInput;
        }
    } catch (error) {
        console.error('Error loading filter preferences:', error);
    }
}

// Save preferences when filters change
document.addEventListener('DOMContentLoaded', function() {
    const filters = ['statusFilter', 'dateFilter', 'searchInput'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', saveFilterPreferences);
            element.addEventListener('input', saveFilterPreferences);
        }
    });
    
    // Load saved preferences
    setTimeout(loadFilterPreferences, 100);
});

