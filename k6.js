import http from 'k6/http';
import { check, sleep } from 'k6';

// --- Opciones de la Prueba ---
// Define las etapas de la prueba de carga (rampa, sostenimiento, bajada)
export const options = {
  stages: [
    { duration: '30s', target: 50 },  // 1. Rampa: de 0 a 50 usuarios en 30s
    { duration: '1m', target: 50 },   // 2. Sostener: 50 usuarios por 1 minuto
    { duration: '10s', target: 0 },   // 3. Bajada: de 50 a 0 usuarios en 10s
  ],
  thresholds: {
    // Definir criterios de éxito
    'http_req_failed': ['rate<0.01'], // Menos del 1% de las peticiones pueden fallar
    'http_req_duration': ['p(95)<1000'], // El 95% de las peticiones debe ser < 1000ms
  },
};

// --- URLs Base ---
// Es buena práctica definir las URLs base aquí
// Se puede pasar por variable de entorno: k6 run -e BASE_URL=http://... script.js
const API_BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'; // Por defecto local

// --- Cuerpo de la Prueba (Lógica del Usuario Virtual) ---
export default function () {

  // === 1. Endpoint: Login (POST /auth/sign-in) ===

  const loginPayload = JSON.stringify({
    email: 'system@example.com',
    password: 'qwerty',
  });

  const loginParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(`${API_BASE_URL}/auth/sign-in`, loginPayload, loginParams);

  // Verificación del login
  const loginCheck = check(loginRes, {
    'Login exitoso (HTTP 201)': (r) => r.status === 201,
  });

  // Si el login falla, no podemos continuar. Detenemos esta iteración.
  if (!loginCheck) {
    console.error('Login fallido, deteniendo iteración del VU');
    return; // Detiene la ejecución de este VU
  }

  // Extracción del Token
  // k6 tiene un selector de JSON muy útil.
  const accessToken = loginRes.json('data.accessToken');

  // === 2. Endpoint: Obtener Usuarios (GET /users) ===

  // Crear los parámetros de header para las peticiones autenticadas
  const authParams = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  };

  const usersRes = http.get(`${API_BASE_URL}/users`, authParams);

  // Verificación
  check(usersRes, {
    'Obtener /users exitoso (HTTP 200)': (r) => r.status === 200,
  });

  // === 3. Endpoint: Obtener Usuario por ID (GET /users/:id) ===
  // Nota: Usando la URL del puerto 3000, como en tu curl.

  const singleUserRes = http.get(`${API_BASE_URL}/users/550e8400-e29b-41d4-a716-446655440000`, authParams);

  // Verificación
  check(singleUserRes, {
    'Obtener /users/:id exitoso (HTTP 200)': (r) => r.status === 200,
  });

  // "Think time": Simula que un usuario espera 1 segundo antes de repetir el flujo
  // sleep(1);
}