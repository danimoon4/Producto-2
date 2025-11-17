
// CONSTANTES GLOBALES
const USUARIOS_KEY = 'usuarios';           
const USUARIO_ACTIVO_KEY = 'usuarioActivo';
const VOLUNTARIADOS_DB = 'VoluntariadosDB';
const VOLUNTARIADOS_STORE = 'voluntariados';
const SELECCION_STORE = 'seleccion';


// SECCIÓN COMÚN - USUARIOS (localStorage)

// Inicializa usuarios de ejemplo 

function inicializarUsuarios() {
    const usuarios = obtenerUsuarios();
    
    if (usuarios.length === 0) {
        const usuariosIniciales = [
            { 
                nombre: 'LAURA',
                email: 'L@A.U',
                password: '123',
                rol: 'usuario'
            },
            { 
                nombre: 'MARCOS',
                email: 'M@R.C',
                password: '123',
                rol: 'usuario'
            },
            { 
                nombre: 'SONIA',
                email: 'S@O.N',
                password: '123',
                rol: 'usuario'
            }
        ];
        
        localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuariosIniciales));
        console.log('[COMÚN] Usuarios iniciales creados');
    }
}

/**
 * COMÚN: Obtiene todos los usuarios
 * @returns {Array} Array de objetos usuario
 */
export function obtenerUsuarios() {
    try {
        const data = localStorage.getItem(USUARIOS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('[COMÚN] Error al obtener usuarios:', error);
        return [];
    }
}

/**
 * COMÚN: Obtiene el usuario actualmente logueado
 * @returns {Object|null} Usuario activo o null
 */
export function obtenerUsuarioActivo() {
    try {
        inicializarUsuarios();
        
        const email = localStorage.getItem(USUARIO_ACTIVO_KEY);
        if (!email) return null;
        
        const usuarios = obtenerUsuarios();
        return usuarios.find(u => u.email === email) || null;
        
    } catch (error) {
        console.error('[COMÚN]  Error al obtener usuario activo:', error);
        return null;
    }
}

/**
 * COMÚN: Crea un nuevo usuario
 * Usado por: Usuarios.html
 * @param {Object} usuario - {nombre, email, password}
 * @returns {Object} {ok: boolean, usuario/error}
 */
export function crearUsuario(usuario) {
    try {
        const usuarios = obtenerUsuarios();
        
        const existe = usuarios.find(u => u.email === usuario.email);
        if (existe) {
            return { ok: false, error: 'El email ya está registrado' };
        }
        
        usuarios.push(usuario);
        localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
        
        console.log('[COMÚN] ✓ Usuario creado:', usuario.email);
        return { ok: true, usuario };
        
    } catch (error) {
        console.error('[COMÚN] Error al crear usuario:', error);
        return { ok: false, error: error.message };
    }
}

/**
 * COMÚN: Borra un usuario por email
 * Usado por: Usuarios.html
 * @param {string} email
 * @returns {Object} {ok: boolean}
 */
export function borrarUsuario(email) {
    try {
        let usuarios = obtenerUsuarios();
        usuarios = usuarios.filter(u => u.email !== email);
        
        localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
        
        console.log('[COMÚN]  Usuario borrado:', email);
        return { ok: true };
        
    } catch (error) {
        console.error('[COMÚN]  Error al borrar usuario:', error);
        return { ok: false, error: error.message };
    }
}

/**
 * COMÚN: Actualiza un usuario existente
 * Usado por: Usuarios.html (futuro)
 * @param {string} email - Email del usuario a actualizar
 * @param {Object} datosNuevos - Nuevos datos
 * @returns {Object} {ok: boolean, usuario/error}
 */
export function actualizarUsuario(email, datosNuevos) {
    try {
        const usuarios = obtenerUsuarios();
        const index = usuarios.findIndex(u => u.email === email);
        
        if (index === -1) {
            return { ok: false, error: 'Usuario no encontrado' };
        }
        
        usuarios[index] = { ...usuarios[index], ...datosNuevos };
        localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
        
        console.log('[COMÚN] Usuario actualizado:', email);
        return { ok: true, usuario: usuarios[index] };
        
    } catch (error) {
        console.error('[COMÚN]  Error al actualizar usuario:', error);
        return { ok: false, error: error.message };
    }
}

/**
 * COMÚN: Autentica un usuario (login)
 * Usado por: Login.html
 * @param {string} email
 * @param {string} password
 * @returns {Object} {ok: boolean, user/error}
 */
export function loguearUsuario(email, password) {
    try {
        inicializarUsuarios();
        
        const usuarios = obtenerUsuarios();
        const usuario = usuarios.find(u => 
            u.email.toLowerCase() === email.toLowerCase().trim()
        );
        
        if (!usuario) {
            return { ok: false, error: 'Usuario no encontrado' };
        }
        
        if (usuario.password !== password) {
            return { ok: false, error: 'Contraseña incorrecta' };
        }
        
        localStorage.setItem(USUARIO_ACTIVO_KEY, usuario.email);
        
        console.log('[COMÚN] Login exitoso:', usuario.nombre);
        return { ok: true, user: usuario };
        
    } catch (error) {
        console.error('[COMÚN]  Error en login:', error);
        return { ok: false, error: error.message };
    }
}

/**
 * COMÚN: Cierra sesión del usuario activo
 * Usado por: Todas las páginas (navbar)
 */
export function cerrarSesion() {
    localStorage.removeItem(USUARIO_ACTIVO_KEY);
    console.log('[COMÚN]  Sesión cerrada');
}

// --------------------------------------------------------------------------
// VARIABLES DE CONFIGURACIÓN
// --------------------------------------------------------------------------

// Datos iniciales para cargar en localStorage la primera vez
const USUARIOS_INICIALES = [
    { id: 1, nombre: "LAURA", email: "L@A.U", password: "123" },
    { id: 2, nombre: "MARCOS", email: "M@R.C", password: "123" },
    { id: 3, nombre: "SONIA", email: "S@O.N", password: "123" }
];

const KEY_USUARIOS = 'usuarios';
const KEY_USUARIO_ACTIVO = 'usuarioActivoEmail';

// Configuración de IndexedDB
const DB_NAME = 'VoluntariadoDB';
const DB_VERSION = 1;
const STORE_VOLUNTARIADOS = 'voluntariados';
let db; // Variable global para la conexión a IndexedDB

// --------------------------------------------------------------------------
// UTILERÍAS
// --------------------------------------------------------------------------

/**
 * Función auxiliar para obtener el siguiente ID único de un array.
 */
function obtenerNuevoId(array) {
    if (array.length === 0) return 1;
    const ids = array.map(item => item.id).filter(id => id !== undefined);
    if (ids.length === 0) return 1;
    return Math.max(...ids) + 1;
}

// --------------------------------------------------------------------------
// GESTIÓN DE USUARIOS (LocalStorage - Persistencia de datos)
// --------------------------------------------------------------------------

/**
 * Inicializa la lista de usuarios en LocalStorage si NO existe.
 * Esto garantiza que los 3 usuarios predeterminados solo se carguen la primera vez.
 */
function inicializarUsuariosLS() {
    if (!localStorage.getItem(KEY_USUARIOS)) { 
        localStorage.setItem(KEY_USUARIOS, JSON.stringify(USUARIOS_INICIALES));
    }
}
inicializarUsuariosLS(); // Ejecutar al inicio del script

/**
 * Obtiene todos los usuarios de LocalStorage.
 */
export function obtenerTodosUsuariosLS() {
    const data = localStorage.getItem(KEY_USUARIOS);
    return data ? JSON.parse(data) : [];
}

/**
 * Guarda un nuevo usuario en LocalStorage (función usada por gestionUsuarios.js).
 */
export function guardarUsuarioLS(usuario) {
    const usuarios = obtenerTodosUsuariosLS();
    const nuevoUsuario = {
        ...usuario,
        id: obtenerNuevoId(usuarios),
        nombre: usuario.nombre.toUpperCase(),
    };
    usuarios.push(nuevoUsuario);
    localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuarios));
    return nuevoUsuario;
}

/**
 * Elimina un usuario de LocalStorage por su ID (función usada por gestionUsuarios.js).
 */
export function eliminarUsuarioLS(id) {
    let usuarios = obtenerTodosUsuariosLS();
    const index = usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
        usuarios.splice(index, 1);
        localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuarios));
        return true;
    }
    return false;
}


// --------------------------------------------------------------------------
// GESTIÓN DE LOGIN Y SESIÓN (LocalStorage - Usuario Activo)
// --------------------------------------------------------------------------

/**
 * Obtiene el email del usuario activo de localStorage.
 */
export function obtenerUsuarioActivoEmail() {
    return localStorage.getItem(KEY_USUARIO_ACTIVO);
}

/**
 * Obtiene el objeto completo del usuario activo (usando el email guardado).
 */
export function obtenerUsuarioActivo() {
    const emailActivo = obtenerUsuarioActivoEmail();
    if (!emailActivo) return null;
    
    const usuarios = obtenerTodosUsuariosLS();
    return usuarios.find(u => u.email === emailActivo);
}

/**
 * Guarda el email del usuario activo en localStorage.
 */
function guardarUsuarioActivo(email) {
    localStorage.setItem(KEY_USUARIO_ACTIVO, email);
}

/**
 * Autentica al usuario y guarda la sesión en localStorage si es exitoso.
 */
export function loguearUsuario(email, password) {
    const usuarios = obtenerTodosUsuariosLS();
    // Normalizar la entrada para hacer la búsqueda
    const normEmail = (email || "").trim().toLowerCase(); 

    const usuario = usuarios.find(u => 
        (u.email || "").trim().toLowerCase() === normEmail && u.password === password
    );
    
    if (usuario) {
        guardarUsuarioActivo(usuario.email); // ¡Persistencia de Sesión!
    }
    return usuario; 
}

/**
 * Cierra la sesión eliminando el usuario activo.
 */
export function cerrarSesion() {
    localStorage.removeItem(KEY_USUARIO_ACTIVO);
}

/**----------------------------------------------------------------------------**/

// SECCIÓN VOLUNTARIADOS (IndexedDB)
// Usado por: Voluntariados.html, Dashboard.html

/**
 * VOLUNTARIADOS: Inicializa la base de datos IndexedDB
 * Crea la estructura de BD la primera vez
 * @returns {Promise<IDBDatabase>}
 */
export function inicializarDB() {
    return new Promise((resolve, reject) => {
        console.log('[VOLUNTARIADOS]  Inicializando IndexedDB...');
        
        const request = indexedDB.open(VOLUNTARIADOS_DB, 1);
        
        request.onerror = () => {
            console.error('[VOLUNTARIADOS]  Error al abrir BD:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            console.log('[VOLUNTARIADOS]  IndexedDB abierta');
            resolve(request.result);
        };
        
        request.onupgradeneeded = (event) => {
            console.log('[VOLUNTARIADOS]  Creando estructura...');
            
            const db = event.target.result;
            
            // Store para voluntariados
            if (!db.objectStoreNames.contains(VOLUNTARIADOS_STORE)) {
                const store = db.createObjectStore(VOLUNTARIADOS_STORE, { 
                    keyPath: 'id',
                    autoIncrement: true
                });
                
                store.createIndex('email', 'email', { unique: false });
                store.createIndex('tipo', 'tipo', { unique: false });
                
                console.log('[VOLUNTARIADOS]  Store "voluntariados" creado');
            }
            
            // Store para selección del dashboard
            if (!db.objectStoreNames.contains(SELECCION_STORE)) {
                db.createObjectStore(SELECCION_STORE, { keyPath: 'id' });
                console.log('[VOLUNTARIADOS] Store "seleccion" creado');
            }
        };
    });
}

/**
 * VOLUNTARIADOS: Crea un nuevo voluntariado
 * Usado por: Voluntariados.html (formulario alta)
 * @param {Object} voluntariado - {titulo, email, fecha, descripcion, tipo}
 * @returns {Promise<Object>} {ok: boolean, id/error}
 */
export async function crearVoluntariado(voluntariado) {
    try {
        console.log('[VOLUNTARIADOS] Creando:', voluntariado.titulo);
        
        const db = await inicializarDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([VOLUNTARIADOS_STORE], 'readwrite');
            const store = transaction.objectStore(VOLUNTARIADOS_STORE);
            const request = store.add(voluntariado);
            
            request.onsuccess = () => {
                console.log('[VOLUNTARIADOS] ✓ Creado con ID:', request.result);
                resolve({ ok: true, id: request.result });
            };
            
            request.onerror = () => {
                console.error('[VOLUNTARIADOS]  Error al crear:', request.error);
                reject(request.error);
            };
        });
        
    } catch (error) {
        console.error('[VOLUNTARIADOS] Error en crearVoluntariado:', error);
        return { ok: false, error: error.message };
    }
}

/**
 * VOLUNTARIADOS: Obtiene todos los voluntariados
 * Usado por: Voluntariados.html (tabla), Dashboard.html (tarjetas)
 * @returns {Promise<Array>} Array de voluntariados
 */
export async function obtenerVoluntariados() {
    try {
        console.log('[VOLUNTARIADOS] Obteniendo todos...');
        
        const db = await inicializarDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([VOLUNTARIADOS_STORE], 'readonly');
            const store = transaction.objectStore(VOLUNTARIADOS_STORE);
            const request = store.getAll();
            
            request.onsuccess = () => {
                console.log('[VOLUNTARIADOS] ✓ Obtenidos:', request.result.length);
                resolve(request.result);
            };
            
            request.onerror = () => {
                console.error('[VOLUNTARIADOS]  Error al obtener:', request.error);
                reject(request.error);
            };
        });
        
    } catch (error) {
        console.error('[VOLUNTARIADOS]  Error en obtenerVoluntariados:', error);
        return [];
    }
}

/**
 * VOLUNTARIADOS: Borra un voluntariado por ID
 * Usado por: Voluntariados.html (botón borrar en tabla)
 * @param {number} id
 * @returns {Promise<Object>} {ok: boolean}
 */
export async function borrarVoluntariado(id) {
    try {
        console.log('[VOLUNTARIADOS]  Borrando ID:', id);
        
        const db = await inicializarDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([VOLUNTARIADOS_STORE], 'readwrite');
            const store = transaction.objectStore(VOLUNTARIADOS_STORE);
            const request = store.delete(id);
            
            request.onsuccess = () => {
                console.log('[VOLUNTARIADOS] ✓ Borrado correctamente');
                resolve({ ok: true });
            };
            
            request.onerror = () => {
                console.error('[VOLUNTARIADOS]  Error al borrar:', request.error);
                reject(request.error);
            };
        });
        
    } catch (error) {
        console.error('[VOLUNTARIADOS] Error en borrarVoluntariado:', error);
        return { ok: false, error: error.message };
    }
}

/**
 * VOLUNTARIADOS: Actualiza un voluntariado existente
 * Usado por: Voluntariados.html (futuro - edición)
 * @param {number} id
 * @param {Object} datos - Datos a actualizar
 * @returns {Promise<Object>} {ok: boolean, voluntariado/error}
 */
export async function actualizarVoluntariado(id, datos) {
    try {
        console.log('[VOLUNTARIADOS] Actualizando ID:', id);
        
        const db = await inicializarDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([VOLUNTARIADOS_STORE], 'readwrite');
            const store = transaction.objectStore(VOLUNTARIADOS_STORE);
            
            const getRequest = store.get(id);
            
            getRequest.onsuccess = () => {
                const voluntariado = { ...getRequest.result, ...datos, id };
                const updateRequest = store.put(voluntariado);
                
                updateRequest.onsuccess = () => {
                    console.log('[VOLUNTARIADOS] ✓ Actualizado correctamente');
                    resolve({ ok: true, voluntariado });
                };
                
                updateRequest.onerror = () => reject(updateRequest.error);
            };
            
            getRequest.onerror = () => reject(getRequest.error);
        });
        
    } catch (error) {
        console.error('[VOLUNTARIADOS] Error en actualizarVoluntariado:', error);
        return { ok: false, error: error.message };
    }
}

// SECCIÓN DASHBOARD (Drag & Drop)
// Usado por: Dashboard.html (selección de voluntariados)

/**
 * DASHBOARD: Guarda la selección de voluntariados del usuario
 * Usado por: Dashboard.html (al soltar tarjeta en zona selección)
 * @param {Array} voluntariadosSeleccionados - Array de IDs o objetos
 * @returns {Promise<Object>} {ok: boolean}
 */
export async function guardarSeleccion(voluntariadosSeleccionados) {
    try {
        console.log('[DASHBOARD] Guardando selección:', voluntariadosSeleccionados.length, 'items');
        
        const db = await inicializarDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([SELECCION_STORE], 'readwrite');
            const store = transaction.objectStore(SELECCION_STORE);
            const request = store.put({ 
                id: 'seleccion', 
                items: voluntariadosSeleccionados 
            });
            
            request.onsuccess = () => {
                console.log('[DASHBOARD] Selección guardada');
                resolve({ ok: true });
            };
            
            request.onerror = () => {
                console.error('[DASHBOARD] Error al guardar selección:', request.error);
                reject(request.error);
            };
        });
        
    } catch (error) {
        console.error('[DASHBOARD] Error en guardarSeleccion:', error);
        return { ok: false, error: error.message };
    }
}

/**
 * DASHBOARD: Obtiene la selección guardada del usuario
 * Usado por: Dashboard.html (al cargar página)
 * @returns {Promise<Array>} Array de voluntariados seleccionados
 */
export async function obtenerSeleccion() {
    try {
        console.log('[DASHBOARD] Obteniendo selección...');
        
        const db = await inicializarDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([SELECCION_STORE], 'readonly');
            const store = transaction.objectStore(SELECCION_STORE);
            const request = store.get('seleccion');
            
            request.onsuccess = () => {
                const items = request.result?.items || [];
                console.log('[DASHBOARD] ✓ Selección obtenida:', items.length, 'items');
                resolve(items);
            };
            
            request.onerror = () => {
                console.error('[DASHBOARD] Error al obtener selección:', request.error);
                reject(request.error);
            };
        });
        
    } catch (error) {
        console.error('[DASHBOARD] Error en obtenerSeleccion:', error);
        return [];
    }
}


// EXPORTACIÓN CENTRALIZADA

/**
 * Objeto que agrupa TODAS las funciones del módulo
 * Permite usar: import { almacenaje } from './almacenaje.js'
 */
export const almacenaje = {
    // === COMÚN - Usuarios ===
    obtenerUsuarios,
    obtenerUsuarioActivo,
    crearUsuario,
    borrarUsuario,
    actualizarUsuario,
    loguearUsuario,
    cerrarSesion,
    
    // === VOLUNTARIADOS ===
    inicializarDB,
    crearVoluntariado,
    obtenerVoluntariados,
    borrarVoluntariado,
    actualizarVoluntariado,
    
    // === DASHBOARD ===
    guardarSeleccion,
    obtenerSeleccion
};

