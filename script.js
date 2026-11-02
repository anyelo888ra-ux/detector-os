const logsData = [
    "[INFO] Verificando cabeceras HTTP del navegador...",
    "[INFO] Extrayendo cadena completa del User Agent...",
    "[INFO] Leyendo propiedades de visualización física (Pantalla)...",
    "[INFO] Consultando asignación de memoria RAM al Sandbox...",
    "[INFO] Detectando hilos lógicos del procesador...",
    "[INFO] Interrogando registros gráficos de WebGL...",
    "[SUCCESS] Rompiendo capas de camuflaje visual...",
    "[OK] Análisis completado con éxito."
];

function iniciarEscaneo() {
    // Asegurar estados iniciales al comenzar o reiniciar
    const logsContainer = document.getElementById("terminal-logs");
    logsContainer.innerHTML = ""; // Limpiar líneas previas si es un re-escaneo
    
    document.getElementById("result-box").classList.add("hidden");
    document.getElementById("rescan-btn").classList.add("hidden");
    
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
            logsContainer.scrollTop = logsContainer.scrollHeight; // Auto-scroll
            logIndex++;
            setTimeout(agregarLog, 450); // Velocidad óptima de escaneo
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
    let esSospechoso = false;
    let esVM = "Máquina Real / Aceleración ANGLE";

    // 1. Detección de Arquitectura
    const composicion64 = ["x86_64", "win64", "wow64", "x64", "macintel", "linux x86_64"];
    const es64Bit = composicion64.some(term => ua.toLowerCase().includes(term) || platform.includes(term));
    
    if (es64Bit) {
        bits = "64-bit (x64)";
    } else if (ua.toLowerCase().includes("arm64") || ua.toLowerCase().includes("aarch64")) {
        bits = "ARM 64-bit";
    }

    // 2. Extracción de Rendimiento de Monitor y Hardware
    const anchoPantalla = screen.width;
    const altoPantalla = screen.height;
    const relacionAspecto = `${anchoPantalla}x${altoPantalla} píxeles`;
    
    // Obtener RAM aproximada (devuelve valores como 2, 4, 8 gigas)
    const ramAproximada = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "No disponible / Bloqueado por privacidad";
    
    // Obtener núcleos de CPU lógicos
    const nucleosProcesador = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Hilos` : "No disponible";

    // 3. Escaneo de WebGL
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

    // 4. Evaluar Sistema Operativo Real
    if (ua.includes("Win")) {
        osName = "Windows";
        if (ua.includes("Windows NT 10.0")) osModel = "Windows 10 / Tiny10";
        else if (ua.includes("Windows NT 6.1")) osModel = "Windows 7";
        else if (ua.includes("Windows NT 5.1")) osModel = "Windows XP";
        else osModel = "Versión Personalizada de Windows";
    } 
    else if (ua.includes("Linux") || platform.includes("linux")) {
        osName = "Linux";
        if (ua.includes("Ubuntu")) osModel = "Ubuntu Linux";
        else if (ua.includes("Mint")) osModel = "Linux Mint";
        else if (ua.includes("Arch")) osModel = "Arch Linux";
        else osModel = "Distribución Base Linux";
    }

    // 5. Inyectar datos en el HTML
    document.getElementById("os-name").innerText = osName;
    document.getElementById("os-model").innerText = osModel;
    document.getElementById("os-bits").innerText = bits;
    document.getElementById("os-platform").innerText = navigator.platform || "No disponible";
    document.getElementById("os-vm").innerText = esVM;
    document.getElementById("os-screen").innerText = relacionAspecto;
    document.getElementById("os-ram").innerText = ramAproximada;
    document.getElementById("os-cores").innerText = nucleosProcesador;
    document.getElementById("os-ua").innerText = ua;

    // Desocultar cuadro de resultados y el botón de reescaneo
    document.getElementById("result-box").classList.remove("hidden");
    document.getElementById("rescan-btn").classList.remove("hidden");
}

// Escuchar el evento de clic en el botón de Rescan
document.getElementById("rescan-btn").addEventListener("click", iniciarEscaneo);

// Arrancar automáticamente en la carga inicial
window.onload = iniciarEscaneo;
