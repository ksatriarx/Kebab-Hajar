// ==========================================
// SCRIPT UNTUK SIDEBAR PROFIL & SALDO (FIREBASE)
// ==========================================

let currentUserKey = "tamu"; 

function bukaProfil() {
    document.getElementById('profile-sidebar').classList.add('show');
    document.getElementById('profile-overlay').classList.add('show');
}

function tutupProfil() {
    document.getElementById('profile-sidebar').classList.remove('show');
    document.getElementById('profile-overlay').classList.remove('show');
}

// Fungsi untuk mengisi data profil dari Firebase
function isiDataProfil(nama, email, fotoUrl, tipeUser) {
    document.getElementById('prof-name').innerText = nama;
    document.getElementById('prof-email').innerText = email;
    
    // Sembunyikan atau tampilkan kotak saldo
    const walletCard = document.querySelector('.wallet-card');
    
    if (tipeUser === "Tamu") {
        // Jika Tamu, sembunyikan saldo
        if(walletCard) walletCard.style.display = 'none';
        currentUserKey = "tamu";
    } else {
        // Jika Akun Google, tampilkan saldo
        if(walletCard) walletCard.style.display = 'flex';
        // Kunci unik berdasarkan email
        currentUserKey = email ? email.replace(/[^a-zA-Z0-9]/g, "") : "user";
    }

    const avatarDiv = document.getElementById('prof-avatar');
    if (fotoUrl) {
        avatarDiv.innerHTML = `<img src="${fotoUrl}" alt="Foto Profil">`;
    } else {
        const inisial = nama.charAt(0).toUpperCase();
        avatarDiv.innerHTML = inisial;
    }
    
    // Perbarui saldo
    perbaruiTampilanSaldo();
}

// ===== SISTEM SALDO (Hanya untuk Akun Google) =====
function ambilSaldo() {
    const saldo = localStorage.getItem('kebabSaldo_' + currentUserKey);
    return saldo ? parseInt(saldo) : 0;
}

function perbaruiTampilanSaldo() {
    const saldoSaatIni = ambilSaldo();
    const elSaldo = document.getElementById('prof-saldo');
    if (elSaldo) {
        elSaldo.innerText = "Rp " + saldoSaatIni.toLocaleString('id-ID');
    }
}

function simulasiTopUp() {
    const nominal = prompt("Masukkan nominal saldo (Uji Coba):\nContoh: 50000");
    if (nominal && !isNaN(nominal)) {
        let saldoBaru = ambilSaldo() + parseInt(nominal);
        localStorage.setItem('kebabSaldo_' + currentUserKey, saldoBaru);
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

document.addEventListener('DOMContentLoaded', () => {
    perbaruiTampilanSaldo();
});
