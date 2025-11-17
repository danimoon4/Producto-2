//  datos.js - CAPA DE DATOS
// Contiene todos los datos de la aplicación

//ARRAY DE USUARIOS

export let usuarios = [
    { id: 1, nombre: 'LAURA', email: 'L@A.U', password: '123' },
    { id: 2, nombre: 'MARCOS', email: 'M@R.C', password: '123' },
    { id: 3, nombre: 'SONIA', email: 'S@O.N', password: '123' }
];

// ==========================================
// 🤝 ARRAY DE VOLUNTARIADOS
// ==========================================
export let voluntariados = [
    {
        id: 1,
        titulo: 'OFREZCO MEDICINA',
        tipo: 'oferta',
        descripcion: 'SUPLEMENTOS VITAMÍNICOS PARA ANIMALES ENFERMOS.',
        fecha: '24/10/2025',
        usuario: 'LAURA'
    },
    {
        id: 2,
        titulo: 'NECESITO REFUGIO',
        tipo: 'peticion',
        descripcion: 'SE DAN EN ADOPCIÓN 4 GATITOS',
        fecha: '27/10/2025',
        usuario: 'MARCOS'
    },
    {
        id: 3,
        titulo: 'NECESITO VEHÍCULO',
        tipo: 'peticion',
        descripcion: 'NECESITO UN VEHÍCULO PARA TRASLADAR UN CABALLO',
        fecha: '28/10/2025',
        usuario: 'SONIA'
    }
];

// ==========================================
// 🔧 FUNCIONES AUXILIARES
// ==========================================

// Función para obtener nuevo ID
export function obtenerNuevoId(array) {
    if (array.length === 0) return 1;
    return Math.max(...array.map(item => item.id)) + 1;
}

// ==========================================
// 👥 FUNCIONES DE USUARIOS
// ==========================================

// Agregar usuario
export function agregarUsuario(nombre, email, password) {
    const nuevoId = obtenerNuevoId(usuarios);
    const nuevoUsuario = {
        id: nuevoId,
        nombre: nombre.toUpperCase(),
        email: email,
        password: password
    };
    usuarios.push(nuevoUsuario);
    return nuevoUsuario;
}

// Eliminar usuario
export function eliminarUsuario(id) {
    const indice = usuarios.findIndex(u => u.id === id);
    if (indice !== -1) {
        usuarios.splice(indice, 1);
        return true;
    }
    return false;
}


// 1. IA: Claude - Prompt: "Crea estructura de datos en JavaScript con arrays de objetos para usuarios con propiedades id, nombre, email y password, usando export para módulos ES6"
// 
// 2. IA: Claude - Prompt: "Necesito un array de voluntariados con objetos que tengan id, titulo, tipo (oferta o peticion), descripcion, fecha y usuario, exportado como módulo"
// 
// 3. IA: Claude - Prompt: "Función JavaScript que calcule automáticamente el siguiente ID disponible en un array de objetos, manejando arrays vacíos"
// 4. IA: Claude - Prompt: "Sintaxis correcta de export const en JavaScript ES6 para exportar múltiples variables y funciones desde un módulo"
