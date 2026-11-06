// ==========================================
// SCRIPT UNTUK SIDEBAR PROFIL & SALDO (FIREBASE)
// ==========================================

let currentUserKey = "tamu"; 
let currentUserEmail = "";
let unsubscribeSaldo = null;

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

    // LOGIKA RAHASIA: TOMBOL KASIR KHUSUS OWNER
    const ownerMenu = document.getElementById('owner-menu');
    if (ownerMenu) {
        if (email === "rxstore101@gmail.com") {
            ownerMenu.style.display = 'inline-block';
        } else {
            ownerMenu.style.display = 'none';
        }
    }
    
    const walletCard = document.querySelector('.wallet-card');
    
    if (tipeUser === "Tamu") {
        if(walletCard) walletCard.style.display = 'none';
        currentUserKey = "tamu";
        currentUserEmail = "";
        if (unsubscribeSaldo) unsubscribeSaldo(); // Hentikan pantauan saldo
    } else {
        if(walletCard) walletCard.style.display = 'flex';
        currentUserKey = email ? email.replace(/[^a-zA-Z0-9]/g, "") : "user";
        currentUserEmail = email;
        pantauSaldoFirebase(); // Mulai pantau saldo
    }

    const avatarDiv = document.getElementById('prof-avatar');
    if (fotoUrl) {
        avatarDiv.innerHTML = `<img src="${fotoUrl}" alt="Foto Profil">`;
    } else {
        const inisial = nama.charAt(0).toUpperCase();
        avatarDiv.innerHTML = inisial;
    }
}

// ===== SISTEM SALDO FIREBASE =====
function pantauSaldoFirebase() {
    if (!currentUserKey || currentUserKey === "tamu") return;
    if (!window.firebaseDb) return; 

    const docRef = window.firestoreDoc(window.firebaseDb, "saldo_pelanggan", currentUserKey);
    
    if (unsubscribeSaldo) unsubscribeSaldo();

    unsubscribeSaldo = window.firestoreOnSnapshot(docRef, (docSnap) => {
        let saldoSaatIni = 0;
        if (docSnap.exists()) {
            saldoSaatIni = docSnap.data().saldo || 0;
        }
        const elSaldo = document.getElementById('prof-saldo');
        if (elSaldo) {
            elSaldo.innerText = "Rp " + saldoSaatIni.toLocaleString('id-ID');
        }
    }, (error) => {
        console.error("Gagal mengambil saldo:", error);
    });
}

// ===== TOP UP VIA MIDTRANS =====
function simulasiTopUp() {
    if (currentUserKey === "tamu" || !currentUserEmail) {
        alert("Silakan login dengan Akun Google terlebih dahulu untuk Top Up Saldo.");
        return;
    }

    const nominal = prompt("Masukkan nominal Top Up (Minimal Rp 10.000):\nContoh: 50000");
    if (!nominal) return; // Batal

    const nominalAngka = parseInt(nominal);
    if (isNaN(nominalAngka) || nominalAngka < 10000) {
        alert("Nominal tidak valid atau kurang dari Rp 10.000.");
        return;
    }

    prosesTopUpMidtrans(nominalAngka);
}

async function prosesTopUpMidtrans(nominal) {
    const orderId = 'TOPUP-' + Date.now();
    const loadingOverlay = document.getElementById('loading');
    if(loadingOverlay) loadingOverlay.classList.add('show');

    try {
        // 1. Minta Token ke Vercel
        const response = await fetch('https://kebab-backend.vercel.app/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order_id: orderId,
                gross_amount: nominal,
                nama_pembeli: "Top Up Saldo",
                email_pembeli: currentUserEmail
            })
        });

        const data = await response.json();
        if(loadingOverlay) loadingOverlay.classList.remove('show');

        if (data.token) {
            // 2. PENGAMAN BARU: Cek apakah script Midtrans berhasil dimuat
            if (typeof window.snap === 'undefined') {
                alert("Gagal memuat sistem pembayaran Midtrans. Silakan tutup aplikasi, bersihkan cache browser, lalu buka kembali.");
                return;
            }

            // 3. Munculkan Pop-up Midtrans
            window.snap.pay(data.token, {
                onSuccess: function(result){
                    alert("✅ Pembayaran Top Up Berhasil! Saldo akan otomatis bertambah.");
                },
                onPending: function(result){
                    alert("⏳ Menunggu pembayaran Top Up.");
                },
                onError: function(result){
                    alert("❌ Pembayaran Top Up gagal.");
                },
                onClose: function(){
                    // alert('Anda menutup pop-up sebelum menyelesaikan pembayaran.');
                }
            });
        } else {
            alert("Gagal mendapatkan token: " + (data.message || 'Error tidak diketahui'));
        }
    } catch (error) {
        if(loadingOverlay) loadingOverlay.classList.remove('show');
        // TAMPILKAN ERROR ASLI, BUKAN PESAN "JARINGAN" LAGI
        console.error("Error Top Up:", error);
        alert("Terjadi kesalahan: " + error.message);
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
