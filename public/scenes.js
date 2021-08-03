/* The below four functions define our four main "scenes." Only one will be called at a time and overwrite the one before
   it when the draw function resets (which it does almost instantly).

   It's incredibly important that when designing shapes and designs, you should use a variable so we can change it in color schemes functions.
 */

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

}

/*  This is where we instantiate the player objects, i.e., we link them with each individual player, set up who's going first, etc.
    When both players are ready, the scene will transition to either singlePlayer() or multiPlayer().
    Might want to do an add code using random() which will match the user with another user.
    We can even do matchmaking and store players who want to play in an array.
 */
function waitingRoom()
{

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

    const c = 132;
        
    //vertical lines
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

}