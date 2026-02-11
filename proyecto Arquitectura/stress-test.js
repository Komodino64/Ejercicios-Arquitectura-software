// ============================================
// STRESS TEST - Imperial Luxury Cars API
// ============================================
// Uso: node stress-test.js

const BASE_URL = 'http://localhost:5000/api';
const NUM_REQUESTS = 100; // Número de requests concurrentes
const ENDPOINTS_TO_TEST = [
  { method: 'GET', url: '/cars', description: 'GET /api/cars' },
  { method: 'GET', url: '/', description: 'GET / (health check)' }
];

console.log('🔥 INICIANDO PRUEBA DE ESTRÉS...\n');
console.log(`📊 Configuración:`);
console.log(`   - Base URL: ${BASE_URL}`);
console.log(`   - Requests concurrentes: ${NUM_REQUESTS}`);
console.log(`   - Endpoints: ${ENDPOINTS_TO_TEST.length}\n`);

async function makeRequest(url, method = 'GET') {
  const startTime = Date.now();
  try {
    const response = await fetch(`${BASE_URL}${url}`, { method });
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    return {
      success: response.ok,
      status: response.status,
      duration,
      error: null
    };
  } catch (error) {
    const endTime = Date.now();
    return {
      success: false,
      status: 0,
      duration: endTime - startTime,
      error: error.message
    };
  }
}

async function runStressTest(endpoint) {
  console.log(`\n⚡ Testeando: ${endpoint.description}`);
  console.log(`   Enviando ${NUM_REQUESTS} requests...`);
  
  const startTime = Date.now();
  const promises = Array(NUM_REQUESTS).fill(null).map(() => 
    makeRequest(endpoint.url, endpoint.method)
  );
  
  const results = await Promise.all(promises);
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  
  // Análisis de resultados
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const rateLimited = results.filter(r => r.status === 429).length;
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  const minDuration = Math.min(...results.map(r => r.duration));
  const maxDuration = Math.max(...results.map(r => r.duration));
  
  // Estadísticas por código de estado
  const statusCounts = {};
  results.forEach(r => {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
  });
  
  console.log(`\n✅ RESULTADOS:`);
  console.log(`   ⏱️  Tiempo total: ${totalDuration}ms`);
  console.log(`   📈 Requests/segundo: ${(NUM_REQUESTS / (totalDuration / 1000)).toFixed(2)}`);
  console.log(`   ✔️  Exitosos: ${successful}/${NUM_REQUESTS} (${(successful/NUM_REQUESTS*100).toFixed(1)}%)`);
  console.log(`   ❌ Fallidos: ${failed}/${NUM_REQUESTS}`);
  console.log(`   🚫 Rate Limited (429): ${rateLimited}/${NUM_REQUESTS}`);
  console.log(`\n   ⏱️  Duración promedio: ${avgDuration.toFixed(2)}ms`);
  console.log(`   ⚡ Duración mínima: ${minDuration}ms`);
  console.log(`   🐌 Duración máxima: ${maxDuration}ms`);
  console.log(`\n   📊 Códigos de estado:`);
  Object.entries(statusCounts).forEach(([status, count]) => {
    const emoji = status === '200' ? '✅' : status === '429' ? '🚫' : '❌';
    console.log(`      ${emoji} ${status}: ${count} (${(count/NUM_REQUESTS*100).toFixed(1)}%)`);
  });
  
  return {
    endpoint: endpoint.description,
    totalDuration,
    successful,
    failed,
    rateLimited,
    avgDuration,
    statusCounts
  };
}

async function main() {
  const allResults = [];
  
  for (const endpoint of ENDPOINTS_TO_TEST) {
    const result = await runStressTest(endpoint);
    allResults.push(result);
    
    // Esperar 2 segundos entre tests para evitar rate limiting
    if (ENDPOINTS_TO_TEST.indexOf(endpoint) < ENDPOINTS_TO_TEST.length - 1) {
      console.log('\n⏸️  Esperando 2 segundos antes del siguiente test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n\n═══════════════════════════════════════════');
  console.log('📊 RESUMEN GENERAL DE LA PRUEBA DE ESTRÉS');
  console.log('═══════════════════════════════════════════\n');
  
  allResults.forEach((result, index) => {
    console.log(`${index + 1}. ${result.endpoint}`);
    console.log(`   ✅ Exitosos: ${result.successful}/${NUM_REQUESTS}`);
    console.log(`   🚫 Rate Limited: ${result.rateLimited}/${NUM_REQUESTS}`);
    console.log(`   ⏱️  Tiempo promedio: ${result.avgDuration.toFixed(2)}ms`);
    console.log(`   ⏱️  Tiempo total: ${result.totalDuration}ms\n`);
  });
  
  const totalSuccessful = allResults.reduce((sum, r) => sum + r.successful, 0);
  const totalRequests = NUM_REQUESTS * ENDPOINTS_TO_TEST.length;
  const successRate = (totalSuccessful / totalRequests * 100).toFixed(2);
  
  console.log(`🎯 SCORE GENERAL: ${successRate}% de éxito`);
  console.log(`📈 Total de requests: ${totalRequests}`);
  console.log(`✅ Exitosos: ${totalSuccessful}`);
  console.log(`❌ Fallidos: ${totalRequests - totalSuccessful}\n`);
  
  if (successRate >= 90) {
    console.log('🏆 EXCELENTE: El sistema maneja bien la carga');
  } else if (successRate >= 70) {
    console.log('⚠️  ACEPTABLE: El sistema aguanta pero puede mejorar');
  } else {
    console.log('❌ CRÍTICO: El sistema necesita optimización');
  }
  
  console.log('\n✅ Prueba de estrés completada!\n');
}

main().catch(console.error);
