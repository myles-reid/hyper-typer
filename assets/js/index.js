'use strict';

import { select, addClass, removeClass, toggleVisibility, listen, shuffleArray } from './utils.js';
import { wordBank } from './data.js';

const instructions = select('.instructions');
const countDownTimer = select('.count-down');
const toolBar = select('.tools');
const timer = select('.time');
const currentScore = select('.rescues');
const activeWord = select('.words');
const startBtn = select('.start');
const inputBox = select('.input');
const highScoreBox = select('.right-zone');
const playAgainBtn = select('.play-again');
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


// Copying the wordBank to prevent mutation.
const words = [...wordBank];
const usedWords = [];
const highScores = [];

function getWord(array) {
  // will shuffle the array every time a new word is picked.
  shuffleArray(array);
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
  gameMusic.pause();     
  toggleVisibility(activeWord, 'hidden');
  toggleVisibility(inputBox, 'hidden');
  toggleVisibility(playAgainBtn, 'visible');
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

function sortScores(scores) {
  let sortedScores = scores.sort(function(a, b){
    return b.score - a.score;
  })
  return sortedScores;
}

function createNewScore() {
  const newScore = {
    date: getDate(),
    score: score,
    percentage: ((score / wordBank.length) * 100).toFixed(1)
  };

  highScores.push(newScore);
  return score = 0;
}

function saveScores() {
  createNewScore();
  sortScores(highScores);

  if (localStorage.length > 0 && 'highScores' in localStorage){
    localStorage.removeItem('highScores');
  }

  localStorage.setItem('highScores', JSON.stringify(highScores.slice(0, 10)));
}

let intervalID;

function startTimer() {
  let time = 20;
  timer.innerText = `${time}`
 intervalID = setInterval(() => {
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
  saveScores();
  setHighScores();
}

function setCountDownState() {
  toggleVisibility(startBtn, 'hidden');
  toggleVisibility(playAgainBtn, 'hidden');
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


function setHighScores() {
  let sortedScores = sortScores(highScores);
  const placeholders = ['Could be you!', 'Could be you!', 'Could be you!'];

  sortedScores.slice(0, 3).forEach((score, index) => {
    placeholders[index] = `#${index + 1}: ${score.score} on ${score.date}`;
  });

  firstPlace.innerText = placeholders[0];
  secondPlace.innerText = placeholders[1];
  thirdPlace.innerText = placeholders[2];
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
    saveScores();
  }
})

function restartGame() {
  gameStateDeactive();
  clearInterval(intervalID);
  score = 0;
  inputBox.value = '';
  currentScore.innerHTML = `<p>Words Saved: ${score}</p>`;
  resetWords();
  setCountDownState();
  setTimeout(() => { startCountDown(); }, 500);
  startGame();
}

listen('click', playAgainBtn, restartGame);
listen('click', restartBtn, restartGame);
