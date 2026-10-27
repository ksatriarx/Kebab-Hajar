/* ==========================================
   SCRIPT UNTUK SIDEBAR PROFIL
   ========================================== */

// Fungsi untuk membuka Sidebar
function bukaProfil() {
    document.getElementById('profile-sidebar').classList.add('show');
    document.getElementById('profile-overlay').classList.add('show');
}

// Fungsi untuk menutup Sidebar
function tutupProfil() {
    document.getElementById('profile-sidebar').classList.remove('show');
    document.getElementById('profile-overlay').classList.remove('show');
}

// Fungsi untuk mengisi data profil dari data Firebase
// Fungsi ini akan dipanggil otomatis oleh index.html saat login berhasil
function isiDataProfil(nama, email, fotoUrl) {
    // Isi Nama
    document.getElementById('prof-name').innerText = nama;
    
    // Isi Email
    document.getElementById('prof-email').innerText = email;

    // Isi Avatar (Foto atau Huruf Depan)
    const avatarDiv = document.getElementById('prof-avatar');
    if (fotoUrl) {
        avatarDiv.innerHTML = `<img src="${fotoUrl}" alt="Foto Profil">`;
    } else {
        // Ambil huruf pertama dari nama
        const inisial = nama.charAt(0).toUpperCase();
        avatarDiv.innerHTML = inisial;
    }
}

// Tombol Logout di Sidebar
document.getElementById('btn-logout-sidebar').addEventListener('click', () => {
    // Panggil fungsi logout Firebase yang ada di index.html
    if (typeof prosesLogout === 'function') {
        prosesLogout();
    } else {
        // Fallback jika fungsi tidak ada
        localStorage.removeItem('kebabGuest');
        window.location.reload();
    }
});