import { supabase } from "./supabase-config.js";

// 🔥 Cargar la navbar dinámicamente
async function cargarNavbar() {
    try {
        const navbarContainer = document.createElement("div");
        const response = await fetch("navbar.html");
        navbarContainer.innerHTML = await response.text();
        document.body.prepend(navbarContainer);
        console.log("✅ Navbar cargada correctamente.");

        // ⚡ Disparar un evento personalizado para indicar que la navbar ya está en el DOM
        const eventoNavbarCargada = new Event("navbarCargada");
        document.dispatchEvent(eventoNavbarCargada);
    } catch (error) {
        console.error("❌ Error al cargar la navbar:", error);
    }
}

// ✅ Ejecutar la carga de la navbar al abrir cualquier página
document.addEventListener("DOMContentLoaded", cargarNavbar);

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("navLinks");

    if (!menuToggle || !navLinks) {
        console.warn("⚠️ No se encontró 'menu-toggle' o 'navLinks' en esta página.");
        return; // Detener ejecución si los elementos no existen
    }

    console.log("✅ Navbar cargada correctamente.");

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("show"); // Alternar visibilidad del menú
    });

    // Cerrar el menú cuando se hace clic en un enlace
    document.querySelectorAll(".nav-links li a").forEach(link => {
        link.addEventListener("click", function () {
            navLinks.classList.remove("show");
        });
    });
});

