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

document.getElementById("menu-toggle").addEventListener("click", function () {
    document.querySelector(".nav-links").classList.toggle("show");
});
