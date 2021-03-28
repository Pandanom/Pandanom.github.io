function codeAddress() {
  var board = document.getElementById('boardInner');
  //var numContainer = document.getElementById('numberContainer');
  //var letterContainer = document.getElementById('letterContainer');
  var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  var numbers = ['1', '2', '3', '4', '5', '6', '7', '8']
  var display = 'block'

  const renderBoard = (isWhite) => {
    renderLetters(!isWhite);
    for (var i = 0; i < letters.length; ++i) {
      var row = document.createElement('DIV');
      row.className = 'row';

      var el = document.createElement('DIV');
      el.innerText = !isWhite ? (i + 1) : (letters.length - i);
      el.className = 'symbol';
      row.appendChild(el);

      for (var j = 0; j < letters.length; ++j) {
        var square = document.createElement('DIV');
        square.className = 'square';
        square.style.backgroundColor = (i + j) % 2 === 0 ? 'white' : 'black';
        square.id = 'cell' + i + j;
        row.appendChild(square);
      }
      board.appendChild(row);
    }
  }

  renderLetters = (reverse) => {
    var row = document.createElement('DIV');
    row.className = 'row';
    var el = document.createElement('DIV');
    el.innerText = '';
    el.className = 'symbol';
    row.appendChild(el);
    var f = (x, i) => {
      var el = document.createElement('DIV');
      el.innerText = x;
      el.className = 'symbol';
      row.appendChild(el);
    }
    if (reverse) {
      letters.slice().reverse().forEach(f);
    }
    else {
      letters.forEach(f);
    }
    board.appendChild(row);
  }
  var chatBox = document.getElementById("chatbox");
  var current = new Date();
  chatBox.innerHTML += '[' + getTimeStr() + ']Hello World!\n';
  renderBoard(true);
}

var getTimeStr = () => {
  var current = new Date();
  let h = current.getHours() > 9 ? current.getHours() : '0' + current.getHours();
  let m = current.getMinutes() > 9 ? current.getMinutes() : '0' + current.getMinutes();
  let s = current.getSeconds() > 9 ? current.getSeconds() : '0' + current.getSeconds();
  return h + ':' + m + ':' + s;
}

function sendMsg() {
  var msg = document.getElementById("usermsg");
  var chatBox = document.getElementById("chatbox");
  if (msg.value) {
    //var current = new Date();	
    chatBox.innerHTML += '[' + getTimeStr() + ']' + msg.value + '\n';
    msg.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}



function updateLeaderboardView() {
  let scores = [
    { name: "Player 1", score: 300 },
    { name: "Player 2", score: 370 },
    { name: "Player 3", score: 500 },
    { name: "Player 4", score: 430 },
    { name: "Player 5", score: 340 },
    { name: "Player 6", score: 320 },
    { name: "Player 7", score: 385 },
    { name: "Player 8", score: 520 },
    { name: "Player 9", score: 450 },
    { name: "Player 10", score: 250 },
    { name: "Player 11", score: 305 },
    { name: "Player 12", score: 375 },
    { name: "Player 13", score: 505 },
    { name: "Player 14", score: 435 },
    { name: "Player 15", score: 345 },
    { name: "Player 16", score: 325 },
    { name: "Player 17", score: 395 },
    { name: "Player 18", score: 525 },
    { name: "Player 19", score: 455 },
    { name: "Player 20", score: 255 },
  ];
  let leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "";

  scores.sort(function (a, b) { return b.score - a.score });
  let elements = []; // we'll need created elements to update colors later on
  // create elements for each player
  for (let i = 0; i < scores.length; i++) {
    let name = document.createElement("div");
    let score = document.createElement("div");
    let spacer = document.createElement("div");
    name.classList.add("lbName");
    score.classList.add("lbScore");
    spacer.classList.add("lbSpacer");
    name.innerText = scores[i].name;
    score.innerText = scores[i].score;
    let scoreRow = document.createElement("div");
    scoreRow.classList.add("row");
    scoreRow.appendChild(name);
    scoreRow.appendChild(spacer);
    scoreRow.appendChild(score);
    leaderboard.appendChild(scoreRow);

    elements.push(scoreRow);

  }

  let colors = ["gold", "silver", "#cd7f32"];
  for (let i = 0; i < 3; i++) {
    elements[i].style.color = colors[i];
  }
}

