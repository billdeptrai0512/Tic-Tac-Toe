import { Board } from "./object/board.js"
import { Player, AIPlayer } from "./object/player.js"
import { Game } from "./object/game.js"


const startGame = (() => {

    const game = new Game()

    const board = new Board(15, 15, game)

    const playerOne = new Player("Bill" , "x");

    const playerTwo = new AIPlayer("Diu Anh", "o");

    // -----------------------------

    game.setBoard(board)

    game.setPlayer(playerOne, playerTwo)

    game.getWinningItem()

    playerTwo.getGame(game)
    

})()









