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

    pickRandomWiningLine() {

        let winningLine = [
            "Để tôi đoán, bạn đang giả vờ thua để tôi mất cảnh giác?",
            "Bạn vừa thua kìa, chắc mạng lag đúng không?",
            "Thua rồi à? Chắc do game bug chứ không phải tại bạn đâu, đúng không?",
            "Bạn thua nhanh thế, có phải bạn đang vội đi đâu không?"
        ]

        let randomIndex = Math.floor(Math.random() * winningLine.length);

        return winningLine[randomIndex]

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

    getBoardKey(board) {
        let key = '';
        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[r].length; c++) {
                if (board[r][c].classList.contains('x')) {
                    key += 'x';
                } else if (board[r][c].classList.contains('o')) {
                    key += 'o';
                } else {
                    key += '.';
                }
            }
        }
        return key;
    }

    findBestMove(board) {

        console.time("Find Best Move Time");

        const bestMove = this.minimax(board, 2, -Infinity, Infinity, false)

        console.log(`${bestMove[1]} have ${bestMove[0]}`)

        console.timeEnd("Find Best Move Time");

        return bestMove

    }

    minimax(board, depth, alpha, beta, isMaximizingPlayer) {


        if (depth === 0 || this.game.isBoardFull() || this.game.isOver) {
            const evalValue = [this.game.evaluate(), null];
            return evalValue
        }

        const possibleMoves = this.getPossibleMoves(board)

        if (isMaximizingPlayer) {
            let maxEval = -Infinity;    
            let bestMove = possibleMoves[0]
            
            for (const move of possibleMoves) {
                let x = move[0]
                let y = move[1]

                this.game.makeMove(board, x, y, 'x');
                let [evaluate, m] = this.minimax(board, depth - 1, alpha, beta, false)
                this.game.removeMark(board, x, y, 'x');

                console.log(`Depth: ${depth}, Move: [${x}, ${y}], Eval: ${evaluate}, Alpha: ${alpha}, Beta: ${beta}`);

                if (evaluate > maxEval) {
                    maxEval = evaluate
                    bestMove = [x, y]
                }

                alpha = Math.max(alpha, evaluate);
                
                if (beta <= alpha) break;
            }

            const result = [maxEval, bestMove];

            return result
            
    
        } else {
            let minEval = Infinity; 
            let bestMove = possibleMoves[0]
            
            for (const move of possibleMoves) {
                let x = move[0]
                let y = move[1]
                this.game.makeMove(board, x, y, 'o');
                let [evaluate, m] = this.minimax(board, depth - 1, alpha, beta, true)
                this.game.removeMark(board, x, y, 'o');

                console.log(`Depth: ${depth}, Move: [${x}, ${y}], Eval: ${evaluate}, Alpha: ${alpha}, Beta: ${beta}`);

                if (evaluate < minEval) {
                    minEval = evaluate
                    bestMove = [x, y]
                }

                beta = Math.min(beta, evaluate);
                
                if (beta <= alpha) break;
            }

            const result = [minEval, bestMove];;

            return result;
            
        }
        
    }

}


