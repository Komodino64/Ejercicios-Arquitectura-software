using System;
using System.IO;
using System.Threading.Tasks;

// ============================================
// INTERFAZ - La Abstracción
// ============================================
// Define QUÉ se puede hacer (no CÓMO hacerlo)
// Esto permite tener múltiples implementaciones (Local, Azure, AWS, etc.)
public interface IFileStorageService
{
    // Método que TODAS las implementaciones deben tener
    Task<string> Guardar(Stream stream, string fileName);
}

// ============================================
// IMPLEMENTACIÓN LOCAL
// ============================================
// CÓMO guardar en disco local (C:\uploads)
// Esta es una implementación CONCRETA de la interfaz
public class LocalFileStorage : IFileStorageService
{
    public async Task<string> Guardar(Stream stream, string fileName)
    {
        // Construir la ruta completa del archivo
        string path = @"C:\uploads\" + fileName;
        Directory.CreateDirectory(@"C:\uploads"); // Crear carpeta si no existe
        
        using (var file = File.Create(path))
        {
            await stream.CopyToAsync(file);
        }
        
        Console.WriteLine($"[LOCAL] Guardado en: {path}");
        return path;
    }
}

// ============================================
// IMPLEMENTACIÓN AZURE (SIMULADA para demostración)
// ============================================
// CÓMO guardar en Azure Blob Storage (simulado)
// Esta es OTRA implementación CONCRETA de la misma interfaz
public class AzureBlobStorage : IFileStorageService
{
    public async Task<string> Guardar(Stream stream, string fileName)
    {
        // NOTA: Esto es una SIMULACIÓN para el parcial
        // En producción usaríamos el paquete NuGet: Azure.Storage.Blobs
        // Aquí solo simulamos el comportamiento
        
        await Task.Delay(50);
        string blobUrl = $"azure://profile-photos/{fileName}";
        Console.WriteLine($"[AZURE SIMULADO] Guardado en blob: {blobUrl}");
        Console.WriteLine($"[AZURE SIMULADO] (No es una URL real, es simulación)");
        return blobUrl;
    }
}

// ============================================
// SERVICIO que USA la abstracción (LÓGICA DE NEGOCIO)
// ============================================
// PUNTO CLAVE: Esta clase NO CONOCE la implementación concreta
// Solo conoce la interfaz IFileStorageService
public class UserProfileService
{
    private readonly IFileStorageService _storage;
    
    // Inyección de Dependencias: Recibe la INTERFAZ, no la clase concreta
    // Esto permite cambiar de Local a Azure sin modificar esta clase
    public UserProfileService(IFileStorageService storage)
    {
        _storage = storage; // Puede ser LocalFileStorage o AzureBlobStorage
    }
    
    public async Task<string> ActualizarFotoPerfil(int userId, Stream foto, string nombre)
    {
        Console.WriteLine($"\n>>> Usuario {userId} subiendo foto...");
        
        // ⭐⭐⭐ CLAVE DEL EJERCICIO ⭐⭐⭐
        // Este método NO SABE si va a disco local, Azure, AWS, etc.
        // Solo llama a Guardar() de la interfaz
        // La implementación concreta se decide en el Main (línea 90-100)
        var resultado = await _storage.Guardar(foto, nombre);
        
        Console.WriteLine($"✓ Foto guardada correctamente\n");
        return resultado;
    }
}

// ============================================
// PROGRAMA PRINCIPAL - DEMOSTRACIÓN
// ============================================
class Program
{
    static async Task Main()
    {
        Console.WriteLine("╔══════════════════════════════════════════════╗");
        Console.WriteLine("║  EJERCICIO 12: ABSTRACCIÓN DE ARCHIVOS      ║");
        Console.WriteLine("╚══════════════════════════════════════════════╝\n");
        
        // ESCENARIO 1: Almacenamiento LOCAL
        Console.WriteLine("--- ESCENARIO 1: LOCAL ---");
        // Creamos la implementación LOCAL
        IFileStorageService local = new LocalFileStorage();
        // Inyectamos la implementación LOCAL al servicio
        var servicio1 = new UserProfileService(local);
        
        var foto1 = new MemoryStream(new byte[] { 1, 2, 3 }); // Foto simulada
        await servicio1.ActualizarFotoPerfil(101, foto1, "foto1.jpg");
        
        // ESCENARIO 2: Almacenamiento AZURE
        Console.WriteLine("--- ESCENARIO 2: AZURE ---");
        // Creamos la implementación AZURE
        IFileStorageService azure = new AzureBlobStorage();
        // Inyectamos la implementación AZURE al servicio
        // ⭐ UserProfileService NO CAMBIÓ, solo cambiamos la implementación
        var servicio2 = new UserProfileService(azure);
        
        var foto2 = new MemoryStream(new byte[] { 4, 5, 6 }); // Foto simulada
        await servicio2.ActualizarFotoPerfil(102, foto2, "foto2.jpg");
        
        // DEMOSTRACIÓN DEL CONCEPTO
        Console.WriteLine("╔══════════════════════════════════════════════╗");
        Console.WriteLine("║  META LOGRADA:                               ║");
        Console.WriteLine("║  ✓ UserProfileService NO sabe dónde se      ║");
        Console.WriteLine("║    guardan los archivos (Local o Azure)     ║");
        Console.WriteLine("║  ✓ Cambiar implementación sin modificar     ║");
        Console.WriteLine("║    la lógica de negocio                     ║");
        Console.WriteLine("║  ✓ Principio: Inversión de Dependencias     ║");
        Console.WriteLine("║  ✓ Desacoplamiento de infraestructura       ║");
        Console.WriteLine("╚══════════════════════════════════════════════╝");
        
        Console.WriteLine("\n[NOTA] Azure está simulado para el parcial.");
        Console.WriteLine("      El concepto importante es la ABSTRACCIÓN,");
        Console.WriteLine("      no la implementación real de Azure.\n");
    }
}
