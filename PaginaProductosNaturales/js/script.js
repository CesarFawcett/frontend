function actualizarReloj() {
  const ahora = new Date();
  const horas = ahora.getHours().toString().padStart(2, '0');
  const minutos = ahora.getMinutes().toString().padStart(2, '0');
  const segundos = ahora.getSeconds().toString().padStart(2, '0');
  const reloj = `${horas}:${minutos}:${segundos}`;
  document.getElementById('reloj').textContent = reloj;
}

setInterval(actualizarReloj, 1000);
actualizarReloj();

const toggleBtn = document.getElementById('toggle-theme');
toggleBtn.addEventListener('click', () => {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  toggleBtn.textContent = isDark ? '🌙' : '☀️';
});

document.body.setAttribute('data-theme', 'light');