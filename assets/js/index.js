'use strict';

import { select, addClass, removeClass, toggleVisibility, listen } from './utils.js';
import { wordBank } from './data.js';

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
  addClass(countDownTimer, 'timer-fade-out');
  countDownTimer.innerHTML = `<h2>${time}</h2>`;
  const intervalID = setInterval(() => {
    if (time > 1){
      countDownTimer.innerHTML = `<h2>${time -= 1}</h2>`;
    } else {
      countDownTimer.innerHTML = `<h2>GO!</h2>`;
      clearInterval(intervalID);
      setTimeout(() => {removeClass(countDownTimer, 'timer-fade-out')}, 1000);
    }
  }, 1100);
};



function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

const words = [...wordBank];
const usedWords = [];
const highScores = [];

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

function animateGameIn() {
  removeClass(toolBar, 'fade-out');
  removeClass(activeWord, 'fade-out');
  removeClass(inputBox, 'fade-out');
  removeClass(highScoreBox, 'fade-out');
  addClass(toolBar, 'fade-in');
  addClass(activeWord, 'fade-in');
  addClass(inputBox, 'fade-in');
  addClass(highScoreBox, 'fade-in');
}


function gameStateActive() {
  toggleVisibility(countDownTimer, 'hidden');
  toggleVisibility(toolBar, 'visible');
  toggleVisibility(activeWord, 'visible');
  toggleVisibility(inputBox, 'visible');
  toggleVisibility(highScoreBox, 'visible');
  animateGameIn();
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
      gameEndState();
    }
  }, 1000);
};

function gameEndState() {
  gameStateDeactive();
  createNewScore();
  gameMusic.pause();
  setHighScores();
}

function setCountDownState() {
  toggleVisibility(startBtn, 'hidden');
  toggleVisibility(restartBtn, 'hidden');
  toggleVisibility(toolBar, 'hidden');
  toggleVisibility(highScoreBox, 'hidden');
  toggleVisibility(instructions, 'hidden');
  setTimeout(() => { toggleVisibility(countDownTimer, 'visible'); }, 500);
}

function startGame() {
  setTimeout(() => {
    gameStateActive();
    setWord();
    startTimer();
    gameMusic.load();
    gameMusic.play();
    inputBox.focus();
  }, 4900);
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
    thirdPlace.innerText = `#3: Could be you!`;
    return;
  }
  if (highScores.length === 1) {
    firstPlace.innerText = `#1: ${sortedScores[0].score} on ${sortedScores[0].date}`;
    secondPlace.innerText = `#2: Could be you!`;
    thirdPlace.innerText = `#3: Could be you!`;
    return;
  }
}



listen('click', startBtn, () => {
  setCountDownState();
  setTimeout(() => { startCountDown(); }, 500);
  startGame();
});


listen('input', inputBox, () => {
  if (inputBox.value.toUpperCase().trim() === activeWord.innerText) { 
    collectSound.play();
    setWord();
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
  inputBox.value = '';
  currentScore.innerHTML = `<p>Words Saved: ${score}</p>`;
  resetWords();
  setCountDownState();
  setTimeout(() => { startCountDown(); }, 500);
  startGame();
})
