// script.js - MathQuest (Versão Final - Abril 2026)

let currentUser = null;

function checkLogin() {
  currentUser = localStorage.getItem('mathquest_current_user');
  if (!currentUser) {
    window.location.href = 'login.html';
    return false;
  }
  const usernameDisplay = document.getElementById('username-display');
  if (usernameDisplay) {
    usernameDisplay.innerHTML = `👤 <span class="text-yellow-400">${currentUser}</span> <span class="text-sm text-blue-300">(logged in)</span>`;
  }
  const welcomeName = document.getElementById('welcome-name');
  if (welcomeName) welcomeName.textContent = currentUser;
  return true;
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem('mathquest_current_user');
    window.location.href = 'login.html';
  }
}

function showSection(section) {
  if (!checkLogin()) return;

  document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
  const target = document.getElementById(section);
  if (target) target.classList.remove('hidden');

  if (section === 'leaderboard') renderLeaderboard();
}

// ==================== LISTA DE JOGOS ====================
const games = [
  {
    id: 1,
    title: "Number Ninja",
    description: "Quick arithmetic operations with timer",
    icon: "⚡",
    difficulty: "Easy",
    color: "from-green-400 to-emerald-500",
    file: "number-ninja.html",
    instructions: `
      <strong>How to Play:</strong><br><br>
      • You have <strong>2 minutes and 30 seconds</strong> to answer as many questions as possible.<br>
      • Each correct answer gives you <strong>+10 points</strong>.<br>
      • Choose the correct result from the 4 options.<br>
      • The game ends automatically when time runs out.<br><br>
      <strong>Goal:</strong> Get the highest score possible!
    `
  },
  {
    id: 2,
    title: "Math Memory",
    description: "Match expressions with correct results",
    icon: "🧠",
    difficulty: "Medium",
    color: "from-purple-400 to-violet-500",
    file: "math-memory.html",
    instructions: `
      <strong>How to Play:</strong><br><br>
      • Flip the cards to find matching pairs.<br>
      • One card shows a math expression and the other the result.<br>
      • Find all <strong>8 pairs</strong>.<br>
      • Each correct pair gives you <strong>20 points</strong>.<br><br>
      <strong>Tip:</strong> Try to remember the positions of the cards!
    `
  },
  {
    id: 3,
    title: "Equation Quest",
    description: "Solve 20 equations correctly as fast as you can",
    icon: "📐",
    difficulty: "Hard",
    color: "from-blue-400 to-indigo-500",
    file: "equation-quest.html",
    instructions: `
      <strong>How to Play:</strong><br><br>
      • You must correctly answer <strong>20 equations</strong>.<br>
      • You have a maximum of <strong>90 seconds</strong>.<br>
      • If you get even one wrong → Game Over.<br>
      • If you complete all 20 correctly → You win!<br><br>
      <strong>The faster you finish, the better your position on the leaderboard!</strong>
    `
  }
];

// ==================== RENDERIZAR JOGOS ====================
function renderGames() {
  const container = document.getElementById('games-grid');
  if (!container) return;
  container.innerHTML = '';

  games.forEach(game => {
    const card = document.createElement('div');
    card.className = `game-card bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden transition-all hover:scale-105`;

    card.innerHTML = `
      <div class="h-52 bg-gradient-to-br ${game.color} flex items-center justify-center text-8xl">
        ${game.icon}
      </div>
      <div class="p-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold">${game.title}</h3>
          <span class="px-4 py-1 bg-white/20 text-xs rounded-full">${game.difficulty}</span>
        </div>
        <p class="text-blue-100 mb-6">${game.description}</p>
        
        <div class="flex flex-col gap-3">
          <button onclick="startGame('${game.file}')" 
                  class="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-2xl transition">
            Play Now →
          </button>
          
          <button onclick="showInstructions(${game.id})" 
                  class="w-full bg-white/20 hover:bg-white/30 border border-white/40 text-white font-medium py-3.5 rounded-2xl transition">
            📋 How to Play
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function startGame(filename) {
  window.location.href = filename;
}

function showInstructions(id) {
  const game = games.find(g => g.id === id);
  if (!game) return;

  const modalHTML = `
    <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onclick="if(event.target === this) this.remove()">
      <div class="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl p-10 max-w-lg w-full mx-4 text-white">
        <h2 class="text-3xl font-bold mb-6">📋 ${game.title} - How to Play</h2>
        <div class="text-lg leading-relaxed text-blue-100">
          ${game.instructions}
        </div>
        <button onclick="this.closest('.fixed').remove()" 
                class="mt-10 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-5 rounded-3xl transition">
          Got it, thanks!
        </button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// ==================== LEADERBOARD POR JOGO ====================
function renderLeaderboard() {
  const container = document.getElementById('leaderboard-content');
  if (!container) return;

  let allScores = JSON.parse(localStorage.getItem('mathquest_leaderboard')) || [];

  const ninjaScores    = allScores.filter(s => s.game === "Number Ninja");
  const memoryScores   = allScores.filter(s => s.game === "Math Memory");
  const equationScores = allScores.filter(s => s.game === "Equation Quest");

  let html = `<h2 class="text-4xl font-bold text-center mb-12">🏆 Leaderboards</h2>`;

  html += createGameLeaderboard("Number Ninja ⚡", ninjaScores, "Highest Score (Points)", true);
  html += createGameLeaderboard("Math Memory 🧠", memoryScores, "Highest Score (Points)", true);
  html += createGameLeaderboard("Equation Quest 📐", equationScores, "Best Time (Lower is better)", false);

  container.innerHTML = html;
}

function createGameLeaderboard(title, scores, subtitle, isPoints) {
  // Ordenar: se for pontos → descending | se for tempo → ascending
  scores.sort((a, b) => isPoints ? b.score - a.score : a.score - b.score);

  let html = `
    <div class="mb-16">
      <h3 class="text-2xl font-bold mb-2">${title}</h3>
      <p class="text-blue-300 mb-6">${subtitle}</p>
  `;

  if (scores.length === 0) {
    html += `<p class="text-center text-blue-200 py-12 bg-white/5 rounded-3xl">No scores yet.<br>Be the first to play!</p>`;
  } else {
    html += `<div class="space-y-4">`;
    scores.slice(0, 10).forEach((entry, i) => {
      const displayValue = isPoints ? entry.score : entry.score + "s";
      html += `
        <div class="flex justify-between items-center bg-white/10 px-8 py-5 rounded-3xl">
          <div class="flex items-center gap-6">
            <span class="text-4xl w-10 text-yellow-400 font-bold">${i + 1}</span>
            <div class="font-bold text-lg">${entry.username}</div>
          </div>
          <div class="text-right">
            <div class="text-5xl font-mono text-yellow-400">${displayValue}</div>
            <div class="text-xs text-blue-300">${isPoints ? 'points' : 'seconds'}</div>
          </div>
        </div>`;
    });
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}
// ==================== QUIZZES ====================

let currentQuiz = null;
let currentQuestionIndex = 0;
let quizScore = 0;

const quizzes = {
  1: { // History of Equations
    title: "History of Equations",
    questions: [
      {
        q: "When was the Pythagorean Theorem first known?",
        options: ["Around 500 BC", "Around 200 BC", "1200 AD", "1600 AD"],
        answer: 0
      },
      {
        q: "Who invented the equals sign (=) and in what year?",
        options: ["Robert Recorde in 1557", "Euclid in 300 BC", "Isaac Newton in 1687", "Galileo in 1600"],
        answer: 0
      },
      {
        q: "When was the quadratic formula developed in its modern form?",
        options: ["9th century by Al-Khwarizmi", "16th century", "18th century", "19th century"],
        answer: 0
      }
    ]
  },
  2: { // Famous Mathematicians
    title: "Famous Mathematicians",
    questions: [
      {
        q: "Who is known as the 'Father of Geometry'?",
        options: ["Euclid", "Pythagoras", "Archimedes", "Descartes"],
        answer: 0
      },
      {
        q: "Which mathematician invented Calculus (along with Leibniz)?",
        options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Leonhard Euler"],
        answer: 0
      },
      {
        q: "Who created the Fibonacci sequence?",
        options: ["Leonardo Fibonacci", "Euclid", "Pythagoras", "Archimedes"],
        answer: 0
      }
    ]
  },
  3: { // Math Curiosities
    title: "Math Curiosities",
    questions: [
      {
        q: "What is the only even prime number?",
        options: ["0", "1", "2", "4"],
        answer: 2
      },
      {
        q: "How many sides does a dodecahedron have?",
        options: ["12", "20", "6", "8"],
        answer: 0
      },
      {
        q: "What does 'π' (pi) represent?",
        options: ["Circle's circumference to diameter ratio", "Golden ratio", "Euler's number", "Speed of light"],
        answer: 0
      }
    ]
  }
};

// ==================== INICIALIZAÇÃO ====================
window.onload = () => {
  if (!checkLogin()) return;
  showSection('home');
  renderGames();
};