const analyzer = require('drawn-shape-recognizer');

let widthCanvas, heightCanvas, midX, midY;

// Stores positions for recognized shapes. No need to store all the points, as this only shows that the shapes the user drew is recognized as.
let shapes = {circle: [], line: []};
let path = [];  // Stores the coordinates while the user is drawing.
// Stores the square the user is currently drawing in.
let current_drawing_in = null;
let mouseDraw = () => ellipse(mouseX, mouseY, 5, 5);

// Keep track of our socket connection. gameOver variable for convenience, gameMode for which scene the user is on.
let socket, gameOver;
let gameMode = scenes.TITLE;

// Reminder to keep with current conventions, i.e., please use brackets on the next line instead of the same line (Because it's cooler).
/* Tic-tac-toe array positions

            |     |
         0  |  1  |  2
       _____|_____|_____
            |     |
         3  |  4  |  5
       _____|_____|_____
            |     |
         6  |  7  |  8
            |     |
*/

// Import player1 and player2 objects after they have been instantiated in the scenes file
import { player1, player2 } from './scenes';

// Decrement by 1 every turn. Used to check whether all the spaces are filled.
let currentBoard = 9;

function Player(name)
{
    // Check to see if it's the player's turn. When instantiating player objects, use random to make one of the player's "isTurn" variable true.
    let isTurn = false;

    //if it is their turn, call the drawingShape();
    // Don't allow the other player to draw shapes when not their turn

    // Check to see if the player is an AI
    let isAI = false;

    // Player scores start at 0, will increase with each win (Useful when players want to play again).
    let score = 0;

    // Used to check if the player is the winner of the game
    let hasWon = false;

    // When any element in winConditions is empty, that means the player has won! Use updateCondition() to remove elements.
    let winConditions =
        [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];


    // Name variable to recognize player and display name.
    this.name = name;

    // Using the index, removes all occurrences of that value from winConditions.
    let updateCondition = (index) =>
    {
        // Removes the index from the player's winConditions
        winConditions = winConditions.filter(e => e !== index);
    }

    // @returns true if the player has won the game
    let checkForWin = () =>
    {
        for (let i = 0; i < winConditions.length; i++)
        {
            if (winConditions[i].length === 0)
                return true;
        }
    }
}

// Export the player object to use in scenes.js for implementation
export { Player };

function setup()
{
    // Make this variable based on screen size while centering tic-tac-toe game.
    widthCanvas = 800
    heightCanvas = 600
    midX = widthCanvas / 2;
    midY = heightCanvas / 2;
    // the reason why it is divided by three is so that the middle square is in the middle as the board is a odd number
    createCanvas(widthCanvas, heightCanvas);
    color.colorMode(color.HSB,360, 100, 100);
    background(0);

    // Change to heroku url after implementation
    socket = io.connect('http://localhost:3000');

    // When we receive input with "mouse" identifier, do anonymous function.
    socket.on('mouse', (data) =>
        {

        });
}

// Continuously draws only one of four preset modes (Title Screen, Settings Screen, etc.).
function draw()
{
    background(0, 0, 95);
    drawBoard();
    drawingUserShape();
    // Have if statements to check which scene the gameMode is pointing to, i.e., if (gameMode == scenes.TITLE) { title() }
    //checkWinner()
}

/* TO-DO:
      - Only works if gameOver is false and the scene is either scenes.SINGLEPLAYER or scenes.MULTIPLAYER.
      - Draw an ellipse (make the color a variable so we can change it later) using mouseX and mouseY.
      - Check to see if it's the user's turn (using player1.isTurn or player2.isTurn) before accepting mouseDragged() input, i.e.,
            don't do anything further if it's not their turn
      - Store mouseX & mouseY values in "path" array (example.js:240) and send them to analyzeShape() for shape analysis.
      - Make sure to also send mouseX and mouseY to sendInfo() so the other player can see (Unless it's an AI).
      - Receive value from analyzeShape() and remove tic-tac-toe index (refer above) from player's winConditions array using updateCondition() and the board array.
      - If the shape isn't recognized, clear the area where they drew on (maybe use the path coordinates to draw over them?)
      - Call checkGameCondition() to see if there's a winner or the game is still being played. The scene in "scenes.js" will handle win & tie results.
 */
function mouseDragged()
{
    if (player1.isTurn)
    {
        path.push({x: mouseX, y: mouseY});
    }
    else
    {

    }
}

/* Use code in example.js:245-259 to detect a user's shape drawing. We'll use the result for a comparison in mouseDragged().
   @return - a string that says which shape was recognized by the AI or says that no shape was found (Maybe make the string equal to error [up to you]).
 */

//dont need analyzeShape, automatically analyze shape when mouse released

function drawingUserShape()
{
    // Looping through path (which stores the coordinate while the user is drawing) and draws the coordinates
    for (let userCoords of path) {
        mouseDraw(userCoords["x"], userCoords["y"])
    }
}

// When mouse clicked on a certain square, sets array to that square
// function mouseClicked()
    //{
    // if (0 <= mouseY && mouseY <= h/3) { // where does the variable w and h come from - austin
    //     if (0 <= mouseX && mouseX <= w/3)
    //     {
    //         // This arraw allows provided access to what square the user is currently drawing in. We use this when recognizing the shape
    //         current_drawing_in = 0; what is this 2-d array for? Which function is using the array? and since we are doing a 1-d array shoulding it just be [0] [1] [2] [3] [4] [5] [6] [7] [8]- austin
    //     }
    //     else if (w/3 < mouseX && mouseX <= 2*(w/3))
    //     {
    //         current_drawing_in = 1;
    //     }
    //     else if (2*(w/3) < mouseX && mouseX <= 3*(w/3))
    //     {
    //         current_drawing_in = 2;
    //     }
    // }
    // if (h/3 <= mouseY && mouseY <= 2*(h/3)) {
    //     if (0 <= mouseX && mouseX <= w/3)
    //     {
    //         current_drawing_in = 3;
    //     }
    //     else if (w/3 < mouseX && mouseX <= 2*(w/3))
    //     {
    //         current_drawing_in = 4;
    //     }
    //     else if (2*(w/3) < mouseX && mouseX <= 3*(w/3))
    //     {
    //         current_drawing_in = 5;
    //     }
    // }
    // if (2*(h/3) <= mouseY && mouseY <= 3*(h/3)) {
    //     if (0 <= mouseX && mouseX <= w/3)
    //     {
    //         current_drawing_in = 6;
    //     }
    //     else if (w/3 < mouseX && mouseX <= 2*(w/3))
    //     {
    //         current_drawing_in = 7;
    //     }
    //     else if (2*(w/3) < mouseX && mouseX <= 3*(w/3))
    //     {
            current_drawing_in = 8;
    //    }
    //}
//}


    // when mouse released after shape drawn, analyzes shape
    //function mouseReleased()
    //{
    // var resultLine = analyzer.analyzeLine(path);
    // var resultCircle = analyzer.analyzeCircle(path);
    //     - tolerance is optional argument. Higher values lower accuracy - default 0.5
    //  if (resultLine['accuracy'] > 0.7)
    //  {
    //     console.log('Line Detected');
    //     shapes['line'].push({square: current_drawing_in, shape: path});
    //     path = [];
    //  }
    //  else if (resultCircle['accuracy'] > 0.7)
    //  {
    //     console.log('Circle detected');
    //     shapes[‘circle’].push({square: current_drawing_in, shape: path});
    //     path = [];
    //  }
    //  else
    //  {
    //     console.log('Nothing Detected');
    //     path = [];
    //  }
    //}

/* TO DO:
      - Use the win conditions and check each player's array for a win, tie, or game continuation
      - Iterate through each array in "winConditions". If any of them are empty, that means the player has won. Make playerX.hasWon = true
      - If not, check to see if there's a tie by seeing if the "board" array is empty.
        If either of the above conditions are true, make sure to make gameOver = true.
      - Else, continue the game by doing nothing.
 */
function checkWinner()
{
    // If any player has won, make their "hasWon" variable true and make the "gameOver" variable true.
    if (player1.checkForWin())
    {
        player1.hasWon = true;
        gameOver = true;
    }

    if (player2.checkForWin())
    {
        player2.hasWon = true;
        gameOver = true;
    }

    // If there are no more spaces on the board, it means there's a tie since no one won.
    if (currentBoard === 0)
    {
        gameOver = true;
    }
}

function sendInfo(data, identifier)
{
/* Function for sending data to other computers.
   @Params - data: Object containing all the data you want to send
           - identifier: used to determine what data you sent
 */
  // Send that object to the socket with unique identifier.
  socket.emit(identifier, data);
}