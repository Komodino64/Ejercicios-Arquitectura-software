// ============================================
// 🛡️ PROTECCIÓN ULTRA AVANZADA + OFUSCACIÓN
// ============================================

(function() {
    'use strict';
    
    // Detectar DevTools abierto (monitorear tamaño de consola)
    let devtoolsOpen = false;
    const threshold = 160;
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    setInterval(function() {
        // Solo aplicar en producción, no en localhost
        if (isLocalhost) return;
        
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                // Ofuscar contenido
                document.body.innerHTML = '<h1 style="text-align:center;margin-top:50px;">⚠️ Acceso Denegado</h1>';
            }
        } else {
            devtoolsOpen = false;
        }
    }, 1000);
    
    // Bloquear todas las teclas de desarrollo
    const blockedKeys = new Set([
        'F12', 'F1', 'F3', 'F5', 'F7', 'F9', 'F11',
        'I', 'J', 'C', 'U', 'S', 'P', 'E'
    ]);
    
    document.addEventListener('keydown', function(e) {
        // Bloquear F12 y combinaciones de DevTools
        if (blockedKeys.has(e.key) || 
            e.keyCode === 123 || // F12
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'U') || // Ver código fuente
            (e.ctrlKey && e.key === 'S') || // Guardar página
            (e.ctrlKey && e.key === 'P') || // Imprimir
            (e.ctrlKey && e.shiftKey && e.key === 'Delete') || // Vaciar caché
            (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) { // Mac
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);
    
    // Bloquear menú contextual (clic derecho)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);
    
    // Bloquear selección de texto
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    }, true);
    
    // Bloquear arrastrar elementos
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    }, true);
    
    // Bloquear copiar
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', '');
        return false;
    }, true);
    
    // Bloquear cortar
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    }, true);
    
    // Aplicar estilos CSS anti-selección
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
        }
        input, textarea, select {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
        img {
            pointer-events: none;
            -webkit-user-drag: none;
        }
    `;
    document.head.appendChild(style);
    
    // Proteger contra console debugging
    if (typeof console !== 'undefined') {
        const noop = function() {};
        // Solo bloquear en producción (no en localhost)
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            ['log', 'debug', 'info', 'warn', 'error'].forEach(method => {
                if (typeof console[method] === 'function') {
                    console[method] = noop;
                }
            });
        }
    }
    
    // Detector de debugger (solo en producción)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        setInterval(function() {
            debugger; // Si DevTools está abierto, esto pausa la ejecución
        }, 1000);
    }
    
    // Método 1: Detectar por tamaño de ventana
    const detectDevToolsBySize = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        return widthThreshold || heightThreshold;
    };
    
    // Método 3: Console.log monitoreo
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            devtoolsOpen = true;
            redirectToWarning();
        }
    });
    
    // Verificación continua (solo en producción)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        setInterval(() => {
            if (detectDevToolsBySize()) {
                devtoolsOpen = true;
                redirectToWarning();
            }
            console.log(element);
            console.clear();
        }, 2000);
    }
    
    // Redirigir si DevTools abierto
    function redirectToWarning() {
        if (devtoolsOpen && !window.location.href.includes('warning.html')) {
            document.body.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100vh; 
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; 
                            font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <div>
                        <h1 style="font-size: 3em; margin-bottom: 20px;">⛔ Acceso Bloqueado</h1>
                        <p style="font-size: 1.3em; margin-bottom: 30px;">
                            Las herramientas de desarrollo están deshabilitadas<br>por razones de seguridad.
                        </p>
                        <button onclick="location.reload()" 
                                style="background: white; color: #667eea; padding: 15px 40px; 
                                       border: none; border-radius: 30px; font-size: 1.1em; 
                                       font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                            Recargar Página
                        </button>
                    </div>
                </div>
            `;
        }
    }
    
    // Desactivar console.log en producción
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        console.log = function() {};
        console.warn = function() {};
        console.error = function() {};
        console.info = function() {};
        console.debug = function() {};
    }
    
    // Proteger contra view-source
    if (window.location.protocol === 'view-source:') {
        window.location = window.location.href.replace('view-source:', '');
    } (solo en producción)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        setInterval(() => {
            document.querySelectorAll('*').forEach(el => {
                if (el.hasAttribute('data-reactid') || 
                    el.hasAttribute('data-react-root') ||
                    el.hasAttribute('ng-version')) {
                    el.removeAttribute('data-reactid');
                    el.removeAttribute('data-react-root');
                    el.removeAttribute('ng-version');
                }
            });
        }, 3000);
    }
        });
    }, 2000);
    
    // Mensaje de advertencia para intentos de inspección
    window.addEventListener('devtoolschange', event => {
        if (event.detail.isOpen) {
            alert('⚠️ ADVERTENCIA: El uso no autorizado de herramientas de desarrollo puede violar los términos de servicio.');
        }
    });
    
})();

// Trampa adicional
if (typeof document.attachEvent === 'undefined') {
    (function() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = 'debugger;';
        document.head.appendChild(script);
    })();
}
