// Importamos los datos desde datos.js
import { voluntariados, obtenerNuevoId } from './datos.js';

function cargarTablaVoluntariados() {
    const tbody = document.getElementById('tablaVoluntariados');
    tbody.innerHTML = ''; // Limpiar tabla antes de cargar
    
    // Recorrer array y crear una fila por cada voluntariado
    voluntariados.forEach((vol, index) => {
        const fila = document.createElement('tr');
        fila.className = 'text-center';
        
        fila.innerHTML = `
            <td class="fw-bold">${vol.titulo}</td>
            <td>${vol.usuario}</td>
            <td>${vol.fecha}</td>
            <td class="text-start">${vol.descripcion}</td>
            <td>
                <span class="badge ${vol.tipo === 'oferta' ? 'bg-success' : 'bg-warning text-dark'}">
                    ${vol.tipo.toUpperCase()}
                </span>
            </td>
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
            borrarVoluntariado(index);
        });
    });
}


function borrarVoluntariado(index) {
    // Eliminar del array
    voluntariados.splice(index, 1);
    
    // Recargar tabla
    cargarTablaVoluntariados();
}

function altaVoluntariado(event) {
    event.preventDefault(); 
    
    // Obtener valores del formulario
    const titulo = document.getElementById('titulo').value;
    const usuario = document.getElementById('usuario').value;
    const fechaInput = document.getElementById('fecha').value;
    const descripcion = document.getElementById('descripcion').value;
    const tipo = document.getElementById('tipo').value;
    
    // Convertir fecha de yyyy-mm-dd a dd/mm/yyyy
    const [año, mes, dia] = fechaInput.split('-');
    const fechaFormateada = `${dia}/${mes}/${año}`;
    
    // Crear nuevo objeto voluntariado
    const nuevoVoluntariado = {
        id: obtenerNuevoId(voluntariados),
        titulo: titulo.toUpperCase(),
        tipo: tipo,
        descripcion: descripcion.toUpperCase(),
        fecha: fechaFormateada,
        usuario: usuario.toUpperCase()
    };
    
    // Añadir al array
    voluntariados.push(nuevoVoluntariado);
    
    // Recargar tabla
    cargarTablaVoluntariados();
    
    // Limpiar formulario
    document.getElementById('formVoluntariado').reset();
}



document.addEventListener('DOMContentLoaded', function() {
    // Cargar tabla inicial con los datos de datos.js
    cargarTablaVoluntariados();
    
    // Registrar evento del formulario
    const formulario = document.getElementById('formVoluntariado');
    formulario.addEventListener('submit', altaVoluntariado);
    
    console.log('Página cargada - Tabla mostrada con', voluntariados.length, 'voluntariados');
});


// 1. IA: Claude - Prompt: "cómo importo variables de otro archivo javascript usando import y export"
// 2. IA: Claude - Prompt: "cómo recorrer un array de objetos en javascript y crear filas de tabla html dinámicamente"
// 3. IA: Claude - Prompt: "cómo añadir eventos click a múltiples botones con addEventListener en javascript?"
// 4. IA: Claude - Prompt: "cómo eliminar un elemento de un array por su índice con splice?"
// 5. A: Claude - Prompt: "cómo capturar el evento submit de un formulario y obtener valores de inputs?"
// 6. IA: Claude - Prompt: "cómo convertir una fecha de formato yyyy-mm-dd a dd/mm/yyyy en javascript?"