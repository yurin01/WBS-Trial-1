// ========== MODAL FUNCTIONS ==========

// Buka Modal Form Laporan
function openReportForm() {
    document.getElementById('reportModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Tutup Modal Form Laporan
function closeReportForm() {
    document.getElementById('reportModal').style.display = 'none';
    document.getElementById('reportForm').reset();
    document.getElementById('reporter-info').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Tutup Modal Success
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Tutup modal ketika klik di luar modal
window.onclick = function(event) {
    let reportModal = document.getElementById('reportModal');
    let successModal = document.getElementById('successModal');
    
    if (event.target == reportModal) {
        closeReportForm();
    }
    if (event.target == successModal) {
        closeSuccessModal();
    }
}

// ========== FORM HANDLING ==========

// Toggle Anonymous Checkbox
document.addEventListener('DOMContentLoaded', function() {
    const anonymousCheckbox = document.getElementById('report-anonymous');
    const reporterInfo = document.getElementById('reporter-info');
    
    if (anonymousCheckbox) {
        anonymousCheckbox.addEventListener('change', function() {
            if (this.checked) {
                reporterInfo.style.display = 'none';
                document.getElementById('report-name').removeAttribute('required');
                document.getElementById('report-email').removeAttribute('required');
                document.getElementById('report-phone').removeAttribute('required');
            } else {
                reporterInfo.style.display = 'block';
            }
        });
    }
});

// Submit Form Laporan
function submitReport(event) {
    event.preventDefault();
    
    // Validasi
    const category = document.getElementById('report-category').value;
    const date = document.getElementById('report-date').value;
    const location = document.getElementById('report-location').value;
    const description = document.getElementById('report-description').value;
    const agree = document.getElementById('report-agree').checked;
    
    if (!category || !date || !location || !description) {
        alert('Mohon lengkapi semua field yang diperlukan!');
        return;
    }
    
    if (!agree) {
        alert('Anda harus menyetujui Syarat & Ketentuan!');
        return;
    }
    
    // Validasi file jika ada
    const fileInput = document.getElementById('report-evidence');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (file.size > maxSize) {
            alert('Ukuran file terlalu besar! Maksimal 5MB');
            return;
        }
    }
    
    // Siapkan data laporan
    const reportData = {
        category: category,
        date: date,
        location: location,
        description: description,
        anonymous: document.getElementById('report-anonymous').checked,
        name: document.getElementById('report-name').value || '',
        email: document.getElementById('report-email').value || '',
        phone: document.getElementById('report-phone').value || ''
    };
    
    // Tampilkan loading indicator
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    submitButton.disabled = true;
    
    // ⭐ GANTI DENGAN URL APPS SCRIPT ANDA! ⭐
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxu-e2pTFf9QYMdDlbb-bjXAJm_lXpH0P0cLwq0OJrDYMCdFiBjoo2S9njdAMMms9Zv/exec';
    
    // Cek apakah URL sudah diganti
    if (APPS_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbxu-e2pTFf9QYMdDlbb-bjXAJm_lXpH0P0cLwq0OJrDYMCdFiBjoo2S9njdAMMms9Zv/exec') {
        alert('❌ Error: URL Apps Script belum dikonfigurasi!\n\nSilakan update file script.js dengan URL Apps Script Anda.');
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        return;
    }
    
    // Kirim ke Google Sheets
    fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(reportData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        console.log('Response dari Apps Script:', result);
        
        if (result.success) {
            // Tutup form modal
            closeReportForm();
            
            // Tampilkan success modal
            showSuccessModal();
            
            // Simpan ke localStorage juga (backup)
            const reports = JSON.parse(localStorage.getItem('wbs-reports') || '[]');
            reports.push({
                ...reportData,
                timestamp: new Date().toISOString(),
                status: 'Dikirim ke Google Sheets'
            });
            localStorage.setItem('wbs-reports', JSON.stringify(reports));
            
            console.log('✅ Laporan berhasil dikirim ke Google Sheets!');
        } else {
            alert('❌ Gagal mengirim laporan: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Terjadi kesalahan saat mengirim laporan.\n\nPastikan URL Apps Script sudah benar.\n\nError: ' + error.message);
    })
    .finally(() => {
        // Restore button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

// Tampilkan Success Modal
function showSuccessModal() {
    document.getElementById('successModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// ========== SMOOTH SCROLL ==========

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Jika section tidak ditemukan, scroll ke form report
        openReportForm();
    }
}

// ========== NAVIGATION SMOOTH SCROLL ==========

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Jika link adalah menu navigasi
        if (href !== '#' && href !== '#lapor-sekarang') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ========== UTILITY FUNCTIONS ==========

// Format Tanggal
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString('id-ID', options);
}

// Validasi Email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validasi Nomor Telepon Indonesia
function validatePhoneNumber(phone) {
    const re = /^(\+62|62|0)[0-9]{9,12}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// ========== PAGE INITIALIZATION ==========

// Inisialisasi halaman
window.addEventListener('load', function() {
    console.log('Whistleblowing System - Landing Page Loaded');
    
    // Set default tanggal ke hari ini
    const dateInput = document.getElementById('report-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
    
    // Tampilkan informasi browser untuk debugging
    console.log('User Agent:', navigator.userAgent);
    console.log('Time:', new Date().toLocaleString('id-ID'));
});

// ========== EVENT LISTENERS ==========

// Prevent default submit behavior jika form tidak lengkap
document.addEventListener('submit', function(e) {
    if (e.target.id === 'reportForm') {
        // Handler sudah ada di submitReport function
    }
});

// Close modal when pressing Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeReportForm();
        closeSuccessModal();
    }
});

// Add animation on scroll (optional enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all section titles for animation
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.section-title').forEach(el => {
        observer.observe(el);
    });
});
