// script.js
const container = document.querySelector('.hologram-container');
const content = document.querySelector('.hologram-content');

// Máxima rotación en grados
const maxRotation = 15;

container.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect();

  // Calcula la posición del ratón relativa al centro del contenedor
  // Normalizado entre -0.5 y 0.5
  const mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
  const mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

  // Calcula la rotación (invertimos Y para que al subir el ratón incline hacia arriba)
  const rotateY = mouseX * maxRotation;
  const rotateX = -mouseY * maxRotation;

  // Aplica la transformación CSS
  content.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

// Resetea la rotación cuando el ratón sale del contenedor
container.addEventListener('mouseleave', () => {
  content.style.transform = 'rotateX(0deg) rotateY(0deg)';
});