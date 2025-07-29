.const rounds = 11;
let scores = JSON.parse(localStorage.getItem('scores')) || Array.from({ length: rounds }, () => ({ team1: 0, team2: 0 }));
let penalties = JSON.parse(localStorage.getItem('penalties')) || { team1: [], team2: [] };
let generalScore = JSON.parse(localStorage.getItem('generalScore')) || Array.from({ length: 15 }, () => ({ team1: '', team2: '' }));
let teamNames = JSON.parse(localStorage.getItem('teamNames')) || { team1: 'TAKIM 1', team2: 'TAKIM 2' };
let playerNames = JSON.parse(localStorage.getItem('playerNames')) || ["Oyuncu 1", "Oyuncu 2", "Oyuncu 3", "Oyuncu 4"];
let startingPlayerIndex = parseInt(localStorage.getItem('startingPlayerIndex')) || 0;

function saveData() {
    localStorage.setItem('scores', JSON.stringify(scores));
    localStorage.setItem('penalties', JSON.stringify(penalties));
    localStorage.setItem('generalScore', JSON.stringify(generalScore));
    localStorage.setItem('teamNames', JSON.stringify(teamNames));
    localStorage.setItem('playerNames', JSON.stringify(playerNames));
    localStorage.setItem('startingPlayerIndex', startingPlayerIndex);
}

function resetAll() {
    scores = Array.from({ length: rounds }, () => ({ team1: 0, team2: 0 }));
    penalties = { team1: [], team2: [] };
    generalScore = Array.from({ length: 15 }, () => ({ team1: '', team2: '' }));
    teamNames = { team1: 'TAKIM 1', team2: 'TAKIM 2' };
    playerNames = ["Oyuncu 1", "Oyuncu 2", "Oyuncu 3", "Oyuncu 4"];
    startingPlayerIndex = 0;
    saveData();
    renderTable();
    renderPenalties();
    renderGeneralScoreTable();
    updatePenaltyHeaders();
    updateGeneralScoreTableHeaders();
    renderPlayerOptions();
}

function updateScores(index, team, value) {
    scores[index][team] = Number(value) || 0;
    saveData();
    renderTable();
}

function addPenalty(event, team) {
    if (event.key === "Enter") {
        let value = parseInt(event.target.value.trim(), 10);
        if (!isNaN(value)) {
            penalties[team].push(value);
            event.target.value = "";
            saveData();
            renderPenalties();
            renderTable();
        }
    }
}

function removePenalty(team, index) {
    penalties[team].splice(index, 1);
    saveData();
    renderPenalties();
    renderTable();
}

function renderPenalties() {
    document.getElementById("penaltiesTeam1").innerHTML = penalties.team1
        .map((p, index) => `
            <li style="color: white;">
                ${p} <span onclick="removePenalty('team1', ${index})" class="trash-icon">🗑️</span>
            </li>
        `).join("");

    document.getElementById("penaltiesTeam2").innerHTML = penalties.team2
        .map((p, index) => `
            <li style="color: white;">
                ${p} <span onclick="removePenalty('team2', ${index})" class="trash-icon">🗑️</span>
            </li>
        `).join("");
}

function renderTable() {
    const tableBody = document.getElementById("scoreTable");
    tableBody.innerHTML = "";
    let totalTeam1 = penalties.team1.reduce((a, b) => a + b, 0);
    let totalTeam2 = penalties.team2.reduce((a, b) => a + b, 0);

    scores.forEach((score, index) => {
        totalTeam1 += score.team1;
        totalTeam2 += score.team2;

        const currentPlayerIndex = (startingPlayerIndex + index) % 4;
        const currentPlayer = playerNames[currentPlayerIndex];

        tableBody.innerHTML += `
            <tr>
                <td>${index + 1} <br><span class="starter-tag">🔸 ${currentPlayer}</span></td>
                <td><input type="number" value="${score.team1 || ''}" onchange="updateScores(${index}, 'team1', this.value)"></td>
                <td><input type="number" value="${score.team2 || ''}" onchange="updateScores(${index}, 'team2', this.value)"></td>
            </tr>
        `;
    });

    document.getElementById("totalTeam1").innerText = totalTeam1;
    document.getElementById("totalTeam2").innerText = totalTeam2;

    const totalDifference = Math.abs(totalTeam1 - totalTeam2);
    document.getElementById("difference").innerText = `Fark: ${totalDifference}`;
    updateWinnerDisplay(totalTeam1, totalTeam2);
}

function updateWinnerDisplay(totalTeam1, totalTeam2) {
    const winnerDisplay = document.getElementById("winnerDisplay");
    const team1Name = teamNames.team1;
    const team2Name = teamNames.team2;

    if (totalTeam1 < totalTeam2) {
        winnerDisplay.innerText = `${team1Name} ÖNDE!`;
    } else if (totalTeam2 < totalTeam1) {
        winnerDisplay.innerText = `${team2Name} ÖNDE!`;
    } else {
        winnerDisplay.innerText = "DURUM EŞİT!";
    }
}

function updatePenaltyHeaders() {
    document.getElementById("team1PenaltyTitle").innerText = teamNames.team1 + " CEZALARI";
    document.getElementById("team2PenaltyTitle").innerText = teamNames.team2 + " CEZALARI";
}

function updateGeneralScoreTableHeaders() {
    document.querySelector(".general-score-table th:nth-child(1)").innerText = teamNames.team1;
    document.querySelector(".general-score-table th:nth-child(2)").innerText = teamNames.team2;
}

function handleTeamNameEdit(event, team) {
    if (event.key === 'Enter') {
        event.preventDefault();
        teamNames[team] = event.target.innerText.trim();
        event.target.blur();
        saveData();
        updatePenaltyHeaders();
        updateGeneralScoreTableHeaders();
        renderTable();
        renderGeneralScoreTable();
    }
}

function updateGeneralScore(index, team, value) {
    generalScore[index][team] = value;
    saveData();
}

function renderGeneralScoreTable() {
    const generalScoreTable = document.getElementById('generalScoreTable');
    generalScoreTable.innerHTML = generalScore.map((score, index) => `
        <tr>
            <td>Oyun ${index + 1}</td>
            <td><input type="text" value="${score.team1}" onchange="updateGeneralScore(${index}, 'team1', this.value)"></td>
            <td><input type="text" value="${score.team2}" onchange="updateGeneralScore(${index}, 'team2', this.value)"></td>
        </tr>
    `).join('');
}

function handlePlayerNameChange(index, value) {
    playerNames[index] = value;
    saveData();
    renderTable();
}

function handleStartingPlayerChange(value) {
    startingPlayerIndex = parseInt(value);
    saveData();
    renderTable();
}

function renderPlayerOptions() {
    const container = document.getElementById("playerSettings");
    if (!container) return;

    container.innerHTML = `
        <div style="margin-bottom: 10px;">
            <label>Oyuna İlk Başlayan:</label>
            <select onchange="handleStartingPlayerChange(this.value)">
                ${playerNames.map((name, i) => `
                    <option value="${i}" ${startingPlayerIndex === i ? "selected" : ""}>${name}</option>
                `).join('')}
            </select>
        </div>
        <div style="display: flex; gap: 10px;">
            ${playerNames.map((name, i) => `
                <input type="text" value="${name}" onchange="handlePlayerNameChange(${i}, this.value)">
            `).join('')}
        </div>
    `;
}

window.onload = () => {
    updatePenaltyHeaders();
    updateGeneralScoreTableHeaders();
    renderPlayerOptions();
    renderTable();
    renderPenalties();
    renderGeneralScoreTable();
};