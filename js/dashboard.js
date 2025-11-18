//Dashboard con Drag and Drop e IndexedDB
import { almacenaje } from './almacenaje.js';
let filtroActivo = null;
let voluntariadosSeleccionados = [];

// MOSTRAR USUARIO ACTIVO
function mostrarUsuarioActivo() {
    const userStatus = document.getElementById('userStatus');
    const usuario = almacenaje.obtenerUsuarioActivo();
    
    if (usuario) {
        userStatus.textContent = usuario.email;
        userStatus.style.color = '#8ab893';
    } else {
        userStatus.textContent = '-NO LOGIN-';
        userStatus.style.color = '#ff4444';
    }
}

// RENDERIZAR TARJETAS (excluye seleccionados)
async function renderizarTarjetas() {
    const grid = document.getElementById('gridVoluntariados');
    grid.innerHTML = '<div class="col-12 text-center"><p class="text-white">Cargando...</p></div>';
    
    try {
        const voluntariados = await almacenaje.obtenerVoluntariados();
        
        // FILTRAR: excluir los ya seleccionados
        let voluntariosFiltrados = voluntariados.filter(v => !voluntariadosSeleccionados.includes(v.id));
        
        // FILTRAR: aplicar filtro de tipo si está activo
        if (filtroActivo) {
            voluntariosFiltrados = voluntariosFiltrados.filter(v => v.tipo === filtroActivo);
        }
        
        grid.innerHTML = '';
        
        if (voluntariosFiltrados.length === 0) {
            grid.innerHTML = '<div class="col-12 text-center"><p class="text-white fs-4">No hay voluntariados disponibles</p></div>';
            return;
        }
        
        voluntariosFiltrados.forEach(vol => {
            const tarjeta = crearTarjetaHTML(vol);
            grid.innerHTML += tarjeta;
        });
        
        agregarEventosDrag();
        
    } catch (error) {
        console.error('Error al renderizar:', error);
    }
}

// CREAR HTML DE TARJETA
function crearTarjetaHTML(vol) {
    const claseTipo = vol.tipo === 'Oferta' ? 'oferta' : 'peticion';
    
    return `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card-voluntariado ${claseTipo}" draggable="true" data-id="${vol.id}">
                <div class="card-body">
                    <h3 class="card-title">${vol.titulo}</h3>
                    <p class="descripcion">${vol.descripcion}</p>
                    <div class="info-footer">
                        <div class="fecha">${vol.fecha}</div>
                        <div class="usuario">PUBLICADO: <strong>${vol.email}</strong></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// EVENTOS DRAG
function agregarEventosDrag() {
    const tarjetas = document.querySelectorAll('.card-voluntariado[draggable="true"]');
    
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('voluntariado-id', tarjeta.getAttribute('data-id'));
            tarjeta.classList.add('dragging');
        });
        
        tarjeta.addEventListener('dragend', () => {
            tarjeta.classList.remove('dragging');
        });
    });
}

// APLICAR FILTRO
function aplicarFiltro() {
    renderizarTarjetas();
    actualizarBotonesFiltro();
}

// ACTUALIZAR BOTONES FILTRO
function actualizarBotonesFiltro() {
    const btnOferta = document.getElementById('btnOferta');
    const btnPeticion = document.getElementById('btnPeticion');
    
    btnOferta.classList.toggle('active', filtroActivo === 'Oferta');
    btnPeticion.classList.toggle('active', filtroActivo === 'Petición');
}

// RENDERIZAR SELECCION (con formato completo)
async function renderizarSeleccion() {
    const zona = document.getElementById('zonaSeleccion');
    
    if (voluntariadosSeleccionados.length === 0) {
        zona.innerHTML = '<p class="texto-placeholder">Arrastra aqui los voluntariados que te interesan</p>';
        return;
    }
    
    const voluntariados = await almacenaje.obtenerVoluntariados();
    zona.innerHTML = '';
    
    voluntariadosSeleccionados.forEach(id => {
        const vol = voluntariados.find(v => v.id === id);
        if (vol) {
            const claseTipo = vol.tipo === 'Oferta' ? 'oferta' : 'peticion';
            
            // Crear tarjeta con el MISMO formato que las disponibles
            const tarjeta = document.createElement('div');
            tarjeta.className = 'col-12 col-md-6 col-lg-4';
            tarjeta.innerHTML = `
                <div class="card-voluntariado ${claseTipo} seleccionada" data-id="${vol.id}">
                    <div class="card-body">
                        <h3 class="card-title">${vol.titulo}</h3>
                        <p class="descripcion">${vol.descripcion}</p>
                        <div class="info-footer">
                            <div class="fecha">${vol.fecha}</div>
                            <div class="usuario">PUBLICADO: <strong>${vol.email}</strong></div>
                        </div>
                    </div>
                </div>
            `;
            
            // Click para quitar de selección
            tarjeta.querySelector('.card-voluntariado').addEventListener('click', () => quitarSeleccion(id));
            
            zona.appendChild(tarjeta);
        }
    });
}

// AGREGAR A SELECCION
async function agregarASeleccion(id) {
    if (!voluntariadosSeleccionados.includes(id)) {
        voluntariadosSeleccionados.push(id);
        await almacenaje.guardarSeleccion(voluntariadosSeleccionados);
        
        // Re-renderizar AMBAS zonas
        await renderizarTarjetas();
        await renderizarSeleccion();
        
        console.log('Voluntariado agregado:', id);
    }
}

// QUITAR DE SELECCION
async function quitarSeleccion(id) {
    voluntariadosSeleccionados = voluntariadosSeleccionados.filter(vId => vId !== id);
    await almacenaje.guardarSeleccion(voluntariadosSeleccionados);
    
    // Re-renderizar AMBAS zonas
    await renderizarTarjetas();
    await renderizarSeleccion();
    
    console.log('Voluntariado quitado:', id);
}

// INICIALIZACION
document.addEventListener('DOMContentLoaded', async function() {
    console.log('=== DASHBOARD CARGADO ===');
    
    await almacenaje.inicializarVoluntariadosEjemplo();
    
    mostrarUsuarioActivo();
    
    voluntariadosSeleccionados = await almacenaje.obtenerSeleccion();
    
    await renderizarTarjetas();
    await renderizarSeleccion();
    
    const btnOferta = document.getElementById('btnOferta');
    const btnPeticion = document.getElementById('btnPeticion');
    
    btnOferta.addEventListener('click', () => {
        filtroActivo = filtroActivo === 'Oferta' ? null : 'Oferta';
        aplicarFiltro();
    });
    
    btnPeticion.addEventListener('click', () => {
        filtroActivo = filtroActivo === 'Petición' ? null : 'Petición';
        aplicarFiltro();
    });
    
    const zonaSeleccion = document.getElementById('zonaSeleccion');
    
    zonaSeleccion.addEventListener('dragover', (e) => {
        e.preventDefault();
        zonaSeleccion.classList.add('drag-over');
    });
    
    zonaSeleccion.addEventListener('dragleave', () => {
        zonaSeleccion.classList.remove('drag-over');
    });
    
    zonaSeleccion.addEventListener('drop', async (e) => {
        e.preventDefault();
        zonaSeleccion.classList.remove('drag-over');
        
        const id = parseInt(e.dataTransfer.getData('voluntariado-id'));
        await agregarASeleccion(id);
    });
    
    console.log('Dashboard iniciado');
});
