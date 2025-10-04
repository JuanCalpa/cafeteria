const form = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    correo: form.correo.value,
    contrasena: form.contrasena.value
  };

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      alert('Inicio de sesión exitoso');
      window.location.href = '/panelAdmin/frontend/index.html';
    } else {
      errorMsg.textContent = result.mensaje || 'Credenciales incorrectas';
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    errorMsg.textContent = 'Error de conexión con el servidor';
  }
});

