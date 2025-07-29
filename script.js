==const rounds = 11;
let scores = JSON.parse(localStorage.getItem('scores')) || Array.from({ length: rounds }, () => ({ team1: 0, team2: 0 }));
let penalties = JSON.parse(localStorage.getItem('penalties')) || { team1: [], team2: [] };
let generalScore = JSON.parse(localStorage.getItem('generalScore')) || Array.from({ length: 15 }, () => ({ team1: '', team2: '' }));
let teamNames = JSON.parse(localStorage.getItem('teamNames')) || { team1: 'TAKIM 1', team2: 'TAKIM 2' };

function saveData() {
    localStorage.setItem('scores', JSON.stringify(scores));
    localStorage.setItem('penalties', JSON.stringify(penalties));
    localStorage.setItem('generalScore', JSON.stringify(generalScore));
    localStorage.setItem('teamNames', JSON.stringify(teamNames));
}

function resetAll() {
    scores = Array.from({ length: rounds }, () => ({ team1: 0, team2: 0 }));
    penalties = { team1: [], team2: [] };
    generalScore = Array.from({ length: 15 }, () => ({ team1: '', team2: '' }));
    teamNames = { team1: 'TAKIM 1', team2: 'TAKIM 2' }; // Reset sırasında takım isimlerini de sıfırla
    saveData();
    renderTable();
    renderPenalties();
    renderGeneralScoreTable();
    updatePenaltyHeaders();
    updateGeneralScoreTableHeaders();
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

function updateGeneralScore(team, value) {
    generalScore[team] = value;
    saveData();
}
}

function updateGeneralScore(index, team, value) {
    generalScore[index][team] = value;
    saveData();
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

function renderPenalties() {
    document.getElementById("penaltiesTeam1").innerHTML = penalties.team1
        .map((p, index) => `
            <li style="color: white;">
                ${p} <span onclick="removePenalty('team1', ${index})" class="trash-icon">🗑️</span>
            </li>
        `)
        .join("");

    document.getElementById("penaltiesTeam2").innerHTML = penalties.team2
        .map((p, index) => `
            <li style="color: white;">
                ${p} <span onclick="removePenalty('team2', ${index})" class="trash-icon">🗑️</span>
            </li>
        `)
        .join("");
}

function removePenalty(team, index) {
    penalties[team].splice(index, 1);
    saveData();
    renderPenalties();
    renderTable();
}

function renderTable() {
    const tableBody = document.getElementById("scoreTable");
    tableBody.innerHTML = "";
    let totalTeam1 = penalties.team1.reduce((a, b) => a + b, 0);
    let totalTeam2 = penalties.team2.reduce((a, b) => a + b, 0);

    scores.forEach((score, index) => {
        totalTeam1 += score.team1;
        totalTeam2 += score.team2;

        tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
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


window.onload = () => {
    updatePenaltyHeaders();
    updateGeneralScoreTableHeaders();
    renderTable();
    renderPenalties();
    renderGeneralScoreTable();
};