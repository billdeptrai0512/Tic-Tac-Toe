const TWO = 10;
const TWO_OBSTACLE = 5;
const THREE = 1000;
const THREE_OBSTACLE = 500;
const FOUR = 30000000;
const FOUR_OBSTACLE = 2000000;
const WINNING = 2000000000;

const TWO_OPPONENT = -20;
const TWO_OBSTACLE_OPPONENT = -3;
const THREE_OPPONENT = -2000;
const THREE_OBSTACLE_OPPONENT = -750;
const FOUR_OPPONENT = -40000000;
const FOUR_OBSTACLE_OPPONENT = -5000000;
const LOSING = -1000000000;

const winningScreen = document.getElementById('winning');
const losingScreen = document.getElementById('losing');
const winningMessage = document.querySelector('[data-winning-message-text]');
const winningButton = document.getElementById('winningButton')
const losingButton = document.getElementById('losingButton')

export class Game {

    constructor() {   
        this.self
        this.board
        this.cells
        this.playerOne
        this.playerTwo
        this.currentPlayer
        
    }

    setBoard(board) {

        this.board = board

        this.cells = board.cells

        return 

    }

    setPlayer(playerOne, playerTwo) {   

        this.playerOne = playerOne

        this.playerTwo = playerTwo

        this.currentPlayer = playerOne

        return 

    }

    getWinningItem() {

        this.winningScreen = winningScreen

        console.log(this.winningScreen)

        this.losingScreen = losingScreen

        console.log(this.losingScreen)

        this.winningButton = winningButton

        this.losingButton = losingButton

        return 
    }

    cloneBoard(board) {

        return board.map(row => row.slice());

    }

    switchTurn() {
        this.currentPlayer = this.currentPlayer === this.playerOne ? this.playerTwo : this.playerOne
    }

    makeMove(board, row, col, mark) {
        if (!board[row][col].classList.contains('x') && 
            !board[row][col].classList.contains('o')) {
            
            return board[row][col].classList.add(mark);
        }

    }

    removeMark(board, row, col, mark) {

        return board[row][col].classList.remove(mark);


    }

    AImakeMove() {

        const findMove = this.playerTwo.findBestMove(this.cells)

        const bestMove = findMove[1]

        this.makeMove(this.cells, bestMove[0], bestMove[1], this.currentPlayer.mark)

        const AIwinning = this.checkWin(this.currentPlayer.mark, bestMove)

        if (AIwinning) {

            return this.restartGame(AIwinning)

        } else {

            return this.switchTurn()

        }



    }


    restartGame(winningPlayer) {

        console.log(this.winningScreen)

        if (winningPlayer === this.playerOne) {
            this.winningScreen.classList.add('show');
        } 

        if (winningPlayer === this.playerTwo) {

            this.switchTurn()

            this.losingScreen.classList.add('show');

        }

        if (winningPlayer === 'tie') {

            this.winningMessage.textContent = 'Tie Game';

        }  

        

        this.winningButton.addEventListener('click', () => {

            this.winningScreen.classList.remove('show');

            this.board.createBoard(15, 15);

        })

        this.losingButton.addEventListener('click', () => {

            this.losingScreen.classList.remove('show');

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
        console.log(`Checking win for mark: ${mark} at position: ${lastMove}`);

        const directions = [
            { row: 0, col: 1 },  // Horizontal right
            { row: 1, col: 0 },  // Vertical down
            { row: 1, col: -1 }, // Diagonal down-left
            { row: 1, col: 1 }   // Diagonal down-right
        ];

        const requiredToWin = 5;
        const [lastRow, lastCol] = lastMove;
        
        for (let { row: dRow, col: dCol } of directions) {
            let count = 1;
            
            // Check in the positive direction
            count += this.countMarks(mark, lastRow, lastCol, dRow, dCol);
    
            // Check in the negative direction
            count += this.countMarks(mark, lastRow, lastCol, -dRow, -dCol);

            if (count >= requiredToWin) {
                return this.currentPlayer;
            }

            if (this.isBoardFull(this.cells) && (count < requiredToWin)) {
                return console.log('stop this loop tie game')
            }
        }

        return null;
        
    }

    countMarks(mark, row, col, dRow, dCol) {

        let count = 0;
        
        row += dRow;
        col += dCol;

        while (this.legalSquare(row, col) && this.cells[row][col].classList.contains(mark)) {
            count++;
            row += dRow;
            col += dCol;

        }
    
        return count;
    }

    legalSquare(row, col) {

        return row >= 0 && col >= 0 && row < this.cells.length && col < this.cells[0].length;

    }

    isBoardFull() {

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

    evaluate() {

        const rows = this.getAllRows();
        const columns = this.getAllColumns();
        const diagonals = this.getAllDiagonals();

        const xScore = this.computeSequences(rows, 'x') + 
                       this.computeSequences(columns, 'x') + 
                       this.computeSequences(diagonals, 'x');

        const oScore = this.computeSequences(rows, 'o') + 
                       this.computeSequences(columns, 'o') + 
                       this.computeSequences(diagonals, 'o');


        return xScore - oScore
    }

    computeSequences(sequences, mark) {
        let result = 0;
    
        sequences.forEach(sequence => {
            let player = 0;
            let opponent = 0;
            let obstacle = 1; // Ban đầu giả định rằng không có chặn
            let obstacle_player = 0;
            let obstacle_opponent = 0;
    
            sequence.forEach(c => {
                if (c === mark) {
                    player++;
    
                    if (opponent !== 0) {
                        if (opponent === 2 && obstacle_player === 0 && obstacle === 0) {
                            result += TWO_OBSTACLE_OPPONENT;
                        } else if (opponent === 3 && obstacle_player === 0 && obstacle === 0) {
                            result += THREE_OBSTACLE_OPPONENT;
                        } else if (opponent === 4 && obstacle_player === 0 && obstacle === 0) {
                            result += FOUR_OBSTACLE_OPPONENT;
                        } else if (opponent === 5) {
                            result += LOSING;
                        }
                    }
    
                    opponent = 0;
                    obstacle_player = 1; // Ghi nhận chặn của người chơi
                } else if (c !== '.') {
                    opponent++;
    
                    if (player !== 0) {
                        if (player === 2 && obstacle_opponent === 0 && obstacle === 0) {
                            result += TWO_OBSTACLE;
                        } else if (player === 3 && obstacle_opponent === 0 && obstacle === 0) {
                            result += THREE_OBSTACLE;
                        } else if (player === 4 && obstacle_opponent === 0 && obstacle === 0) {
                            result += FOUR_OBSTACLE;
                        } else if (player === 5) {
                            result += WINNING;
                        }
                    }
    
                    player = 0;
                    obstacle_opponent = 1; // Ghi nhận chặn của đối thủ
                } else {
                    if (player !== 0) {
                        if (player === 2) {
                            if (obstacle_opponent === 1 || obstacle === 1) {
                                result += TWO_OBSTACLE;
                            } else {
                                result += TWO;
                            }
                        } else if (player === 3) {
                            if (obstacle_opponent === 1 || obstacle === 1) {
                                result += THREE_OBSTACLE;
                            } else {
                                result += THREE;
                            }
                        } else if (player === 4) {
                            if (obstacle_opponent === 1 || obstacle === 1) {
                                result += FOUR_OBSTACLE;
                            } else {
                                result += FOUR;
                            }
                        } else if (player === 5) {
                            result += WINNING;
                        }
                    }
    
                    if (opponent !== 0) {
                        if (opponent === 2) {
                            if (obstacle_player === 1 || obstacle === 1) {
                                result += TWO_OBSTACLE_OPPONENT;
                            } else {
                                result += TWO_OPPONENT;
                            }
                        } else if (opponent === 3) {
                            if (obstacle_player === 1 || obstacle === 1) {
                                result += THREE_OBSTACLE_OPPONENT;
                            } else {
                                result += THREE_OPPONENT;
                            }
                        } else if (opponent === 4) {
                            if (obstacle_player === 1 || obstacle === 1) {
                                result += FOUR_OBSTACLE_OPPONENT;
                            } else {
                                result += FOUR_OPPONENT;
                            }
                        } else if (opponent === 5) {
                            result += LOSING;
                        }
                    }
    
                    player = 0;
                    opponent = 0;
                    obstacle = 0;
                    obstacle_player = 0;
                    obstacle_opponent = 0;
                }
            });
    
            if (opponent !== 0) {
                if (opponent === 2 && obstacle_player === 0 && obstacle === 0) {
                    result += TWO_OBSTACLE_OPPONENT;
                } else if (opponent === 3 && obstacle_player === 0 && obstacle === 0) {
                    result += THREE_OBSTACLE_OPPONENT;
                } else if (opponent === 4 && obstacle_player === 0 && obstacle === 0) {
                    result += FOUR_OBSTACLE_OPPONENT;
                } else if (opponent === 5) {
                    result += LOSING;
                }
            }
    
            if (player !== 0) {
                if (player === 2 && obstacle_opponent === 0 && obstacle === 0) {
                    result += TWO_OBSTACLE;
                } else if (player === 3 && obstacle_opponent === 0 && obstacle === 0) {
                    result += THREE_OBSTACLE;
                } else if (player === 4 && obstacle_opponent === 0 && obstacle === 0) {
                    result += FOUR_OBSTACLE;
                } else if (player === 5) {
                    result += WINNING;
                }
            }
        });

        // console.log(`this is ${result} point for ${mark}`)
    
        return result;
    }
    
    getAllRows() {
        const rows = [];
        for (let r = 0; r < this.cells.length; r++) {
            const row = [];
            for (let c = 0; c < this.cells[r].length; c++) {
                row.push(this.cells[r][c].classList.contains('x') ? 'x' :
                         this.cells[r][c].classList.contains('o') ? 'o' : '.');
            }
            rows.push(row);
        }

        return rows;
    }

    getAllColumns() {
        const columns = [];
        for (let c = 0; c < this.cells[0].length; c++) {
            const column = [];
            for (let r = 0; r < this.cells.length; r++) {
                column.push(this.cells[r][c].classList.contains('x') ? 'x' :
                            this.cells[r][c].classList.contains('o') ? 'o' : '.');
            }
            columns.push(column);
        }
        return columns;
    }
    
    getAllDiagonals() {
        const diagonals = [];
    
        // Các đường chéo từ trái sang phải
        for (let r = 0; r < this.cells.length; r++) {
            const diagonal = [];
            for (let d = 0; d + r < this.cells.length && d < this.cells[r].length; d++) {
                diagonal.push(this.cells[r + d][d].classList.contains('x') ? 'x' :
                              this.cells[r + d][d].classList.contains('o') ? 'o' : '.');
            }
            diagonals.push(diagonal);
        }
    
        for (let c = 1; c < this.cells[0].length; c++) {
            const diagonal = [];
            for (let d = 0; d < this.cells.length && d + c < this.cells[0].length; d++) {
                diagonal.push(this.cells[d][c + d].classList.contains('x') ? 'x' :
                              this.cells[d][c + d].classList.contains('o') ? 'o' : '.');
            }
            diagonals.push(diagonal);
        }
    
        // Các đường chéo từ phải sang trái
        for (let r = 0; r < this.cells.length; r++) {
            const diagonal = [];
            for (let d = 0; d + r < this.cells.length && d < this.cells[r].length; d++) {
                diagonal.push(this.cells[r + d][this.cells[r].length - 1 - d].classList.contains('x') ? 'x' :
                              this.cells[r + d][this.cells[r].length - 1 - d].classList.contains('o') ? 'o' : '.');
            }
            diagonals.push(diagonal);
        }
    
        for (let c = this.cells[0].length - 2; c >= 0; c--) {
            const diagonal = [];
            for (let d = 0; d < this.cells.length && c - d >= 0; d++) {
                diagonal.push(this.cells[d][c - d].classList.contains('x') ? 'x' :
                              this.cells[d][c - d].classList.contains('o') ? 'o' : '.');
            }
            diagonals.push(diagonal);
        }
    
        return diagonals;
    }
    
}