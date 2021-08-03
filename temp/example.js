// Keep track of our socket connection
let socket;

/*let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let w; // = width / 3;
let h; // = height / 3;

let ai = 'X';
let human = 'O';
let currentPlayer = human;
*/

function setup()
{
    /*
  createCanvas(400, 400);
  w = width / 3;
  h = height / 3;
  bestMove();
  */

    canvas.createCanvas(800, 600);
    background(0);

    // Change to heroku url after implementation
    socket = io.connect('http://localhost:3000');

    // When we receive input with "mouse" identifier, do anonymous function
    socket.on('mouse', (data) =>
        {
            // Draw a blue circle for received data
            fill(0, 0, 255);
            draw.noStroke();
            ellipse(data.x, data.y, 20, 20);
        }
    );
}

/*
function equals3(a, b, c) {
  return a == b && b == c && a != '';
}

function checkWinner() {
  let winner = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  // Diagonal
  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }

  if (winner == null && openSpots == 0) {
    return 'tie';
  } else {
    return winner;
  }
}

function mousePressed() {
  if (currentPlayer == human) {
    // Human make turn
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    // If valid turn
    if (board[i][j] == '') {
      board[i][j] = human;
      currentPlayer = ai;
      bestMove();
    }
  }
}
*/

function draw()
{
    // Title(), mode1(), mode2(), settings()
    // if (user clicks mode 1) display mode 1



    /*
      background(255);
    strokeWeight(4);

    line(w, 0, w, height);
    line(w * 2, 0, w * 2, height);
    line(0, h, width, h);
    line(0, h * 2, width, h * 2);

    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        let x = w * i + w / 2;
        let y = h * j + h / 2;
        let spot = board[i][j];
        textSize(32);
        let r = w / 4;
        if (spot == human) {
          noFill();
          ellipse(x, y, r * 2);
        } else if (spot == ai) {
          line(x - r, y - r, x + r, y + r);
          line(x + r, y - r, x - r, y + r);
        }
      }
    */
}

/*
 let result = checkWinner();
  if (result != null) {
    noLoop();
    let resultP = createP('');
    resultP.style('font-size', '32pt');
    if (result == 'tie') {
      resultP.html('Tie!');
    } else {
      resultP.html(`${result} wins!`);
    }
  }
}
*/

// function titleScreen(){
//    background(starting gif)
//    starting sound plays when opens
//    settings();
//    if (clicks certain buttons)
//      multiplayer or AI
//     }
//
// }
//
// function boardDesign(){
//     horizontal and vertical line grid
//     set to screen width - 100
//     settings();
// }

// function settings(){
//
//     // gifs for background images! for border
//      when settings button clicked:
//     if (mouse clicked on certain location)
//     {
//         picture = loadImage('');
//     }
//     else if (different location) {
//         picture = loadImage('');
//         for all pictures
//     }
//     background(picture);
//     picture1 = loadImage('');
//     picture2 = loadImage('');
//     picture3 = loadImage('');
//     picture4 = loadImage('');
////_______________________________________________
//     if (mouse clicked on certain location)
//     {
//         mainMusic = loadMusic('');
//     }
//     else if (different location) {
//         mainMusic = loadMusic('');
//         for all pictures
//     }
//
//     music1 = loadMusic('');
//     music2 = loadMusic('');
//     music3 = loadMusic('');
//     music4 = loadMusic('');
////_______________________________________________
//    // slider for music sound level
////_______________________________________________
//     color theme import
//      if (clicks on certain position){
//      drawing color, text color, game board color
//     }
// }

function mouseDragged()
{
    // Draw some white circles
    fill(255);
    draw.noStroke();
    ellipse(mouseX, mouseY,20,20);

    // Send the mouse coordinates
    sendMouse(mouseX, mouseY);
}

// Function for sending to the socket
function sendMouse(x1, y1)
{
    // Make an object with x and y variables
    const data =
        {
            x: x1,
            y: y1
        };

    // Send that object to the socket with the "mouse" identifier
    socket.emit('mouse', data);
}

/*
const analyzer = require('drawn-shape-recognizer');

When mouse clicked:
let shapes = {circle: [], line: []};
let path = [];
path.push({x: mouseX, y: mouseY})

When we want to detect shape (write code to detect where majority of shape is & substitute the square ([0, 0 ])-> what square they draw in):

var resultLine = analyzer.analyzeLine(path);
var resultCircle = analyzer.analyzeCircle(path, tolerance)
	 - higher values lower accuracy - default 0.5
if (resultLine[‘accuracy’] > 0.7) {
    console.log(‘Line Detected’);
    shapes[’line’].push({square: [0, 0], shape: path});
    path = [];
} else if (resultCircle[‘accuracy’]> 0.7) {
    console.log(‘Circle detected’);
    shapes[‘circle’].push({square: [0, 0], shape: path});
    path = [];
} else {
    console.log(‘Nothing Detected’);
    path = [];
}

function mousePressed() {
  if (currentPlayer == human) {
    // Human make turn
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    // If valid turn
    if (board[i][j] == '') {
      board[i][j] = human;
      currentPlayer = player2;
    }
  }
}
 */