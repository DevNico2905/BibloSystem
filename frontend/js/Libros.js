// ============================
// CONFIGURACIÓN
// ============================
const API_URL = 'http://localhost:8081/api/libros';

// ============================
// CARGAR LIBROS AL INICIAR
// ============================
document.addEventListener('DOMContentLoaded', function() {
    cargarLibros();
});

// ============================
// FUNCIONES PRINCIPALES
// ============================

// Cargar todos los libros
async function cargarLibros() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar libros');
        
        const libros = await response.json();
        mostrarLibrosEnTabla(libros);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar los libros. Verifica que el servicio esté corriendo.', 'error');
        document.getElementById('tablaLibros').innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="color: red;">
                    ⚠️ Error al cargar libros. Verifica que el servicio esté corriendo en el puerto 8081.
                </td>
            </tr>
        `;
    }
}

// Mostrar libros en la tabla
function mostrarLibrosEnTabla(libros) {
    const tbody = document.getElementById('tablaLibros');
    
    if (libros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">No hay libros registrados</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = libros.map(libro => `
        <tr>
            <td>${libro.id}</td>
            <td><strong>${libro.titulo}</strong></td>
            <td>${libro.autor}</td>
            <td><span class="badge badge-info">${libro.categoria}</span></td>
            <td>${libro.isbn || 'N/A'}</td>
            <td>${libro.stock}</td>
            <td>
                ${libro.stockDisponible > 0 
                    ? `<span class="badge badge-success">${libro.stockDisponible}</span>`
                    : `<span class="badge badge-danger">0</span>`
                }
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning btn-icon" onclick="editarLibro(${libro.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-icon" onclick="eliminarLibro(${libro.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Buscar libros por título
async function buscarLibros() {
    const searchTerm = document.getElementById('searchInput').value;
    
    if (searchTerm.trim() === '') {
        cargarLibros();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/buscar?titulo=${searchTerm}`);
        if (!response.ok) throw new Error('Error en la búsqueda');
        
        const libros = await response.json();
        mostrarLibrosEnTabla(libros);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al buscar libros', 'error');
    }
}

// Mostrar/Ocultar formulario
function mostrarFormulario() {
    document.getElementById('formularioLibro').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Agregar Nuevo Libro';
    document.getElementById('libroForm').reset();
    document.getElementById('libroId').value = '';
}

function cerrarFormulario() {
    document.getElementById('formularioLibro').style.display = 'none';
    document.getElementById('libroForm').reset();
}

// Guardar libro (crear o actualizar)
async function guardarLibro(event) {
    event.preventDefault();
    
    const id = document.getElementById('libroId').value;
    const libro = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        isbn: document.getElementById('isbn').value,
        categoria: document.getElementById('categoria').value,
        editorial: document.getElementById('editorial').value,
        fechaPublicacion: document.getElementById('fechaPublicacion').value || null,
        stock: parseInt(document.getElementById('stock').value),
        descripcion: document.getElementById('descripcion').value
    };

    try {
        let response;
        if (id) {
            // Actualizar
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(libro)
            });
        } else {
            // Crear
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(libro)
            });
        }

        if (!response.ok) throw new Error('Error al guardar');

        mostrarNotificacion(
            id ? '✅ Libro actualizado correctamente' : '✅ Libro creado correctamente',
            'success'
        );
        cerrarFormulario();
        cargarLibros();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('❌ Error al guardar el libro', 'error');
    }
}

// Editar libro
async function editarLibro(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Error al cargar libro');
        
        const libro = await response.json();
        
        // Llenar el formulario
        document.getElementById('libroId').value = libro.id;
        document.getElementById('titulo').value = libro.titulo;
        document.getElementById('autor').value = libro.autor;
        document.getElementById('isbn').value = libro.isbn || '';
        document.getElementById('categoria').value = libro.categoria;
        document.getElementById('editorial').value = libro.editorial || '';
        document.getElementById('fechaPublicacion').value = libro.fechaPublicacion || '';
        document.getElementById('stock').value = libro.stock;
        document.getElementById('descripcion').value = libro.descripcion || '';
        
        // Mostrar formulario
        document.getElementById('formularioLibro').style.display = 'block';
        document.getElementById('formTitle').textContent = 'Editar Libro';
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar el libro', 'error');
    }
}

// Eliminar libro
async function eliminarLibro(id) {
    if (!confirm('¿Estás seguro de eliminar este libro?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar');

        mostrarNotificacion('✅ Libro eliminado correctamente', 'success');
        cargarLibros();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('❌ Error al eliminar el libro', 'error');
    }
}

// ============================
// NOTIFICACIONES
// ============================
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notification.className = `notification ${tipo} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}