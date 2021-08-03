//
// // Tic Tac Toe AI with Minimax Algorithm
// // The Coding Train / Daniel Shiffman
// // https://thecodingtrain.com/CodingChallenges/154-tic-tac-toe-minimax.html
// // https://youtu.be/I64-UTORVfU
// // https://editor.p5js.org/codingtrain/sketches/0zyUhZdJD
//
// function bestMove() {
//     // AI to make its turn
//     let bestScore = -Infinity;
//     let move;
//     for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 3; j++) {
//             // Is the spot available?
//             if (boardSquares[i] === null) {
//                boardSquares[i] = ai;
//                 let score = minimax(board, 0, false);
//                boardSquares[i] = '';
//                 if (score > bestScore) {
//                     bestScore = score;
//                     move = { i, j };
//                 }
//             }
//         }
//     }
//     board[move.i][move.j] = ai;
//     currentPlayer = human;
// }
//
// let scores = {
//     X: 10,
//     O: -10,
//     tie: 0
// };
//
// function minimax(board, depth, isMaximizing) {
//     let result = checkWinner();
//     if (result !== null) {
//         return scores[result];
//     }
//
//     if (isMaximizing) {
//         let bestScore = -Infinity;
//         for (let i = 0; i < 3; i++) {
//             for (let j = 0; j < 3; j++) {
//                 // Is the spot available?
//                 if (boardSquares[i] == '') {
//                    boardSquares[i] = ai;
//                     let score = minimax(board, depth + 1, false);
//                    boardSquares[i] = '';
//                     bestScore = max(score, bestScore);
//                 }
//             }
//         }
//         return bestScore;
//     } else {
//         let bestScore = Infinity;
//         for (let i = 0; i < 3; i++) {
//             for (let j = 0; j < 3; j++) {
//                 // Is the spot available?
//                 if (boardSquares[i] == '') {
//                    boardSquares[i] = human;
//                     let score = minimax(board, depth + 1, true);
//                    boardSquares[i] = '';
//                     bestScore = min(score, bestScore);
//                 }
//             }
//         }
//         return bestScore;
//     }
// }