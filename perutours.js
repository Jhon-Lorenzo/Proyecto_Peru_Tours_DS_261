// perutours.js - Lógica del Sistema Web Agencia Perú TOURS

// ==================== DATOS EN MEMORIA ====================
let socios = [
    {
        id: 1,
        nombres: 'Juan Carlos',
        apellidos: 'García López',
        dni: '45678912',
        email: 'juan@mail.com',
        telefono: '987654321',
        direccion: 'Av. Arequipa 1234, Lima',
        password: '123456'
    }
];

let solicitudes = [
    {
        id: 1,
        socioId: 1,
        destino: 'Cusco - Machu Picchu',
        numPersonas: 2,
        fechaPartida: '2026-05-15',
        horaPartida: '08:00',
        ciudadPartida: 'Lima',
        fechaRegreso: '2026-05-18',
        horaRegreso: '20:00',
        estado: 'Pendiente',
        fechaRegistro: '2026-04-10'
    },
    {
        id: 2,
        socioId: 1,
        destino: 'Nazca - Líneas de Nazca',
        numPersonas: 4,
        fechaPartida: '2026-06-01',
        horaPartida: '06:00',
        ciudadPartida: 'Lima',
        fechaRegreso: '2026-06-03',
        horaRegreso: '22:00',
        estado: 'Cotizado',
        fechaRegistro: '2026-04-12'
    }
];

let socioActual = null;
let nextSocioId = 2;
let nextSolicitudId = 3;

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
    if (screenId === 'landing' || screenId === 'login' || screenId === 'registro') {
        nav.classList.add('hidden');
    } else {
        nav.classList.remove('hidden');
    }

    // Mostrar/ocultar info de usuario
    const userInfo = document.getElementById('userInfo');
    if (socioActual && screenId !== 'landing' && screenId !== 'login' && screenId !== 'registro') {
        userInfo.textContent = socioActual.nombres + ' ' + socioActual.apellidos;
        userInfo.classList.remove('hidden');
    } else {
        userInfo.classList.add('hidden');
    }

    // Actualizar link activo en nav
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(l => {
        l.classList.remove('active');
        const onclick = l.getAttribute('onclick');
        if (onclick && onclick.includes(screenId)) {
            l.classList.add('active');
        }
    });

    // Resetear formulario multi-step si es registro
    if (screenId === 'registro') {
        showStep(1);
    }

    // Cargar tabla si es mis-solicitudes
    if (screenId === 'mis-solicitudes') {
        cargarTablaSolicitudes();
    }

    // Limpiar alertas
    document.querySelectorAll('.alert').forEach(a => a.remove());
}

// ==================== MULTI-STEP REGISTRO ====================
function showStep(stepNumber) {
    const step1Header = document.getElementById('step1-header');
    const step2Header = document.getElementById('step2-header');
    const step1Content = document.getElementById('step1-content');
    const step2Content = document.getElementById('step2-content');

    if (stepNumber === 1) {
        step1Header.classList.add('active');
        step2Header.classList.remove('active');
        step1Content.classList.remove('hidden');
        step2Content.classList.add('hidden');
    } else {
        step1Header.classList.add('active');
        step2Header.classList.add('active');
        step1Content.classList.add('hidden');
        step2Content.classList.remove('hidden');
    }
}

// ==================== REGISTRO / AFILIACIÓN ====================
function validarPaso1() {
    const nombres = document.getElementById('reg-nombres').value.trim();
    const apellidos = document.getElementById('reg-apellidos').value.trim();
    const dni = document.getElementById('reg-dni').value.trim();
    const telefono = document.getElementById('reg-telefono').value.trim();
    const direccion = document.getElementById('reg-direccion').value.trim();

    if (!nombres || !apellidos || !dni || !telefono || !direccion) {
        mostrarAlerta('step1-content', 'Todos los campos son obligatorios.', 'error');
        return;
    }

    if (dni.length !== 8 || isNaN(dni)) {
        mostrarAlerta('step1-content', 'El DNI debe tener 8 dígitos numéricos.', 'error');
        return;
    }

    // Verificar DNI duplicado
    if (socios.some(s => s.dni === dni)) {
        mostrarAlerta('step1-content', 'Ya existe un socio registrado con ese DNI.', 'error');
        return;
    }

    showStep(2);
}

function registrarSocio() {
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const password2 = document.getElementById('reg-password2').value.trim();
    const aceptaTerminos = document.getElementById('accept-terms').checked;

    if (!email || !password || !password2) {
        mostrarAlerta('step2-content', 'Todos los campos son obligatorios.', 'error');
        return;
    }

    if (password !== password2) {
        mostrarAlerta('step2-content', 'Las contraseñas no coinciden.', 'error');
        return;
    }

    if (password.length < 6) {
        mostrarAlerta('step2-content', 'La contraseña debe tener al menos 6 caracteres.', 'error');
        return;
    }

    if (!aceptaTerminos) {
        mostrarAlerta('step2-content', 'Debe aceptar los términos y condiciones.', 'error');
        return;
    }

    // Crear socio
    const nuevoSocio = {
        id: nextSocioId++,
        nombres: document.getElementById('reg-nombres').value.trim(),
        apellidos: document.getElementById('reg-apellidos').value.trim(),
        dni: document.getElementById('reg-dni').value.trim(),
        email: email,
        telefono: document.getElementById('reg-telefono').value.trim(),
        direccion: document.getElementById('reg-direccion').value.trim(),
        password: password
    };

    socios.push(nuevoSocio);

    // Limpiar formulario
    document.getElementById('form-registro').reset();

    alert('¡Registro exitoso! Ahora puede iniciar sesión.');
    showScreen('login');
}

// ==================== LOGIN ====================
function iniciarSesion() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        mostrarAlerta('screen-login', 'Ingrese email y contraseña.', 'error');
        return;
    }

    const socio = socios.find(s => s.email === email && s.password === password);

    if (!socio) {
        mostrarAlerta('screen-login', 'Credenciales incorrectas. Intente nuevamente.', 'error');
        return;
    }

    socioActual = socio;
    document.getElementById('form-login').reset();
    showScreen('dashboard');
}

function cerrarSesion() {
    socioActual = null;
    showScreen('landing');
}

// ==================== SOLICITUD DE PAQUETE ====================
function registrarSolicitud() {
    const destino = document.getElementById('sol-destino').value;
    const numPersonas = document.getElementById('sol-personas').value;
    const fechaPartida = document.getElementById('sol-fecha-partida').value;
    const horaPartida = document.getElementById('sol-hora-partida').value;
    const ciudadPartida = document.getElementById('sol-ciudad-partida').value.trim();
    const fechaRegreso = document.getElementById('sol-fecha-regreso').value;
    const horaRegreso = document.getElementById('sol-hora-regreso').value;

    if (!destino || !numPersonas || !fechaPartida || !horaPartida || !ciudadPartida || !fechaRegreso || !horaRegreso) {
        mostrarAlerta('screen-solicitud', 'Todos los campos son obligatorios.', 'error');
        return;
    }

    if (numPersonas < 1) {
        mostrarAlerta('screen-solicitud', 'El número de personas debe ser al menos 1.', 'error');
        return;
    }

    if (fechaRegreso <= fechaPartida) {
        mostrarAlerta('screen-solicitud', 'La fecha de regreso debe ser posterior a la de partida.', 'error');
        return;
    }

    const nuevaSolicitud = {
        id: nextSolicitudId++,
        socioId: socioActual.id,
        destino: destino,
        numPersonas: parseInt(numPersonas),
        fechaPartida: fechaPartida,
        horaPartida: horaPartida,
        ciudadPartida: ciudadPartida,
        fechaRegreso: fechaRegreso,
        horaRegreso: horaRegreso,
        estado: 'Pendiente',
        fechaRegistro: new Date().toISOString().split('T')[0]
    };

    solicitudes.push(nuevaSolicitud);
    document.getElementById('form-solicitud').reset();
    alert('Solicitud de paquete turístico registrada exitosamente.');
    showScreen('mis-solicitudes');
}

// ==================== TABLA DE SOLICITUDES ====================
function cargarTablaSolicitudes() {
    const tbody = document.getElementById('tabla-solicitudes-body');
    if (!tbody || !socioActual) return;

    const misSolicitudes = solicitudes.filter(s => s.socioId === socioActual.id);

    if (misSolicitudes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No tiene solicitudes registradas.</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    misSolicitudes.forEach(sol => {
        const badgeClass = sol.estado === 'Pendiente' ? 'badge-pendiente' :
                          sol.estado === 'Cotizado' ? 'badge-cotizado' : 'badge-aceptado';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${sol.id}</td>
            <td>${sol.destino}</td>
            <td>${sol.numPersonas}</td>
            <td>${sol.fechaPartida}</td>
            <td>${sol.ciudadPartida}</td>
            <td>${sol.fechaRegreso}</td>
            <td><span class="badge ${badgeClass}">${sol.estado}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// ==================== MODAL ====================
function openModal() {
    document.getElementById('termsModal').classList.add('active');
}

function closeModal() {
    document.getElementById('termsModal').classList.remove('active');
}

function acceptTerms() {
    document.getElementById('accept-terms').checked = true;
    closeModal();
}

function declineTerms() {
    document.getElementById('accept-terms').checked = false;
    closeModal();
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('termsModal');
    if (event.target === modal) {
        closeModal();
    }
};

// ==================== UTILIDADES ====================
function mostrarAlerta(containerId, mensaje, tipo) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Eliminar alertas anteriores en este container
    container.querySelectorAll('.alert').forEach(a => a.remove());

    const alert = document.createElement('div');
    alert.className = 'alert alert-' + tipo;
    alert.textContent = mensaje;

    container.insertBefore(alert, container.firstChild);

    // Auto-remover después de 4 segundos
    setTimeout(() => alert.remove(), 4000);
}

// ==================== INICIALIZACIÓN ====================
window.onload = () => {
    showScreen('landing');
};
