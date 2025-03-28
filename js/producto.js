import { agregarAlCarrito, actualizarContadorCarrito } from "./carrito_proto_ab.js";

let producto = null;

document.addEventListener("DOMContentLoaded", () => {
  const data = localStorage.getItem("productoSeleccionado");

  if (!data) {
    document.querySelector(".main-content").innerHTML = "<p>⚠️ No se encontró el producto.</p>";
    return;
  }

  producto = JSON.parse(data); // 🔁 Ahora es global

  document.getElementById("producto-nombre").textContent = producto.nombre;
  document.getElementById("producto-descripcion").textContent = producto.descripcion || "Sin descripción.";
  document.getElementById("producto-precio").textContent = `$${producto.precio}`;
  document.getElementById("producto-imagen").src = producto.imagen || "assets/default.jpg";

  document.getElementById("btnPersonalizar").addEventListener("click", () => {
    if (!producto) return;

    abrirModalPersonalizacion(
      producto.id,
      producto.nombre,
      producto.precio,
      producto.imagen
    );
  });
});


let productoSeleccionado = null;
const canvas = document.getElementById("previewCanvas");
const ctx = canvas.getContext("2d");
const imgPlayera = new Image();
imgPlayera.src = "assets/playera.png"; // Imagen base de la playera
let imagenBase64 = null;

const imagenSubida = new Image(); // Imagen personalizada subida por el usuario

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modalPersonalizacion");
    const btnCerrar = document.getElementById("cerrarModal");
    const btnConfirmar = document.getElementById("confirmarPersonalizacion");
    const fileInput = document.getElementById("imagenPersonalizada");

    imgPlayera.onload = function () {
        actualizarVistaPrevia(); // Cargar imagen inicial
    };

    // Mostrar modal con la imagen del producto seleccionado
    window.abrirModalPersonalizacion = function (id, nombre, precio, imagen) {
        productoSeleccionado = { id, nombre, precio, imagen };
        modal.style.display = "flex";
        imagenSubida.src = ""; // Limpia previo
        fileInput.value = "";
        // Cargar la imagen en el canvas
        imgPlayera.src = imagen || "assets/playera.png";
        console.log(imagen)
        imgPlayera.onload = function () {
            actualizarVistaPrevia();
        };
    };

    // Cerrar modal
    btnCerrar.addEventListener("click", () => {
        cerrarModalPersonalizacion();
    });

    // Subir imagen personalizada y mostrarla en la playera
    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagenBase64 = e.target.result; // 💾 Guardamos la imagen como base64
                imagenSubida.src = imagenBase64;
                imagenSubida.onload = () => actualizarVistaPrevia();
            };
            reader.readAsDataURL(file);
        }
    });

    // Confirmar personalización y agregar al carrito
    btnConfirmar.addEventListener("click", () => {
        if (!productoSeleccionado) return;
        const talla = document.getElementById("talla").value;
        agregarAlCarrito(
            productoSeleccionado.id,
            `${productoSeleccionado.nombre} (Talla: ${talla})`,
            productoSeleccionado.precio,
            productoSeleccionado.imagen, // Imagen base del producto
            imagenBase64 // Imagen personalizada en capa superior
        );
        cerrarModalPersonalizacion();
    });
    
});

export function cerrarModalPersonalizacion() {
    const fileInput = document.getElementById("imagenPersonalizada");
    
    // 🔁 Limpiar imagen personalizada
    imagenBase64 = null;
    imagenSubida.src = ""; // Limpia el canvas si había algo cargado

    // 🧼 Limpiar input file
    if (fileInput) {
        fileInput.value = "";
    }

    // 🔄 Refrescar el canvas con solo la playera base
    actualizarVistaPrevia();

    // 🧊 Ocultar el modal
    const modal = document.getElementById("modalPersonalizacion");
    modal.style.display = "none";
}

// Función para actualizar la vista previa en el Canvas (Ahora con imagen más grande)
function actualizarVistaPrevia() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la playera base (centrada)
    ctx.drawImage(imgPlayera, 0, 0, canvas.width, canvas.height);

    // Si hay una imagen subida, dibujarla en el centro de la playera (más grande)
    if (imagenSubida.src) {
        const imgWidth = canvas.width * 0.35;
        const imgHeight = canvas.height * 0.3;
        const imgX = (canvas.width - imgWidth) / 2;
        const imgY = (canvas.height - imgHeight) / 4;
        ctx.drawImage(imagenSubida, imgX, imgY, imgWidth, imgHeight);
    }
}

window.agregarAlCarrito = agregarAlCarrito; // Hace la función accesible en index.html

const observer = new MutationObserver(() => {
    const contador = document.getElementById("contadorCarrito");
    if (contador) {
      actualizarContadorCarrito();
      observer.disconnect(); // Deja de observar una vez que está listo
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });