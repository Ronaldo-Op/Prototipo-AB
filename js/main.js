import { supabase } from "./supabase-config.js";
import {
  agregarAlCarrito,
  obtenerCarrito,
  actualizarContadorCarrito,
} from "./carrito_proto_ab.js";
document.addEventListener("DOMContentLoaded", function () {
  actualizarContadorCarrito(); // 🔹 Se ejecuta cuando la página carga
});
document.addEventListener("DOMContentLoaded", function () {
  cargarProductos();
});

let pagina = 1; // Número de veces que hemos cargado los productos
const repeticionesPorCarga = 5; // Cuántas veces se repite la lista por carga

async function cargarProductos() {
  const productosContainer = document.querySelector(".grid-productos");

  const { data: productos, error } = await supabase
    .from("productos")
    .select("*");
  if (error) {
    console.error("Error al obtener productos:", error);
    return;
  }

  for (let i = 0; i < repeticionesPorCarga; i++) {
    productos.forEach((producto) => {
      const item = document.createElement("div");
      item.classList.add("producto-item");

      const imagenSrc = producto.imagen
        ? producto.imagen
        : "assets/default.jpg";

      item.innerHTML = `
                <img src="${imagenSrc}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <button class="personalizar-btn">Personalizar y Añadir al Carrito</button>
            `;

      // Redirigir al hacer clic en la tarjeta (excepto el botón)
      item.addEventListener("click", (e) => {
        if (!e.target.classList.contains("personalizar-btn")) {
          localStorage.setItem(
            "productoSeleccionado",
            JSON.stringify(producto)
          );
          window.location.href = "producto.html";
        }
      });

      // Botón de personalización (delegado desde la tarjeta)
      item.querySelector(".personalizar-btn").addEventListener("click", (e) => {
        e.stopPropagation(); // Prevenir redirección
        abrirModalPersonalizacion(
          producto.id,
          producto.nombre,
          producto.precio,
          imagenSrc
        );
      });

      productosContainer.appendChild(item);
    });
  }

  console.log(
    `✅ Se han cargado ${
      productos.length * repeticionesPorCarga
    } productos en la página.`
  );
}

// Cargar los productos iniciales
cargarProductos();

// Detectar cuando el usuario llega al final del scroll
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    pagina++;
    cargarProductos();
  }
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
    console.log(imagen);
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
    ctx.globalAlpha = 0.8; // 🔶 Aquí controlas la opacidad (0 = transparente, 1 = sólido)
    ctx.drawImage(imagenSubida, imgX, imgY, imgWidth, imgHeight);
    ctx.globalAlpha = 1.0; // 🔁 Importante: volver a la opacidad normal
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

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".banner-carrusel .slide");
  const btnIzq = document.querySelector(".flecha.izquierda");
  const btnDer = document.querySelector(".flecha.derecha");
  let indice = 0;

  function mostrarSlide(index) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[index].classList.add("active");
  }

  btnIzq.addEventListener("click", () => {
    indice = (indice - 1 + slides.length) % slides.length;
    mostrarSlide(indice);
  });

  btnDer.addEventListener("click", () => {
    indice = (indice + 1) % slides.length;
    mostrarSlide(indice);
  });

  // Cambiar automáticamente cada 5 segundos
  setInterval(() => {
    indice = (indice + 1) % slides.length;
    mostrarSlide(indice);
  }, 5000);
});

