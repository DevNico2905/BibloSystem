// ============================
// CONFIGURACIÓN
// ============================
const API_URL = '/api/prestamos';
const USUARIOS_URL = '/api/usuarios';
const LIBROS_URL = '/api/libros';

let todosLosPrestamos = [];

// ============================
// CARGAR DATOS AL INICIAR
// ============================
document.addEventListener('DOMContentLoaded', function() {
    cargarPrestamos();
    cargarUsuarios();
    cargarLibros();
    
    // Establecer fecha actual por defecto
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaPrestamo').value = hoy;
    
    // Establecer fecha de devolución 15 días después
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaDevolucion.getDate() + 15);
    document.getElementById('fechaDevolucionEsperada').value = fechaDevolucion.toISOString().split('T')[0];
});

// ============================
// FUNCIONES PRINCIPALES
// ============================

// Cargar todos los préstamos
async function cargarPrestamos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar préstamos');
        
        // Obtener préstamos crudos
        const prestamos = await response.json();

        // Enriquecer cada préstamo con nombre de usuario y título de libro
        const enriquecidos = await Promise.all(prestamos.map(async (p) => {
            // Inicializar valores por defecto
            p.nombreUsuario = 'N/A';
            p.tituloLibro = 'N/A';

            // Mapear campos de fecha del backend a los nombres que usa el frontend
            // fechaDevolucion (backend) -> fechaDevolucionEsperada (frontend)
            p.fechaDevolucionEsperada = p.fechaDevolucion || null;
            // fechaDevolucionReal puede no existir todavía en el backend
            p.fechaDevolucionReal = p.fechaDevolucionReal || null;

            try {
                if (p.usuarioId) {
                    const uResp = await fetch(`${USUARIOS_URL}/${p.usuarioId}`);
                    if (uResp.ok) {
                        const usuario = await uResp.json();
                        p.nombreUsuario = usuario.nombre || `${usuario.email || 'N/A'}`;
                    }
                }
            } catch (e) {
                console.warn('No se pudo obtener usuario', p.usuarioId, e);
            }

            try {
                if (p.libroId) {
                    const lResp = await fetch(`${LIBROS_URL}/${p.libroId}`);
                    if (lResp.ok) {
                        const libro = await lResp.json();
                        p.tituloLibro = libro.titulo || `${libro.autor || 'N/A'}`;
                    }
                }
            } catch (e) {
                console.warn('No se pudo obtener libro', p.libroId, e);
            }

            return p;
        }));

        todosLosPrestamos = enriquecidos;
        mostrarPrestamosEnTabla(todosLosPrestamos);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar los préstamos. Verifica que el servicio esté corriendo.', 'error');
        document.getElementById('tablaPrestamos').innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="color: red;">
                    ⚠️ Error al cargar préstamos. Verifica que el servicio esté corriendo en el puerto 8083.
                </td>
            </tr>
        `;
    }
}

// Cargar usuarios para el select
async function cargarUsuarios() {
    try {
        const response = await fetch(USUARIOS_URL);
        if (!response.ok) throw new Error('Error al cargar usuarios');
        
        const usuarios = await response.json();
        const select = document.getElementById('usuarioId');
        
        usuarios.forEach(usuario => {
            if (usuario.activo) {
                const option = document.createElement('option');
                option.value = usuario.id;
                option.textContent = `${usuario.nombre} (${usuario.email})`;
                select.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

// Cargar libros para el select
async function cargarLibros() {
    try {
        const response = await fetch(LIBROS_URL);
        if (!response.ok) throw new Error('Error al cargar libros');
        
        const libros = await response.json();
        const select = document.getElementById('libroId');
        
        libros.forEach(libro => {
            if (libro.stockDisponible > 0) {
                const option = document.createElement('option');
                option.value = libro.id;
                option.textContent = `${libro.titulo} - ${libro.autor} (Disponibles: ${libro.stockDisponible})`;
                select.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error al cargar libros:', error);
    }
}

// Mostrar préstamos en la tabla
function mostrarPrestamosEnTabla(prestamos) {
    const tbody = document.getElementById('tablaPrestamos');
    
    if (prestamos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">No hay préstamos registrados</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = prestamos.map(prestamo => {
        const estado = determinarEstado(prestamo);
        const badgeClass = {
            'ACTIVO': 'badge-info',
            'DEVUELTO': 'badge-success',
            'VENCIDO': 'badge-danger'
        }[estado];

        return `
            <tr>
                <td>${prestamo.id}</td>
                <td>${prestamo.nombreUsuario || 'N/A'}</td>
                <td>${prestamo.tituloLibro || 'N/A'}</td>
                <td>${formatearFecha(prestamo.fechaPrestamo)}</td>
                <td>${formatearFecha(prestamo.fechaDevolucionEsperada)}</td>
                <td>${prestamo.fechaDevolucionReal ? formatearFecha(prestamo.fechaDevolucionReal) : '-'}</td>
                <td><span class="badge ${badgeClass}">${estado}</span></td>
                <td>
                    <div class="action-buttons">
                        ${prestamo.estado === 'ACTIVO' ? `
                            <button class="btn btn-success btn-icon" 
                                    onclick="devolverLibro(${prestamo.id})" 
                                    title="Registrar Devolución">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                        <button class="btn btn-danger btn-icon" 
                                onclick="eliminarPrestamo(${prestamo.id})" 
                                title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Determinar el estado del préstamo
function determinarEstado(prestamo) {
    if (prestamo.estado === 'DEVUELTO') return 'DEVUELTO';
    
    const hoy = new Date();
    const fechaEsperada = new Date(prestamo.fechaDevolucionEsperada);
    
    if (hoy > fechaEsperada) return 'VENCIDO';
    
    return 'ACTIVO';
}

// Filtrar préstamos por estado
function filtrarPrestamos() {
    const filtro = document.getElementById('filtroEstado').value;
    
    if (filtro === 'TODOS') {
        mostrarPrestamosEnTabla(todosLosPrestamos);
        return;
    }
    
    const filtrados = todosLosPrestamos.filter(p => determinarEstado(p) === filtro);
    mostrarPrestamosEnTabla(filtrados);
}

// Mostrar/Ocultar formulario
function mostrarFormulario() {
    document.getElementById('formularioPrestamo').style.display = 'block';
    document.getElementById('prestamoForm').reset();
    
    // Restablecer fechas por defecto
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaPrestamo').value = hoy;
    
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaDevolucion.getDate() + 15);
    document.getElementById('fechaDevolucionEsperada').value = fechaDevolucion.toISOString().split('T')[0];
}

function cerrarFormulario() {
    document.getElementById('formularioPrestamo').style.display = 'none';
    document.getElementById('prestamoForm').reset();
}

// Guardar préstamo
async function guardarPrestamo(event) {
    event.preventDefault();
    
    const prestamo = {
        usuarioId: parseInt(document.getElementById('usuarioId').value),
        libroId: parseInt(document.getElementById('libroId').value),
        fechaPrestamo: document.getElementById('fechaPrestamo').value,
        fechaDevolucionEsperada: document.getElementById('fechaDevolucionEsperada').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prestamo)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al guardar');
        }

        mostrarNotificacion('✅ Préstamo registrado correctamente', 'success');
        cerrarFormulario();
        cargarPrestamos();
        
        // Recargar libros para actualizar disponibilidad
        document.getElementById('libroId').innerHTML = '<option value="">Seleccione un libro</option>';
        cargarLibros();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('❌ ' + error.message, 'error');
    }
}

// Devolver libro
async function devolverLibro(id) {
    if (!confirm('¿Confirmar la devolución de este libro?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}/devolver`, {
            method: 'PUT'
        });

        if (!response.ok) throw new Error('Error al devolver');

        mostrarNotificacion('✅ Libro devuelto correctamente', 'success');
        cargarPrestamos();
        
        // Recargar libros para actualizar disponibilidad
        document.getElementById('libroId').innerHTML = '<option value="">Seleccione un libro</option>';
        cargarLibros();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('❌ Error al devolver el libro', 'error');
    }
}

// Eliminar préstamo
async function eliminarPrestamo(id) {
    if (!confirm('¿Estás seguro de eliminar este préstamo?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar');

        mostrarNotificacion('✅ Préstamo eliminado correctamente', 'success');
        cargarPrestamos();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('❌ Error al eliminar el préstamo', 'error');
    }
}

// ============================
// UTILIDADES
// ============================

// Formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES');
}

// Notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notification.className = `notification ${tipo} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}