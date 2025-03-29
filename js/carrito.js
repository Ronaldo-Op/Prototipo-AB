import {
  obtenerCarrito,
  eliminarDelCarrito,
  cargarCarrito,
  agregarAlCarrito,
  actualizarContadorCarrito,
} from "./carrito_proto_ab.js";

document.addEventListener("DOMContentLoaded", function () {
  cargarCarrito(); // Carga los datos del carrito desde localStorage
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
    const imagenBase = producto.imagenBase
      ? producto.imagenBase
      : "assets/playera.png"; // Imagen base del producto
    const imagenPersonalizada = producto.imagenPersonalizada
      ? producto.imagenPersonalizada
      : null; // Imagen personalizada

    item.innerHTML = `
            <div class="contenedor-imagen">
                <img src="${imagenBase}" alt="${
      producto.nombre
    }" class="imagen-base">
                ${
                  imagenPersonalizada
                    ? `<img src="${imagenPersonalizada}" alt="Personalización" class="imagen-superpuesta" style="opacity: 0.8;">`
                    : ""
                }
            </div>
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
  document.querySelectorAll(".eliminar-btn").forEach((btn) => {
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

  carrito.forEach((producto) => {
    const item = document.createElement("div");
    item.classList.add("resumen-item");

    item.innerHTML = `
            <p><strong>${producto.nombre}</strong></p>
            <p>Precio: $${producto.precio} x ${producto.cantidad}</p>
            <p><strong>Subtotal:</strong> $${
              producto.precio * producto.cantidad
            }</p>
            <hr>
        `;

    resumenCompra.appendChild(item);
    total += producto.precio * producto.cantidad;
  });

  resumenTotal.textContent = `$${total.toFixed(2)}`;

  // Mostrar el modal de pago
  document.getElementById("modalPago").style.display = "flex";
});

document
  .getElementById("btnConfirmarPago")
  .addEventListener("click", function () {
    const pantallaCarga = document.getElementById("pantallaCarga");
    const btnPagar = document.getElementById("btnConfirmarPago");
    const cerrarModal = document.getElementById("cerrarModalPago");
    const resumenCompra = document.getElementById("resumenCompra");
    const resumenTotalTexto = document.getElementById("resumenTotalTexto");
    const modal = document.getElementById("modalPago");

    // Ocultar el resumen de compra y botones
    resumenCompra.style.display = "none";
    resumenTotalTexto.style.display = "none";
    btnPagar.style.display = "none";
    cerrarModal.style.display = "none";
    modal.style.display = "none";

    // Mostrar la pantalla de carga
    pantallaCarga.style.display = "flex";

    // Esperar 4 segundos
    setTimeout(() => {
      pantallaCarga.style.display = "none";
      modal.style.display = "flex";

      // Mostrar mensaje de éxito
      tituloModal.textContent = "✅ ¡Compra realizada con éxito!";
      resumenCompra.innerHTML = `
        <div class="compra-realizada">
        <p>Gracias por tu compra 🎉</p>
        <button id="btnAceptarCompra">Aceptar</button>
        </div>
        `;
      resumenCompra.style.display = "block";

      // Limpiar carrito
      localStorage.removeItem("carrito");
      actualizarContadorCarrito();

      // Volver a mostrar el botón cerrar si se desea
      const btnAceptar = document.getElementById("btnAceptarCompra");
      btnAceptar.addEventListener("click", () => {
        window.location.reload(); // O redirige a index.html
      });
    }, 4000);
  });
