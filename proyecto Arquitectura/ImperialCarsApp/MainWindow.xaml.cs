using System;
using System.IO;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using Microsoft.Web.WebView2.Core;

namespace ImperialCarsApp
{
    public partial class MainWindow : Window
    {
        private HttpListener? _httpListener;
        private CancellationTokenSource? _cancellationTokenSource;
        private const int PORT = 9999;
        private string _wwwRootPath = "";

        public MainWindow()
        {
            InitializeComponent();
            Loaded += MainWindow_Loaded;
            Closing += MainWindow_Closing!;
        }

        private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            try
            {
                // Inicializar servidor HTTP local
                _wwwRootPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot");
                
                if (!Directory.Exists(_wwwRootPath))
                {
                    MessageBox.Show($"Error: No se encontró la carpeta wwwroot en:\n{_wwwRootPath}", 
                                    "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                    Application.Current.Shutdown();
                    return;
                }

                StatusText.Text = " - Iniciando servidor local...";
                
                // Iniciar servidor HTTP
                await StartLocalServer();
                
                // Inicializar WebView2
                await InitializeWebView();
                
                StatusText.Text = " - ✅ Conectado";
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al iniciar: {ex.Message}", "Error", 
                                MessageBoxButton.OK, MessageBoxImage.Error);
                Application.Current.Shutdown();
            }
        }

        private async Task InitializeWebView()
        {
            try
            {
                await WebView.EnsureCoreWebView2Async(null);
                
                // Configuración de WebView2
                WebView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = true;
                WebView.CoreWebView2.Settings.AreDevToolsEnabled = true;
                WebView.CoreWebView2.Settings.IsStatusBarEnabled = false;
                WebView.CoreWebView2.Settings.AreDefaultScriptDialogsEnabled = true;
                
                // Manejar errores de navegación
                WebView.CoreWebView2.NavigationCompleted += (s, e) =>
                {
                    if (!e.IsSuccess)
                    {
                        StatusText.Text = $" - ❌ Error de navegación: {e.WebErrorStatus}";
                    }
                    else
                    {
                        StatusText.Text = " - ✅ Página cargada";
                    }
                };
                
                // Navegar a la página principal
                WebView.CoreWebView2.Navigate($"http://localhost:{PORT}/index.html");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al inicializar WebView2:\n{ex.Message}\n\n" +
                               "Asegúrate de tener WebView2 Runtime instalado.\n" +
                               "Descarga: https://go.microsoft.com/fwlink/p/?LinkId=2124703",
                               "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                throw;
            }
        }

        private async Task StartLocalServer()
        {
            try
            {
                _httpListener = new HttpListener();
                _httpListener.Prefixes.Add($"http://localhost:{PORT}/");
                _httpListener.Start();
                
                _cancellationTokenSource = new CancellationTokenSource();
                
                // Ejecutar servidor en background
                _ = Task.Run(() => ServerLoop(_cancellationTokenSource.Token));
                
                await Task.Delay(500); // Dar tiempo al servidor para iniciar
            }
            catch (Exception ex)
            {
                throw new Exception($"No se pudo iniciar el servidor en puerto {PORT}. " +
                                   "Verifica que no esté ocupado por otra aplicación.", ex);
            }
        }

        private async Task ServerLoop(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested && _httpListener != null && _httpListener.IsListening)
            {
                try
                {
                    var context = await _httpListener.GetContextAsync();
                    _ = Task.Run(() => HandleRequest(context), cancellationToken);
                }
                catch (HttpListenerException)
                {
                    // Listener detenido
                    break;
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"Server error: {ex.Message}");
                }
            }
        }

        private void HandleRequest(HttpListenerContext context)
        {
            try
            {
                var request = context.Request;
                var response = context.Response;

                // Obtener ruta del archivo
                string path = request.Url?.AbsolutePath.TrimStart('/') ?? "index.html";
                if (string.IsNullOrEmpty(path) || path == "/")
                    path = "index.html";

                string filePath = Path.Combine(_wwwRootPath, path.Replace('/', Path.DirectorySeparatorChar));

                if (File.Exists(filePath))
                {
                    // Determinar Content-Type
                    string contentType = GetContentType(filePath);
                    response.ContentType = contentType;

                    // Leer y enviar archivo
                    byte[] buffer = File.ReadAllBytes(filePath);
                    response.ContentLength64 = buffer.Length;
                    response.StatusCode = 200;
                    response.OutputStream.Write(buffer, 0, buffer.Length);
                }
                else
                {
                    // 404 - Archivo no encontrado
                    response.StatusCode = 404;
                    byte[] buffer = System.Text.Encoding.UTF8.GetBytes("404 - File Not Found");
                    response.ContentLength64 = buffer.Length;
                    response.OutputStream.Write(buffer, 0, buffer.Length);
                }

                response.OutputStream.Close();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Request handler error: {ex.Message}");
            }
        }

        private string GetContentType(string filePath)
        {
            string extension = Path.GetExtension(filePath).ToLowerInvariant();
            return extension switch
            {
                ".html" => "text/html; charset=utf-8",
                ".htm" => "text/html; charset=utf-8",
                ".css" => "text/css; charset=utf-8",
                ".js" => "application/javascript; charset=utf-8",
                ".json" => "application/json; charset=utf-8",
                ".png" => "image/png",
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".gif" => "image/gif",
                ".svg" => "image/svg+xml",
                ".ico" => "image/x-icon",
                ".woff" => "font/woff",
                ".woff2" => "font/woff2",
                ".ttf" => "font/ttf",
                ".eot" => "application/vnd.ms-fontobject",
                _ => "application/octet-stream"
            };
        }

        private void RefreshButton_Click(object sender, RoutedEventArgs e)
        {
            StatusText.Text = " - 🔄 Recargando...";
            WebView.Reload();
        }

        private void DevToolsButton_Click(object sender, RoutedEventArgs e)
        {
            if (WebView.CoreWebView2 != null)
            {
                WebView.CoreWebView2.OpenDevToolsWindow();
            }
        }

        private void MainWindow_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            // Detener servidor HTTP
            _cancellationTokenSource?.Cancel();
            _httpListener?.Stop();
            _httpListener?.Close();
        }
    }
}
