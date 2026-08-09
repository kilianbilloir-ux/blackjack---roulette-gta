// app.js
// Blackjack : 1 croupier + jusqu'à 6 participants
// Argent fictif illimité

const MAX_PLAYERS = 6;

let players = [];
let deck = [];
let dealer = {
    name: "Croupier",
    cards: [],
    score: 0
};

let gameStarted = false;

// =========================
// DECK
// =========================

const suits = ["♠", "♥", "♦", "♣"];
const values = [
    { name: "2", value: 2 },
    { name: "3", value: 3 },
    { name: "4", value: 4 },
    { name: "5", value: 5 },
    { name: "6", value: 6 },
    { name: "7", value: 7 },
    { name: "8", value: 8 },
    { name: "9", value: 9 },
    { name: "10", value: 10 },
    { name: "J", value: 10 },
    { name: "Q", value: 10 },
    { name: "K", value: 10 },
    { name: "A", value: 11 }
];

function createDeck() {
    deck = [];

    for (const suit of suits) {
        for (const card of values) {
            deck.push({
                name: card.name,
                value: card.value,
                suit: suit
            });
        }
    }

    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawCard() {
    if (deck.length === 0) {
        createDeck();
    }

    return deck.pop();
}

// =========================
// SCORE
// =========================

function calculateScore(cards) {
    let score = 0;
    let aces = 0;

    cards.forEach(card => {
        score += card.value;

        if (card.name === "A") {
            aces++;
        }
    });

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

// =========================
// JOUEURS
// =========================

function addPlayer(name) {

    if (players.length >= MAX_PLAYERS) {
        alert("Maximum 6 participants.");
        return;
    }

    name = name.trim();

    if (!name) {
        alert("Entre un nom.");
        return;
    }

    players.push({
        id: Date.now(),
        name: name,
        cards: [],
        score: 0,
        money: Infinity,
        bet: 0,
        standing: false,
        busted: false,
        blackjack: false
    });

    renderPlayers();
}

function removePlayer(id) {

    players = players.filter(player => player.id !== id);

    renderPlayers();
}

// =========================
// NOUVELLE PARTIE
// =========================

function startGame() {

    if (players.length === 0) {
        alert("Ajoute au moins un participant.");
        return;
    }

    createDeck();

    gameStarted = true;

    dealer.cards = [];
    dealer.score = 0;

    players.forEach(player => {

        player.cards = [];
        player.score = 0;
        player.bet = 0;
        player.standing = false;
        player.busted = false;
        player.blackjack = false;

        player.cards.push(drawCard());
        player.cards.push(drawCard());

        player.score = calculateScore(player.cards);

        if (player.score === 21) {
            player.blackjack = true;
            player.standing = true;
        }
    });

    dealer.cards.push(drawCard());
    dealer.cards.push(drawCard());

    dealer.score = calculateScore(dealer.cards);

    renderGame();
}

// =========================
// ACTIONS
// =========================

function hitPlayer(id) {

    const player = players.find(p => p.id === id);

    if (!player || player.standing || player.busted) {
        return;
    }

    player.cards.push(drawCard());

    player.score = calculateScore(player.cards);

    if (player.score > 21) {
        player.busted = true;
        player.standing = true;
    }

    renderGame();
}

function standPlayer(id) {

    const player = players.find(p => p.id === id);

    if (!player) {
        return;
    }

    player.standing = true;

    renderGame();
}

// =========================
// CROUPIER
// =========================

function dealerPlay() {

    if (!gameStarted) {
        return;
    }

    while (calculateScore(dealer.cards) < 17) {
        dealer.cards.push(drawCard());
    }

    dealer.score = calculateScore(dealer.cards);

    players.forEach(player => {

        if (player.busted) {
            return;
        }

        if (player.blackjack) {
            return;
        }

        if (dealer.score > 21) {
            return;
        }

        if (player.score > dealer.score) {
            // gagné
        }
        else if (player.score === dealer.score) {
            // égalité
        }
        else {
            // perdu
        }
    });

    renderGame();
}

// =========================
// AFFICHAGE
// =========================

function cardHTML(card) {

    let red = card.suit === "♥" || card.suit === "♦";

    return `
        <div class="card ${red ? "red" : ""}">
            <div class="card-value">${card.name}</div>
            <div class="card-suit">${card.suit}</div>
        </div>
    `;
}

function renderPlayers() {

    const container = document.getElementById("players");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    players.forEach((player, index) => {

        const div = document.createElement("div");

        div.className = "player";

        div.innerHTML = `
            <div class="player-header">
                <h3>${escapeHTML(player.name)}</h3>
                <button onclick="removePlayer(${player.id})">
                    ❌
                </button>
            </div>

            <div class="player-info">
                Participant ${index + 1}
            </div>

            <div class="cards">
                ${player.cards.map(card => cardHTML(card)).join("")}
            </div>

            <div class="score">
                Score :
                <strong>
                    ${player.score}
                </strong>
            </div>

            <div class="player-actions">

                <button
                    onclick="hitPlayer(${player.id})"
                    ${player.standing ? "disabled" : ""}
                >
                    Tirer
                </button>

                <button
                    onclick="standPlayer(${player.id})"
                    ${player.standing ? "disabled" : ""}
                >
                    Rester
                </button>

            </div>

            <div class="status">
                ${getPlayerStatus(player)}
            </div>
        `;

        container.appendChild(div);
    });

    updatePlayerCount();
}

function renderGame() {

    renderPlayers();

    const dealerContainer =
        document.getElementById("dealer-cards");

    const dealerScore =
        document.getElementById("dealer-score");

    if (dealerContainer) {

        dealerContainer.innerHTML =
            dealer.cards.map(card => cardHTML(card)).join("");
    }

    if (dealerScore) {

        dealerScore.textContent =
            dealer.score;
    }

    const dealerButton =
        document.getElementById("dealer-play");

    if (dealerButton) {
        dealerButton.disabled =
            players.some(player =>
                !player.standing &&
                !player.busted
            );
    }

    checkEndGame();
}

// =========================
// STATUTS
// =========================

function getPlayerStatus(player) {

    if (player.blackjack) {
        return "🃏 BLACKJACK";
    }

    if (player.busted) {
        return "💥 BUST";
    }

    if (player.standing) {
        return "✋ Reste";
    }

    return "🎮 En jeu";
}

function getWinnerStatus(player) {

    if (player.busted) {
        return "❌ Perdu";
    }

    if (player.blackjack) {
        return "🃏 Blackjack";
    }

    if (dealer.score > 21) {
        return "🏆 Gagné";
    }

    if (player.score > dealer.score) {
        return "🏆 Gagné";
    }

    if (player.score === dealer.score) {
        return "🤝 Égalité";
    }

    return "❌ Perdu";
}

// =========================
// FIN DE PARTIE
// =========================

function checkEndGame() {

    if (!gameStarted) {
        return;
    }

    const allFinished =
        players.length > 0 &&
        players.every(player =>
            player.standing || player.busted
        );

    if (!allFinished) {
        return;
    }

    const dealerButton =
        document.getElementById("dealer-play");

    if (dealerButton) {
        dealerButton.disabled = false;
    }
}

function showResults() {

    if (!gameStarted) {
        return;
    }

    dealerPlay();

    const results =
        document.getElementById("results");

    if (!results) {
        return;
    }

    results.innerHTML = `
        <h2>Résultats</h2>

        ${players.map(player => `
            <div class="result-player">

                <strong>
                    ${escapeHTML(player.name)}
                </strong>

                <span>
                    ${getWinnerStatus(player)}
                </span>

            </div>
        `).join("")}
    `;
}

// =========================
// COMPTEUR
// =========================

function updatePlayerCount() {

    const counter =
        document.getElementById("player-count");

    if (!counter) {
        return;
    }

    counter.textContent =
        `${players.length}/${MAX_PLAYERS}`;
}

// =========================
// UTILITAIRE
// =========================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

// =========================
// BOUTONS HTML
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const addButton =
        document.getElementById("add-player");

    const nameInput =
        document.getElementById("player-name");

    const startButton =
        document.getElementById("start-game");

    const dealerButton =
        document.getElementById("dealer-play");

    if (addButton && nameInput) {

        addButton.addEventListener("click", () => {

            addPlayer(nameInput.value);

            nameInput.value = "";

            nameInput.focus();
        });

        nameInput.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                addPlayer(nameInput.value);

                nameInput.value = "";
            }
        });
    }

    if (startButton) {

        startButton.addEventListener(
            "click",
            startGame
        );
    }

    if (dealerButton) {

        dealerButton.addEventListener(
            "click",
            showResults
        );
    }

    renderPlayers();
});