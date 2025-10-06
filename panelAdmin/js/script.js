// panelAdmin/frontend/script.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('loginForm');
  const errorMsg = document.getElementById('errorMsg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const correo = document.getElementById('correo').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();

    if (!correo || !contrasena) {
      errorMsg.textContent = 'Por favor llena todos los campos';
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ correo, contrasena })
      });

      const data = await res.json();
      console.log('Respuesta del backend:', data);

      if (!res.ok) {
        errorMsg.textContent = data.mensaje || 'Error en el login';
        return;
      }

      // redirige usando la ruta retornada desde el servidor
      if (data.destino) {
        window.location.href = data.destino;
      } else {
        errorMsg.textContent = 'Inicio de sesión correcto, pero no hay destino configurado';
      }
    } catch (err) {
      console.error(err);
      errorMsg.textContent = 'Error de conexión con el servidor';
    }
  });
});
