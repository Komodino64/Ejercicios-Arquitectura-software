using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace ImperialStressTest
{
    class Program
    {
        private static readonly string API_BASE_URL = "http://localhost:5000";
        private static readonly int NUM_REQUESTS = 100;
        private static readonly HttpClient httpClient = new HttpClient();

        static async Task Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            Console.Clear();
            
            PrintHeader();
            
            // Obtener IP si se pasa como argumento
            string apiUrl = args.Length > 0 ? args[0] : API_BASE_URL;
            
            Console.WriteLine($"🎯 API URL: {apiUrl}");
            Console.WriteLine($"📊 Requests: {NUM_REQUESTS} concurrentes por endpoint");
            Console.WriteLine($"⏱️  Timeout: 30 segundos");
            Console.WriteLine();
            
            Console.WriteLine("Presiona cualquier tecla para iniciar la prueba...");
            Console.ReadKey();
            Console.WriteLine();
            
            try
            {
                // Test 1: Health Check (/)
                await RunStressTest(apiUrl, "/", "GET", "Health Check (/)");
                
                Console.WriteLine("\n⏸️  Esperando 2 segundos...\n");
                await Task.Delay(2000);
                
                // Test 2: Get Cars
                await RunStressTest(apiUrl, "/api/cars", "GET", "GET /api/cars");
                
                Console.WriteLine("\n═══════════════════════════════════════════");
                Console.WriteLine("✅ PRUEBA DE ESTRÉS COMPLETADA");
                Console.WriteLine("═══════════════════════════════════════════\n");
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"\n❌ ERROR: {ex.Message}");
                Console.ResetColor();
            }
            
            Console.WriteLine("\nPresiona cualquier tecla para salir...");
            Console.ReadKey();
        }

        static void PrintHeader()
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("═══════════════════════════════════════════");
            Console.WriteLine("  🔥 IMPERIAL LUXURY CARS - STRESS TEST");
            Console.WriteLine("═══════════════════════════════════════════");
            Console.ResetColor();
            Console.WriteLine();
        }

        static async Task RunStressTest(string baseUrl, string endpoint, string method, string description)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"⚡ Testeando: {description}");
            Console.ResetColor();
            Console.WriteLine($"   Enviando {NUM_REQUESTS} requests...");
            
            var results = new List<RequestResult>();
            var stopwatch = Stopwatch.StartNew();
            
            // Crear tasks para requests concurrentes
            var tasks = new List<Task<RequestResult>>();
            for (int i = 0; i < NUM_REQUESTS; i++)
            {
                tasks.Add(MakeRequest(baseUrl + endpoint, method));
            }
            
            // Ejecutar todos concurrentemente
            results = (await Task.WhenAll(tasks)).ToList();
            stopwatch.Stop();
            
            // Analizar resultados
            AnalyzeResults(results, stopwatch.ElapsedMilliseconds, description);
        }

        static async Task<RequestResult> MakeRequest(string url, string method)
        {
            var result = new RequestResult();
            var stopwatch = Stopwatch.StartNew();
            
            try
            {
                HttpRequestMessage request = new HttpRequestMessage(
                    method == "GET" ? HttpMethod.Get : HttpMethod.Post,
                    url
                );
                
                var response = await httpClient.SendAsync(request);
                stopwatch.Stop();
                
                result.Success = response.IsSuccessStatusCode;
                result.StatusCode = (int)response.StatusCode;
                result.Duration = stopwatch.ElapsedMilliseconds;
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                result.Success = false;
                result.StatusCode = 0;
                result.Duration = stopwatch.ElapsedMilliseconds;
                result.Error = ex.Message;
            }
            
            return result;
        }

        static void AnalyzeResults(List<RequestResult> results, long totalDuration, string description)
        {
            int successful = results.Count(r => r.Success);
            int failed = results.Count(r => !r.Success);
            int rateLimited = results.Count(r => r.StatusCode == 429);
            
            var successfulResults = results.Where(r => r.Success).ToList();
            double avgDuration = successfulResults.Any() 
                ? successfulResults.Average(r => r.Duration) 
                : 0;
            long minDuration = successfulResults.Any() 
                ? successfulResults.Min(r => r.Duration) 
                : 0;
            long maxDuration = successfulResults.Any() 
                ? successfulResults.Max(r => r.Duration) 
                : 0;
            
            double requestsPerSecond = (NUM_REQUESTS / (totalDuration / 1000.0));
            
            // Códigos de estado
            var statusCounts = results
                .GroupBy(r => r.StatusCode)
                .ToDictionary(g => g.Key, g => g.Count());
            
            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("✅ RESULTADOS:");
            Console.ResetColor();
            
            Console.WriteLine($"   ⏱️  Tiempo total: {totalDuration}ms");
            Console.WriteLine($"   📈 Requests/segundo: {requestsPerSecond:F2}");
            Console.WriteLine($"   ✔️  Exitosos: {successful}/{NUM_REQUESTS} ({(successful * 100.0 / NUM_REQUESTS):F1}%)");
            Console.WriteLine($"   ❌ Fallidos: {failed}/{NUM_REQUESTS}");
            Console.WriteLine($"   🚫 Rate Limited (429): {rateLimited}/{NUM_REQUESTS}");
            
            if (successfulResults.Any())
            {
                Console.WriteLine();
                Console.WriteLine($"   ⏱️  Duración promedio: {avgDuration:F2}ms");
                Console.WriteLine($"   ⚡ Duración mínima: {minDuration}ms");
                Console.WriteLine($"   🐌 Duración máxima: {maxDuration}ms");
            }
            
            Console.WriteLine();
            Console.WriteLine("   📊 Códigos de estado:");
            foreach (var status in statusCounts.OrderBy(s => s.Key))
            {
                string emoji = status.Key switch
                {
                    200 => "✅",
                    201 => "✅",
                    429 => "🚫",
                    500 => "💥",
                    0 => "❌",
                    _ => "⚠️"
                };
                
                string statusDescription = status.Key switch
                {
                    200 => "OK",
                    201 => "Created",
                    429 => "Too Many Requests (Rate Limit)",
                    500 => "Internal Server Error",
                    0 => "Connection Failed",
                    _ => "Other"
                };
                
                Console.WriteLine($"      {emoji} {status.Key} ({statusDescription}): {status.Value} ({(status.Value * 100.0 / NUM_REQUESTS):F1}%)");
            }
            
            // Evaluación
            Console.WriteLine();
            double successRate = (successful * 100.0 / NUM_REQUESTS);
            if (successRate >= 90)
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("   🏆 EXCELENTE: El sistema maneja bien la carga");
            }
            else if (successRate >= 70)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("   ⚠️  ACEPTABLE: El sistema aguanta pero puede mejorar");
            }
            else if (successRate >= 50)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("   ⚠️  REGULAR: Rate limiting funcionando (esto es esperado)");
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("   ❌ CRÍTICO: El sistema necesita optimización");
            }
            Console.ResetColor();
        }
    }

    class RequestResult
    {
        public bool Success { get; set; }
        public int StatusCode { get; set; }
        public long Duration { get; set; }
        public string? Error { get; set; }
    }
}
