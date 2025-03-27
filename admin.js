// Variables globales
let productosPanel = [];

// Recuperar los productos existentes
let productos = JSON.parse(localStorage.getItem('productos')) || [];

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', function() {
    mostrarProductosEnTabla();
});

function mostrarProductosEnTabla() {
    const tabla = document.getElementById('productosTabla');
    if (!tabla) return;

    tabla.innerHTML = '';
    productos.forEach((producto, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td>${producto.marca}</td>
            <td>${producto.modelo}</td>
            <td>${producto.tipo}</td>
            <td>$${parseFloat(producto.precio).toLocaleString()}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function agregarProducto() {
    // Obtener valores del formulario
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const tipo = document.getElementById('tipo').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const imagenInput = document.getElementById('imagen');

    // Validar campos
    if (!marca || !modelo || !tipo || isNaN(precio) || !imagenInput.files[0]) {
        alert('Por favor, completa todos los campos correctamente');
        return;
    }

    const imagen = imagenInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        // Crear nuevo producto
        const nuevoProducto = {
            nombre: `${marca} ${modelo}`,
            marca: marca,
            modelo: modelo,
            tipo: tipo,
            precio: precio,
            imagen: e.target.result
        };

        // Agregar a la lista de productos
        productos.push(nuevoProducto);
        
        // Guardar en localStorage
        localStorage.setItem('productos', JSON.stringify(productos));
        
        // Actualizar vista de la tabla
        mostrarProductosEnTabla();
        
        // Limpiar formulario
        document.getElementById('productoForm').reset();

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('agregarProductoModal'));
        if (modal) {
            modal.hide();
        }

        // Mostrar confirmación
        alert('Producto agregado exitosamente');
    };

    reader.readAsDataURL(imagen);
}

function eliminarProducto(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        productos.splice(index, 1);
        localStorage.setItem('productos', JSON.stringify(productos));
        mostrarProductosEnTabla();
    }
}

// Funciones de búsqueda de compradores
function realizarBusqueda() {
    const nombreComprador = document.getElementById('nombre-comprador').value;
    const resultadoCompra = document.getElementById('resultado-compra');
    resultadoCompra.innerHTML = '';
    
    // Obtener compras del localStorage
    const compras = JSON.parse(localStorage.getItem('compras')) || [];
    const comprasEncontradas = compras.filter(compra => 
        compra.cliente.toLowerCase().includes(nombreComprador.toLowerCase())
    );

    if (comprasEncontradas.length > 0) {
        comprasEncontradas.forEach(compra => {
            const compraDetalle = document.createElement('div');
            compraDetalle.className = 'card mb-3';
            compraDetalle.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">Comprador: ${compra.cliente}</h5>
                    <p class="card-text">Fecha: ${new Date(compra.fecha).toLocaleString()}</p>
                    <p class="card-text">Total: $${compra.total.toLocaleString()}</p>
                    <ul class="list-group list-group-flush">
                        ${compra.items.map(item => `
                            <li class="list-group-item">
                                ${item.modelo} - $${item.precio.toLocaleString()}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
            resultadoCompra.appendChild(compraDetalle);
        });
    } else {
        resultadoCompra.innerHTML = `
            <div class="alert alert-info">
                No se encontraron compras para el comprador "${nombreComprador}"
            </div>
        `;
    }
}

function limpiarResultados() {
    document.getElementById('resultado-compra').innerHTML = '';
    document.getElementById('nombre-comprador').value = '';
} 