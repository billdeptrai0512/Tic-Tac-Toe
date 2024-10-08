const TWO = 10;
const TWO_OBSTACLE = 5;
const THREE = 1000;
const THREE_OBSTACLE = 100;
const FOUR = 1000000;
const FOUR_OBSTACLE = 100000;
const WINNING = 1000000000;

const TWO_OPPONENT = -50;
const TWO_OBSTACLE_OPPONENT = -25;
const THREE_OPPONENT = -5000;
const THREE_OBSTACLE_OPPONENT = -2500;
const FOUR_OPPONENT = -10000000;
const FOUR_OBSTACLE_OPPONENT = -5000000;
const LOSING = -1000000000;

const winningScreen = document.getElementById('winning');
const losingScreen = document.getElementById('losing');
const winningMessage = document.querySelector('[data-winning-message-text]');
const winningButton = document.getElementById('winningButton')
const losingButton = document.getElementById('losingButton')
const roundNumber = document.querySelector('#number.round')
const pointsNumber = document.querySelector('#number.points')

export class Game {

    constructor() {   
        this.self
        this.board
        this.cells
        this.playerOne
        this.playerTwo
        this.currentPlayer
        this.firstPlayer2Move
        this.round 
        this.points 
        this.isOver = false
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

        this.firstPlayer2Move = playerOne

        return 

    }

    getWinningItem() {

        this.winningScreen = winningScreen

        this.losingScreen = losingScreen

        this.winningButton = winningButton

        this.losingButton = losingButton

        this.round = parseInt(roundNumber.innerHTML)
        
        this.points = parseInt(pointsNumber.innerHTML)

        this.winningButton.addEventListener('click', () => {

            this.winningScreen.classList.remove('show');

            this.isOver = false

            this.board.createBoard(15, 15);

            this.startGame()

        })

        this.losingButton.addEventListener('click', () => {

            this.losingScreen.classList.remove('show');

            this.isOver = false

            this.board.createBoard(15, 15);

            this.startGame()
        })

        return 
    }

    makeMove(board, row, col, mark) {

        const cell = board[row][col]

        if (!cell.classList.contains('x') && !cell.classList.contains('o')) {

            this.board.highlight(cell)

            return cell.classList.add(mark);
        }

    }

    removeMark(board, row, col, mark) {

        const cell = board[row][col]

        return cell.classList.remove(mark);

    }

    async switchTurn() {

        this.currentPlayer = this.currentPlayer === this.playerOne ? this.playerTwo : this.playerOne

        if (this.currentPlayer === this.playerTwo) {

            const mark = this.playerTwo.mark

            const bestMove = await this.playerTwo.findBestMove(this.cells)

            if (bestMove) {

                const cell = this.cells[bestMove[1][0]][bestMove[1][1]]

                this.board.displayMove(cell, mark)

                this.checkWin(mark, cell)

            }

        } 

    }

    startGame() {

        this.firstPlayer2Move = this.firstPlayer2Move === this.playerOne ? this.playerTwo : this.playerOne;

        if (this.firstPlayer2Move === this.playerTwo) {

            this.currentPlayer = this.playerTwo

            this.makeMove(this.cells, 7, 7, this.firstPlayer2Move.mark)

            return this.switchTurn()

        }

    }

    endGame(winningPlayer) {

        if (winningPlayer === this.playerOne) {

            this.round -= 1

            this.points += 10

            roundNumber.innerHTML = this.round

            pointsNumber.innerHTML = this.points
            
            this.winningScreen.classList.add('show');
        } 

        if (winningPlayer === this.playerTwo) {

            this.round -= 1

            this.points -= 2

            roundNumber.innerHTML = this.round

            pointsNumber.innerHTML = this.points

            this.losingScreen.classList.add('show');

        }

        if (winningPlayer === 'tie') {

            this.winningMessage.textContent = 'Tie Game';

        }  

        return this.switchTurn()
    }

    checkWin(mark, cell) {

        const directions = [
            { row: 0, col: 1 },  // Horizontal right
            { row: 1, col: 0 },  // Vertical down
            { row: 1, col: -1 }, // Diagonal down-left
            { row: 1, col: 1 }   // Diagonal down-right
        ];

        const requiredToWin = 5;
        const [lastRow, lastCol] = [parseInt(cell.attributes.row.value), parseInt(cell.attributes.column.value)];
        
        
        for (let { row: dRow, col: dCol } of directions) {

            let count = 1;
            
            // Check in the positive direction
            count += this.countMarks(mark, lastRow, lastCol, dRow, dCol);
    
            // Check in the negative direction
            count += this.countMarks(mark, lastRow, lastCol, -dRow, -dCol);

            if (count >= requiredToWin) {

                this.board.cancelCells()

                this.isOver = true
                
                return setTimeout(() => this.endGame(this.currentPlayer), 1500);
            }

            if (this.board.isFull() && (count < requiredToWin)) {
                return console.log('stop this loop tie game')
            }
        }

        return this.switchTurn();
        
    }

    countMarks(mark, row, col, dRow, dCol) {

        let count = 0;
        let winningArray = []
        
        row += dRow;
        col += dCol;
        
        while (this.legalSquare(row, col) && this.cells[row][col].classList.contains(mark)) {
            count++;
            winningArray.push(this.cells[row][col])
            row += dRow;
            col += dCol;
            
        }

        if (winningArray.length === 4) {
            this.board.highlightWinning(winningArray)
        }
        
        return count;
    }

    legalSquare(row, col) {

        return row >= 0 && col >= 0 && row < this.cells.length && col < this.cells[0].length;

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

        // console.log(xScore, oScore)

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
