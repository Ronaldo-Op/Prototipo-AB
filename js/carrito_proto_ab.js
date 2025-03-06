export let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Agregar un producto al carrito
export function agregarAlCarrito(id, nombre, precio, imagen) {
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
    }

    guardarCarrito();
    actualizarContadorCarrito();
}

// Eliminar un producto del carrito
export function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
}

// Obtener el carrito actualizado
export function obtenerCarrito() {
    return carrito;
}

// Guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Cargar el carrito desde localStorage
export function cargarCarrito() {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
}

// Función para actualizar el contador en la navbar
export function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contador = document.getElementById("contadorCarrito");

    if (contador) {
        if (carrito.length > 0) {
            contador.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
            contador.style.display = "flex";
        } else {
            contador.style.display = "none";
        }
    }
}
