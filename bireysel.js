const rounds = 11;
let scores = Array.from({ length: rounds }, () => ({ player1: 0, player2: 0, player3: 0, player4: 0 }));
let penalties = { player1: [], player2: [], player3: [], player4: [] };
let playerNames = { player1: "OYUNCU 1", player2: "OYUNCU 2", player3: "OYUNCU 3", player4: "OYUNCU 4" };

function resetAll() {
    scores = Array.from({ length: rounds }, () => ({ player1: 0, player2: 0, player3: 0, player4: 0 }));
    penalties = { player1: [], player2: [], player3: [], player4: [] };
    renderTable();
    renderPenalties();
    showWinner({ player1: 0, player2: 0, player3: 0, player4: 0 });  // Kazanan kısmı silinmiyor, eşit gösterimi yapılıyor.
}


function updateScores(index, player, value) {
    scores[index][player] = Number(value) || 0;
    renderTable();
}

function addPenalty(event, player) {
    if (event.key === "Enter") {
        let value = parseInt(event.target.value.trim(), 10);  // Number() yerine parseInt() kullandık.
        if (!isNaN(value)) {  // Eğer değer geçerli bir sayıysa
            penalties[player].push(value);
            event.target.value = "";
            renderPenalties();
            renderTable();
        }
    }
}

function renderPenalties() {
    ['player1', 'player2', 'player3', 'player4'].forEach(player => {
        document.getElementById(`penalties${player.charAt(0).toUpperCase() + player.slice(1)}`).innerHTML = 
            penalties[player].map((p, index) => `<li>${p} <span onclick="removePenalty('${player}', ${index})">🗑️</span></li>`).join("");
    });
}

function removePenalty(player, index) {
    penalties[player].splice(index, 1);
    renderPenalties();
    renderTable();
}

function renderTable() {
    const tableBody = document.getElementById("scoreTable");
    tableBody.innerHTML = "";

    let total = { player1: 0, player2: 0, player3: 0, player4: 0 };
    let totalWithPenalties = { ...total };
    
    scores.forEach((score, index) => {
        ['player1', 'player2', 'player3', 'player4'].forEach(player => {
            total[player] += score[player];
            totalWithPenalties[player] = total[player] + penalties[player].reduce((a, b) => a + b, 0);
        });

        tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><input type="number" placeholder="" value="${score.player1 === 0 ? '' : score.player1}" onchange="updateScores(${index}, 'player1', this.value)"></td>
                <td><input type="number" placeholder="" value="${score.player2 === 0 ? '' : score.player2}" onchange="updateScores(${index}, 'player2', this.value)"></td>
                <td><input type="number" placeholder="" value="${score.player3 === 0 ? '' : score.player3}" onchange="updateScores(${index}, 'player3', this.value)"></td>
                <td><input type="number" placeholder="" value="${score.player4 === 0 ? '' : score.player4}" onchange="updateScores(${index}, 'player4', this.value)"></td>
            </tr>
        `;
    });

    document.getElementById("totalPlayer1").innerText = totalWithPenalties.player1;
    document.getElementById("totalPlayer2").innerText = totalWithPenalties.player2;
    document.getElementById("totalPlayer3").innerText = totalWithPenalties.player3;
    document.getElementById("totalPlayer4").innerText = totalWithPenalties.player4;

    showWinner(totalWithPenalties);
}


function showWinner(totals) {
    const sortedPlayers = Object.keys(totals).sort((a, b) => totals[a] - totals[b]);
    const lowestScore = totals[sortedPlayers[0]];  // En düşük skoru bul
    
    const winners = sortedPlayers.filter(player => totals[player] === lowestScore);  // En düşük skora sahip tüm oyuncuları bul
    
    const allZero = Object.values(totals).every(value => value === 0);  // Tüm puanlar sıfır mı kontrol et

    if (allZero) {
        document.getElementById("winnerDisplay").innerText = "DURUM EŞİT!";
    } else if (winners.length > 1) {  // Eğer birden fazla kazanan varsa
        const winnerNames = winners.map(player => playerNames[player] || player.toUpperCase()).join(" - ");
        document.getElementById("winnerDisplay").innerText = `${winnerNames} ÖNDE!`;
    } else {  // Tek bir kazanan varsa
        const winnerName = playerNames[winners[0]] || winners[0].toUpperCase();
        document.getElementById("winnerDisplay").innerText = `${winnerName} ÖNDE!`;
    }
}





function handlePlayerNameEdit(event, player) {
    if (event.key === "Enter") {
        playerNames[player] = event.target.innerText.trim() || playerNames[player];
        event.target.blur();
        syncPenaltyTitles();
    }
}

function syncPenaltyTitles() {
    document.getElementById("penaltiesPlayer1").previousElementSibling.innerText = `${playerNames.player1} CEZALARI`;
    document.getElementById("penaltiesPlayer2").previousElementSibling.innerText = `${playerNames.player2} CEZALARI`;
    document.getElementById("penaltiesPlayer3").previousElementSibling.innerText = `${playerNames.player3} CEZALARI`;
    document.getElementById("penaltiesPlayer4").previousElementSibling.innerText = `${playerNames.player4} CEZALARI`;
}

renderTable();
