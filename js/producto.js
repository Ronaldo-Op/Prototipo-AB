import { agregarAlCarrito } from "./carrito_proto_ab.js";

document.addEventListener("DOMContentLoaded", () => {
    const data = localStorage.getItem("productoSeleccionado");

    if (!data) {
        document.querySelector(".main-content").innerHTML = "<p>⚠️ No se encontró el producto.</p>";
        return;
    }

    const producto = JSON.parse(data);

    document.getElementById("producto-nombre").textContent = producto.nombre;
    document.getElementById("producto-descripcion").textContent = producto.descripcion || "Sin descripción.";
    document.getElementById("producto-precio").textContent = `$${producto.precio}`;
    document.getElementById("producto-imagen").src = producto.imagen || "assets/default.jpg";

    document.getElementById("btn-agregar").addEventListener("click", () => {
        const talla = document.getElementById("talla").value;
        agregarAlCarrito(
            producto.id,
            `${producto.nombre} (Talla: ${talla})`,
            producto.precio,
            producto.imagen,
            null
        );
        alert("✅ Producto añadido al carrito.");
    });
});
