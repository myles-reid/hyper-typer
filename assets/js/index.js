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

class Score {
  #date;
  #score;
  #percentage;

  constructor(date, score, percentage) {
    this.#date = date;
    this.#score = score;
    this.#percentage = percentage;
  }

  getDate() { return this.#date };
  getScore() { return this.#score };
  getPercentage() { return this.#percentage };
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
  toggleVisibility(startBtn, 'visible');
}

let score = 0;
function updateScore() {
  score += 1;
  currentScore.innerHTML = `<p>Words Saved: ${score}</p>`;
}

function startTimer() {
  let time = 10
  timer.innerText = `${time}`
  const intervalID = setInterval(() => {
    if (time > 1){
      timer.innerText = `${time -= 1}`;
    } else {
      timer.innerText = `END`
      clearInterval(intervalID);
      gameStateDeactive();
    }
  }, 1000);
};

listen('click', startBtn, () => {
  toggleVisibility(instructions, 'hidden');
  toggleVisibility(startBtn, 'hidden');
  toggleVisibility(countDownTimer, 'visible');
  startCountDown();
  setTimeout(() => {
    gameStateActive();
    setWord();
    startTimer();
    inputBox.focus();
  }, 3500);
});


listen('input', inputBox, () => {
  if (inputBox.value.toUpperCase().trim() === activeWord.innerText) { 
    setWord()
    updateScore();
    inputBox.value = '';
    inputBox.focus();
  };
})






