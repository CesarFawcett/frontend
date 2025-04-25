const images = ['assets/img1.png', 'assets/img2.png', 'assets/img3.png', 'assets/img4.png', 'assets/img5.png', 'assets/img6.png'];
let cards = [], flipped = [], matched = 0, score = 0, timer = 0, interval;
let gameStarted = false;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createCards() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  cards = images.concat(images);
  shuffle(cards);

  cards.forEach((img) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.img = img;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back" style="background-image: url('${img}')"></div>
      </div>
    `;
    card.onclick = () => flipCard(card);
    board.appendChild(card);
  });
}

function shuffleCards() {
  clearInterval(interval);
  gameStarted = false; 
  timer = 0;
  score = 0;
  matched = 0;
  document.getElementById('timer').innerText = `⏱ Tiempo: 0s`;
  document.getElementById('score').innerText = `⭐ Puntos: 0`;
  createCards();
}

function startGame() {
  gameStarted = true;
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => {
    card.classList.add('flipped');
    card.classList.add('hover-effect'); 
  });

  setTimeout(() => {
    allCards.forEach(card => card.classList.remove('flipped'));
    startTimer();
  }, 1000);
}

function flipCard(card) {
  if (!gameStarted || card.classList.contains('flipped') || flipped.length === 2) return;
  card.classList.add('flipped');
  flipped.push(card);

  if (flipped.length === 2) {
    const [first, second] = flipped;
    if (first.dataset.img === second.dataset.img) {
      score += 5;
      matched += 2;
      flipped = [];
      updateScore();
      if (matched === cards.length) endGame();
    } else {
      setTimeout(() => {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
        flipped = [];
      }, 800);
    }
  }
}

function startTimer() {
  interval = setInterval(() => {
    timer++;
    document.getElementById('timer').innerText = `⏱ Tiempo: ${timer}s`;
  }, 1000);
}

function updateScore() {
  document.getElementById('score').innerText = `⭐ Puntos: ${score}`;
}

function endGame() {
  clearInterval(interval);
  setTimeout(() => {
    alert(`¡Juego terminado!\nPuntos: ${score}\nTiempo: ${timer} segundos.`);
  }, 500);
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}


shuffleCards();