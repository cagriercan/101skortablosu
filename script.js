const rounds = 11;
let scores = Array.from({ length: rounds }, () => ({ team1: 0, team2: 0 }));
let penalties = { team1: [], team2: [] };

function resetAll() {
    scores = Array.from({ length: rounds }, () => ({ team1: 0, team2: 0 }));
    penalties = { team1: [], team2: [] };
    renderTable();
    renderPenalties();
    updatePenaltyHeaders();
}

function updateScores(index, team, value) {
    scores[index][team] = Number(value) || 0;
    renderTable();
}

function addPenalty(event, team) {
    if (event.key === "Enter") {
        let value = parseInt(event.target.value.trim(), 10);  // Number() yerine parseInt() kullanıyoruz.
        if (!isNaN(value)) {  // Değer geçerli bir sayı ise işleme devam et.
            penalties[team].push(value);
            event.target.value = "";
            renderPenalties();
            renderTable();
        }
    }
}


function renderPenalties() {
    document.getElementById("penaltiesTeam1").innerHTML = penalties.team1
        .map((p, index) => `
            <li style="color: white; cursor: pointer;">
                ${p} <span onclick="removePenalty('team1', ${index})" style="color: gray; cursor: pointer;">🗑️</span>
            </li>
        `)
        .join("");

    document.getElementById("penaltiesTeam2").innerHTML = penalties.team2
        .map((p, index) => `
            <li style="color: white; cursor: pointer;">
                ${p} <span onclick="removePenalty('team2', ${index})" style="color: gray; cursor: pointer;">🗑️</span>
            </li>
        `)
        .join("");
}

function removePenalty(team, index) {
    penalties[team].splice(index, 1);
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
    const team1Name = document.getElementById("team1Name").innerText.trim() || "TAKIM 1";
    const team2Name = document.getElementById("team2Name").innerText.trim() || "TAKIM 2";

    if (totalTeam1 < totalTeam2) {
        winnerDisplay.innerText = `${team1Name} ÖNDE!`;
    } else if (totalTeam2 < totalTeam1) {
        winnerDisplay.innerText = `${team2Name} ÖNDE!`;
    } else {
        winnerDisplay.innerText = "DURUM EŞİT!";
    }
}

function updatePenaltyHeaders() {
    document.getElementById("team1PenaltyTitle").innerText = document.getElementById("team1Name").innerText + " CEZALARI";
    document.getElementById("team2PenaltyTitle").innerText = document.getElementById("team2Name").innerText + " CEZALARI";
}

// Yeni Fonksiyon: Takım adı değiştirildiğinde Enter tuşuna basılınca kaydetmeyi sağlar
function handleTeamNameEdit(event, team) {
    if (event.key === "Enter") {
        event.preventDefault(); // Enter tuşuna basıldığında alt satıra geçmeyi engeller
        event.target.blur(); // Edit işleminden çıkış yapar
        updatePenaltyHeaders(); // Başlıkları günceller
    }
}

window.onload = renderTable;
