export class Game {

    constructor(playerOne, playerTwo) {   
        this.playerOne = playerOne
        this.playerTwo = playerTwo
        this.currentPlayer = playerOne
        this.board = null
        this.winningScreen = null
        this.winningMessage = null
        this.winningButton = null
    }

    setBoard(board) {
        this.board = board
    }

    switchTurn() {
        this.currentPlayer = this.currentPlayer === this.playerOne ? this.playerTwo : this.playerOne
    }

    handleClick(e) {

        const cell = e.target
        const mark = this.currentPlayer.mark

        cell.classList.add(mark)

        const index = this.getLastMove(cell)

        const winningPlayer = this.checkWin(mark, index)

        if (winningPlayer) {

            console.log('we have the winner')

            this.restartGame(winningPlayer)
        }

        return this.switchTurn()
    }

    getWinningItem(winningScreen, winningMessage, winningButton) {

        this.winningScreen = winningScreen

        this.winningMessage = winningMessage

        this.winningButton = winningButton

        return 
    }

    restartGame(winningPlayer) {

        this.winningScreen.classList.add('show');

        console.log(this.winningScreen.classList)

        if (winningPlayer === 'tie') {

            this.winningMessage.textContent = 'Tie Game';

        }

        this.winningMessage.textContent = winningPlayer.name + " Win";
    
        this.winningButton.addEventListener('click', () => {

            this.winningScreen.classList.remove('show');

            this.board.createBoard(15, 15);

        })

        return
    }

    getLastMove(cell) {

        const row = cell.getAttribute('data-row')
        const column = cell.getAttribute('data-column')

        return [parseInt(row), parseInt(column)]

    }

    checkWin(mark, lastMove) {

        const directions = [
            { row: 0, col: 1 },  // Horizontal right
            { row: 1, col: 0 },  // Vertical down
            { row: 1, col: -1 }, // Diagonal down-left
            { row: 1, col: 1 }   // Diagonal down-right
        ];

    
        const requiredToWin = 5;
        const [lastRow, lastCol] = lastMove;
        const cells = this.board.cells;
        
        for (let { row: dRow, col: dCol } of directions) {
            let count = 1;
            
            // Check in the positive direction
            count += this.countMarks(mark, lastRow, lastCol, dRow, dCol);
    
            // Check in the negative direction
            count += this.countMarks(mark, lastRow, lastCol, -dRow, -dCol);

            console.log(count)

            if (count >= requiredToWin) {
                return this.currentPlayer;
            }
        }

        return null;
        
    }

    countMarks(mark, row, col, dRow, dCol) {

        let count = 0;
        
        row += dRow;
        col += dCol;

        while (this.legalSquare(row, col) && this.board.cells[row][col].classList.contains(mark)) {
            count++;
            row += dRow;
            col += dCol;

        }
    
        return count;
    }

    legalSquare(row, col) {

        return row >= 0 && col >= 0 && row < this.board.cells.length && col < this.board.cells[0].length;

    }
}