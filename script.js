import { Board } from "./object/board.js"
import { Player, AIPlayer } from "./object/player.js"
import { Game } from "./object/game.js"


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









