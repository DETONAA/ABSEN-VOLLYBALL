// Main JavaScript for Volleyball Attendance System

// Initialize Supabase client
let supabase = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSupabase();
    initializeEventListeners();
    loadStatistics();
    updateDateTime();
    
    // Update date/time every minute
    setInterval(updateDateTime, 60000);
});

// Initialize Supabase connection
function initializeSupabase() {
    try {
        if (typeof SUPABASE_CONFIG !== 'undefined' && 
            SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL' && 
            SUPABASE_CONFIG.anonKey !== 'YOUR_SUPABASE_ANON_KEY') {
            
            // Load Supabase from CDN
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = function() {
                supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
                console.log('Supabase initialized successfully');
            };
            document.head.appendChild(script);
        } else {
            console.warn('Supabase configuration not found or incomplete. Using local storage fallback.');
        }
    } catch (error) {
        console.error('Error initializing Supabase:', error);
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Form submission
    const attendanceForm = document.getElementById('attendanceForm');
    if (attendanceForm) {
        attendanceForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Attendance status change
    const attendanceOptions = document.querySelectorAll('input[name="attendanceStatus"]');
    attendanceOptions.forEach(option => {
        option.addEventListener('change', handleAttendanceStatusChange);
    });
    
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Smooth scrolling for CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', scrollToAttendance);
    }
}

// Handle form submission
async function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('.submit-button');
    
    // Show loading state
    setLoadingState(submitButton, true);
    
    try {
        // Validate form data
        const attendanceData = {
            student_name: formData.get('studentName').trim(),
            student_class: formData.get('studentClass'),
            attendance_status: formData.get('attendanceStatus'),
            reason: formData.get('reason')?.trim() || null,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            session_id: generateSessionId()
        };
        
        // Validate required fields
        if (!attendanceData.student_name || !attendanceData.student_class || !attendanceData.attendance_status) {
            throw new Error('Mohon lengkapi semua field yang wajib diisi.');
        }
        
        // Check for duplicate attendance today
        const isDuplicate = await checkDuplicateAttendance(attendanceData.student_name, attendanceData.date);
        if (isDuplicate) {
            throw new Error('Anda sudah melakukan absensi hari ini.');
        }
        
        // Submit attendance
        await submitAttendance(attendanceData);
        
        // Show success message
        showModal('successModal');
        
        // Reset form
        form.reset();
        hideReasonField();
        
        // Update statistics
        loadStatistics();
        
    } catch (error) {
        console.error('Error submitting attendance:', error);
        showErrorModal(error.message);
    } finally {
        setLoadingState(submitButton, false);
    }
}

// Submit attendance to Supabase or local storage
async function submitAttendance(attendanceData) {
    if (supabase) {
        // Submit to Supabase
        const { data, error } = await supabase
            .from(SUPABASE_CONFIG.tables.attendance)
            .insert([attendanceData]);
        
        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }
        
        console.log('Attendance submitted to Supabase:', data);
    } else {
        // Fallback to local storage
        const attendanceRecords = getLocalAttendanceRecords();
        attendanceData.id = Date.now(); // Simple ID generation
        attendanceRecords.push(attendanceData);
        localStorage.setItem('volleyball_attendance', JSON.stringify(attendanceRecords));
        console.log('Attendance saved to local storage:', attendanceData);
    }
}

// Check for duplicate attendance
async function checkDuplicateAttendance(studentName, date) {
    if (supabase) {
        const { data, error } = await supabase
            .from(SUPABASE_CONFIG.tables.attendance)
            .select('id')
            .eq('student_name', studentName)
            .eq('date', date);
        
        if (error) {
            console.error('Error checking duplicate:', error);
            return false;
        }
        
        return data && data.length > 0;
    } else {
        // Check local storage
        const attendanceRecords = getLocalAttendanceRecords();
        return attendanceRecords.some(record => 
            record.student_name === studentName && record.date === date
        );
    }
}

// Get local attendance records
function getLocalAttendanceRecords() {
    try {
        const records = localStorage.getItem('volleyball_attendance');
        return records ? JSON.parse(records) : [];
    } catch (error) {
        console.error('Error reading local storage:', error);
        return [];
    }
}

// Handle attendance status change
function handleAttendanceStatusChange(event) {
    const status = event.target.value;
    const reasonGroup = document.getElementById('reasonGroup');
    
    if (status === 'izin' || status === 'sakit') {
        showReasonField();
    } else {
        hideReasonField();
    }
}

// Show reason field
function showReasonField() {
    const reasonGroup = document.getElementById('reasonGroup');
    if (reasonGroup) {
        reasonGroup.style.display = 'flex';
        reasonGroup.querySelector('textarea').required = true;
    }
}

// Hide reason field
function hideReasonField() {
    const reasonGroup = document.getElementById('reasonGroup');
    if (reasonGroup) {
        reasonGroup.style.display = 'none';
        reasonGroup.querySelector('textarea').required = false;
        reasonGroup.querySelector('textarea').value = '';
    }
}

// Load and display statistics
async function loadStatistics() {
    try {
        let attendanceRecords = [];
        
        if (supabase) {
            const { data, error } = await supabase
                .from(SUPABASE_CONFIG.tables.attendance)
                .select('*');
            
            if (!error && data) {
                attendanceRecords = data;
            }
        } else {
            attendanceRecords = getLocalAttendanceRecords();
        }
        
        updateStatisticsDisplay(attendanceRecords);
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Update statistics display
function updateStatisticsDisplay(records) {
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate statistics
    const totalMembers = new Set(records.map(r => r.student_name)).size;
    const todayRecords = records.filter(r => r.date === today);
    const todayPresent = todayRecords.filter(r => r.attendance_status === 'hadir').length;
    const totalSessions = new Set(records.map(r => r.date)).size;
    
    let attendanceRate = 0;
    if (totalMembers > 0 && totalSessions > 0) {
        const totalPossibleAttendances = totalMembers * totalSessions;
        const totalActualAttendances = records.filter(r => r.attendance_status === 'hadir').length;
        attendanceRate = Math.round((totalActualAttendances / totalPossibleAttendances) * 100);
    }
    
    // Update DOM elements
    updateStatElement('totalMembers', totalMembers);
    updateStatElement('todayPresent', todayPresent);
    updateStatElement('totalSessions', totalSessions);
    updateStatElement('attendanceRate', attendanceRate + '%');
}

// Update individual stat element
function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        // Animate number change
        const currentValue = parseInt(element.textContent) || 0;
        const targetValue = parseInt(value) || 0;
        
        if (currentValue !== targetValue) {
            animateNumber(element, currentValue, targetValue, 1000);
        }
    }
}

// Animate number changes
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const isPercentage = element.id === 'attendanceRate';
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.round(start + (end - start) * progress);
        element.textContent = isPercentage ? current + '%' : current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Handle navigation
function handleNavigation(event) {
    event.preventDefault();
    
    const href = event.target.getAttribute('href');
    
    if (href.startsWith('#')) {
        // Internal navigation
        const targetElement = document.querySelector(href);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        event.target.classList.add('active');
    } else {
        // External navigation
        window.location.href = href;
    }
}

// Scroll to attendance section
function scrollToAttendance() {
    const attendanceSection = document.getElementById('attendance');
    if (attendanceSection) {
        attendanceSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Update date and time display
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const dateTimeString = now.toLocaleDateString('id-ID', options);
    
    // Update any date/time displays if they exist
    const dateTimeElements = document.querySelectorAll('.current-datetime');
    dateTimeElements.forEach(element => {
        element.textContent = dateTimeString;
    });
}

// Generate session ID
function generateSessionId() {
    const today = new Date().toISOString().split('T')[0];
    return `session_${today}`;
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

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Auto close after 3 seconds for success modal
        if (modalId === 'successModal') {
            setTimeout(() => {
                closeModal();
            }, 3000);
        }
    }
}

// Show error modal with custom message
function showErrorModal(message) {
    const errorMessageElement = document.getElementById('errorMessage');
    if (errorMessageElement) {
        errorMessageElement.textContent = message;
    }
    showModal('errorModal');
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

// Handle escape key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Utility functions for admin panel
function isAdminLoggedIn() {
    return localStorage.getItem(ADMIN_CONFIG.sessionKey) === 'true';
}

function loginAdmin(username, password) {
    if (username === ADMIN_CONFIG.username && password === ADMIN_CONFIG.password) {
        localStorage.setItem(ADMIN_CONFIG.sessionKey, 'true');
        return true;
    }
    return false;
}

function logoutAdmin() {
    localStorage.removeItem(ADMIN_CONFIG.sessionKey);
}

// Export functions for admin panel
window.attendanceSystem = {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    getLocalAttendanceRecords,
    supabase: () => supabase,
    config: SUPABASE_CONFIG
};

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Add to home screen prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button if needed
    const installButton = document.getElementById('installButton');
    if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
            });
        });
    }
});

// Handle online/offline status
window.addEventListener('online', function() {
    console.log('Back online');
    // Sync any pending data
});

window.addEventListener('offline', function() {
    console.log('Gone offline');
    // Show offline message
});

// Performance monitoring
window.addEventListener('load', function() {
    setTimeout(function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }, 0);
});

