export class Board {
    constructor(row, column, game) {
        this.cells = []
        this.self = this.createBoard(row, column)
        this.game = game
    }

    createBoard(row, column) {

        const board = document.getElementById('board')

        console.log(board)

        board.innerHTML = ''

        for (let r = 0; r < row; r++) {

            this.cells[r] = []

            for (let c = 0; c < column; c++) {

                let cell = this.createCell(r, c)

                this.cells[r][c] = cell

                board.appendChild(cell);
                
            }
        }
        
        return board
        
    }

    createCell(row, column) {
        
        let cell = document.createElement("div")

        cell.classList.add("cell");
        cell.setAttribute("data-cell", "");
        cell.setAttribute("data-row", row);
        cell.setAttribute("data-column", column);
        cell.addEventListener('click', (e) => this.handleClick(e) , { once: true})

        return cell

    }

    handleClick(e) {

        if (this.game.isOver) {
            return
        }

        const cell = e.target

        if (cell.classList.contains('x') || cell.classList.contains('o')) {
            return
        }

        const mark = this.game.currentPlayer.mark

        cell.classList.add(mark)

        this.highlight(cell)

        const index = this.game.getLastMove(cell)

        const winningPlayer = this.game.checkWin(mark, index)

        if (winningPlayer) {

            console.log('we have the winner')

            return setTimeout(() => this.game.restartGame(winningPlayer), 1500)

        } else {

            this.game.switchTurn()

            return this.game.AImakeMove()

        }

    }

    highlight(cell) {

        for (let r = 0; r < 15; r++) {

            for (let c = 0; c < 15; c++) {

                if (this.cells[r][c].classList.contains('highlight')) {
                    this.cells[r][c].classList.remove('highlight')
                }
                
            }
        }
        
        return cell.classList.add('highlight')

    }

    highlightWinning(array) {

        let index = 0

        const intervalID = setInterval(() => {
            if (index < 4) {
                array[index].classList.add('highlight')
                index++
            } else {
                clearInterval(intervalID)
            }
        }, 300)

        return

    }

}
