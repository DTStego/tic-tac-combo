/* The below four functions define our four main "scenes." Only one will be called at a time and overwrite the one before
   it when the draw function resets (which it does almost instantly).

   It's incredibly important that when designing shapes and designs, you should use a variable so we can change it in color schemes functions.
 */

let mgr;

function setup()
{
    widthCanvas = 400;
    heightCanvas = 400;
    midX = widthCanvas / 2;
    midY = heightCanvas / 2;
    colorMode(HSB, 360, 100, 100);
    backgroundColor = color(0,0,95);

    mgr = new SceneManager();

    mgr.addScene(title);
    //mgr.addScene(singleplayer);
    mgr.addScene(waitingRoom);
    mgr.addScene(settings);
    //mgr.addScene(multiplayer);

    //mgr.showScene(title);

    frameRate(30);

    gravity = 1;
    friction = 0.8; //air resistence
}

function draw()
{
    mgr.draw();
}

function mouseClicked()
{
    mgr.handleEvent("mouseClicked");
}

const scenes =
    {
        TITLE: 'title',
        WAITING: 'waitingRoom',
        GAME: 'game',
        SETTINGS: 'settings'
    }

/* Background picture with some music.
   Buttons that will take you to the other scenes. Button code below 
 */

// // 1. Create the button
// var button = document.createElement("button");
// button.innerHTML = "Do Something";

// // 2. Append somewhere
// var body = document.getElementsByTagName("body")[0];
// body.appendChild(button);

// // 3. Add event handler
// button.addEventListener ("click", function() {
//   alert("did something");
// });

function title()
{
    this.setup = function()
    {
        createCanvas(widthCanvas, heightCanvas);
        background(200, 100, 100); // change this to variables for theme selector
        textSize(50);
        textAlign(CENTER, TOP);
        text('Tic-Tac-Toe', 0, 12, width);
        // add music
        // Singleplayer button
        rect((width/2)-50, 150, 100, 40);
        textSize(15);
        textAlign(CENTER);
        text('Singleplayer', 0, 162, width);
        // Multiplayer button
        rect((width/2)-50, 200, 100, 40);
        textSize(15);
        textAlign(CENTER);
        text('Multiplayer', 0, 212, width);
        // Settings button
        rect((width/2)-50, 250, 100, 40);
        textSize(15);
        textAlign(CENTER);
        text('Settings', 0, 262, width);
    }

    this.draw = function()
    {

    }

    this.mouseClicked = function()
    {
        // switch the scene
        if (mouseX > (width/2)-50 && mouseX < (width/2)+50 && mouseY < 190 && mouseY > 150)
        {
            this.sceneManager.showScene( waitingRoom ) // this will go to singleplayer
        }
        if (mouseX > (width/2)-50 && mouseX < (width/2)+50 && mouseY < 240 && mouseY > 200)
        {
            this.sceneManager.showScene( waitingRoom ) // this will go to the waiting room
        }
        if (mouseX > (width/2)-50 && mouseX < (width/2)+50 && mouseY < 290 && mouseY > 250)
        {
            this.sceneManager.showScene( waitingRoom ) // this will go to the settings page
        }
    }
}

/*  This is where we instantiate the player objects, i.e., we link them with each individual player, set up who's going first, etc.
    When both players are ready, the scene will transition to either singlePlayer() or multiPlayer().
    Might want to do an add code using random() which will match the user with another user.
    We can even do matchmaking and store players who want to play in an array.
 */
function waitingRoom()
{
        this.setup = function() {
            createCanvas(widthCanvas, heightCanvas);


        }

        this.draw = function()
        {
            background(100, 100, 100)
            textAlign(CENTER);
            textSize(20)
            text("L O A D I N G",midX,midY )
            for(let i = 0 ; i <= 30000 ; i++){
                console.log(i)
                if (i == 10000 ){
                    fill(0)
                    noStroke()
                    ellipse(widthCanvas/4, heightCanvas2/3,20);
                }
                if (i == 20000 ){
                    fill(0)
                    noStroke()
                    ellipse(widthCanvas/2, heightCanvas2/3,20);
                }
                if (i == 30000 ){
                    fill(0)
                    noStroke()
                    ellipse(widthCanvas3/4, heightCanvas2/3,20);
                }
            }
        }

        this.keyPressed = function() {
            // switch the scene
            this.sceneManager.showScene( game );
        }
}

/* Draw the board and have a back button (Use goBackPrompt() if they click on the back button)
   Have some background music and a background if possible. Remember to center the board.
   Display the names of the players and their scores. We might want to add a time limit for each player if it's two players.
 */
function game()
{
  //drawBoard();
  //goBackPrompt();
}

/* OPTIONAL
      - Have a volume mixer
      - Have a theme changer
 */
function settings()
{

}

function drawBoard()
{
    //draws the board
    stroke('black');
    strokeWeight(4);

    //let c = Math.round((widthCanvas + heightCanvas) / (2*9));
    let c = 132;

    //vertical lines;
    line(midX - c, midY - 3 * c, midX - c, midY + 3 * c);
    line(midX + c, midY - 3 * c, midX + c, midY + 3 * c);
        
    // horizontal lines
    line(midX - 3 * c, midY - c, midX + 3 * c, midY - c);
    line(midX - 3 * c, midY + c, midX + 3 * c, midY + c);
}

/* When the user wants to go back to the main menu during a game, prompt them for confirmation
   Don't run this if the game is already over.
 */
function goBackPrompt()
{
// goes back to title or something
}