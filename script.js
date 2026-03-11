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
    
    // ⭐ PASTE URL APPS SCRIPT ANDA DI SINI! ⭐
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxu-e2pTFf9QYMdDlbb-bjXAJm_lXpH0P0cLwq0OJrDYMCdFiBjoo2S9njdAMMms9Zv/exec';
    
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
