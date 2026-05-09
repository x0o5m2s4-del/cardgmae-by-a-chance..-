const firebaseConfig = {
  apiKey: "AIzaSyD2ZvVaN_ZWrTKvQdWGpdLyt0jb1FHnVp4",
  authDomain: "cardgame-ed26e.firebaseapp.com",
  projectId: "cardgame-ed26e",
  storageBucket: "cardgame-ed26e.firebasestorage.app",
  messagingSenderId: "830034089374",
  appId: "1:830034089374:web:7c00cf947426a813f8b28f"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const symbols = ["🍓", "🍓", "🐰", "🐰", "🌸", "🌸"];

let cards = [];
let flippedCards = [];
let score = 0;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

async function startGame() {

  const studentId =
    document.getElementById("studentId").value.trim();

  const name =
    document.getElementById("name").value.trim();

  if (!studentId || !name) {
    alert("학번과 이름을 입력해줘!");
    return;
  }

  const snapshot = await db
    .collection("scores")
    .where("studentId", "==", studentId)
    .get();

  if (!snapshot.empty) {
    alert("이미 참여한 학생이야!");
    return;
  }

  document.getElementById("start-screen").style.display = "none";

  document.getElementById("game-screen").style.display = "block";

  cards = shuffle([...symbols]);

  const board = document.getElementById("game-board");

  board.innerHTML = "";

  cards.forEach((symbol) => {

    const card = document.createElement("div");

    card.className = "card";

    card.dataset.symbol = symbol;

    card.addEventListener("click", () => flipCard(card));

    board.appendChild(card);

  });

}

async function flipCard(card) {

  if (card.textContent !== "") return;

  if (flippedCards.length >= 2) return;

  card.textContent = card.dataset.symbol;

  flippedCards.push(card);

  if (flippedCards.length === 2) {

    const card1 = flippedCards[0];
    const card2 = flippedCards[1];

    if (card1.dataset.symbol === card2.dataset.symbol) {

      score++;

      document.getElementById("score").textContent = score;

    }

    flippedCards = [];

    const openedCards =
      [...document.querySelectorAll(".card")]
      .filter(card => card.textContent !== "");

    if (openedCards.length === 6) {

      const studentId =
        document.getElementById("studentId").value;

      const name =
        document.getElementById("name").value;

      await db.collection("scores").add({
        name: name,
        studentId: studentId,
        score: score,
        time: new Date()
      });

      setTimeout(() => {

        alert(name + "님의 최종 점수는 " + score + "점입니다!");

      }, 300);

    }

  }

}

window.startGame = startGame;
