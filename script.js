import { Board } from "./object/board.js"
import { Player, AIPlayer } from "./object/player.js"
import { Game } from "./object/game.js"
// create 15x15 board 


// Create 2 player 
// Allow user to make legal move
// swtich turn
// check for a win


// create AI


const winningScreen = document.querySelector('.winning-message');
const winningMessage = document.querySelector('[data-winning-message-text]');
const winningButton = document.querySelector('#restartButton');

const startGame = (() => {

    const playerOne = new Player("Bill" , "x");
    const playerTwo = new AIPlayer("Diu Anh", "o");

    const game = new Game(playerOne, playerTwo)

    playerTwo.getGame(game)

    const board = new Board(15, 15, game)

    game.setBoard(board)

    game.getWinningItem(winningScreen, winningMessage, winningButton)
    
    

})()


//     function handleClick (e) {

//         let cell = e.target

//         if (cell.classList.contains(playerTwo.mark) || (cell.classList.contains(playerOne.mark))) {
//             return
//         } else {
//             cell.classList.add(activePlayer.mark);
//         }

//         const lastMove = getLastMove(board, cell);

//         console.log(lastMove)

//         checkWin(activePlayer.mark, lastMove);

//         switchPlayerTurn();

//         return makeMove();
//     }

//     //now we update the new board every time user make a move -> the board left is available board
//     function getAvailableCells() {
//         // get all the available cell that not contain the mark
//         let availableCells = [];

//         for (let row = 0; row < 15; row++) {
//             availableCells[row] = []
//             for (let col = 0; col < 15; col++) {
//                 if (!board[row][col].classList.contains(playerOne.mark) && !board[row][col].classList.contains(playerTwo.mark)) {
//                     availableCells[row].push([row, col]); // Push the coordinates of available cells to the array
//                 }
//             }
//         }
//         console.log(availableCells)
//         return availableCells
//     }

//     function makeMove() {
//         //Search for empty cell
//         const availableCells = getAvailableCells()

//         let number = Math.floor(Math.random() * availableCells.length)

//         move = availableCells[number][Math.floor(Math.random()* availableCells[number].length)]

//         board[move[0]][move[1]].classList.add(playerTwo.mark);

//         const lastMove = getLastMove(board, board[move[0]][move[1]])
//         console.log(lastMove)
//         checkWin(activePlayer.mark, lastMove);
 
//         return switchPlayerTurn();
//     }







