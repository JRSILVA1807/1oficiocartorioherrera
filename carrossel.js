document.querySelectorAll('.carrossel').forEach(carrossel => {
  const slides = carrossel.querySelector('.slides');
  const imgs = slides.querySelectorAll('img');
  const prev = carrossel.querySelector('.prev');
  const next = carrossel.querySelector('.next');
  let index = 0;
  const total = imgs.length;

  const show = (i) => {
    index = (i + total) % total;
    slides.style.transform = `translateX(-${index * 100}%)`;
  };

  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));

  // Troca automática a cada 3 segundos
  setInterval(() => show(index + 1), 3000);
});
