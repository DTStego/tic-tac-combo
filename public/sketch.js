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

let currentBoard = [null, null, null, null, null, null, null, null];

function Player(name)
{
    // Check to see if it's the player's turn. When instantiating player objects, use random to make one of the player's "isTurn" variable true.
    let isTurn = false;

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
        ]

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

function setup()
{
    // Make this variable based on screen size while centering tic-tac-toe game.
    createCanvas(800, 600);
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
    // Have if statements to check which scene the gameMode is pointing to, i.e., if (gameMode == scenes.TITLE) { title() }
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

}

/* Use code in example.js:245-259 to detect a user's shape drawing. We'll use the result for a comparison in mouseDragged().
   @return - a string that says which shape was recognized by the AI or says that no shape was found (Maybe make the string equal to error [up to you]).
 */
function analyzeShape()
{

}

/* TO DO:
      - Use the win conditions and check each player's array for a win, tie, or game continuation
      - Iterate through each array in "winConditions". If any of them are empty, that means the player has won. Make playerX.hasWon = true
      - If not, check to see if there's a tie by seeing if the "board" array is empty.
        If either of the above conditions are true, make sure to make gameOver = true.
      - Else, continue the game by doing nothing.
 */
function checkGameCondition()
{

}

/* Function for sending data to other computers.
   @Params - data: Object containing all the data you want to send
           - identifier: used to determine what data you sent
 */
function sendInfo(data, identifier)
{
  // Send that object to the socket with unique identifier.
  socket.emit(identifier, data);
}