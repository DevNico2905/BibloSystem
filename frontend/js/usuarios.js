// ============================
// CONFIGURACIÓN
// ============================
const API_URL = '/api/usuarios';

// ============================
// CARGAR USUARIOS AL INICIAR
// ============================
document.addEventListener('DOMContentLoaded', function() {
    cargarUsuarios();
});

// ============================
// FUNCIONES PRINCIPALES
// ============================

// Cargar todos los usuarios
async function cargarUsuarios() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar usuarios');
        
        const usuarios = await response.json();
        mostrarUsuariosEnTabla(usuarios);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar los usuarios. Verifica que el servicio esté corriendo.', 'error');
        document.getElementById('tablaUsuarios').innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="color: red;">
                    ⚠️ Error al cargar usuarios. Verifica que el servicio esté corriendo en el puerto 8082.
                </td>
            </tr>
        `;
    }
}

// Mostrar usuarios en la tabla
function mostrarUsuariosEnTabla(usuarios) {
    const tbody = document.getElementById('tablaUsuarios');
    
    if (usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">No hay usuarios registrados</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = usuarios.map(usuario => `
        <tr>
            <td>${usuario.id}</td>
            <td><strong>${usuario.nombre}</strong></td>
            <td>${usuario.email}</td>
            <td>${usuario.telefono || 'N/A'}</td>
            <td><span class="badge badge-info">${usuario.tipoUsuario}</span></td>
            <td>
                ${usuario.activo 
                    ? `<span class="badge badge-success">Activo</span>`
                    : `<span class="badge badge-danger">Inactivo</span>`
                }
            </td>
            <td>${usuario.prestamosActivos || 0}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning btn-icon" onclick="editarUsuario(${usuario.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn ${usuario.activo ? 'btn-danger' : 'btn-success'} btn-icon" 
                            onclick="toggleEstadoUsuario(${usuario.id}, ${usuario.activo})" 
                            title="${usuario.activo ? 'Desactivar' : 'Activar'}">
                        <i class="fas fa-${usuario.activo ? 'ban' : 'check'}"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Buscar usuarios
function buscarUsuarios() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        cargarUsuarios();
        return;
    }

    // Filtrar localmente (puedes implementar búsqueda en backend si lo prefieres)
    fetch(API_URL)
        .then(response => response.json())
        .then(usuarios => {
            const filtrados = usuarios.filter(u => 
                u.nombre.toLowerCase().includes(searchTerm) ||
                u.email.toLowerCase().includes(searchTerm)
            );
            mostrarUsuariosEnTabla(filtrados);
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Error al buscar usuarios', 'error');
        });
}

// Mostrar/Ocultar formulario
function mostrarFormulario() {
    document.getElementById('formularioUsuario').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Agregar Nuevo Usuario';
    document.getElementById('usuarioForm').reset();
    document.getElementById('usuarioId').value = '';
    // Establecer fecha actual por defecto
    document.getElementById('fechaRegistro').valueAsDate = new Date();
}

function cerrarFormulario() {
    document.getElementById('formularioUsuario').style.display = 'none';
    document.getElementById('usuarioForm').reset();
}

// Guardar usuario
async function guardarUsuario(event) {
    event.preventDefault();
    
    const id = document.getElementById('usuarioId').value;
    const usuario = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value,
        tipoUsuario: document.getElementById('tipoUsuario').value,
        fechaRegistro: document.getElementById('fechaRegistro').value || new Date().toISOString().split('T')[0]
    };

    try {
        let response;
        if (id) {
            // Actualizar
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            });
        } else {
            // Crear
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            });
        }

        if (!response.ok) throw new Error('Error al guardar');

        mostrarNotificacion(
            id ? '✅ Usuario actualizado correctamente' : '✅ Usuario creado correctamente',
            'success'
        );
        cerrarFormulario();
        cargarUsuarios();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('❌ Error al guardar el usuario', 'error');
    }
}

// Editar usuario
async function editarUsuario(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Error al cargar usuario');
        
        const usuario = await response.json();
        
        // Llenar el formulario
        document.getElementById('usuarioId').value = usuario.id;
        document.getElementById('nombre').value = usuario.nombre;
        document.getElementById('email').value = usuario.email;
        document.getElementById('telefono').value = usuario.telefono || '';
        document.getElementById('direccion').value = usuario.direccion || '';
        document.getElementById('tipoUsuario').value = usuario.tipoUsuario;
        document.getElementById('fechaRegistro').value = usuario.fechaRegistro || '';
        
        // Mostrar formulario
        document.getElementById('formularioUsuario').style.display = 'block';
        document.getElementById('formTitle').textContent = 'Editar Usuario';
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar el usuario', 'error');
    }
}

// Toggle estado del usuario
async function toggleEstadoUsuario(id, estadoActual) {
    const accion = estadoActual ? 'desactivar' : 'activar';
    if (!confirm(`¿Estás seguro de ${accion} este usuario?`)) return;

    try {
        const endpoint = estadoActual 
            ? `${API_URL}/${id}/desactivar`
            : `${API_URL}/${id}/activar`;
            
        const response = await fetch(endpoint, { method: 'PUT' });

        if (!response.ok) throw new Error(`Error al ${accion}`);

        mostrarNotificacion(`✅ Usuario ${accion}do correctamente`, 'success');
        cargarUsuarios();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(`❌ Error al ${accion} el usuario`, 'error');
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