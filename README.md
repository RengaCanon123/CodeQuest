# CodeQuest
CodeQuest es una aplicación web interactiva (Single-Page Application) orientada a la evaluación y el aprendizaje activo de lenguajes de programación. Diseñada bajo una identidad visual pastel, la plataforma desafía a los usuarios a reconocer patrones de sintaxis, estructuras y paradigmas en fragmentos de código de más de 15 lenguajes.
El proyecto demuestra cómo construir una experiencia de usuario (UX) rica, rápida y gamificada utilizando únicamente estándares web nativos, sin depender de frameworks ni arquitecturas backend.

El Juego: Experiencia & Mecánicas
4 Modos de Juego Adaptativos:
•Clásico: Evaluación sin restricciones de tiempo para aprendizaje progresivo.
•Contrarreloj: Sesión dinámica de 60 segundos con bonificaciones de tiempo por aciertos.
•Supervivencia: Modalidad de alta exigencia con sistema de 3 vidas.
•Modo Experto: Enmascaramiento dinámico de palabras clave, obligando a deducir el lenguaje según la estructura y los operadores.

Progresión Gamificada: Sistema de puntos de experiencia (XP), niveles escalonados, cálculo de racha máxima (streak) y árbol de logros desbloqueables.
Enciclopedia Interactiva: Módulo de aprendizaje detallado con historia, creadores, casos de uso principales y curiosidades de cada lenguaje.

Detalles Técnicos & Arquitectura
1. Arquitectura Frontend (Vanilla JS ES6+)
Patrón Modular Orientado a Objetos: La lógica está estructurada en un controlador principal (CodeQuestApp) que administra el ciclo de vida del juego, el procesamiento de eventos y la renderización en el DOM sin necesidad de librerías de estado.
Manejo de Estado Unidireccional: Despliegue de vistas Single-Page activadas dinámicamente mediante manipulación eficiente de clases CSS (.active), reduciendo la sobrecarga de re-renderizado.
2. Persistencia Client-Side sin Backend
Integración con LocalStorage: Sincronización automática del perfil del usuario, métricas globales (partidas, precisión, aciertos/errores), configuración de preferencia y estados de logros.
Privacidad y Cero Latencia: Toda la lógica de datos se procesa de forma local en el navegador, garantizando disponibilidad inmediata e independencia de bases de datos externas.
3. Integración de APIs Nativas del Navegador
Sintetizador de Audio Retro (Web Audio API): Generación de retroalimentación sonora mediante osciladores de ondas (sine, triangle, sawtooth) en frecuencias controladas dinámicamente, eliminando la necesidad de cargar archivos de audio .mp3 pesados.
Efectos Visuales Renderizados (HTML5 Canvas): Sistema de partículas para confeti pixelado calculado e insertado en tiempo real en la capa gráfica del navegador mediante requestAnimationFrame.
Mapeo de Eventos Globales (Keybindings): Registro de listeners de teclado para responder asociando las teclas 1, 2, 3 y 4.
4. Accesibilidad y Maquetación Responsive
CSS Grid & Flexbox Fluidos: Adaptación de interfaces de alta densidad de información (como la vista de la enciclopedia) utilizando media queries que transforman diseños multicolumna en vistas verticales adaptadas a smartphones.
Resaltado de Sintaxis Dinámico: Integración ligera con Prism.js para el procesamiento sintáctico e iluminación del código en vivo dentro de la ventana de simulación IDE.
