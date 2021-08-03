/* The below four functions define our four main "scenes." Only one will be called at a time and overwrite the one before
   it when the draw function resets (which it does almost instantly).

   It's incredibly important that when designing shapes and designs, you should use a variable so we can change it in color schemes functions.
 */

// Create and export player1 and player2 objects
let player1, player2;
export { player1, player2 };

const scenes =
    {
        TITLE: 'title',
        WAITING: 'waitingRoom',
        SINGLEPLAYER: 'singlePlayer',
        MULTIPLAYER: 'multiPlayer',
        SETTINGS: 'settings'
    }

/* Background picture with some music.
   Buttons that will take you to the other scenes.
 */
function title()
{

}

/*  This is where we instantiate the player objects, i.e., we link them with each individual player, set up who's going first, etc.
    When both players are ready, the scene will transition to either singlePlayer() or multiPlayer()
 */
function waitingRoom()
{
        player1 = random(0, 1);
        if (player1 === 1)
        {
            player1.isTurn === true;
            player2 = 0;
        }
        else
        {
            player2 = 1;
            player2.isTurn === true;
        }
        if (player1.isTurn === true)
        {
            player1.drawingShape();
        }
        else
        {
            player2.drawingShape();
        }
}

function singlePlayer()
{

}

function multiPlayer()
{

}

function settings()
{

}

function drawBoard()
{
        // draws the board
        // stroke('black');
        // strokeWeight(4);
        //
        // const c = 75
        //
        // //vertical lines
        // line(midX-c,midY-3*c, midX-c,midY+3*c);
        // line(midX+c,midY-3*c, midX+c,midY+3*c);
        //
        // // horizontal lines
        // line(midX-3*c,midY-c,midX+3*c,midY-c);
        // line(midX-3*c,midY+c,midX+3*c,midY+c);
}
