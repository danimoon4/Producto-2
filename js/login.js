// login.js - LÓGICA DE INICIO DE SESIÓN

// Verifica credenciales y actualiza el navbar

// Importamos los usuarios desde datos.js
import { usuarios } from './datos.js';

//  REFERENCIAS A ELEMENTOS DEL DOM

const formLogin = document.getElementById('formLogin');
const mensajeError = document.getElementById('mensajeError');
const userStatus = document.getElementById('userStatus');

// 
// Comprueba si el email y password coinciden con algún usuario
function verificarLogin(event) {
    event.preventDefault();
    
    // Obtener valores del formulario
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;
    
    // Buscar usuario en el array
    const usuarioEncontrado = usuarios.find(user => 
        user.email === email && user.password === password
    );
    
    if (usuarioEncontrado) {
        // Login exitoso
        console.log('Login exitoso:', usuarioEncontrado.nombre);
        
        // Guardar usuario en localStorage
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));
        
        // Ocultar mensaje de error si estaba visible
        mensajeError.classList.add('d-none');
        
        // Actualizar el navbar con el nombre del usuario
        userStatus.textContent = `HOLA ${usuarioEncontrado.nombre}`;
        userStatus.style.color = '#4CAF50';
        userStatus.style.fontWeight = '700';
        
        // Limpiar el formulario
        formLogin.reset();
        
    } else {
        // Login fallido
        console.log('Login fallido: credenciales incorrectas');
        
        // Mostrar mensaje de error
        mensajeError.classList.remove('d-none');
    }
}

//  INICIALIZACIÓN AL CARGAR LA PÁGINA

document.addEventListener('DOMContentLoaded', function() {
    // Registrar evento del formulario
    formLogin.addEventListener('submit', verificarLogin);
    
    // Verificar si ya hay un usuario logueado
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    if (usuarioLogueado) {
        const usuario = JSON.parse(usuarioLogueado);
        userStatus.textContent = `HOLA ${usuario.nombre}`;
        userStatus.style.color = '#4CAF50';
        userStatus.style.fontWeight = '700';
    }
    
    console.log('Página de login cargada');
    console.log('Usuarios disponibles:', usuarios.length);
});


// 1. IA: Claude - Prompt: "Cómo buscar un objeto en un array de JavaScript usando find() con múltiples condiciones"
// 
// 2. IA: Claude - Prompt: "Cómo guardar objetos JavaScript en localStorage usando JSON.stringify"
// 
// 3. IA: Claude - Prompt: "Cómo actualizar el contenido de texto de un elemento HTML usando template literals para mostrar saludos personalizados"
// 
// 4. IA: Claude - Prompt: "Cómo mostrar y ocultar elementos HTML añadiendo y quitando la clase d-none de Bootstrap"
// 
// 5. IA: Claude - Prompt: "Cómo cambiar estilos CSS dinámicamente usando la propiedad style en JavaScript"
// 6. IA: Claude - Prompt: "Cómo prevenir el comportamiento por defecto de un formulario con preventDefault y limpiar inputs con reset"
