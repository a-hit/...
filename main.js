"use strict";

const eventType = window.ontouchstart !== null ? "mousedown" : "touchstart"; // パソコンかモバイルか判定
let songArray = [];
const red = document.getElementById("red");
const blue = document.getElementById("blue");
const yellow = document.getElementById("yellow");
const green = document.getElementById("green");
const redNote = new Audio("./assets/Cm7.mp3");
const blueNote = new Audio("./assets/D6.mp3");
const yellowNote = new Audio("./assets/D.mp3");
const greenNote = new Audio("./assets/Em.mp3");
const miss = new Audio("./assets/miss.mp3"); 
const blocks = [red, blue, yellow, green];
blocks.forEach((color, index) => {
  color.addEventListener(eventType, () => {
    clickBlock(noteArray[index]);
  });
});
const noteArray = [redNote, blueNote, yellowNote, greenNote];
let isPlaying = true;
let clickIndex = 0;
const btn = document.querySelector("#btn p");
// スタートボタン
btn.addEventListener(eventType, start);
// 初期化
function start() {
  blocks.forEach((color) => {
    color.style.opacity = 0.3;
  });
  songArray = [];
  clickIndex = 0;
  addNote();
  playSong();
  btn.removeEventListener("click", start);
}
// 音を鳴らす
function playNote(note) {
  note.currentTime = 0;
  note.play();
}
// ブロックがクリックされた時の処理
function clickBlock(note) {
  if (isPlaying) {
    return;
  }
  if (note === songArray[clickIndex]) {
    playNote(note);
    clickIndex++;
    if (clickIndex === songArray.length) {
      clickIndex = 0;
      addNote();
      playSong();
    }
  } else {
    playNote(miss);
    gameOver();
    return;
  }
}
// ノート追加
function addNote() {
  const random = Math.floor(Math.random() * noteArray.length);
  songArray.push(noteArray[random]);
}
// スリープ
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms * 1000);
  });
}
// ノート再生
async function playSong() {
  isPlaying = true;
  await sleep(0.2);
  btn.textContent = songArray.length;
  for (let i = 0; i < songArray.length; i++) {
    await sleep(0.8);
    const color = noteArray.indexOf(songArray[i]);
    blocks[color].style.opacity = 1;
    setTimeout(() => {
      blocks[color].style.opacity = 0.3;
    }, 650);
    playNote(songArray[i]);
  }
  await sleep(0.5);
  isPlaying = false;
}
// ゲームオーバー
async function gameOver() {
  btn.textContent = "GAME OVER";
  isPlaying = true;
  await sleep(2);
  const color = noteArray.indexOf(songArray[clickIndex]);
  blocks[color].style.opacity = 1;
  playNote(songArray[clickIndex]);
  setTimeout(() => {
    btn.textContent = "RESTERT";
    btn.addEventListener("click", start);
  }, 1000);
}
