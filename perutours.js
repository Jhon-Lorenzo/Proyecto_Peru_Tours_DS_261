// perutours.js - Lógica del Sistema Web Agencia Perú TOURS - FASE 1

let socioActual = null;

// ==================== NAVEGACIÓN ====================
function showScreen(screenId) {
    // Ocultar todas las pantallas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));

    // Mostrar la pantalla solicitada
    const target = document.getElementById('screen-' + screenId);
    if (target) {
        target.classList.add('active');
    }

    // Mostrar/ocultar nav según pantalla
    const nav = document.getElementById('appNav');
    if (screenId === 'landing') {
        nav.classList.add('hidden');
    } else {
        nav.classList.remove('hidden');
    }
}

// ==================== INICIALIZACIÓN ====================
window.onload = () => {
    showScreen('landing');
};
