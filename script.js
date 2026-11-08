const logsData = [
    "[INFO] Verificando cabeceras HTTP del navegador...",
    "[INFO] Extrayendo cadena completa del User Agent...",
    "[INFO] Leyendo propiedades de visualización física (Pantalla)...",
    "[INFO] Consultando asignación de memoria RAM al Sandbox...",
    "[INFO] Detectando hilos lógicos del procesador...",
    "[INFO] Interrogando registros gráficos de WebGL...",
    "[INFO] Analizando políticas de privacidad y anti-fingerprinting...",
    "[SUCCESS] Rompiendo capas de camuflaje visual...",
    "[OK] Análisis completado con éxito."
];

function iniciarEscaneo() {
    const logsContainer = document.getElementById("terminal-logs");
    logsContainer.innerHTML = ""; 
    
    document.getElementById("result-box").classList.add("hidden");
    document.getElementById("rescan-btn").classList.add("hidden");
    document.getElementById("privacy-warning").classList.add("hidden");
    
    let logIndex = 0;

    function agregarLog() {
        if (logIndex < logsData.length) {
            const p = document.createElement("p");
            p.className = "log";
            p.innerText = logsData[logIndex];
            
            if (logsData[logIndex].includes("SUCCESS") || logsData[logIndex].includes("OK")) {
                p.style.color = "#22c55e";
            }
            
            logsContainer.appendChild(p);
            logsContainer.scrollTop = logsContainer.scrollHeight; 
            logIndex++;
            setTimeout(agregarLog, 350); 
        } else {
            procesarDeteccionFinal();
        }
    }

    setTimeout(agregarLog, 200);
}

function procesarDeteccionFinal() {
    const ua = navigator.userAgent;
    const platform = (navigator.platform || '').toLowerCase();
    
    let osName = "Desconocido";
    let osModel = "Genérico / No especificado";
    let bits = "32-bit (x86)"; 
    let esVM = "Máquina Real / Aceleración ANGLE";

    // 1. Arquitectura
    const composicion64 = ["x86_64", "win64", "wow64", "x64", "macintel", "linux x86_64"];
    const es64Bit = composicion64.some(term => ua.toLowerCase().includes(term) || platform.includes(term));
    
    if (es64Bit) {
        bits = "64-bit (x64)";
    } else if (ua.toLowerCase().includes("arm64") || ua.toLowerCase().includes("aarch64")) {
        bits = "ARM 64-bit";
    }

    // 2. Hardware y Pantalla
    const anchoPantalla = screen.width;
    const altoPantalla = screen.height;
    const relacionAspecto = `${anchoPantalla}x${altoPantalla} píxeles`;
    
    const ramBloqueada = !navigator.deviceMemory;
    const ramAproximada = ramBloqueada ? "No disponible / Bloqueado por privacidad" : `${navigator.deviceMemory} GB`;
    const nucleosProcesador = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Hilos` : "No disponible";

    // 3. Nuevas métricas: Tema y Red
    const esDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const temaSistema = esDarkMode ? "Modo Oscuro (Dark)" : "Modo Claro (Light)";

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    let tipoRed = "No especificado / Oculto";
    if (connection) {
        tipoRed = `${connection.effectiveType ? connection.effectiveType.toUpperCase() : 'Estándar'} (${connection.downlink ? connection.downlink + ' Mbps aprox.' : 'Velocidad oculta'})`;
    }

    // 4. WebGL VM Check
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
                const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL).toLowerCase();
                
                if (renderer.includes("vmware") || vendor.includes("vmware") || 
                    renderer.includes("virtualbox") || renderer.includes("swiftshader") ||
                    renderer.includes("llvmpipe")) {
                    esVM = "Sí (Máquina Virtual Detectada)";
                }
            }
        }
    } catch (e) {
        esVM = "Protegido / No determinado";
    }

    // 5. OS Real
    if (ua.includes("Win")) {
        osName = "Windows";
        if (ua.includes("Windows NT 10.0")) osModel = "Windows 10 / 11 (Tiny10/Pro)";
        else if (ua.includes("Windows NT 6.1")) osModel = "Windows 7";
        else osModel = "Versión Personalizada de Windows";
    } else if (ua.includes("Linux") || platform.includes("linux")) {
        osName = "Linux";
        if (ua.includes("Ubuntu")) osModel = "Ubuntu Linux";
        else if (ua.includes("Mint")) osModel = "Linux Mint";
        else if (ua.includes("Arch")) osModel = "Arch Linux";
        else osModel = "Distribución Base Linux";
    } else if (ua.includes("Mac") || platform.includes("mac")) {
        osName = "macOS";
        osModel = "Apple Macintosh";
    }

    // 6. Inyectar en HTML
    document.getElementById("os-name").innerText = osName;
    document.getElementById("os-model").innerText = osModel;
    document.getElementById("os-bits").innerText = bits;
    document.getElementById("os-platform").innerText = navigator.platform || "No disponible";
    document.getElementById("os-vm").innerText = esVM;
    document.getElementById("os-screen").innerText = relacionAspecto;
    document.getElementById("os-ram").innerText = ramAproximada;
    document.getElementById("os-cores").innerText = nucleosProcesador;
    document.getElementById("os-theme").innerText = temaSistema;
    document.getElementById("os-network").innerText = tipoRed;
    document.getElementById("os-ua").innerText = ua;

    // Mostrar elementos finales
    document.getElementById("result-box").classList.remove("hidden");
    document.getElementById("rescan-btn").classList.remove("hidden");

    // Si la RAM está bloqueada (como en tu Firefox), mostramos la caja de tutoriales de privacidad
    if (ramBloqueada) {
        document.getElementById("privacy-warning").classList.remove("hidden");
    }
}

// Función para abrir/cerrar los tutoriales de los navegadores
function toggleTutorial(navegador) {
    const firefoxBox = document.getElementById("tut-firefox");
    const chromeBox = document.getElementById("tut-chrome");
    
    if (navegador === 'firefox') {
        firefoxBox.classList.toggle("hidden");
        chromeBox.classList.add("hidden");
    } else {
        chromeBox.classList.toggle("hidden");
        firefoxBox.classList.add("hidden");
    }
}

document.getElementById("rescan-btn").addEventListener("click", iniciarEscaneo);
window.onload = iniciarEscaneo;