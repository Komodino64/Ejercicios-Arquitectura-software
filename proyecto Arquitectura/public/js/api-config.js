// ============================================
// 🔧 CONFIGURACIÓN API REST - Backend Linux
// ============================================

const API_CONFIG = {
    // AUTO-DETECTA IP: usa localhost o IP de red local
    // Para acceder desde otro dispositivo: http://TU_IP:8080
    BASE_URL: (() => {
        // Si está en localhost, usar localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:5000/api';
        }
        // Si se accede por IP, usar esa misma IP para el backend
        return `http://${window.location.hostname}:5000/api`;
    })(),
    TIMEOUT: 10000,
    
    // Cloudinary (sigue siendo el mismo)
    CLOUDINARY: {
        cloudName: 'dkdoh6z8u',
        uploadPreset: 'imperial_cars'
    }
};

// Helper para obtener token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Helper para guardar token
function saveAuthToken(token) {
    localStorage.setItem('authToken', token);
}

// Helper para guardar usuario
function saveUserData(user) {
    localStorage.setItem('userData', JSON.stringify(user));
}

// Helper para obtener usuario
function getUserData() {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
}

// Helper para logout
function clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
}

// Cliente HTTP con manejo de errores
async function apiRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const config = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    };
    
    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `Error: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// API Methods
const API = {
    // Auth
    auth: {
        register: (email, password) => 
            apiRequest('/auth/register', {
                method: 'POST',
                body: { email, password }
            }),
        
        login: (email, password) =>
            apiRequest('/auth/login', {
                method: 'POST',
                body: { email, password }
            }),
        
        verify: () => apiRequest('/auth/verify')
    },
    
    // Cars
    cars: {
        getAll: async () => {
            const response = await apiRequest('/cars');
            // Backend devuelve { cars: [...], pagination: {...} }
            // Extraemos solo el array de cars
            return response.cars || response;
        },
        
        getMy: () => apiRequest('/cars/my'),
        
        getOne: (id) => apiRequest(`/cars/${id}`),
        
        create: (carData) =>
            apiRequest('/cars', {
                method: 'POST',
                body: carData
            }),
        
        update: (id, carData) =>
            apiRequest(`/cars/${id}`, {
                method: 'PUT',
                body: carData
            }),
        
        delete: (id) =>
            apiRequest(`/cars/${id}`, {
                method: 'DELETE'
            })
    },
    
    // Contact
    contact: {
        send: (contactData) =>
            apiRequest('/contact', {
                method: 'POST',
                body: contactData
            })
    },
    
    // Stats (admin)
    stats: {
        get: () => apiRequest('/stats')
    }
};

// ============================================
// HELPER FUNCTIONS - Auth validation
// ============================================

// Verificar autenticación (reemplaza requireAuth de Firebase)
function requireAuth() {
    return new Promise((resolve, reject) => {
        const token = getAuthToken();
        const user = getUserData();
        
        if (token && user) {
            resolve(user);
        } else {
            window.location.href = '/login.html';
            reject(new Error('No autenticado'));
        }
    });
}

// Verificar autenticación de admin (reemplaza requireAdmin de Firebase)
async function requireAdmin() {
    const user = await requireAuth();
    if (user.role !== 'admin') {
        alert('⛔ Acceso denegado. Solo administradores.');
        window.location.href = '/index.html';
        throw new Error('No es admin');
    }
    return user;
}

// Cloudinary config (mantener compatibilidad con código existente)
const CLOUDINARY_CONFIG = API_CONFIG.CLOUDINARY;
