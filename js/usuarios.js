// ===============================================
// MÓDULO INT_4_USUARIOS.JS (Producto 2)
// Lógica de Gestión de Usuarios - CRUD con LocalStorage (Persistencia)
// ===============================================

import { 
    obtenerTodosUsuariosLS,    // OBTENER: Obtiene todos los usuarios persistidos de LocalStorage
    guardarUsuarioLS,          // ALTA: Guarda un nuevo usuario en LocalStorage
    eliminarUsuarioLS,         // BAJA: Elimina un usuario de LocalStorage
    obtenerUsuarioActivo       // SESIÓN: Obtiene el usuario logueado para mostrar en navbar
} from './almacenaje.js'; 

// 1. REFERENCIAS A ELEMENTOS DEL DOM
const formulario = document.getElementById('formulario-alta-usuario');
const tablaCuerpo = document.getElementById('tabla-cuerpo-usuarios');
// ID usado en la navbar de gestiondeUsuarios.html
const usuarioActivoSpan = document.getElementById('usuarioActivo'); 

/**
 * Muestra el nombre del usuario activo en la barra de navegación.
 */
function mostrarUsuarioActivoNav() {
    const usuario = obtenerUsuarioActivo(); // Obtiene el objeto usuario del localStorage
    if (usuario) {
        usuarioActivoSpan.textContent = usuario.nombre;
    } else {
        usuarioActivoSpan.textContent = '-NO LOGIN-';
    }
}

/**
 * Función que actualiza el contenido de la tabla de usuarios.
 */
function renderizarTabla() {
    tablaCuerpo.innerHTML = ''; 
    
    // Obtener los usuarios de LocalStorage (Persistidos)
    const usuarios = obtenerTodosUsuariosLS(); 
    
    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        fila.className = 'text-center';
        
        fila.innerHTML = `
            <td class="fw-bold">${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${usuario.password}</td>
            <td>
                <!-- Usamos data-id para identificar al usuario por su ID único -->
                <button class="btn btn-danger btn-sm" data-id="${usuario.id}">
                    BORRAR
                </button>
            </td>
        `;
        tablaCuerpo.appendChild(fila);
    });
    
    // Asignar eventos de baja después de renderizar
    document.querySelectorAll('.btn-danger').forEach(button => {
        button.addEventListener('click', (e) => {
            const idUsuario = parseInt(e.target.dataset.id); 
            gestionarBajaUsuario(idUsuario);
        });
    });
}

/**
 * Lógica para manejar el ALTA de un usuario (cuando se pulsa 'DAR DE ALTA')
 */
formulario.addEventListener('submit', function(e) {
    e.preventDefault(); 

    const nombre = document.getElementById('nombreUsuario').value;
    const email = document.getElementById('emailUsuario').value;
    const password = document.getElementById('passwordUsuario').value;

    // Llama a la función de almacenaje para guardar en LocalStorage (Persistencia)
    guardarUsuarioLS({ nombre, email, password });
    
    // Actualizar la tabla
    renderizarTabla();
    
    // Limpiar el formulario
    formulario.reset();
});


/**
 * Lógica para manejar la BAJA de un usuario (Persistencia)
 */
function gestionarBajaUsuario(id) {
    // Usamos confirm() para la interacción requerida
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario con ID ${id}?`)) {
        // Llama a la función de almacenaje para eliminar de LocalStorage
        const exito = eliminarUsuarioLS(id);

        if (exito) {
            renderizarTabla();
        } else {
            alert(`Error: No se encontró el usuario con ID ${id}.`);
        }
    }
}

// 4. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    // Muestra el estado del login en la navbar
    mostrarUsuarioActivoNav(); 
    // Carga los usuarios desde LocalStorage (Persistencia)
    renderizarTabla(); 
});

// ============================================
// ⭐ PROMPTS DE IA GENERATIVA UTILIZADOS:
// ============================================
// 1. IA: Claude - Prompt: "Cómo importar variables y funciones de otro archivo JavaScript usando import y export en módulos ES6"
// 
// 2. IA: Claude - Prompt: "Cómo recorrer un array de objetos con forEach y crear filas de tabla HTML dinámicamente con createElement"
// 
// 3. IA: Claude - Prompt: "Cómo añadir eventos click a múltiples botones generados dinámicamente usando querySelectorAll y addEventListener"
// 
// 4. IA: Claude - Prompt: "Cómo capturar el evento submit de un formulario con preventDefault y obtener valores de inputs por id"
// 
// 5. IA: Claude - Prompt: "Cómo usar data attributes en HTML y leerlos desde JavaScript con getAttribute o dataset"
// 
// 6. IA: Claude - Prompt: "Cómo eliminar elementos de un array por índice usando splice en JavaScript"

