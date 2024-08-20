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

        cell.classList.add("cell")

        // cell.setAttribute("data-cell", ""); content

        cell.setAttribute("row", row);
        cell.setAttribute("column", column);

        cell.addEventListener('click', (e) => this.handleClick(e) , { once: true})

        return cell

    }

    cancelCells() {

        for (let r = 0; r < 15; r++) {

            for (let c = 0; c < 15; c++) {

                this.cells[r][c].style.cursor = 'not-allowed'
                
            }
        }

    }

    isClear() {

        let array = []

        for (let r = 0; r < 15; r++) {

            for (let c = 0; c < 15; c++) {

                if (this.cells[r][c].classList.contains('x') || this.cells[r][c].classList.contains('o')) {
                    array.push(this.cells[r][c])
                }
                
            }
        }

        if (array.length !== 0) {
            return false
        }

        return true

    }

    isFull() {

        for (let row = 0; row < this.cells.length; row++) {

            for (let col = 0; col < this.cells[row].length; col++) {

                if (!this.cells[row][col].classList.contains('x') && 
                    !this.cells[row][col].classList.contains('o')) {
                    return false;
                }

            }
        }
        return true;
    }

    displayMove(cell, mark) {

        this.highlight(cell);        

        return cell.classList.add(mark);

    }

    highlight(cell) {

        this.cleanLastHighLight()
        
        return cell.classList.add('highlight')

    }

    cleanLastHighLight() {

        for (let r = 0; r < 15; r++) {

            for (let c = 0; c < 15; c++) {

                if (this.cells[r][c].classList.contains('highlight')) {
                    this.cells[r][c].classList.remove('highlight')
                }
                
            }
        }

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

    async handleClick(e) {

        if (this.game.isOver) {
            return
        }

        const cell = e.target

        if (cell.classList.contains('x') || cell.classList.contains('o')) {
            return
        }

        const mark = this.game.playerOne.mark

        this.displayMove(cell, mark)

        await new Promise(resolve => setTimeout(resolve, 0));

        return this.game.checkWin(mark, cell)
        
    }



}


