//variable that assigns which player won
//have to make it so that player 1 can only draw circles
//have to make it so that player 2 can only draw lines
let playerThatWon;

// Stores positions for recognized shapes. No need to store all the points, as this only shows that the shapes the user drew is recognized as.
let shapes = {circle: [], line: []};

// Stores the coordinates while the user is drawing.
let path = [];

// Stores the square the user is currently drawing in.
let current_drawing_in = null;
let mouseDraw = () => ellipse(mouseX, mouseY, 5, 5);

// Keep track of our socket connection. gameOver variable for convenience, gameMode for which scene the user is on.
let socket,  widthCanvas, heightCanvas, midX, midY, boardSquares, analyzer;
let current_player_id = null;
let gameMode = scenes.TITLE;

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

function Player(identifier)
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

    // When any element in winConditions is empty, that means the player has won! Use updateCondition() to remove elements

    // Name variable to recognize player and display name.
    this.identifier = identifier;

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

function setup()
{
    boardSquares = [null, null, null, null, null, null, null, null, null];

    // Make this variable based on screen size while centering tic-tac-toe game.
    widthCanvas = 800;
    heightCanvas = 800;
    midX = widthCanvas / 2;
    midY = heightCanvas / 2;
    // the reason why it is divided by three is so that the middle square is in the middle as the board is a odd number
    createCanvas(widthCanvas, heightCanvas);
    colorMode(HSB,360, 100, 100);
    background(0);

    // Change to heroku url after implementation
    socket = io.connect();

    console.log("In Client = " + socket.id);

    // When we receive an event with some identifier, the function we provide will be called.
    socket.on('shape_draw', (data) =>
    {
        shapes = data["shapes"];
    });

    socket.on('player_turn', (data) => {
        current_player_id = data["player_id"];
    });
}

// Continuously draws only one of four preset modes (Title Screen, Settings Screen, etc.).
function draw()
{
    background(0, 0, 95);
    drawBoard();
    drawingUserShape();
    drawingFinalShapes();
    checkWinner();
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
    path.push({x: mouseX, y: mouseY});
    /* if (player1.isTurn)
    {
        // path.push({x: mouseX, y: mouseY});
    }
    else
    {

    } */
}
function drawingUserShape()
{
    // Looping through path (which stores the coordinate while the user is drawing) and draws the coordinates
    for (let index=0; index < path.length - 1; index++) {
        line(path[index]["x"], path[index]["y"], path[index + 1]["x"], path[index + 1]["y"]);  // Need to draw a line, because if we draw a point, the output looks very choppy
    }
}

function drawingFinalShapes()
{
    for (let circle of shapes["circle"])
    {
        ellipse(
            ((widthCanvas / 3) / 2) + ((widthCanvas / 3) * (circle % 3)),              // x coordinate of center
            ((heightCanvas / 3) / 2) + ((heightCanvas / 3) * Math.floor(circle / 3)),  // y coordinate of center
            widthCanvas / 3 - 10, heightCanvas / 3 - 10
        )
        
    }
    for (let line_coords of shapes["line"])
    {
        let left_corner = [
            ((widthCanvas / 3) * (line_coords % 3)),
            ((heightCanvas / 3) * Math.floor(line_coords / 3))
        ]
        let right_corner = [
            (widthCanvas / 3) + ((widthCanvas / 3) * (line_coords % 3)),
            (heightCanvas / 3) * Math.floor(line_coords / 3)
        ]
        let br_c = [
            (widthCanvas / 3) + ((widthCanvas / 3) * (line_coords % 3)),
            (heightCanvas / 3) + ((heightCanvas / 3) * Math.floor(line_coords / 3))
        ]
        let bl_c = [
            ((widthCanvas / 3) * (line_coords % 3)),
            (heightCanvas / 3) + ((heightCanvas / 3) * Math.floor(line_coords / 3))
        ]
        line(left_corner[0], left_corner[1], br_c[0], br_c[1])
        line(right_corner[0], right_corner[1], bl_c[0], bl_c[1])
    }
}

// When mouse clicked on a certain square, sets array to that square
function mousePressed()
{
    // if functions to determine which square the mouse clicks in
    // once square identified, current_drawing_in variable set to square index
    // 3 if conditions for 3 columns, 3 rows in each if loop
    if (0 <= mouseY && mouseY <= heightCanvas/3) {
        if (0 <= mouseX && mouseX <= widthCanvas/3)
        {
            current_drawing_in = 0;
        }
        else if (widthCanvas/3 < mouseX && mouseX <= 2*(widthCanvas/3))
        {
            current_drawing_in = 1;
        }
        else if (2*(widthCanvas/3) < mouseX && mouseX <= 3*(widthCanvas/3))
        {
            current_drawing_in = 2;
        }
    }
    else if (heightCanvas/3 <= mouseY && mouseY <= 2*(heightCanvas/3)) {
        if (0 <= mouseX && mouseX <= widthCanvas/3)
        {
            current_drawing_in = 3;
        }
        else if (widthCanvas/3 < mouseX && mouseX <= 2*(widthCanvas/3))
        {
            current_drawing_in = 4;
        }
        else if (2*(widthCanvas/3) < mouseX && mouseX <= 3*(widthCanvas/3))
        {
            current_drawing_in = 5;
        }
    }
    else if (2*(heightCanvas/3) <= mouseY && mouseY <= 3*(heightCanvas/3)) {
        if (0 <= mouseX && mouseX <= widthCanvas/3)
        {
            current_drawing_in = 6;
        }
        else if (widthCanvas/3 < mouseX && mouseX <= 2*(widthCanvas/3))
        {
            current_drawing_in = 7;
        }
        else if (2*(widthCanvas/3) < mouseX && mouseX <= 3*(widthCanvas/3))
        {
            current_drawing_in = 8;
       }
    }
}

// when mouse released after shape drawn, analyzes shape
function mouseReleased()
{
    // analyses path data points as soon as mouse released
    const resultLine = window.analyzer.analyzeLine(path);
    const resultCircle = window.analyzer.analyzeCircle(path);
    // - tolerance is optional argument. Higher values lower accuracy - default 0.5
    // the analysis returns values between 0-1, greater than 0.7 is good accuracy

    //adds points to permanent shape line array if line detected
    if (resultLine['accuracy'] > 0.7)
    {
        console.log(`Line Detected. Currently Drawing In: ${current_drawing_in}`);
        if (!(shapes['line'].concat(shapes['circle']).includes(current_drawing_in)))
        {
            if (current_player_id !== socket.id)
            {
                console.log("Not Your Turn")
            }
            else
            {
                shapes['line'].push(current_drawing_in);
            }
        }
        else
        {
            console.log("Square taken")
        }
        path = [];
    }
    //adds points to permanent shape circle array if circle detected
    else if (resultCircle['accuracy'] > 0.5)
    {
        console.log(`Circle detected Currently Drawing In: ${current_drawing_in}`);
        if (!(shapes['line'].concat(shapes['circle']).includes(current_drawing_in)))
        {
            if (current_player_id !== socket.id)
            {
                console.log("Not Your Turn")
            }
            else
            {
                shapes['circle'].push(current_drawing_in);
            }
        }
        else
        {
            console.log("Square taken")
        }
        path = [];
    }
    //returns nothing detected if not clear enough
    else
    {
        console.log('Nothing Detected');
        path = [];
        return;
    }
    socket.emit("shape_draw", 
    {
        "shapes": shapes
    });
}

// TODO
function checkWinner()
{
    // If any player has won, make their "hasWon" variable true and make the "gameOver" variable true.
    /* if (player1.checkForWin())
    {
        player1.hasWon = true;
        gameOver = true;
    }

    if (player2.checkForWin())
    {
        player2.hasWon = true;
        gameOver = true;
    }

    // If there are no more spaces on the board, neither player can win
    if (!boardSquares.includes("null") )
    {
        console.log('tie');
        gameOver = true;
    } */
    for (let winCondition of winConditions)
    {
        if (winCondition.every(element => shapes['circle'].includes(element)))
        {
            console.log(`circle has won with ${winCondition}`)
            //playerThatWon = player1;
            gameOver();
        } else if (winCondition.every(element => shapes['line'].includes(element)))
        {
            console.log(`line has won with ${winCondition}`)
            //playerThatWon = player2;
            gameOver();
        }
    }
}

function gameOver(){
    background('black');
    fill('white');
    text( `GAME OVER! ${playerThatWon} has won.`, widthCanvas/2 -30, heightCanvas/2);
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
