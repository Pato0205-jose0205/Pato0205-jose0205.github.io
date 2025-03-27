let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let total = parseFloat(localStorage.getItem('total')) || 0;
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let usuarioActual = null;
let productos = JSON.parse(localStorage.getItem('productos')) || [];

// Funcionalidad del carrito
const cartIcon = document.getElementById('cartIcon');
const cartContainer = document.getElementById('cartContainer');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

// Mostrar/ocultar carrito
cartIcon.addEventListener('click', () => {
    cartContainer.style.display = cartContainer.style.display === 'none' ? 'block' : 'none';
});

// Función para agregar al carrito
function addToCart(product) {
    cart.push(product);
    updateCart();
    
    // Animación del elemento agregado
    const element = document.querySelector(`[data-product-id="${product.id}"]`);
    if (element) {
        element.classList.add('added-to-cart');
        setTimeout(() => {
            element.classList.remove('added-to-cart');
        }, 500);
    }
}

// Función para actualizar el carrito
function updateCart() {
    cartCount.textContent = cart.length;
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += parseFloat(item.precio);
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div>
                    <h6>${item.nombre}</h6>
                    <p>$${item.precio}</p>
                </div>
                <i class="fas fa-times remove-item" onclick="removeFromCart(${index})"></i>
            </div>
        `;
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Función para eliminar del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Función para finalizar compra
function checkout() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    alert('¡Gracias por tu compra!');
    cart = [];
    updateCart();
    cartContainer.style.display = 'none';
}

// Funcionalidad del buscador
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length < 2) {
        searchResults.style.display = 'none';
        return;
    }

    // Aquí deberías filtrar tus productos según el término de búsqueda
    const filteredProducts = productos.filter(product => 
        product.nombre.toLowerCase().includes(searchTerm) ||
        product.marca.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(filteredProducts);
});

function displaySearchResults(results) {
    if (results.length === 0) {
        searchResults.style.display = 'none';
        return;
    }

    searchResults.innerHTML = results.map(product => `
        <div class="search-result-item" onclick="selectProduct('${product.id}')">
            <img src="${product.imagen}" alt="${product.nombre}" style="width: 50px; height: 50px; object-fit: cover;">
            <span>${product.nombre} - ${product.marca}</span>
        </div>
    `).join('');

    searchResults.style.display = 'block';
}

// Cerrar resultados de búsqueda al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
    }
});

// Función para seleccionar un producto de la búsqueda
function selectProduct(productId) {
    const product = productos.find(p => p.id === productId);
    if (product) {
        // Aquí puedes redirigir al producto o mostrar más detalles
        window.location.href = `#producto-${productId}`;
    }
    searchResults.style.display = 'none';
    searchInput.value = '';
}

function actualizarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    const carritoTotal = document.getElementById('carrito-total');
    
    if (!carritoItems || !carritoTotal) return;

    // Obtener el carrito actualizado del localStorage
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Calcular el total
    total = carrito.reduce((sum, item) => sum + parseFloat(item.precio), 0);
    
    carritoItems.innerHTML = '';
    carrito.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'd-flex justify-content-between align-items-center mb-2';
        itemElement.innerHTML = `
            <span>${item.modelo}</span>
            <div>
                <span class="me-3">$${parseFloat(item.precio).toLocaleString()}</span>
                <button class="btn btn-danger btn-sm" onclick="eliminarItem(${index})">Eliminar</button>
            </div>
        `;
        carritoItems.appendChild(itemElement);
    });

    // Actualizar el total en la vista
    carritoTotal.textContent = total.toLocaleString();
    
    // Guardar el total actualizado en localStorage
    localStorage.setItem('total', total);
    
    actualizarContadorCarrito();
}

function eliminarItem(index) {
    // Obtener el carrito actual del localStorage
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Eliminar el item
    carrito.splice(index, 1);
    
    // Guardar el carrito actualizado
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Recalcular el total
    total = carrito.reduce((sum, item) => sum + parseFloat(item.precio), 0);
    localStorage.setItem('total', total);
    
    // Actualizar la vista del carrito
    actualizarCarrito();
}

function agregarAlCarrito(modelo, precio) {
    // Obtener el carrito actual
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Encontrar el producto completo
    const productoCompleto = productos.find(p => p.modelo === modelo);
    
    if (productoCompleto) {
        // Agregar el producto con todos sus detalles
        carrito.push({
            modelo: productoCompleto.modelo,
            precio: productoCompleto.precio,
            nombre: productoCompleto.nombre,
            marca: productoCompleto.marca,
            imagen: productoCompleto.imagen
        });
    } else {
        // Fallback si no se encuentra el producto completo
        carrito.push({ modelo, precio });
    }
    
    // Actualizar el total
    total = carrito.reduce((sum, item) => sum + parseFloat(item.precio), 0);
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('total', total);
    
    // Actualizar la vista
    actualizarCarrito();
    actualizarContadorCarrito();
    
    // Mostrar feedback visual
    mostrarNotificacion('Producto agregado al carrito');
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('total-items');
    const carritoIcono = document.getElementById('carrito-icono');
    
    if (contador) {
        const cantidadItems = carrito.length;
        contador.textContent = cantidadItems;
        
        // Asegurar que el contador sea visible si hay items
        if (cantidadItems > 0) {
            contador.style.display = 'inline-block';
            contador.classList.add('badge', 'bg-danger', 'rounded-pill');
        } else {
            contador.style.display = 'none';
        }
    }

    // Asegurar que el icono del carrito sea clickeable
    if (carritoIcono) {
        carritoIcono.style.cursor = 'pointer';
    }
}

function verCarrito() {
    const carritoModal = new bootstrap.Modal(document.getElementById('carritoModal'));
    actualizarCarrito();
    carritoModal.show();
}

// Guardar en localStorage en lugar de archivo JSON
function guardarCompra(compra) {
    let compras = JSON.parse(localStorage.getItem('compras')) || [];
    compras.push(compra);
    localStorage.setItem('compras', JSON.stringify(compras));
}

function buscarCompraPorNombre(nombre) {
    let compras = JSON.parse(localStorage.getItem('compras')) || [];
    return compras.filter(compra => compra.cliente.toLowerCase() === nombre.toLowerCase());
}

function iniciarSesion() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const usuario = usuarios.find(u => u.username === username && u.password === password);
    if (usuario) {
        usuarioActual = usuario;
        alert('Inicio de sesión exitoso');
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        finalizarCompra(); // Continuar con la compra después del login
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

function registrarse() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    if (usuarios.some(u => u.username === username)) {
        alert('El nombre de usuario ya está en uso');
    } else {
        const nuevoUsuario = { username, password };
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        alert('Registro exitoso');
        usuarioActual = nuevoUsuario;
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        finalizarCompra(); // Continuar con la compra después del registro
    }
}

function finalizarCompra() {
    if (!usuarioActual) {
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
    }
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    const compra = {
        cliente: usuarioActual.username,
        items: carrito,
        total: total,
        fecha: new Date().toISOString()
    };

    guardarCompra(compra);

    // Limpiar el carrito
    carrito = [];
    total = 0;
    localStorage.removeItem('carrito');
    localStorage.removeItem('total');
    actualizarCarrito();
    document.getElementById('total-items').textContent = '0';

    const carritoModal = bootstrap.Modal.getInstance(document.getElementById('carritoModal'));
    carritoModal.hide();

    alert('¡Gracias por tu compra! Te contactaremos pronto para finalizar los detalles.');
}

// Cargar carrito al iniciar la página
window.onload = function() {
    // Recuperar carrito del localStorage
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    total = parseFloat(localStorage.getItem('total')) || 0;
    
    actualizarCarrito();
    actualizarContadorCarrito();
};

function mostrarProductos() {
    const container = document.getElementById('marcas-container');
    const isMobile = window.innerWidth <= 768;
    
    container.innerHTML = '';
    productos.forEach((producto, index) => {
        const card = document.createElement('div');
        card.className = isMobile ? 'col-12 mb-3' : 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card marca-card">
                <div class="card-body text-center">
                    <img src="${producto.imagen}" class="card-img-top p-3" alt="${producto.nombre}">
                    <h5 class="card-title mt-2">${producto.nombre}</h5>
                    <p class="card-text">
                        <strong>Marca:</strong> ${producto.marca}<br>
                        <strong>Modelo:</strong> ${producto.modelo}<br>
                        <strong>Tipo:</strong> ${producto.tipo}<br>
                        <strong>Precio:</strong> $${parseFloat(producto.precio).toLocaleString()}
                    </p>
                    <div class="d-flex gap-2 ${isMobile ? 'flex-column' : 'justify-content-between'} mt-3">
                        <button class="btn btn-primary" onclick="agregarAlCarrito('${producto.modelo}', ${producto.precio})">
                            <i class="fas fa-shopping-cart me-2"></i>Agregar al carrito
                        </button>
                        <button class="btn btn-danger" onclick="eliminarProducto(${index})">
                            <i class="fas fa-trash me-2"></i>Eliminar
                        </button>
                    </div>
                </div>
            </div>`;
        container.appendChild(card);
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
        
        // Actualizar vista
        mostrarProductos();
        
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

// Asegurar que el botón esté correctamente conectado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar productos
    productos = JSON.parse(localStorage.getItem('productos')) || [];
    
    // Mostrar productos existentes
    mostrarProductos();
    
    // Conectar el botón de guardar
    const guardarBtn = document.querySelector('.modal-footer .btn-primary');
    if (guardarBtn) {
        // Remover cualquier event listener existente
        guardarBtn.replaceWith(guardarBtn.cloneNode(true));
        
        // Agregar el nuevo event listener
        document.querySelector('.modal-footer .btn-primary').addEventListener('click', function(e) {
            e.preventDefault();
            agregarProducto();
        });
    }
});

function eliminarProducto(index) {
    productos.splice(index, 1);
    localStorage.setItem('productos', JSON.stringify(productos));
    mostrarProductos();
    alert('Producto eliminado exitosamente');
}

// Inicializar la visualización de productos al cargar la página
mostrarProductos();

// Función para cargar productos por marca
function cargarProductosPorMarca(marca) {
    const productos = JSON.parse(localStorage.getItem('productos')) || {};
    const productosContainer = document.getElementById('productos-container');
    
    if (!productosContainer) return; // Salir si no existe el contenedor

    if (productos[marca]) {
        let html = '';
        productos[marca].forEach(producto => {
            html += `
                <div class="col-md-4 mb-4">
                    <div class="card producto-card h-100">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">
                                <strong>Tipo:</strong> ${producto.tipo}<br>
                                <strong>Motor:</strong> ${producto.motor}<br>
                                <strong>Potencia:</strong> ${producto.potencia}<br>
                                <strong>Peso:</strong> ${producto.peso}<br>
                                <strong>Frenos:</strong> ${producto.frenos}<br>
                                <strong>Velocidad Máx:</strong> ${producto.velocidadMax}<br>
                                <strong>Precio:</strong> $${producto.precio.toLocaleString()}
                            </p>
                            <p class="card-text"><small>${producto.descripcion}</small></p>
                            <button class="btn btn-primary w-100" onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio})">
                                <i class="fas fa-shopping-cart me-2"></i>Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        productosContainer.innerHTML = html;
    } else {
        productosContainer.innerHTML = '<div class="col-12 text-center"><p>No hay productos disponibles para esta marca.</p></div>';
    }
}

// Asegurarse de que se carguen los productos cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    const marcaActual = document.body.dataset.marca;
    if (marcaActual) {
        cargarProductosPorMarca(marcaActual.toLowerCase());
    }
    actualizarContadorCarrito();
});

// Agregar efecto de seguimiento del mouse para la iluminación
document.addEventListener('mousemove', function(e) {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
});

// Agregar función para mostrar notificación
function mostrarNotificacion(mensaje) {
    const isMobile = window.innerWidth <= 768;
    const notificacion = document.createElement('div');
    notificacion.className = 'alert alert-success notification';
    notificacion.style.cssText = `
        position: fixed;
        ${isMobile ? 'bottom: 20px;' : 'top: 20px;'}
        ${isMobile ? 'left: 50%; transform: translateX(-50%);' : 'right: 20px;'}
        z-index: 1000;
        animation: fadeInOut 2s ease-in-out;
        ${isMobile ? 'width: 90%;' : 'max-width: 300px;'}
        text-align: center;
        padding: ${isMobile ? '12px' : '15px'};
        font-size: ${isMobile ? '14px' : '16px'};
    `;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 2000);
}

// Agregar el estilo de la animación
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(100%); }
        15% { opacity: 1; transform: translateX(0); }
        85% { opacity: 1; transform: translateX(0); }
        100% { opacity: 0; transform: translateX(100%); }
    }
`;
document.head.appendChild(style);

// Agregar detección de orientación para ajustar la vista
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        mostrarProductos();
    }, 100);
});

// Mejorar el manejo del scroll en móviles
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > 50) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScroll = currentScroll;
        });
    }
});

