import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up a 10 usuarios
    { duration: '1m', target: 20 },   // Mantener 20 usuarios
    { duration: '30s', target: 50 },  // Subir a 50 usuarios
    { duration: '1m', target: 50 },   // Mantener 50 usuarios
    { duration: '30s', target: 0 },   // Ramp down a 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de requests deben ser < 500ms
    http_req_failed: ['rate<0.1'],    // Menos del 10% de fallos
  },
};

const BASE_URL = 'http://localhost:5000';

export default function () {
  // 1. Health Check
  let res = http.get(`${BASE_URL}/`);
  check(res, { 'health check OK': (r) => r.status === 200 });

  // 2. Listar todos los vehículos
  res = http.get(`${BASE_URL}/api/cars`);
  check(res, { 
    'cars list OK': (r) => r.status === 200,
    'cars is array': (r) => Array.isArray(r.json())
  });

  sleep(1);

  // 3. Login de administrador
  const loginPayload = JSON.stringify({
    email: 'admin@imperialluxury.com',
    password: 'Admin123!'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  res = http.post(`${BASE_URL}/api/auth/login`, loginPayload, params);
  check(res, { 
    'login OK': (r) => r.status === 200,
    'token exists': (r) => r.json('token') !== undefined
  });

  const authToken = res.json('token');

  sleep(1);

  // 4. Mis vehículos (requiere autenticación)
  if (authToken) {
    params.headers.Authorization = `Bearer ${authToken}`;
    res = http.get(`${BASE_URL}/api/cars/my`, params);
    check(res, { 'my cars OK': (r) => r.status === 200 });
    
    sleep(1);
    
    // 5. Estadísticas (solo admin)
    res = http.get(`${BASE_URL}/api/stats`, params);
    check(res, { 'stats OK': (r) => r.status === 200 || r.status === 403 });
  }

  sleep(2);

  // 6. Enviar mensaje de contacto
  const contactPayload = JSON.stringify({
    name: `Test User ${Date.now()}`,
    email: `test${Date.now()}@test.com`,
    phone: '555-1234',
    message: 'Prueba de estrés con k6'
  });

  res = http.post(`${BASE_URL}/api/contact`, contactPayload, {
    headers: { 'Content-Type': 'application/json' }
  });
  check(res, { 'contact OK': (r) => r.status === 201 });

  sleep(1);
}
