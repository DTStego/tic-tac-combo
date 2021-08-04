
class Player {
    constructor(identifier, type) {
        // Check to see if it's the player's turn. When instantiating player objects, use random to make one of the player's "isTurn" variable true.
        this.isTurn = false;

        // if it is their turn, call the drawingShape();
        // Don't allow the other player to draw shapes when not their turn
        // Check to see if the player is an AI
        this.isAI = false;

        // Player scores start at 0, will increase with each win (Useful when players want to play again).
        this.score = 0;

        // Used to check if the player is the winner of the game
        this.hasWon = false;

        // When any element in winConditions is empty, that means the player has won! Use updateCondition() to remove elements
        // Name variable to recognize player and display name.
        this.identifier = identifier;
        
        // this.type is either 'cross' or 'circle'
        this.type = type;

        // Using the index, removes all occurrences of that value from winConditions.
        // this.updateCondition = (index) => {
        //     // Removes the index from the player's winConditions
        //     winConditions = winConditions.filter(e => e !== index);
        // };

        // @returns true if the player has won the game
        // let checkForWin = () =>
        // {
        //     for (let i = 0; i < winConditions.length; i++)
        //     {
        //         if (winConditions[i].length === 0)
        //             return true;
        //     }
        // }
    }
}
