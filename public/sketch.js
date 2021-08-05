// variable that assigns which player won
let playerThatWon;

// Stores positions for recognized shapes. No need to store all the points, as this only shows that the shapes the user drew is recognized as.
let shapes = {circle: [], line: []};

// Stores the coordinates while the user is drawing.
let path = [];

// Stores the square the user is currently drawing in.
let current_drawing_in = null;

// Keep track of our socket connection. gameOver variable for convenience, gameMode for which scene the user is on.
let canvas, widthCanvas, heightCanvas, midX, midY, music, gif, settings_icon, back_arrow;
let slider = null;
let current_player_id = null;
let player1 = new Player(null, 'circle');
let player2 = new Player(null, 'cross');
let player_us = null;
let socket = null;
let ai = false;
let gameStart = false;

// Saves the volume for the next page load
let volume = localStorage.getItem("volume");
if (volume === null)
{
    localStorage.setItem("volume", 1);
    volume = 0.5;
}
else
{
    volume = parseFloat(volume);
}

function startSocket() {
    socket = io.connect('https://tic-tac-combo.herokuapp.com/');

    console.log(`In Client = ${socket.id}`);

    // When we receive an event with some identifier, the function we provide will be called.
    socket.on('shape_draw', (data) =>
    {
        shapes = data['shapes'];
    });

    socket.on('player_turn', (data) => {
        current_player_id = data['player_id'];
    });

    socket.on('game_start', (data) => {
        gameStart = true;
    });

    socket.on('type', (data) => {
        player_us = data['circle'] ? player1 : player2;
        player_us.identifier = socket.id;
    });
}

function stopSocket() {
    socket.disconnect();
    socket = null;
}

const scenes =
{
    TITLE: 'title',   
    WAITING: 'waitingRoom',
    AI_DIFFICULTY: 'aiDifficulty',
    GAME: 'game',
    SETTINGS: 'settings',
    GAMEOVER: 'gameover',
}

let gameMode = scenes.TITLE;
let prevScreen = gameMode;

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

// Export the player object to use in scenes.js for implementation


function preload()
{
    gif = loadImage('gif1.gif');  // Loads the gif image. Use with gif_var.play() and gif_var.pause()
    music = loadSound('music1.mp3');
    settings_icon = loadImage('settings_icon.png');
    back_arrow = loadImage('back_arrow.png');
}

function setup()
{
    userStartAudio();

    // Make this variable based on screen size while centering tic-tac-toe game.
    widthCanvas = 600;
    heightCanvas = 600;
    midX = widthCanvas / 2;
    midY = heightCanvas / 2;
    // the reason why it is divided by three is so that the middle square is in the middle as the board is a odd number
    canvas = createCanvas(widthCanvas, heightCanvas);
    // colorMode(HSB, 360, 100, 100);
    background(0);

    canvas.position((window.innerWidth - widthCanvas) / 2, 0);
    music.setVolume(volume);
}

// Continuously draws only one of four preset modes (Title Screen, Settings Screen, etc.).
function draw()
{
    if (!music.isPlaying()) {
        music.play();
    }
    if (gameMode !== scenes.SETTINGS && slider !== null) {
        slider.remove();
        slider = null;
    }
    if (gameMode !== scenes.GAME)
    {
        background(gif);
    }
    else
    {
        background(0);
    }
    textAlign(CENTER, CENTER);
    if (gameMode === scenes.TITLE)
    {
        stroke(0);
        textSize(40);
        fill('white');
        text('Tic-Tac-Toe Home', widthCanvas/2, 40);
        noFill();
        fill(color(0, 0, 0));
        rect(widthCanvas/2 - (50 + 125), heightCanvas/2 - 25, 125, 50, 15);
        rect(widthCanvas/2 + (125 - 50), heightCanvas/2 - 25, 125, 50, 15);
        noFill();
        fill(color(0, 255, 0));
        textSize(20);
        text('Multiplayer!', widthCanvas/2 - ((125 / 2) + 50), heightCanvas/2);
        text('Computer!', widthCanvas/2 + ((125 / 2) + 75), heightCanvas/2);
        noFill();
    }
    else if (gameMode === scenes.WAITING)
    {
        textAlign(CENTER, CENTER);
        fill(color(255, 255, 255));
        text("WAITING ROOM...", widthCanvas/2, heightCanvas/2);
        noFill();
        if (gameStart)
        {
            prevScreen = gameMode;
            gameMode = scenes.GAME;
        }
    }
    else if (gameMode === scenes.AI_DIFFICULTY)
    {
    }
    else if (gameMode === scenes.GAME)
    {
        if (checkWinner()[0])
        {
            prevScreen = gameMode;
            gameMode = scenes.GAMEOVER;
        }
        // background(0, 0, 0);
        if (!ai && socket === null)
        {
            startSocket();
        }
        stroke(0);
        drawBoard();
        drawingUserShape();
        drawingFinalShapes();
    }
    else if (gameMode === scenes.SETTINGS)
    {
        stroke(0);
        music.setVolume(slider.value());
        volume = slider.value();
        localStorage.setItem("volume", volume);
        textSize(40);
        fill('white');
        text('Settings', widthCanvas/2, 40);
        textSize(20);
        text('Volume Level', widthCanvas/2, heightCanvas/2 - 30);
        noFill();
    }
    else if (gameMode === scenes.GAMEOVER)
    {
        gameStart = false;
        if (checkWinner()[1] === 'tie') 
        {
            tie();
        }
        else
        {
            gameOver();
        }
    }
   
    fill('white');
    image(settings_icon, widthCanvas - 50, 0, 50, 50);
    
    // go back function
    // rect(0, 0, 50, 50);
    image(back_arrow, 5, 5, 70, 52.5);
    noFill();

    if (ai && gameMode === scenes.GAME)
    {
        gameStart = true;
        player_us = player1;
    }
    if ((ai || (gameMode !== scenes.GAME && gameMode !== scenes.WAITING)) && socket !== null)
    {
        console.log(1)
        stopSocket();
    }

    document.body.style.backgroundColor = (gameMode === scenes.GAME) ? '#000000': '#080600';
}

function mouseDragged()
{
    if (gameMode === scenes.GAME)
    {
        path.push({x: mouseX, y: mouseY});
    }
}


function drawingUserShape()
{
    // Looping through path (which stores the coordinate while the user is drawing) and draws the coordinates
    for (let index=0; index < path.length - 1; index++) {
        line(path[index]['x'], path[index]['y'], path[index + 1]['x'], path[index + 1]['y']);  // Need to draw a line, because if we draw a point, the output looks very choppy
    }
}

function drawingFinalShapes()
{
    for (let circle of shapes['circle'])
    {
        ellipse(
            ((widthCanvas / 3) / 2) + ((widthCanvas / 3) * (circle % 3)),              // x coordinate of center
            ((heightCanvas / 3) / 2) + ((heightCanvas / 3) * Math.floor(circle / 3)),  // y coordinate of center
            widthCanvas / 3 - 10, heightCanvas / 3 - 10
        )
        
    }
    for (let line_coords of shapes['line'])
    {
        let top_left_corner = [
            ((widthCanvas / 3) * (line_coords % 3)),
            ((heightCanvas / 3) * Math.floor(line_coords / 3))
        ]
        let top_right_corner = [
            (widthCanvas / 3) + ((widthCanvas / 3) * (line_coords % 3)),
            (heightCanvas / 3) * Math.floor(line_coords / 3)
        ]
        let bottom_right_corner = [
            (widthCanvas / 3) + ((widthCanvas / 3) * (line_coords % 3)),
            (heightCanvas / 3) + ((heightCanvas / 3) * Math.floor(line_coords / 3))
        ]
        let bottom_left_corner = [
            ((widthCanvas / 3) * (line_coords % 3)),
            (heightCanvas / 3) + ((heightCanvas / 3) * Math.floor(line_coords / 3))
        ]
        line(...top_left_corner, ...bottom_right_corner);
        line(...top_right_corner, ...bottom_left_corner);
    }
}

function drawBoard()
{
    // draws the board
    stroke('white');
    strokeWeight(4);

    // let c = Math.round((widthCanvas + heightCanvas) / (2*9));
    let c = 100;

    // vertical lines;
    line(midX - c, midY - 3 * c, midX - c, midY + 3 * c);
    line(midX + c, midY - 3 * c, midX + c, midY + 3 * c);
        
    // horizontal lines
    line(midX - 3 * c, midY - c, midX + 3 * c, midY - c);
    line(midX - 3 * c, midY + c, midX + 3 * c, midY + c);
}

// When mouse clicked on a certain square, sets array to that square
function mousePressed()
{
    if (gameMode === scenes.GAME)
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
}

function mouseClicked()
{
    console.log(mouseX, mouseY);
    // title page buttons clicked
    // if multiplayer clicked
    if (gameMode === scenes.TITLE)
    {
        if (mouseX >= widthCanvas/2 - (50 + 125) && 
            mouseX <= widthCanvas/2 - 50 && 
            mouseY >= heightCanvas/2 - 25 && 
            mouseY <= heightCanvas/2 + 25)
        {
            ai = false;
            player1.type = 'circle';
            player2.type = 'cross';
            prevScreen = gameMode;
            gameMode = scenes.WAITING;
            startSocket();
        }
        //if singleplayer clicked
        else if (mouseX >= widthCanvas/2 + (125 - 50) && 
                mouseX <= widthCanvas/2 + (250 - 50) && 
                mouseY>= heightCanvas/2 - 25 && 
                mouseY <= heightCanvas/2 + 25)
        {
            ai = true;
            prevScreen = gameMode;
            gameMode = scenes.GAME;
            
        }
    }
    else if (gameMode === scenes.GAMEOVER) {
        // If return to home clicked
        if (mouseX >= widthCanvas/2 + (125 - 50) && 
            mouseX <= widthCanvas/2 + (250 - 50) && 
            mouseY>= heightCanvas/2 - 25 && 
            mouseY <= heightCanvas/2 + 25 &&
            socket === null)
        {
            ai = false;
            player1.type = 'circle';
            player2.type = 'cross';
            prevScreen = gameMode;
            gameMode = scenes.TITLE;
            shapes = {circle: [], line: []};
        }
        // Other wise if play again clicked
        else if (mouseX >= widthCanvas/2 - (50 + 125) && 
            mouseX <= widthCanvas/2 - 50 && 
            mouseY >= heightCanvas/2 - 25 && 
            mouseY <= heightCanvas/2 + 25)
        {
            // If play against AI again clicked
            prevScreen = gameMode;
            if (ai)
            {
                ai = true;
                gameMode = scenes.GAME;
            }
            // If play multiplayer again clicked
            else if (!ai)
            {
                startSocket();
                ai = false;
                gameMode = scenes.WAITING;
            }
            shapes = {circle: [], line: []};
        }
    }
    if (mouseX >= widthCanvas - 50 &&
        mouseX <= widthCanvas &&
        mouseY >= 0 &&
        mouseY <= 50)
    {
        if (gameMode !== scenes.SETTINGS)
        {
            prevScreen = gameMode;
            gameMode = scenes.SETTINGS;
            slider = createSlider(0, 1, volume, 0.01);
            slider.position((widthCanvas/2 + (window.innerWidth - widthCanvas) / 2) - 60, heightCanvas/2);
            slider.style('width', `${widthCanvas / 5}px`);
        }
    }

    if (mouseX >= 0 &&
        mouseX <= 50 &&
        mouseY >= 0 &&
        mouseY <= 50)
    {
        gameMode = prevScreen;
    }
}

// when mouse released after shape drawn, analyzes shape
function mouseReleased()
{
    if (gameMode === scenes.GAME)
    {
        // analyses path data points as soon as mouse released
        const resultLine = analyzer.analyzeLine(path);
        const resultCircle = analyzer.analyzeCircle(path);
        // - tolerance is optional argument. Higher values lower accuracy - default 0.5
        // the analysis returns values between 0-1, greater than 0.7 is good accuracy

        path = [];

        //adds points to permanent shape line array if line detected
        if (!(shapes['line'].concat(shapes['circle']).includes(current_drawing_in))) {
            if (ai || current_player_id === socket.id)
            {
                if (resultLine['accuracy'] > 0.7)
                {
                    if (player_us.type === 'cross')
                    {
                        M.toast({
                            html: `<span class="noselect">A Cross Has Been Detected in Square ${current_drawing_in}</span><button class="btn-flat toast-action" style="color: white;" onclick="M.Toast.dismissAll();">X</button>`,
                            classes: 'rounded'
                        })
                        // console.log(`Line detected. Currently drawing in: ${current_drawing_in}`);
                        shapes['line'].push(current_drawing_in);
                    }
                    else
                    {
                        M.toast({
                            html: '<span class="noselect">You cannot draw crosses. You are allowed to draw circles.</span><button class="btn-flat toast-action" style="color: white;" onclick="M.Toast.dismissAll();">X</button>',
                            classes: 'rounded'
                        })
                        // console.log('You cannot draw crosses. You are allowed to draw circles.');
                        return;
                    }
                }
                else if (resultCircle['accuracy'] > 0.5)
                {
                    if (ai || player_us.type === 'circle')
                    {
                        M.toast({
                            html: `<span class="noselect">A Circle Has Been Detected in Square ${current_drawing_in}</span><button class="btn-flat toast-action" style="color: white;" onclick="M.Toast.dismissAll();">X</button>`,
                            classes: 'rounded'
                        })
                        // console.log(`Circle detected. Currently drawing in: ${current_drawing_in}`);
                        shapes['circle'].push(current_drawing_in);
                    }
                    else
                    {
                        M.toast({
                            html: '<span class="noselect">You cannot draw circles. You are allowed to draw crosses.</span><button class="btn-flat toast-action" style="color: white;" onclick="M.Toast.dismissAll();">X</button>',
                            classes: 'rounded'
                        })
                        // console.log('You cannot draw circles. You are allowed to draw crosses.');
                        return;
                    }                
                }
                else
                {
                    M.toast({
                        html: '<span class="noselect">The shape could not be recognized.</span><button class="btn-flat toast-action" style="color: white;" onclick="M.Toast.dismissAll();">X</button>',
                        classes: 'rounded'
                    })
                    // console.log('The shape could not be recognized');
                    return;
                }
            } else {
                M.toast({
                    html: '<span class="noselect">It is not your turn. Please wait for your opponent for move.</span><button class="btn-flat toast-action" style="color: white;" onclick="M.Toast.dismissAll();">X</button>',
                    classes: 'rounded'
                })
                // console.log('Not Your Turn');
                return;
            }
        } else {
            M.toast({
                html: '<span class="noselect">That square has been taken. Please choose another one.</span><button class="btn-flat toast-action" style="color: white;" onclick="M.Toast.dismissAll();">X</button>',
                classes: 'rounded'
            })
            // console.log('Square taken');
            return;
        }
        if (!ai) {
            socket.emit('shape_draw', 
            {
                'shapes': shapes
            });
        } else {
            randomAI(shapes['line'].concat(shapes['circle']), shapes);
        }
    }
    
}

function checkWinner()
{
    for (let winCondition of winConditions)
    {
        if (winCondition.every(element => shapes['circle'].includes(element)))
        {
            player1.hasWon = true;
            player2.hasWon = false;
            return [true, 'gameOver'];
        }
        else if (winCondition.every(element => shapes['line'].includes(element)))
        {
            player2.hasWon = true;
            player1.hasWon = false;
            return [true, 'gameOver'];
        }
        else if ([0, 1, 2, 3, 4, 5, 6, 7, 8].every(element => shapes['line'].concat(shapes['circle']).includes(element)))
        {
            return [true, 'tie'];
        }
    }
    return false;
}

function gameOver()
{
    gameMode = scenes.GAMEOVER;
    background(gif);
    fill('white');
    textSize(30);
    stroke(0);
    textAlign(CENTER, CENTER);

    text(`Game Over! ${player1.hasWon ? 'Player 1': (ai ? 'AI': 'Player 2')} has won.`, widthCanvas/2, heightCanvas/2 - 200);
    if (player1.hasWon)
    {
        player1.score++;
    }
    else if (player2.hasWon)
    {
        player2.score++;
    }
    if (ai)
    {
        fill(color(0, 0, 0));
        rect(widthCanvas/2 - (50 + 220), heightCanvas/2 - 25, 220, 50, 15);
        rect(widthCanvas/2 + 50, heightCanvas/2 - 25, 220, 50, 15);
        noFill();
        fill(color(0, 255, 0));
        textSize(20);
        text('Play Computer Again!', widthCanvas/2 - ((220 / 2) + 50), heightCanvas/2);
        text('Go Back to Home!', widthCanvas/2 + ((220 / 2) + 50), heightCanvas/2);
        noFill();
    }
    else if (!ai)
    {
        fill(color(0, 0, 0));
        rect(widthCanvas/2 - (50 + 220), heightCanvas/2 - 25, 220, 50, 15);
        rect(widthCanvas/2 + 50, heightCanvas/2 - 25, 220, 50, 15);
        noFill();
        fill(color(0, 255, 0));
        textSize(20);
        text('Play Multiplayer Again!', widthCanvas/2 - ((220 / 2) + 50), heightCanvas/2);
        text('Go Back to Home!', widthCanvas/2 + ((220 / 2) + 50), heightCanvas/2);
        noFill();
    }
}

function tie()
{
    gameMode = scenes.GAMEOVER;
    background(gif);
    fill('white');
    stroke(0);
    textSize(30);
    textAlign(CENTER, CENTER);
    text('Tie!', widthCanvas/2, heightCanvas/2 - 200);
    if (ai) {
        fill(color(0, 0, 0));
        rect(widthCanvas/2 - (50 + 220), heightCanvas/2 - 25, 220, 50, 15);
        rect(widthCanvas/2 + 50, heightCanvas/2 - 25, 220, 50, 15);
        noFill();
        fill(color(0, 255, 0));
        textSize(20);
        text('Play Computer Again!', widthCanvas/2 - ((220 / 2) + 50), heightCanvas/2);
        text('Go Back to Home!', widthCanvas/2 + ((220 / 2) + 50), heightCanvas/2);
        noFill();
    }
    else if (!ai)
    {
        fill(color(0, 0, 0));
        rect(widthCanvas/2 - (50 + 220), heightCanvas/2 - 25, 220, 50, 15);
        rect(widthCanvas/2 + 50, heightCanvas/2 - 25, 220, 50, 15);
        noFill();
        fill(color(0, 255, 0));
        textSize(20);
        text('Play Multiplayer Again!', widthCanvas/2 - ((220 / 2) + 50), heightCanvas/2);
        text('Go Back to Home!', widthCanvas/2 + ((220 / 2) + 50), heightCanvas/2);
        noFill();
    }
}

function windowResized() {
    if (canvas)
    {
        canvas.position((window.innerWidth - widthCanvas) / 2, 0);
    }
}
