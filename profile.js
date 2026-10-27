// ==========================================
// SCRIPT UNTUK SIDEBAR PROFIL & SALDO (FIREBASE)
// ==========================================

// Fungsi Buka/Tutup Sidebar
function bukaProfil() {
    document.getElementById('profile-sidebar').classList.add('show');
    document.getElementById('profile-overlay').classList.add('show');
}

function tutupProfil() {
    document.getElementById('profile-sidebar').classList.remove('show');
    document.getElementById('profile-overlay').classList.remove('show');
}

// Fungsi untuk mengisi data profil dari Firebase
function isiDataProfil(nama, email, fotoUrl) {
    document.getElementById('prof-name').innerText = nama;
    document.getElementById('prof-email').innerText = email;
    
    const avatarDiv = document.getElementById('prof-avatar');
    if (fotoUrl) {
        avatarDiv.innerHTML = `<img src="${fotoUrl}" alt="Foto Profil">`;
    } else {
        const inisial = nama.charAt(0).toUpperCase();
        avatarDiv.innerHTML = inisial;
    }
}

// ===== SISTEM SALDO SEMENTARA (SIMULASI) =====
// Karena belum ada backend, saldo disimpan di localStorage
function ambilSaldo() {
    const saldo = localStorage.getItem('kebabSaldo');
    return saldo ? parseInt(saldo) : 0;
}

function perbaruiTampilanSaldo() {
    const saldoSaatIni = ambilSaldo();
    const elSaldo = document.getElementById('prof-saldo');
    if (elSaldo) {
        elSaldo.innerText = "Rp " + saldoSaatIni.toLocaleString('id-ID');
    }
}

// Fungsi untuk simulasi isi saldo (Hanya untuk uji coba)
function simulasiTopUp() {
    const nominal = prompt("Masukkan nominal saldo (Uji Coba):\nContoh: 50000");
    if (nominal && !isNaN(nominal)) {
        let saldoBaru = ambilSaldo() + parseInt(nominal);
        localStorage.setItem('kebabSaldo', saldoBaru);
        perbaruiTampilanSaldo();
        alert("✅ Top Up Berhasil!\nSaldo Anda sekarang: Rp " + saldoBaru.toLocaleString('id-ID'));
    }
}

// Tombol Logout
document.getElementById('btn-logout-sidebar').addEventListener('click', () => {
    if (typeof prosesLogout === 'function') {
        prosesLogout();
    } else {
        localStorage.removeItem('kebabGuest');
        window.location.reload();
    }
});

// Panggil fungsi saldo saat file dimuat
document.addEventListener('DOMContentLoaded', () => {
    perbaruiTampilanSaldo();
});
