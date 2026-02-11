// ============================================
// 🔐 AUTENTICACIÓN Y GESTIÓN DE SESIÓN (REST API)
// ============================================

// ============================================
// OBJETO AUTH - Métodos de autenticación
// ============================================
const Auth = {
    // Obtener usuario actual
    getCurrentUser: function() {
        return getUserData();
    },
    
    // Verificar si está autenticado
    isAuthenticated: function() {
        const token = getAuthToken();
        const user = getUserData();
        return !!(token && user);
    },
    
    // Verificar si es admin
    isAdmin: function() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }
};

// Referencias a elementos de navegación
const navAdmin = document.getElementById('navAdmin');
const navLogout = document.getElementById('navLogout');
const navLogin = document.getElementById('navLogin');
const navMyAds = document.getElementById('navMyAds');

// Inicializar autenticación al cargar la página
function initAuth() {
    const token = getAuthToken();
    const user = getUserData();
    
    if (token && user) {
        // Usuario autenticado
        if (navLogin) navLogin.classList.add('hidden');
        if (navLogout) navLogout.classList.remove('hidden');
        if (navMyAds) navMyAds.classList.remove('hidden');
        
        // Verificar si es admin
        if (user.role === 'admin' && navAdmin) {
            navAdmin.classList.remove('hidden');
            navAdmin.href = 'admin.html';
        }
    } else {
        // Usuario no autenticado
        if (navLogin) navLogin.classList.remove('hidden');
        if (navLogout) navLogout.classList.add('hidden');
        if (navAdmin) navAdmin.classList.add('hidden');
        if (navMyAds) navMyAds.classList.add('hidden');
    }
}

// Ejecutar al cargar
initAuth();

// Logout functionality
if (navLogout) {
    navLogout.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (confirm('¿Seguro que deseas cerrar sesión?')) {
            clearAuthData();
            alert('✅ Sesión cerrada exitosamente');
            window.location.href = 'index.html';
        }
    });
}

// Helper: Formatear fecha
function formatDate(timestamp) {
    if (!timestamp) return 'Fecha no disponible';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
}

// Helper: Mostrar mensajes de alerta
function showAlert(message, type = 'info') {
    const alertClass = type === 'success' ? 'alert-success' : 
                       type === 'error' ? 'alert-error' : 'alert-info';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertClass}`;
    alertDiv.textContent = message;
    
    // Insertar al inicio del main
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(alertDiv, main.firstChild);
        
        // Auto-remove después de 5 segundos
        setTimeout(() => alertDiv.remove(), 5000);
    }
}
