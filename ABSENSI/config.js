// Supabase Configuration
// IMPORTANT: Replace these with your actual Supabase credentials
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL', // Replace with your Supabase URL
    anonKey: 'YOUR_SUPABASE_ANON_KEY', // Replace with your Supabase anon key
    
    // Table names
    tables: {
        attendance: 'attendance',
        students: 'students',
        sessions: 'sessions'
    }
};

// Admin Configuration
const ADMIN_CONFIG = {
    // Simple admin credentials (in production, use proper authentication)
    username: 'admin',
    password: 'volleyball2024', // Change this password!
    sessionKey: 'volleyball_admin_session'
};

// Application Configuration
const APP_CONFIG = {
    schoolName: 'SMA Negeri 1',
    clubName: 'Ekstrakurikuler Bola Voli',
    trainingSchedule: [
        { day: 'Senin', time: '15:30 - 17:00' },
        { day: 'Rabu', time: '15:30 - 17:00' },
        { day: 'Jumat', time: '15:30 - 17:00' }
    ],
    contact: {
        email: 'volleyball@school.edu',
        phone: '(021) 1234-5678',
        address: 'Sekolah ABC, Jakarta'
    }
};

// Export configurations (for ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, ADMIN_CONFIG, APP_CONFIG };
}

