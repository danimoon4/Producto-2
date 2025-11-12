// js/login.js
import { almacenaje } from "./almacenaje.js";

const $ = (sel) => document.querySelector(sel);

function mostrarUsuarioActivo() {
  const label = $("#usuarioActivoLabel");
  if (!label) return;
  const activo = almacenaje.obtenerUsuarioActivo();
  label.textContent = activo ? activo.nombre : "-no login-";
  console.log("[login] usuarioActivoLabel =", label.textContent);
}

function mostrarAlerta(tipo, mensaje) {
  const alerta = $("#alerta");
  if (!alerta) return;
  alerta.className = `alert mt-3 alert-${tipo}`;
  alerta.textContent = mensaje;
  alerta.classList.remove("d-none");
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("[login] DOM listo");
  mostrarUsuarioActivo();

  const form = $("#loginForm");
  const emailInput = $("#emailInput");
  const passwordInput = $("#passwordInput");
  const logoutBtn = $("#logoutBtn");

  // Si existe el botón "Cerrar sesión" lo activamos
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      almacenaje.cerrarSesion();
      mostrarUsuarioActivo();
      alert("Sesión cerrada.");
    });
  }

  if (!form) {
    console.error("[login] No se encontró #loginForm en el DOM");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput?.value ?? "";
    const password = passwordInput?.value ?? "";

    const res = almacenaje.loguearUsuario(email, password);
    console.log("[login] resultado login:", res);

    if (res.ok) {
      mostrarUsuarioActivo();
      mostrarAlerta("success", `Bienvenida, ${res.user.nombre}. Inicio de sesión correcto.`);
      // redirigir al dashboard (si quieres): window.location.href = "index.html";
    } else {
      mostrarAlerta("danger", res.error || "No se pudo iniciar sesión.");
    }
  });
});