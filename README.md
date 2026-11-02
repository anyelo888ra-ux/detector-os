# 🖥️ Detector de OS Real e Inspección de Hardware

Una aplicación web interactiva diseñada para realizar un análisis profundo del entorno del navegador del usuario. El script analiza las variables de entorno para desenmascarar sistemas operativos clonados o modificados que intentan camuflarse como Windows, exponiendo la verdadera identidad de la plataforma.

## 🚀 Características del Proyecto
* **Secuencia de Inicialización:** Terminal simulada interactiva que procesa los registros de escaneo línea por línea.
* **Detección Avanzada de OS:** Identifica Windows (incluyendo entornos optimizados como Tiny10), distribuciones populares de Linux (Ubuntu, Arch, Mint, Debian, Fedora) y macOS/Android/iOS.
* **Inspección Cruzada de Arquitectura:** Discierne con precisión entre plataformas de `64-bit (x64)`, `32-bit (x86)` y arquitecturas `ARM`.
* **Extracción de Hardware:** Lee hilos lógicos del procesador (CPU) y la resolución nativa de la pantalla del monitor en tiempo real.
* **Filtro Anticamulaje:** Ejecuta validaciones secundarias para cazar núcleos Linux disfrazados bajo capas de personalización visual de Windows.

## 🛠️ Tecnologías Utilizadas
* **HTML5** - Estructura semántica del panel.
* **CSS3** - Interfaz de usuario responsiva con temática de consola oscura e informática.
* **JavaScript (Vanilla)** - Lógica de interrogación de APIs del navegador (`navigator.userAgent`, `screen`, `WebGL`).

## 💻 Desarrollador
Desarrollado con pasión por **anyelo888ra-ux**.
