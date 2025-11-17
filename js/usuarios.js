//S LÓGICA DE GESTIÓN DE USUARIOS

// Lee y modifica datos de datos.js

// Importamos los datos desde datos.js
import { usuarios, agregarUsuario, obtenerNuevoId } from '../js/almacenaje';

// REFERENCIAS A ELEMENTOS DEL DOM

const formulario = document.getElementById('formUsuario');
const tbody = document.getElementById('tablaUsuarios');

//  FUNCIÓN: Renderizar tabla de usuarios

function cargarTablaUsuarios() {
    tbody.innerHTML = ''; // Limpiar tabla antes de cargar
    
    // Recorrer array y crear una fila por cada usuario
    usuarios.forEach((usuario, index) => {
        const fila = document.createElement('tr');
        fila.className = 'text-center';
        
        fila.innerHTML = `
            <td class="fw-bold">${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${usuario.password}</td>
            <td>
                <button class="btn btn-danger btn-sm" data-index="${index}">
                    BORRAR
                </button>
            </td>
        `;
        
        tbody.appendChild(fila);
    });

    // Añadir eventos a los botones de borrar
    const botonesBorrar = tbody.querySelectorAll('.btn-danger');
    botonesBorrar.forEach(boton => {
        boton.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            borrarUsuario(index);
        });
    });
}

//  FUNCIÓN: Borrar usuario

function borrarUsuario(index) {
    // Eliminar del array
    usuarios.splice(index, 1);
    
    // Recargar tabla
    cargarTablaUsuarios();
}

//  FUNCIÓN: Alta de usuario

function altaUsuario(event) {
    event.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Crear nuevo objeto usuario
    const nuevoUsuario = {
        id: obtenerNuevoId(usuarios),
        nombre: nombre.toUpperCase(),
        email: email,
        password: password
    };
    
    // Añadir al array
    usuarios.push(nuevoUsuario);
    
    // Recargar tabla
    cargarTablaUsuarios();
    
    // Limpiar formulario
    formulario.reset();
    
    console.log(`Usuario ${nombre} agregado. Total: ${usuarios.length}`);
}

//INICIALIZACIÓN AL CARGAR LA PÁGINA

document.addEventListener('DOMContentLoaded', function() {
    // Cargar tabla inicial con los datos de datos.js
    cargarTablaUsuarios();
    
    // Registrar evento del formulario
    formulario.addEventListener('submit', altaUsuario);
    
    console.log('Página cargada - Mostrando', usuarios.length, 'usuarios');
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

