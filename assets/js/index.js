'use strict';

function select(selector, scope = document) {
  return scope.querySelector(selector);
}

function selectAll(selector, scope = document) {
  return scope.querySelectorAll(selector);
}

function listen(event, element, callback) {
  return element.addEventListener(event, callback);
}

function toggleVisibility(element, status) {
  return element.style.visibility = status;
}

function addClass(element, text) {
  return element.classList.add(text);
}

function removeClass(element, text) {
  return element.classList.remove(text);
}

function toggleClass(element, text) {
  return element.classList.toggle(text);
}

const wordBank = [
  'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
  'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
  'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
  'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
  'philosophy', 'database', 'periodic', 'capitalism', 'abominable', 'phone',
  'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
  'velvet', 'potion', 'treasure', 'beacon', 'labyrinth', 'whisper', 'breeze',
  'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology',
  'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
  'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
  'butterfly', 'discovery', 'ambition', 'music', 'eagle', 'crown',
  'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'door', 'bird',
  'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework',
  'beach', 'economy', 'interview', 'awesome', 'challenge', 'science',
  'mystery', 'famous', 'league', 'memory', 'leather', 'planet', 'software',
  'update', 'yellow', 'keyboard', 'window', 'beans', 'truck', 'sheep',
  'blossom', 'secret', 'wonder', 'enchantment', 'destiny', 'quest', 'sanctuary',
  'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil',
  'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
  'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort',
  'mask', 'escape', 'promise', 'band', 'level', 'hope', 'moonlight', 'media',
  'orchestra', 'volcano', 'guitar', 'raindrop', 'inspiration', 'diamond',
  'illusion', 'firefly', 'ocean', 'cascade', 'journey', 'laughter', 'horizon',
  'exploration', 'serendipity', 'infinity', 'silhouette', 'wanderlust',
  'marvel', 'nostalgia', 'serenity', 'reflection', 'twilight', 'harmony',
  'symphony', 'solitude', 'essence', 'melancholy', 'melody', 'vision',
  'silence', 'whimsical', 'eternity', 'cathedral', 'embrace', 'poet', 'ricochet',
  'mountain', 'dance', 'sunrise', 'dragon', 'adventure', 'galaxy', 'echo',
  'fantasy', 'radiant', 'serene', 'legend', 'starlight', 'light', 'pressure',
  'bread', 'cake', 'caramel', 'juice', 'mouse', 'charger', 'pillow', 'candle',
  'film', 'jupiter'
  ];

const instructions = select('.instructions');
const countDownTimer = select('.count-down');
const toolBar = select('.tools');
const timer = select('.time');
const currentScore = select('.rescues');
const activeWord = select('.words');
const startBtn = select('.start');
const inputBox = select('.input');
const highScoreBox = select('.score-zone');
const restartBtn = select('.restart');
const firstPlace = select('.first');
const secondPlace = select('.second');
const thirdPlace = select('.third');
const gameMusic = new Audio('./assets/audio/bgmusic.mp3');
const collectSound = new Audio('./assets/audio/collect.mp3')
collectSound.type = 'audio/mp3';
collectSound.volume = 0.2;
gameMusic.type = 'audio/mp3';
gameMusic.volume = 0.2;

class Score {
  #date;
  #score;
  #percentage;

  constructor(date, score, percentage) {
    this.#date = date;
    this.#score = score;
    this.#percentage = percentage;
  }

  get date() { return this.#date };
  get score() { return this.#score };
  get percentage() { return this.#percentage };
}

function startCountDown() {
  let time = 3
  countDownTimer.innerHTML = `<h2>${time}</h2>`;
  const intervalID = setInterval(() => {
    if (time > 1){
      countDownTimer.innerHTML = `<h2>${time -= 1}</h2>`;
    } else {
      countDownTimer.innerHTML = `<h2>GO!</h2>`;
      clearInterval(intervalID);
    }
  }, 1000);
};

const words = [...wordBank];
const usedWords = [];
const highScores = [];


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getWord(array) {
  shuffleArray(array)
  let word = array.pop();
  usedWords.push(word);
  return word.toUpperCase(); 
}

function setWord() {
  activeWord.innerHTML = `<h2>${getWord(words)}</h2>`;
}

function resetWords() {
  for (let i = usedWords.length - 1; i > 0; i--){
    words.push(usedWords[i]);
  }
}

function gameStateActive() {
  toggleVisibility(countDownTimer, 'hidden');
  toggleVisibility(toolBar, 'visible');
  toggleVisibility(activeWord, 'visible');
  toggleVisibility(inputBox, 'visible');
  toggleVisibility(highScoreBox, 'visible');
}

function gameStateDeactive() {
  toggleVisibility(activeWord, 'hidden');
  toggleVisibility(inputBox, 'hidden');
  toggleVisibility(restartBtn, 'visible');
}

let score = 0;
function updateScore() {
  score += 1;
  currentScore.innerHTML = `<p>Words Saved: ${score}</p>`;
}


function getDate() {
  const options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit' 
  } 

  return new Date().toLocaleDateString('en-ca', options);
}

function createNewScore() {
  let percentage = (score / wordBank.length) * 100;
  const highScore = new Score(getDate(), score, percentage.toFixed(1));
  highScores.push(highScore);

  return score = 0;
}

function startTimer() {
  let time = 120
  timer.innerText = `${time}`
  const intervalID = setInterval(() => {
    if (time > 1){
      timer.innerText = `${time -= 1}`;
    } else {
      timer.innerText = `END`
      clearInterval(intervalID);
      gameStateDeactive();
      createNewScore();
      gameMusic.pause();
      setHighScores();
    }
  }, 1000);
};

function setCountDownState() {
  toggleVisibility(countDownTimer, 'visible');
  toggleVisibility(toolBar, 'hidden');
  toggleVisibility(highScoreBox, 'hidden');
}

function startGame() {
  setTimeout(() => {
    gameStateActive();
    setWord();
    startTimer();
    gameMusic.load();
    gameMusic.play();
    inputBox.focus();
  }, 3500);
}

function sortScores(scores) {
  let sortedScores = scores.sort(function(a, b){
    return b.score - a.score;
  })
  return sortedScores;
}

function setHighScores() {
  let sortedScores = sortScores(highScores);
  console.log(sortedScores[0]);
  if (highScores.length >= 3) {
    firstPlace.innerText = `#1: ${sortedScores[0].score} on ${sortedScores[0].date}`;
    secondPlace.innerText = `#2: ${sortedScores[1].score} on ${sortedScores[1].date}`;
    thirdPlace.innerText = `#3: ${sortedScores[2].score} on ${sortedScores[2].date}`;
    return;
  }
  if (highScores.length === 2) {
    firstPlace.innerText = `#1: ${sortedScores[0].score} on ${sortedScores[0].date}`;
    secondPlace.innerText = `#2: ${sortedScores[1].score} on ${sortedScores[1].date}`;
    thirdPlace.innerText = `#3: Your Score here`;
    return;
  }
  if (highScores.length === 1) {
    firstPlace.innerText = `#1: ${sortedScores[0].score} on ${sortedScores[0].date}`;
    secondPlace.innerText = `#2: Your Name here`;
    thirdPlace.innerText = `#3: Your Name here`;
    return;
  }
}

listen('click', startBtn, () => {
  toggleVisibility(instructions, 'hidden');
  toggleVisibility(startBtn, 'hidden');
  toggleVisibility(countDownTimer, 'visible');
  startCountDown();
  startGame();
});


listen('input', inputBox, () => {
  if (inputBox.value.toUpperCase().trim() === activeWord.innerText) { 
    collectSound.play();
    setWord()
    updateScore();
    inputBox.value = '';
    inputBox.focus();
  };
  if (words.length === 0){
    gameStateDeactive();
    clearInterval(intervalID);
    createNewScore();
  }
})

listen('click', restartBtn, () => {
  toggleVisibility(restartBtn, 'hidden');
  inputBox.value = '';
  currentScore.innerHTML = `<p>Words Saved: ${score}</p>`;
  resetWords();
  setCountDownState();
  startCountDown();
  startGame();
})






