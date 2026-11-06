// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCceiYONY_sx9ivD0CDDQGoB9OXm05h4CY",
    authDomain: "kebab-idi.firebaseapp.com",
    projectId: "kebab-idi",
    storageBucket: "kebab-idi.firebasestorage.app",
    messagingSenderId: "303997052314",
    appId: "1:303997052314:web:1db122bc5911297b710623"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handler saat aplikasi ditutup atau di background
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Menerima pesan background: ', payload);
    
    const notificationTitle = payload.notification.title || 'Kebab Turki Hajar';
    const notificationOptions = {
        body: payload.notification.body || 'Ada pesan baru untuk Anda',
        icon: 'https://i.ibb.co.com/QFk2vtzb/1000587297.png',
        badge: 'https://i.ibb.co.com/QFk2vtzb/1000587297.png',
        vibrate: [200, 100, 200, 100, 200, 100, 200]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
