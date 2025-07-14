// --- Oyun Geçişleri ---
function showHome() {
  document.querySelectorAll('.game-section').forEach(el => el.classList.remove('active'));
  document.getElementById('section-home').classList.add('active');
  document.querySelectorAll('nav button').forEach(el => el.classList.remove('active'));
}
function selectGame(game) {
  document.querySelectorAll('.game-section').forEach(el => el.classList.remove('active'));
  document.getElementById('section-' + game).classList.add('active');
  document.querySelectorAll('nav button').forEach(el => el.classList.remove('active'));
  document.getElementById('btn-' + game).classList.add('active');
  if (game === "color-match") initColorMatch();
  if (game === "balloon") initBalloon();
  if (game === "animal") initAnimal();
  if (game === "memory") initMemory();
  if (game === "xox") setXoxMode(xoxModeComputer);
  if (game === "sudoku") initSudoku();
  if (game === "maze") initMaze();
  if (game === "flood") initFlood();
  if (game === "number-guessing") initGuessGame();
  if (game === "whos-missing") initWhosMissingGame(); // BU SATIRI EKLEYİN
  if (game === "liquid-sort") initLiquidSortGame();
  if (game === "catch") initCatchGame();
}

// --- Gece/Gündüz Modu ---
function toggleMode() {
  const body = document.body;
  const btn = document.getElementById('mode-btn');
  const isNight = body.classList.toggle('night');
  if(isNight) {
    btn.textContent = "☀️";
    btn.title = "Gündüz Modu";
  } else {
    btn.textContent = "🌙";
    btn.title = "Gece Modu";
  }
  try {
    localStorage.setItem('melisaNightMode', isNight ? '1' : '0');
  } catch(e){}
}
function restoreMode() {
  try {
    const mode = localStorage.getItem('melisaNightMode');
    if(mode === "1") {
      document.body.classList.add("night");
      document.getElementById('mode-btn').textContent = "☀️";
      document.getElementById('mode-btn').title = "Gündüz Modu";
    } else {
      document.body.classList.remove("night");
      document.getElementById('mode-btn').textContent = "🌙";
      document.getElementById('mode-btn').title = "Gece Modu";
    }
  } catch(e){}
}

function toggleFenerbahceTheme() {
  const body = document.body;
  const fenerbahceOn = body.classList.toggle('fenerbahce');

  // Fenerbahçe teması açılırsa diğer temaları kapat
  if (fenerbahceOn) {
    body.classList.remove('rainbow');
    body.classList.remove('night');
    document.getElementById('rainbow-btn').classList.remove('active');
    document.getElementById('mode-btn').textContent = "🌙";
    document.getElementById('mode-btn').title = "Gece Modu";
  }
  updateThemeButtons(); // Butonların aktif durumunu güncelle
  saveMode(); // Temayı kaydet
}

// --- Renk Eşleştirme ---
const colorList = [
  "#ff7272", "#7fff8f", "#7fcaff", "#ffe066",
  "#b967ff", "#ffb86f", "#fcb69f", "#8cfffb"
];
function initColorMatch() {
  let pairs = colorList.concat(colorList);
  pairs = pairs.sort(() => Math.random() - 0.5);
  const board = document.getElementById('color-match-board');
  board.innerHTML = '';
  let open = [], matched = 0;
  for (let i = 0; i < 16; i++) {
    const div = document.createElement('div');
    div.className = 'color-card';
    div.style.setProperty('--card-color', pairs[i]);
    div.dataset.color = pairs[i];
    div.onclick = function () {
      if (div.classList.contains("matched") || div.classList.contains("open") || open.length === 2) return;
      div.classList.add("open");
      open.push(div);
      if (open.length === 2) {
        setTimeout(() => {
          if (open[0].dataset.color === open[1].dataset.color) {
            open[0].classList.add("matched"); open[1].classList.add("matched");
            matched += 2;
            open[0].onclick = null; open[1].onclick = null;
            if (matched === 16) {
              showOverlay("win", "Tebrikler!", "🎉", initColorMatch);
            }
          } else {
            open[0].classList.remove("open");
            open[1].classList.remove("open");
          }
          open = [];
        }, 450);
      }
    };
    board.appendChild(div);
  }
  document.getElementById('color-match-result').textContent = '';
}

// --- Balon Patlatma ---
function initBalloon() {
  const balloonColors = ["#ffb6d5","#ff8fcf","#ffe066","#b967ff","#7fcaff"];
  let numbers = Array.from({length:20},(_,i)=>i+1).sort(()=>Math.random()-0.5);
  let next = 1;
  const board = document.getElementById('balloon-board');
  board.innerHTML = '';
  document.getElementById('balloon-result').textContent = '';
  numbers.forEach(num => {
    const div = document.createElement('div');
    div.className = 'balloon';
    div.style.background = balloonColors[num%balloonColors.length];
    div.textContent = num;
    div.onclick = function(){
      if(num === next) {
        div.classList.add("pop");
        div.style.pointerEvents = "none";
        next++;
        if(next===21){
          showOverlay("win", "Tebrikler!", "🎈", initBalloon);
        }
      } else {
        showOverlay("fail", "Yanlış balon!", "😢", initBalloon);
      }
    }
    board.appendChild(div);
  });
}

// --- Hayvan Bulma ---
const animalList = [
  {name:"Kedi",img:"https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&w=120&h=120&fit=crop"},
  {name:"Köpek",img:"https://images.pexels.com/photos/4587994/pexels-photo-4587994.jpeg?auto=compress&w=120&h=120&fit=crop"},
  {name:"Kuş",img:"https://images.pexels.com/photos/45911/peacock-plumage-bird-peafowl-45911.jpeg?auto=compress&w=120&h=120&fit=crop"},
  {name:"Tavşan",img:"https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&w=120&h=120&fit=crop"},
  {name:"Balık",img:"https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&w=120&h=120&fit=crop"},
  {name:"At",img:"https://images.pexels.com/photos/52500/horse-herd-fog-nature-52500.jpeg?auto=compress&w=120&h=120&fit=crop"},
  {name:"İnek",img:"https://images.pexels.com/photos/162240/cow-cattle-animal-horn-162240.jpeg?auto=compress&w=120&h=120&fit=crop"},
  {name:"Fil",img:"https://images.pexels.com/photos/667205/pexels-photo-667205.jpeg?auto=compress&w=120&h=120&fit=crop"},
];
function initAnimal() {
  document.getElementById('animal-result').textContent = '';
  const board = document.getElementById('animal-board');
  board.innerHTML = '';
  const options = animalList.sort(()=>Math.random()-0.5).slice(0,4);
  const answer = options[Math.floor(Math.random()*options.length)];
  const img = document.createElement('img');
  img.className = "animal-img";
  img.src = answer.img;
  img.alt = answer.name;
  img.onerror = function(){this.style.display="none";}
  board.appendChild(img);
  const optDiv = document.createElement('div');
  optDiv.id = "animal-options";
  options.sort(()=>Math.random()-0.5).forEach(opt=>{
    const btn = document.createElement('button');
    btn.className = 'animal-btn';
    btn.textContent = opt.name;
    btn.onclick = function(){
      if(opt.name===answer.name){
        showOverlay("win", "Tebrikler!", "🐾", initAnimal);
      }else{
        showOverlay("fail", "Yanlış hayvan!", "😢", initAnimal);
      }
    };
    optDiv.appendChild(btn);
  });
  board.appendChild(optDiv);
}

// --- Hafıza Oyunu ---
const memoryEmojis = ["🍎","🍌","🍇","🍉","🍒","🍓","🥕","🍋"];
function initMemory() {
  let pairs = memoryEmojis.concat(memoryEmojis);
  pairs = pairs.sort(() => Math.random() - 0.5);
  const board = document.getElementById('memory-board');
  board.innerHTML = '';
  let open = [], matched = 0;
  for(let i=0;i<16;i++) {
    const div = document.createElement('div');
    div.className = 'memory-card';
    div.dataset.emoji = pairs[i];
    div.textContent = '';
    div.onclick = function(){
      if (div.classList.contains("matched") || div.classList.contains("open") || open.length===2) return;
      div.classList.add("open");
      div.textContent = pairs[i];
      open.push(div);
      if(open.length===2){
        setTimeout(()=>{
          if(open[0].dataset.emoji === open[1].dataset.emoji){
            open[0].classList.add("matched"); open[1].classList.add("matched");
            matched += 2;
            open[0].onclick = null; open[1].onclick = null;
            if(matched===16){
              showOverlay("win", "Tebrikler!", "🎊", initMemory);
            }
          }else{
            open[0].classList.remove("open"); open[0].textContent='';
            open[1].classList.remove("open"); open[1].textContent='';
          }
          open = [];
        },500);
      }
    };
    board.appendChild(div);
  }
  document.getElementById('memory-result').textContent = '';
}

// --- XOX ---
let xoxModeComputer = false;
function setXoxMode(compMode) {
  xoxModeComputer = compMode;
  document.getElementById('xox-human-btn').classList.toggle('active', !compMode);
  document.getElementById('xox-computer-btn').classList.toggle('active', compMode);
  initXox();
}
function xoxComputerBestMove(cells) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let l of lines) {
    let [a,b,c] = l;
    let vals = [cells[a], cells[b], cells[c]];
    if(vals.filter(v=>v==="O").length===2 && vals.includes("")){
      let idx = l[vals.indexOf("")];
      return idx;
    }
  }
  for (let l of lines) {
    let [a,b,c] = l;
    let vals = [cells[a], cells[b], cells[c]];
    if(vals.filter(v=>v==="X").length===2 && vals.includes("")){
      let idx = l[vals.indexOf("")];
      return idx;
    }
  }
  if(cells[4] === "") return 4;
  let corners = [0,2,6,8].filter(i=>cells[i]==="");
  if(corners.length) return corners[Math.floor(Math.random()*corners.length)];
  let empty = [];
  for(let i=0;i<9;i++) if(!cells[i]) empty.push(i);
  if(empty.length) return empty[Math.floor(Math.random()*empty.length)];
  return -1;
}
function initXox() {
  document.getElementById('xox-human-btn').classList.toggle('active', !xoxModeComputer);
  document.getElementById('xox-computer-btn').classList.toggle('active', xoxModeComputer);

  let turn = "X";
  let cells = Array(9).fill("");
  const board = document.getElementById('xox-board');
  board.innerHTML = '';
  let gameOver = false;

  for(let i=0;i<9;i++){
    const div = document.createElement('div');
    div.className = 'xox-cell';
    div.addEventListener('click', function() {
      if(cells[i] || gameOver) return;
      if(xoxModeComputer && turn==="O") return;
      cells[i] = turn;
      div.textContent = turn;
      div.classList.toggle('o', turn==="O");
      const result = checkWin();
      if(result){
        gameOver = true;
        setTimeout(()=>{
          if(result==="Berabere"){
            showOverlay("fail", "Berabere!", "😶", initXox);
          } else {
            showOverlay("win", result+" kazandı!", result==="X"?"❌":"⭕", initXox);
          }
        }, 300);
      } else {
        if(xoxModeComputer) {
          turn = turn==="X" ? "O" : "X";
          setTimeout(computerMove, 600);
        } else {
          turn = turn==="X" ? "O" : "X";
        }
      }
    });
    board.appendChild(div);
  }
  function checkWin() {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for(let l of lines){
      if(cells[l[0]] && cells[l[0]]===cells[l[1]] && cells[l[0]]===cells[l[2]])
        return cells[l[0]];
    }
    if(cells.every(c=>c)) return "Berabere";
    return null;
  }
  function computerMove() {
    if(gameOver) return;
    let idx = xoxComputerBestMove(cells);
    if(idx === -1) return;
    cells[idx] = "O";
    let cellDiv = board.children[idx];
    cellDiv.textContent = "O";
    cellDiv.classList.add("o");
    const result = checkWin();
    if(result){
      gameOver = true;
      setTimeout(()=>{
        if(result==="Berabere"){
          showOverlay("fail", "Berabere!", "😶", initXox);
        } else {
          showOverlay("win", result+" kazandı!", result==="X"?"❌":"⭕", initXox);
        }
      }, 300);
    } else {
      turn = "X";
    }
  }
}

// --- Sudoku: 5 farklı tablo, her yenilemede rastgele biri! ---
const sudokuExamples = [
  [
    [5,3,"","",7,"","","",""],
    [6,"","",1,9,5,"","",""],
    ["",9,8,"","","","",6,""],
    [8,"","","",6,"","","",3],
    [4,"","",8,"",3,"","",1],
    [7,"","","",2,"","","",6],
    ["",6,"","","","",2,8,""],
    ["","","",4,1,9,"","",5],
    ["","","","",8,"","",7,9]
  ],
  [
    ["",2,"",6,"","",8,"",""],
    [5,8,"","","",9,7,"",""],
    ["","",9,"",4,"","",1,""],
    [6,"",2,"","","","",9,""],
    ["",5,"","","",3,"","",8],
    ["",4,"",9,"","","",5,""],
    ["",9,"","","",7,"",8,""],
    ["",7,"","",2,"","","",6],
    ["",1,"",8,"","",4,"",""]
  ],
  [
    [1,"","","",7,"",9,"",8],
    ["",3,"",1,"",6,"",5,""],
    ["",2,"",4,"","","",6,""],
    ["",7,4,"",3,"",1,"",2],
    ["",1,"",9,"",2,"",8,""],
    [8,"",3,"",1,"",6,"",4],
    ["",9,"","","",4,"",2,""],
    ["",8,"",2,"",3,"",1,""],
    [2,"","","",5,"",7,"",9]
  ],
  [
    ["",6,"",1,"","","",8,""],
    [2,"","",6,"",7,"",9,""],
    ["",9,8,"","","",6,"",3],
    ["",7,"","","",4,"",1,""],
    ["",5,9,"",2,"",4,3,""],
    ["",4,"",5,"","","",2,""],
    [7,"",3,"","","",1,6,""],
    ["",8,"",7,"",5,"","",4],
    ["",1,"","","",9,"",7,""]
  ],
  [
    ["",1,"","",8,"",3,"",""],
    [6,"",3,"","","",1,"",5],
    ["",9,"",3,"",2,"",8,""],
    [8,"",7,"",6,"",4,"",1],
    ["",4,"",8,"",1,"",5,""],
    ["",6,"",9,"",7,"",2,""],
    ["",2,"",5,"",9,"",7,""],
    [1,"",6,"","","",8,"",4],
    ["",7,"",4,"",8,"",9,""]
  ]
];
function initSudoku() {
  const board = document.getElementById('sudoku-board');
  board.innerHTML = '';
  let gridRaw = sudokuExamples[Math.floor(Math.random()*sudokuExamples.length)];
  let grid = JSON.parse(JSON.stringify(gridRaw));
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      const inp = document.createElement('input');
      inp.maxLength = 1;
      inp.className = 'sudoku-cell';
      // 3x3 kutu kenarları
      if (r % 3 === 0) inp.style.borderTop = "2px solid #ff8fcf";
      if (c % 3 === 0) inp.style.borderLeft = "2px solid #ff8fcf";
      if (r === 8) inp.style.borderBottom = "2px solid #ff8fcf";
      if (c === 8) inp.style.borderRight = "2px solid #ff8fcf";
      if(grid[r][c]){
        inp.value = grid[r][c];
        inp.readOnly = true;
      } else {
        inp.value = '';
        inp.oninput = function(){
          let v = inp.value.replace(/[^1-9]/g, '');
          inp.value = v;
          grid[r][c] = v ? Number(v) : '';
          if(checkSudoku(grid)){
            showOverlay("win", "Tebrikler!", "🌿", initSudoku);
          }
        };
      }
      board.appendChild(inp);
    }
  }
}
function checkSudoku(grid){
  for(let i=0;i<9;i++){
    let row=new Set(), col=new Set();
    for(let j=0;j<9;j++){
      let r=grid[i][j], c=grid[j][i];
      if(!r||row.has(r)) return false; row.add(r);
      if(!c||col.has(c)) return false; col.add(c);
    }
  }
  for(let br=0;br<3;br++)for(let bc=0;bc<3;bc++){
    let box=new Set();
    for(let r=0;r<3;r++)for(let c=0;c<3;c++){
      let v=grid[3*br+r][3*bc+c];
      if(!v||box.has(v)) return false;
      box.add(v);
    }
  }
  return true;
}

// --- Labirent Oyunu (Maze) ---
const MAZE_SIZE = 9; // Boyut orijinal değeri olan 9'a geri döndürüldü
let maze = [], mazePlayer = {x:0, y:0}, mazeExit = {x:0, y:0}, mazeActive = false;
function initMaze() {
  maze = generateMaze(MAZE_SIZE, MAZE_SIZE);
  mazePlayer = {x:0, y:0};
  mazeExit = {x:MAZE_SIZE-1, y:MAZE_SIZE-1};
  mazeActive = true;
  renderMaze();
}
function renderMaze() {
  const board = document.getElementById('maze-board');
  board.innerHTML = '';
  for(let y=0;y<MAZE_SIZE;y++) {
    for(let x=0;x<MAZE_SIZE;x++) {
      const div = document.createElement('div');
      div.className = 'maze-cell';
      if (maze[y][x] === 1) div.classList.add('maze-wall');
      if (x === mazeExit.x && y === mazeExit.y) div.classList.add('maze-exit');
      if (x === mazePlayer.x && y === mazePlayer.y) div.classList.add('maze-player');
      board.appendChild(div);
    }
  }
}
function moveMazePlayer(dx, dy) {
  if (!mazeActive) return;
  const nx = mazePlayer.x + dx, ny = mazePlayer.y + dy;
  if (nx<0 || ny<0 || nx>=MAZE_SIZE || ny>=MAZE_SIZE) return;
  if (maze[ny][nx] === 1) {
    mazeActive = false;
    setTimeout(()=>showOverlay("fail", "Duvara çarptın! Başa dönüyorsun...", "😢", initMaze), 80);
    return;
  }
  mazePlayer.x = nx; mazePlayer.y = ny;
  renderMaze();
  if (mazePlayer.x === mazeExit.x && mazePlayer.y === mazeExit.y) {
    mazeActive = false;
    setTimeout(()=>showOverlay("win", "Tebrikler! Çıkışı buldun!", "🚩", initMaze), 50);
  }
}
document.addEventListener('keydown', (e)=>{
  if (!document.getElementById('section-maze').classList.contains('active')) return;
  if (!mazeActive) return;
  if (["ArrowRight","d"].includes(e.key)) { moveMazePlayer(1,0); e.preventDefault();}
  if (["ArrowLeft","a"].includes(e.key))  { moveMazePlayer(-1,0); e.preventDefault();}
  if (["ArrowUp","w"].includes(e.key))    { moveMazePlayer(0,-1); e.preventDefault();}
  if (["ArrowDown","s"].includes(e.key))  { moveMazePlayer(0,1); e.preventDefault();}
});
function generateMaze(w, h) {
  let grid = Array.from({length:h},()=>Array(w).fill(1));
  function carve(x,y) {
    grid[y][x]=0;
    let dirs = [[1,0],[-1,0],[0,1],[0,-1]].sort(()=>Math.random()-0.5);
    for(let [dx,dy] of dirs) {
      let nx = x+dx*2, ny = y+dy*2;
      if (nx>=0 && ny>=0 && nx<w && ny<h && grid[ny][nx]===1) {
        grid[y+dy][x+dx]=0;
        carve(nx,ny);
      }
    }
  }
  // Başlangıç noktası tekrar orijinal haline getirildi (0,0)
  carve(0,0);
  grid[0][0]=0;
  grid[h-1][w-1]=0;
  return grid;
}

// --- Renk Doldurma (Flood Fill) ---
const FLOOD_SIZE = 12, FLOOD_COLORS = ["#ff7272", "#7fcaff", "#ffe066", "#7fff8f", "#b967ff"];
let floodGrid = [], floodMoves = 0, floodActive = false;
function initFlood() {
  floodGrid = [];
  for(let y=0;y<FLOOD_SIZE;y++) {
    let row=[];
    for(let x=0;x<FLOOD_SIZE;x++) {
      let neighbors=[];
      if(x>0) neighbors.push(row[x-1]);
      if(y>0) neighbors.push(floodGrid[y-1][x]);
      let color;
      do { color = FLOOD_COLORS[Math.floor(Math.random()*FLOOD_COLORS.length)]; }
      while(neighbors.includes(color) && Math.random()<0.7);
      row.push(color);
    }
    floodGrid.push(row);
  }
  floodMoves = 0;
  floodActive = true;
  renderFlood();
  document.getElementById('flood-result').textContent = '';
}
function renderFlood() {
  const board = document.getElementById('flood-board');
  board.innerHTML = '';
  for(let y=0;y<FLOOD_SIZE;y++)
    for(let x=0;x<FLOOD_SIZE;x++) {
      const div = document.createElement('div');
      div.className = 'flood-cell';
      div.style.background = floodGrid[y][x];
      if(x===0&&y===0) div.classList.add('selected');
      board.appendChild(div);
    }
  let colorBtns = document.getElementById('flood-color-btns');
  colorBtns.innerHTML = '';
  FLOOD_COLORS.forEach(c=>{
    const btn = document.createElement('button');
    btn.className = 'flood-color-btn';
    btn.style.background = c;
    btn.onclick = ()=>floodFill(c);
    colorBtns.appendChild(btn);
  });
}
function floodFill(newColor) {
  if(!floodActive) return;
  let oldColor = floodGrid[0][0];
  if(oldColor===newColor) return;
  floodMoves++;
  let queue=[[0,0]], visited={};
  while(queue.length) {
    let [x,y]=queue.shift();
    let key=x+"-"+y;
    if(visited[key]) continue;
    visited[key]=1;
    if(floodGrid[y][x]!==oldColor) continue;
    floodGrid[y][x]=newColor;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
      let nx=x+dx,ny=y+dy;
      if(nx>=0&&ny>=0&&nx<FLOOD_SIZE&&ny<FLOOD_SIZE)
        queue.push([nx,ny]);
    });
  }
  renderFlood();
  if(isFloodCompleted()) {
    floodActive = false;
    setTimeout(()=>showOverlay("win", "Tebrikler! Hamle: "+floodMoves, "🌈", initFlood),50);
  }
  else {
    document.getElementById('flood-result').textContent = `Hamle: ${floodMoves}`;
  }
}
function isFloodCompleted() {
  let c=floodGrid[0][0];
  for(let y=0;y<FLOOD_SIZE;y++)
    for(let x=0;x<FLOOD_SIZE;x++)
      if(floodGrid[y][x]!==c) return false;
  return true;
}
// Sayı Tahmini Oyunu değişkenleri
let randomNumber;
let guessCount;
let previousGuesses;

// HTML elemanlarını seçme
const guessInput = document.getElementById('guessInput');
const checkGuessBtn = document.getElementById('checkGuessBtn');
const guessMessage = document.getElementById('guessMessage');
const guessCountDisplay = document.getElementById('guessCount');
const previousGuessesList = document.getElementById('previousGuessesList');

function initGuessGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    guessCount = 0;
    previousGuesses = [];

    // Mesajları ve listeyi sıfırla
    guessMessage.textContent = '1 ile 100 arasında bir sayı tuttum. Tahmin et!';
    guessCountDisplay.textContent = 'Deneme Sayısı: 0';
    previousGuessesList.innerHTML = ''; // Önceki tahminleri temizle

    // Giriş alanını ve butonu etkinleştir
    guessInput.value = '';
    guessInput.disabled = false;
    checkGuessBtn.disabled = false;

    // input ve buton event listener'larını sadece bir kez ekle
    // Eğer daha önce eklenmişlerse, tekrar eklememek için kontrol edebiliriz
    if (!checkGuessBtn.dataset.listenerAdded) {
        checkGuessBtn.addEventListener('click', checkGuess);
        checkGuessBtn.dataset.listenerAdded = true; // Dinleyici eklendi işaretle
    }
}

function checkGuess() {
    const userGuess = Number(guessInput.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        guessMessage.textContent = 'Lütfen geçerli bir sayı (1-100 arası) girin.';
        return;
    }

    guessCount++;
    guessCountDisplay.textContent = `Deneme Sayısı: ${guessCount}`;
    previousGuesses.push(userGuess);

    // Önceki tahminleri listeye ekle
    const listItem = document.createElement('li');
    listItem.textContent = userGuess;
    previousGuessesList.appendChild(listItem);

    if (userGuess === randomNumber) {
        guessMessage.textContent = `Tebrikler! ${randomNumber} sayısını ${guessCount} denemede bildiniz! 🎉`;
        guessInput.disabled = true;
        checkGuessBtn.disabled = true;
	showOverlay("win", "Tebrikler!", "🎉", initGuessGame);
    } else if (userGuess < randomNumber) {
        guessMessage.textContent = 'Daha büyük bir sayı dene.';
    } else {
        guessMessage.textContent = 'Daha küçük bir sayı dene.';
    }

    guessInput.value = ''; // Giriş alanını temizle
    guessInput.focus(); // Giriş alanına odaklan
}
// --- Kutlama & Üzgün Yağmuru ---
function showOverlay(type, msg, emoji, restartFn) {
  clearOverlay();
  const overlay = document.getElementById('overlay-message');
  const title = document.getElementById('overlay-title');
  const emo = document.getElementById('overlay-emoji');
  title.textContent = msg;
  emo.textContent = emoji;
  overlay.style.display = "flex";
  document.getElementById("confetti-canvas").style.display = "none";
  document.getElementById("sad-emoji-rain").innerHTML = "";
  if(type==="win") {
    document.getElementById("confetti-canvas").style.display = "block";
    startConfetti();
  }
  if(type==="fail") {
    startSadRain();
  }
  overlay.onclick = function() {
    clearOverlay();
    if(typeof restartFn==="function") setTimeout(restartFn, 50);
  };
}
function clearOverlay() {
  const overlay = document.getElementById('overlay-message');
  overlay.style.display = "none";
  overlay.onclick = null;
  stopConfetti();
  document.getElementById("sad-emoji-rain").innerHTML = "";
}
// --- Konfeti Yağmuru ---
let confettiAnimId = null;
function startConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;
  let confs = [];
  for(let i=0;i<120;i++) confs.push({
    x: Math.random()*W,
    y: Math.random()*-H,
    r: 8+Math.random()*12,
    d: Math.random()*150,
    color: randomConfColor(),
    tilt: Math.random()*10 - 10,
    tiltAngle: 0
  });
  function draw() {
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<confs.length;i++){
      let c = confs[i];
      ctx.beginPath();
      ctx.lineWidth = c.r;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r/3, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.r*2);
      ctx.stroke();
    }
    update();
    confettiAnimId = requestAnimationFrame(draw);
  }
  function update() {
    for(let i=0;i<confs.length;i++){
      let c = confs[i];
      c.y += (Math.cos(c.d) + 3 + c.r/3)/2;
      c.x += Math.sin(0.01 * c.d);
      c.tilt = Math.sin(c.d) * 15;
      c.d += 0.02;
      if(c.y>H){
        c.x = Math.random()*W;
        c.y = -10;
        c.d = Math.random()*150;
      }
    }
  }
  draw();
}
function stopConfetti() {
  cancelAnimationFrame(confettiAnimId);
  const canvas = document.getElementById("confetti-canvas");
  if(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
}
function randomConfColor() {
  const colors = ["#ff69b4","#ffb6d5","#ffe066","#7fcaff","#7fff8f","#ffd2fc","#b967ff","#fcb69f"];
  return colors[Math.floor(Math.random()*colors.length)];
}
// --- Üzgün Emoji Yağmuru ---
function startSadRain() {
  const sadDiv = document.getElementById("sad-emoji-rain");
  sadDiv.innerHTML = "";
  const emojis = ["😢","🥺","😭"];
  let w = window.innerWidth;
  let n = Math.floor(w/36);
  for(let i=0;i<n;i++){
    let span = document.createElement("span");
    span.className = "sad-emoji";
    span.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    span.style.left = (i*100/n + Math.random()*2) + "vw";
    span.style.fontSize = (1.6 + Math.random()*1.7) + "em";
    span.style.animationDelay = (Math.random()*0.7) + "s";
    sadDiv.appendChild(span);
  }
}
// --- Sayfa Açılışı ---
document.addEventListener("DOMContentLoaded", () => {
  restoreMode();
  showHome();
  initColorMatch();
  initBalloon();
  initAnimal();
  initMemory();
  setXoxMode(false);
  initSudoku();
  initMaze();
  initFlood();
  initGuessGame();
});

function toggleRainbowTheme() {
  const body = document.body;
  const rainbowOn = body.classList.toggle('rainbow');
  // Gökkuşağı açılırsa gece modunu kapat
  if (rainbowOn) {
    body.classList.remove('night');
    document.getElementById('mode-btn').textContent = "🌙";
    document.getElementById('mode-btn').title = "Gece Modu";
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowUp') {
    // yukarı git
  }
});

function hareketEt(yon) {
  switch (yon) {
    case 'up':
      // Yukarı git
      hareketYap('ArrowUp');
      break;
    case 'down':
      hareketYap('ArrowDown');
      break;
    case 'left':
      hareketYap('ArrowLeft');
      break;
    case 'right':
      hareketYap('ArrowRight');
      break;
  }
}

function hareketYap(tus) {
  // Eğer oyunun mevcut keydown olayına gönderim yapmak istersen:
  const olay = new KeyboardEvent('keydown', { key: tus });
  document.dispatchEvent(olay);
}
// --- Kim Kayboldu? Oyunu ---
const characters = [
    { name: 'Elma', emoji: '🍎' },
    { name: 'Muz', emoji: '🍌' },
    { name: 'Çilek', emoji: '🍓' },
    { name: 'Üzüm', emoji: '🍇' },
    { name: 'Portakal', emoji: '🍊' },
    { name: 'Kivi', emoji: '🥝' },
    { name: 'Kiraz', emoji: '🍒' },
    { name: 'Limon', emoji: '🍋' },
    { name: 'Köpek', emoji: '🐶' },
    { name: 'Kedi', emoji: '🐱' },
    { name: 'Tavşan', emoji: '🐰' },
    { name: 'Panda', emoji: '🐼' },
    { name: 'Ayı', emoji: '🐻' },
    { name: 'Aslan', emoji: '🦁' },
    { name: 'Fil', emoji: '🐘' },
    { name: 'Maymun', emoji: '🐒' },
    { name: 'Araba', emoji: '🚗' },
    { name: 'Uçak', emoji: '✈️' },
    { name: 'Tren', emoji: '🚂' },
    { name: 'Gemi', emoji: '⛵' },
    { name: 'Top', emoji: '⚽' },
    { name: 'Balon', emoji: '🎈' },
    { name: 'Çiçek', emoji: '🌸' },
    { name: 'Güneş', emoji: '☀️' }
];

let currentRoundCharacters = [];
let missingCharacter = null;
let displayTimeout;

function initWhosMissingGame() {
    clearTimeout(displayTimeout); // Önceki turun zamanlayıcısını temizle
    clearOverlay(); // Eğer varsa üst katmanı temizle (konfeti/sadrain gibi)
    document.getElementById('whos-missing-message').textContent = '';
    document.getElementById('whos-missing-next-btn').style.display = 'none';
    // BURADAKİ SATIRI SİLİN:
    // document.getElementById('whos-missing-restart-btn').style.display = 'none';
    generateWhosMissingRound();
}

function generateWhosMissingRound() {
    // Önceki turdan kalanları temizle
    document.getElementById('whos-missing-display').innerHTML = '';
    document.getElementById('whos-missing-options').innerHTML = '';
    document.getElementById('whos-missing-message').textContent = '';
    document.getElementById('whos-missing-next-btn').style.display = 'none';
    // BURADAKİ SATIRI SİLİN:
    // document.getElementById('whos-missing-restart-btn').style.display = 'none';

    // Rastgele karakter seçimi (örn: 5 karakter)
    const numCharacters = 6; // Ekranda görünecek emoji sayısı
    let shuffledCharacters = [...characters].sort(() => 0.5 - Math.random());
    currentRoundCharacters = shuffledCharacters.slice(0, numCharacters);

    // Kaybolacak karakteri seç
    const missingIndex = Math.floor(Math.random() * currentRoundCharacters.length);
    missingCharacter = currentRoundCharacters[missingIndex];

    // Karakterleri 5 saniye boyunca göster
    const displayGrid = document.getElementById('whos-missing-display');
    currentRoundCharacters.forEach(char => {
        const item = document.createElement('div');
        item.classList.add('whos-missing-item');
        item.textContent = char.emoji; // Emojiyi göster
        displayGrid.appendChild(item);
    });

    // 5 saniye sonra birini gizle ve seçenekleri göster
    displayTimeout = setTimeout(() => {
        displayGrid.innerHTML = ''; // Ekranı temizle
        
        let displayOrder = [...currentRoundCharacters];
        
        // Kaybolan karakterin yerine soru işareti emojisi koy
        displayOrder[missingIndex] = { name: 'Boşluk', emoji: '❓' }; 

        displayOrder.forEach(char => {
            const item = document.createElement('div');
            item.classList.add('whos-missing-item');
            if (char.emoji === '❓') {
                item.classList.add('hidden'); // Gizleme stili (opacity 0)
                item.style.fontSize = '1.5em'; // Soru işareti daha küçük görünebilir
            }
            item.textContent = char.emoji; // Emojiyi veya soru işaretini göster
            displayGrid.appendChild(item);
        });

        // Seçenekleri oluştur
        const optionsDiv = document.getElementById('whos-missing-options');
        let options = [];
        options.push(missingCharacter); // Doğru cevabı seçeneklere ekle
        
        // Diğer 4 yanlış seçeneği ekle
        let otherOptionsCount = numCharacters - 1; 
        let availableForOptions = shuffledCharacters.filter(c => 
            c.emoji !== missingCharacter.emoji && // Kaybolan karakter olmasın
            !currentRoundCharacters.some(crc => crc.emoji === c.emoji) // Halihazırda gösterilenlerden olmasın (❓ hariç)
        );
        availableForOptions = availableForOptions.slice(0, otherOptionsCount); // Yeterli seçenek bul
        options = [...options, ...availableForOptions]; // Doğru ve yanlış seçenekleri birleştir
        
        options.sort(() => 0.5 - Math.random()); // Seçenekleri karıştır

        options.forEach(charOption => {
            const button = document.createElement('button');
            button.classList.add('whos-missing-option-button');
            button.textContent = charOption.emoji; // Seçenek emojisini göster
            button.onclick = () => checkMissingAnswer(charOption); // Cevap kontrolü için event listener
            optionsDiv.appendChild(button);
        });

    }, 5000); // 5 saniye sonra gizle ve seçenekleri göster
}

// checkMissingAnswer fonksiyonunuzu aşağıdaki gibi güncelleyin:
function checkMissingAnswer(selectedCharacter) {
    const optionsButtons = document.querySelectorAll('.whos-missing-option-button');

    optionsButtons.forEach(btn => btn.disabled = true);

    // Mesajları ve efektleri doğrudan showOverlay fonksiyonuna bırakın
    // document.getElementById('whos-missing-message').textContent = ''; // Bunu showOverlay halleder
    // document.getElementById('whos-missing-message').style.color = 'var(--text)'; // Bunu showOverlay halleder

    if (selectedCharacter.emoji === missingCharacter.emoji) {
        // Doğru tahmin: showOverlay'i kullanarak kutlama ekranını ve konfetiyi göster
        showOverlay('win', 'Bravo! Doğru Bildin!', '🎉', initWhosMissingGame); // initWhosMissingGame'i overlay kapanınca başlat
        
        // Sonraki tur butonu showOverlay'in işi değildir, burada kalsın
        document.getElementById('whos-missing-next-btn').style.display = 'inline-block';
        document.getElementById('whos-missing-next-btn').onclick = initWhosMissingGame;

    } else {
        // Yanlış tahmin: showOverlay'i kullanarak hata ekranını ve üzgün emojiyi göster
        showOverlay('fail', 'Maalesef, Yanlış Cevap!', '😢', null); // restartFn null, çünkü tekrar deneme istenecek

        optionsButtons.forEach(btn => btn.disabled = false); // Seçenekleri tekrar aktif et
        optionsButtons.forEach(btn => {
            if (btn.textContent === selectedCharacter.emoji) {
                btn.style.backgroundColor = '#ffbb00'; // Yanlış cevabı vurgula
                setTimeout(() => btn.style.backgroundColor = 'var(--accent1)', 500); // Vurguyu kaldır
            }
        });
    }
    // BURADAKİ SATIRI SİLİN:
    // document.getElementById('whos-missing-restart-btn').style.display = 'inline-block';
}

// showOverlay ve clearOverlay fonksiyonlarınızın script.js dosyasında olduğundan emin olun.
// startConfetti, stopConfetti, randomConfColor, startSadRain fonksiyonlarınızın da script.js dosyasında olduğundan emin olun.


// --- Sıvı Ayırma Oyunu ---
const LIQUID_COLORS = ["#FF6347", "#ff2eff", "#32CD32", "#FFD700", "#9370DB", "#00CED1"]; // Kullanılacak sıvı renkleri
const TUBE_CAPACITY = 4; // Her tüpün alabileceği sıvı miktarı
const NUM_TUBES = 6; // Toplam tüp sayısı (oyun seviyesine göre ayarlanabilir)
const EMPTY_TUBES = 2; // Başlangıçta boş olacak tüp sayısı

let tubes = []; // Oyunun mevcut durumunu tutacak dizi
let selectedTube = null; // Seçilen tüpün indeksi
let liquidSortGameArea; // Oyun alanının DOM elementi

function initLiquidSortGame() {
    liquidSortGameArea = document.getElementById('liquid-sort-game-area');
    liquidSortGameArea.innerHTML = ''; // Önceki oyunu temizle
    tubes = [];
    selectedTube = null;

    // Renkleri karıştır ve tüplere dağıt
    let allLiquids = [];
    for (let i = 0; i < (NUM_TUBES - EMPTY_TUBES); i++) {
        for (let j = 0; j < TUBE_CAPACITY; j++) {
            allLiquids.push(LIQUID_COLORS[i % LIQUID_COLORS.length]);
        }
    }
    shuffleArray(allLiquids);

    // Tüpleri oluştur
    for (let i = 0; i < NUM_TUBES; i++) {
        tubes.push([]);
    }

    // Sıvıları tüplere doldur
    let currentLiquidIndex = 0;
    for (let i = 0; i < (NUM_TUBES - EMPTY_TUBES); i++) { // Sadece dolu tüplere doldur
        for (let j = 0; j < TUBE_CAPACITY; j++) {
            tubes[i].push(allLiquids[currentLiquidIndex++]);
        }
    }

    renderLiquidSortGame();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Elemanları yer değiştir
    }
}

function renderLiquidSortGame() {
    liquidSortGameArea.innerHTML = '';
    tubes.forEach((tube, index) => {
        const tubeElement = document.createElement('div');
        tubeElement.classList.add('liquid-sort-tube');
        if (index === selectedTube) {
            tubeElement.classList.add('selected');
        }
        tubeElement.dataset.index = index;
        tubeElement.onclick = () => handleTubeClick(index);

        // Sıvıları tüpün içine yerleştir
        tube.forEach(color => {
            const liquidLayer = document.createElement('div');
            liquidLayer.classList.add('liquid-layer');
            liquidLayer.style.backgroundColor = color;
            tubeElement.appendChild(liquidLayer);
        });

        // Tüpün boş kısımlarını doldur (görsel için)
        for (let i = tube.length; i < TUBE_CAPACITY; i++) {
            const emptyLayer = document.createElement('div');
            emptyLayer.classList.add('liquid-layer', 'empty');
            tubeElement.appendChild(emptyLayer);
        }
        liquidSortGameArea.appendChild(tubeElement);
    });
}

function handleTubeClick(index) {
    if (selectedTube === null) {
        // İlk tüp seçimi
        if (tubes[index].length > 0) {
            selectedTube = index;
            renderLiquidSortGame();
        }
    } else if (selectedTube === index) {
        // Aynı tüp tekrar seçilirse seçimi kaldır
        selectedTube = null;
        renderLiquidSortGame();
    } else {
        // İkinci tüp seçimi, sıvıyı aktarmaya çalış
        pourLiquid(selectedTube, index);
    }
}

function pourLiquid(fromIndex, toIndex) {
    const fromTube = tubes[fromIndex];
    const toTube = tubes[toIndex];

    if (fromTube.length === 0) {
        selectedTube = null;
        renderLiquidSortGame();
        return; // Kaynak tüp boşsa hiçbir şey yapma
    }

    const liquidToMove = fromTube[fromTube.length - 1]; // En üstteki sıvı

    // Hedef tüp doluysa veya renk uyuşmuyorsa ve hedef tüp boş değilse
    if (toTube.length === TUBE_CAPACITY ||
        (toTube.length > 0 && toTube[toTube.length - 1] !== liquidToMove)) {
        selectedTube = null;
        renderLiquidSortGame();
        return; // Geçersiz hareket
    }

    // Sıvıyı aktar
    let movedCount = 0;
    for (let i = fromTube.length - 1; i >= 0; i--) {
        if (fromTube[i] === liquidToMove && toTube.length < TUBE_CAPACITY) {
            toTube.push(fromTube.pop());
            movedCount++;
        } else {
            break; // Farklı renk veya hedef dolu
        }
    }
    
    selectedTube = null;
    renderLiquidSortGame();

    if (checkLiquidSortWin()) {
        showOverlay("win", "Tebrikler! Sıvıları Ayırdın!", "🎉", initLiquidSortGame);
    }
}


function checkLiquidSortWin() {
    return tubes.every(tube => {
        if (tube.length === 0) {
            return true; // Boş tüpler de tamamlanmış sayılır
        }
        // Tüp doluysa ve tüm renkler aynıysa
        return tube.length === TUBE_CAPACITY && tube.every(color => color === tube[0]);
    });
}


// --- Düşenleri Yakala Oyunu ---
let catchGameCanvas;
let catchGameCtx;
let player;
let fallingObjects = [];
let catchScore = 0;
let catchGameActive = false;
let catchAnimationFrameId;
let objectGenerationInterval; // Nesne oluşturma interval'ı için
let objectSpeed = 1.5; // Nesnelerin düşme hızı (ayarladığınız güncel değer)
let playerSpeed = 20; // Oyuncunun hareket hızı (ayarladığınız güncel değer)

const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 20;

// Mobil kontrol butonları değişkenleri
let catchLeftBtn;
let catchRightBtn;

function initCatchGame() {
    // Önceki oyunun animasyonunu durdur (varsa)
    if (catchAnimationFrameId) {
        cancelAnimationFrame(catchAnimationFrameId);
    }
    if (objectGenerationInterval) {
        clearInterval(objectGenerationInterval);
    }
    clearOverlay(); // Eğer varsa üst katmanı temizle

    catchGameCanvas = document.getElementById('catch-game-canvas');
    if (!catchGameCanvas) {
        console.error("Catch game canvas bulunamadı!");
        return;
    }
    catchGameCtx = catchGameCanvas.getContext('2d');

    player = {
        x: catchGameCanvas.width / 2 - PLAYER_WIDTH / 2,
        y: catchGameCanvas.height - PLAYER_HEIGHT - 10,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT
    };

    fallingObjects = [];
    catchScore = 0;
    objectSpeed = 1.5; // Hızı başlangıç değerine sıfırla
    catchGameActive = true;
    document.getElementById('catch-score').textContent = catchScore;

    // Nesne oluşturma interval'ını başlat (güncel değer)
    objectGenerationInterval = setInterval(generateFallingObject, 2000); // Örneğin 2 saniyede bir

    // Oyun döngüsünü başlat
    gameLoopCatch();

    // Klavye dinleyicilerini ekle (sadece bir kez ekle)
    if (!document.body.dataset.catchKeyListenerAdded) {
        document.addEventListener('keydown', handleCatchGameKeydown);
        document.body.dataset.catchKeyListenerAdded = true;
    }

    // Mobil kontrol butonlarını al ve olay dinleyicilerini ekle
    catchLeftBtn = document.getElementById('catch-left-btn');
    catchRightBtn = document.getElementById('catch-right-btn');

    if (catchLeftBtn && !catchLeftBtn.dataset.listenerAdded) {
        catchLeftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            player.x -= playerSpeed;
            if (player.x < 0) player.x = 0;
        });
        catchLeftBtn.addEventListener('mousedown', () => {
            player.x -= playerSpeed;
            if (player.x < 0) player.x = 0;
        });
        catchLeftBtn.dataset.listenerAdded = true;
    }

    if (catchRightBtn && !catchRightBtn.dataset.listenerAdded) {
        catchRightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            player.x += playerSpeed;
            if (player.x + player.width > catchGameCanvas.width) player.x = catchGameCanvas.width - player.width;
        });
        catchRightBtn.addEventListener('mousedown', () => {
            player.x += playerSpeed;
            if (player.x + player.width > catchGameCanvas.width) player.x = catchGameCanvas.width - player.width;
        });
        catchRightBtn.dataset.listenerAdded = true;
    }
}

function generateFallingObject() {
    const isStar = Math.random() > 0.3;
    fallingObjects.push({
        x: Math.random() * (catchGameCanvas.width - 20),
        y: 0,
        type: isStar ? 'star' : 'bomb',
        emoji: isStar ? '🌟' : '💣',
        size: 25,
        speed: objectSpeed + Math.random() * 1.5
    });
}

function drawPlayer() {
    catchGameCtx.fillStyle = 'var(--accent1)'; // Sarı oyuncu
    catchGameCtx.fillRect(player.x, player.y, player.width, player.height);
    
    catchGameCtx.font = '20px Arial';
    catchGameCtx.textAlign = 'center';
    catchGameCtx.fillText('🧺', player.x + player.width / 2, player.y + player.height - 2); // Sepet emojisi
}

function drawObject(obj) {
    catchGameCtx.font = `${obj.size}px Arial`;
    catchGameCtx.textAlign = 'center';

    // Temanın aktif olup olmadığını kontrol ederek renk belirliyoruz
    if (document.body.classList.contains('fenerbahce')) {
        // Fenerbahçe teması aktifse sarı ve koyu lacivert arasındaki renkleri kullan
        catchGameCtx.fillStyle = (obj.type === 'star') ? '#008000' : '#FFFF00'; // Yıldız sarı, bomba koyu lacivert
    } else {
        // Diğer temalarda (varsayılan, gece vb.) yıldız için siyah, bomba için koyu kırmızı
        catchGameCtx.fillStyle = (obj.type === 'star') ? '#FF69B4' : '#FF69B4'; // YILDIZ İÇİN SİYAH, bomba için koyu kırmızı
    }

    catchGameCtx.fillText(obj.emoji, obj.x + obj.size / 2, obj.y + obj.size);
}

function updateGame() {
    if (!catchGameActive) return;

    for (let i = 0; i < fallingObjects.length; i++) {
        let obj = fallingObjects[i];
        obj.y += obj.speed;

        // Çarpışma kontrolü
        if (obj.y + obj.size > player.y &&
            obj.x < player.x + player.width &&
            obj.x + obj.size > player.x &&
            obj.y < player.y + player.height) {

            // Çarpıştı!
            if (obj.type === 'star') {
                catchScore += 10;
                document.getElementById('catch-score').textContent = catchScore;
            } else if (obj.type === 'bomb') {
                catchScore -= 15;
                if (catchScore < 0) catchScore = 0;
                document.getElementById('catch-score').textContent = catchScore;
            }
            fallingObjects.splice(i, 1);
            i--;
        } else if (obj.y > catchGameCanvas.height) {
            // Ekranın dışına çıktı
            if (obj.type === 'star') {
                catchScore -= 5;
                if (catchScore < 0) catchScore = 0;
                document.getElementById('catch-score').textContent = catchScore;
            }
            fallingObjects.splice(i, 1);
            i--;
        }
    }

    // Oyun Bitiş Koşulu
    if (catchScore < -50) {
        catchGameActive = false;
        clearInterval(objectGenerationInterval);
        showOverlay("fail", "Oyun Bitti! Skorunuz çok düştü.", "💥", initCatchGame);
    }
    
    // Oyunun hızını skora göre artır (isteğe bağlı)
    objectSpeed = 1.5 + Math.floor(catchScore / 100) * 0.5;
}

function gameLoopCatch() {
    catchGameCtx.clearRect(0, 0, catchGameCanvas.width, catchGameCanvas.height); // Ekranı temizle

    drawPlayer();
    fallingObjects.forEach(drawObject); // Düşen objeleri çiz

    updateGame(); // Oyunu güncelle

    if (catchGameActive) {
        catchAnimationFrameId = requestAnimationFrame(gameLoopCatch); // Sonraki kareyi iste
    }
}

// Klavye olay dinleyicisi
function handleCatchGameKeydown(e) {
    if (!document.getElementById('section-catch').classList.contains('active') || !catchGameActive) return;

    if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.x -= playerSpeed;
        if (player.x < 0) player.x = 0;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        player.x += playerSpeed;
        if (player.x + player.width > catchGameCanvas.width) player.x = catchGameCanvas.width - player.width;
    }
}