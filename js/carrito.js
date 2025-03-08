import { obtenerCarrito, eliminarDelCarrito, cargarCarrito, agregarAlCarrito, actualizarContadorCarrito } from "./carrito_proto_ab.js";

document.addEventListener("DOMContentLoaded", function () {
    cargarCarrito();  // Carga los datos del carrito desde localStorage
    mostrarCarrito();
});

function mostrarCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    const totalPrecio = document.getElementById("total-precio");
    const totalCarritoContainer = document.querySelector(".total-carrito");
    const btnPagar = document.getElementById("btn-pagar");

    listaCarrito.innerHTML = ""; // Limpiar contenido previo

    const carrito = obtenerCarrito();
    let total = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";

        // Ocultar el monto total y el botón de pago
        totalCarritoContainer.style.display = "none";
        btnPagar.style.display = "none";
        
        return;
    }

    // Mostrar el monto total y el botón de pago si hay productos
    totalCarritoContainer.style.display = "block";
    btnPagar.style.display = "inline-block";

    carrito.forEach((producto, index) => {
        const item = document.createElement("div");
        item.classList.add("carrito-item");

        const imagenSrc = producto.imagen ? producto.imagen : "assets/default.jpg";

        item.innerHTML = `
            <img src="${imagenSrc}" alt="${producto.nombre}">
            <div class="info">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                <button class="eliminar-btn" data-index="${index}">Eliminar</button>
            </div>
        `;
        listaCarrito.appendChild(item);
        total += producto.precio * producto.cantidad;
    });

    totalPrecio.textContent = `$${total.toFixed(2)}`;

    // Agregar eventos a los botones de eliminar
    document.querySelectorAll(".eliminar-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            eliminarProducto(index);
        });
    });
}


// Función para eliminar un producto del carrito
function eliminarProducto(index) {
    let carrito = obtenerCarrito();
    carrito.splice(index, 1); // Eliminar producto del array
    localStorage.setItem("carrito", JSON.stringify(carrito)); // Actualizar localStorage
    mostrarCarrito(); // Refrescar la vista del carrito
}

// Evento para proceder al pago
document.getElementById("btn-pagar").addEventListener("click", function () {
    if (obtenerCarrito().length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    // Aquí se puede integrar un sistema de pago real
});

document.getElementById("btn-pagar").addEventListener("click", function () {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de proceder al pago.");
        return;
    }

    // Mostrar el resumen de compra en el modal
    const resumenCompra = document.getElementById("resumenCompra");
    const resumenTotal = document.getElementById("resumenTotal");
    resumenCompra.innerHTML = ""; // Limpiar contenido previo

    let total = 0;

    carrito.forEach(producto => {
        const item = document.createElement("div");
        item.classList.add("resumen-item");

        item.innerHTML = `
            <p><strong>${producto.nombre}</strong></p>
            <p>Precio: $${producto.precio} x ${producto.cantidad}</p>
            <p><strong>Subtotal:</strong> $${producto.precio * producto.cantidad}</p>
            <hr>
        `;

        resumenCompra.appendChild(item);
        total += producto.precio * producto.cantidad;
    });

    resumenTotal.textContent = `$${total.toFixed(2)}`;

    // Mostrar el modal de pago
    document.getElementById("modalPago").style.display = "flex";
});

document.getElementById("btnConfirmarPago").addEventListener("click", function () {
    const btnPagar = document.getElementById("btnConfirmarPago");
    const cerrarModal = document.getElementById("cerrarModalPago");
    const resumenCompra = document.getElementById("resumenCompra");
    const resumenTotalTexto = document.getElementById("resumenTotalTexto");
    const tituloModal = document.getElementById("tituloModal");

    console.log("🔄 Procesando pago...");

    // Ocultar el resumen de compra y botones
    resumenCompra.style.display = "none";
    resumenTotalTexto.style.display = "none";
    btnPagar.style.display = "none";
    cerrarModal.style.display = "none";

    // Mostrar mensaje de compra realizada con botón de aceptar
    tituloModal.innerHTML = "✅ ¡Compra realizada!";
    resumenCompra.innerHTML = `
        <div class="compra-realizada">
            <p>¡Gracias por tu compra! 🎉</p>
            <button id="btnAceptarCompra">Aceptar</button>
        </div>
    `;
    resumenCompra.style.display = "block";

    // Limpiar el carrito después de la compra
    console.log("🗑 Limpiando carrito...");
    localStorage.removeItem("carrito");

    // Actualizar el contador del carrito
    actualizarContadorCarrito();

    // Agregar evento para cerrar el modal al hacer clic en "Aceptar"
    setTimeout(() => {
        document.getElementById("btnAceptarCompra").addEventListener("click", function () {
            document.getElementById("modalPago").style.display = "none";
            location.reload(); // 🔹 Recargar la página
        });
    }, 100);
});

document.getElementById("btnPrueba").addEventListener("click", function () {
    const pantallaCarga = document.getElementById("pantallaCarga");

    // Mostrar la pantalla de carga
    pantallaCarga.style.display = "flex";

    // Ocultar la pantalla de carga después de 4 segundos
    setTimeout(() => {
        pantallaCarga.style.display = "none";
    }, 4000);
});
