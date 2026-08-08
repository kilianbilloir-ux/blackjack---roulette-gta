let currentTable = null;
let isDealer = false;

function hideAll() {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("createPanel").classList.add("hidden");
    document.getElementById("joinPanel").classList.add("hidden");
    document.getElementById("tableScreen").classList.add("hidden");
}

function backHome() {
    hideAll();
    document.getElementById("home").classList.remove("hidden");
}

function showCreate() {
    hideAll();
    document.getElementById("createPanel").classList.remove("hidden");
}

function showJoin() {
    hideAll();
    document.getElementById("joinPanel").classList.remove("hidden");
}


function generateCode() {
    const number = Math.floor(1000 + Math.random() * 9000);
    return "BJ-" + number;
}


function createTable() {

    const name = document.getElementById("dealerName").value.trim();

    if (!name) {
        alert("Entre ton pseudo.");
        return;
    }

    currentTable = {
        code: generateCode(),
        dealer: name,
        players: []
    };

    isDealer = true;

    openTable();
}


function joinTable() {

    const name = document.getElementById("playerName").value.trim();
    const code = document.getElementById("tableCode").value.trim().toUpperCase();

    if (!name) {
        alert("Entre ton pseudo.");
        return;
    }

    if (!code) {
        alert("Entre le code de la table.");
        return;
    }

    /*
     * Pour l'instant, cette version est locale.
     * Firebase permettra ensuite de rejoindre
     * une vraie table depuis un autre téléphone.
     */

    currentTable = {
        code: code,
        dealer: "Croupier",
        players: []
    };

    currentTable.players.push({
        name: name
    });

    isDealer = false;

    openTable();
}


function openTable() {

    hideAll();

    document
        .getElementById("tableScreen")
        .classList.remove("hidden");

    document.getElementById("displayCode").textContent =
        currentTable.code;

    renderPlayers();
}


function renderPlayers() {

    const container = document.getElementById("players");

    container.innerHTML = "";

    currentTable.players.forEach(player => {

        const div = document.createElement("div");

        div.className = "player";

        div.innerHTML = `
            <div class="player-name">
                ${player.name}
            </div>

            <div class="player-money">
                💰 Argent illimité
            </div>
        `;

        container.appendChild(div);
    });

    document.getElementById("playerCount").textContent =
        currentTable.players.length;
}


function newRound() {

    alert("Nouvelle manche prête !");

}


function dealCards() {

    alert("La distribution des cartes sera ajoutée ensuite.");

}


function leaveTable() {

    currentTable = null;
    isDealer = false;

    backHome();
}