export class Player {
    constructor(name, mark) {
        this.name = name
        this.mark = mark

    }
    
}

export class AIPlayer extends Player {
    constructor(name, mark) {
        super(name, mark)
        this.game = null
    }

    getGame (game) {
        return this.game = game
    }

    getPossibleMoves(board) {

        const moves = new Set()
        const directions = [
            [1, 0], [0, 1], [1, 1], [1, -1],
            [-1, 0], [0, -1], [-1, -1], [-1, 1],
        ]

        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[r].length; c++) {
                if (board[r][c].classList.contains('x') || 
                    board[r][c].classList.contains('o')){
                    for (const [dx, dy] of directions) {
                        const newRow = r + dx
                        const newCol = c + dy
                        if (newRow >= 0 && newRow < board.length && 
                            newCol >= 0 && newCol < board[r].length) {
                            if (!board[newRow][newCol].classList.contains('x') &&
                                !board[newRow][newCol].classList.contains('o')) {
                                moves.add(`${newRow},${newCol}`)
                            }
                        }
                    }
                }
            }
        }

        return Array.from(moves).map(move => move.split(',').map(Number));;
    }

    findBestMove(board) {

        console.time("Find Best Move Time");

        const cloneBoard = this.game.cloneBoard(board)

        let bestMove = this.minimax(cloneBoard, 2, -Infinity, Infinity, false)

        console.log(`${bestMove[1]} have ${bestMove[0]}`)

        console.timeEnd("Find Best Move Time");

        return bestMove

    }

    minimax(board, depth, alpha, beta, isMaximizingPlayer) {


        // Nếu trò chơi kết thúc (thắng, thua hoặc hòa), trả về điểm số
        if (depth === 0 || this.game.isBoardFull()) {
            return [this.game.evaluate(), null]
        }

        const possibleMoves = this.getPossibleMoves(board)

        if (isMaximizingPlayer) {
            let maxEval = -Infinity;    
            let bestMove = possibleMoves[0]

            for (const move of possibleMoves) {
                let x = move[0]
                let y = move[1]
                const cloneBoard = this.game.cloneBoard(board);
                this.game.makeMove(cloneBoard, x, y, 'x');
                let [evaluate, m] = this.minimax(cloneBoard, depth - 1, alpha, beta, false)
                this.game.removeMark(cloneBoard, x, y, 'x');

                if (evaluate > maxEval) {
                    maxEval = evaluate
                    bestMove = [x, y]
                }

                alpha = Math.max(alpha, evaluate);
                
                if (beta <= alpha) break;
            }

            return [maxEval, bestMove]
            
    
        } else {
            let minEval = Infinity; 
            let bestMove = possibleMoves[0]
            
            for (const move of possibleMoves) {
                let x = move[0]
                let y = move[1]
                const cloneBoard = this.game.cloneBoard(board);
                this.game.makeMove(cloneBoard, x, y, 'o');
                let [evaluate, m] = this.minimax(cloneBoard, depth - 1, alpha, beta, true)
                this.game.removeMark(cloneBoard, x, y, 'o');

                if (evaluate < minEval) {
                    minEval = evaluate
                    bestMove = [x, y]
                }

                beta = Math.min(beta, evaluate);
                
                if (beta <= alpha) break;
            }

            return [minEval, bestMove]
            
        }

    }
}


