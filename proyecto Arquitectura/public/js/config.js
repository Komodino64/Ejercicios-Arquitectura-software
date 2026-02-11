// ============================================
// 🔥 CONFIGURACIÓN FIREBASE + CLOUDINARY
// ============================================
// IMPORTANTE: Reemplaza estos valores con los tuyos después de seguir INSTRUCCIONES_FIREBASE.md

// Configuración de Firebase (copia estos valores de Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDS_mz-212EcVxnpiZYt9_xE70c2Z5QXE0",
  authDomain: "imperial-luxury-5b48a.firebaseapp.com",
  projectId: "imperial-luxury-5b48a",
  storageBucket: "imperial-luxury-5b48a.firebasestorage.app",
  messagingSenderId: "332170900857",
  appId: "1:332170900857:web:6e881e0f455adf52136ba8"
};

// UID del usuario administrador (copia el UID del usuario admin de Firebase Authentication)
const ADMIN_UID = "KZHNi0Nft1OH8FsLDEx8OrkGTHn1";

// Configuración de Cloudinary
const CLOUDINARY_CONFIG = {
  cloudName: "dkdoh6z8u",
  uploadPreset: "imperial_cars"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencias a servicios de Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// Helper: Verificar si el usuario actual es admin
async function isAdmin() {
  const user = auth.currentUser;
  if (!user) return false;
  return user.uid === ADMIN_UID;
}

// Helper: Verificar autenticación
function requireAuth() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        window.location.href = '/login.html';
        reject(new Error('No autenticado'));
      }
    });
  });
}

// Helper: Verificar autenticación de admin
async function requireAdmin() {
  const user = await requireAuth();
  if (user.uid !== ADMIN_UID) {
    alert('⛔ Acceso denegado. Solo administradores.');
    window.location.href = '/index.html';
    throw new Error('No es admin');
  }
  return user;
}
