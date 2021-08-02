/* The below four functions define our four main "scenes." Only one will be called at a time and overwrite the one before
   it when the draw function resets (which it does almost instantly).

   It's incredibly important that when designing shapes and designs, you should use a variable so we can change it in color schemes functions.
 */

const scenes =
    {
        TITLE: 'title',
        WAITING: 'waitingRoom',
        SINGLEPLAYER: 'singlePlayer',
        MULTIPLAYER: 'multiPlayer',
        SETTINGS: 'settings'
    }

function title()
{

}

/*  This is where we instantiate the player objects, i.e., we link them with each individual player, set up who's going first, etc.
    When both players are ready, the scene will transition to either singlePlayer() or multiPlayer()
 */
function waitingRoom()
{

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