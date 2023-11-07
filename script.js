// create 15x15 board 
// Create 2 player 
// Allow user to make legal move
// swtich turn
// check for a win
// create AI

const player = (name , mark) => {
    return {name , mark};
}

const playerOne = player("Bill" , "x");
const playerTwo = player("Diu Anh", "o");


const boardModule = (() => {
    const cells = document.querySelectorAll('[data-cell]');
    const winningScreen = document.querySelector('.winning-message');
    const winningMessage = document.querySelector('[data-winning-message-text]');
    const winningButton = document.querySelector('#restartButton');
    const board = [];
    
    for (let r = 0; r < 15; r++) {
        board[r] = [];
        for (let c = 0; c < 15; c++) {
            if ( r === 0 ) {
                board[r].push(cells[c])
            } else if (r > 0)  {
                board[r].push(cells[c + r*15])
            }
        }
    }

    function getIndexOfK(arr, k) {
        for (i = 0 ; i < arr.length; i++) {
            let index = arr[i].indexOf(k);
            if (index > -1) {
                return [i, index]
            }
        }
    }

    function startGame() {
        cells.forEach((cell) => {
            cell.classList.remove(playerOne.mark, playerTwo.mark)
            cell.removeEventListener('click', handleClick)
            cell.addEventListener('click', handleClick, { once: true})       
        });    
    }
    
    startGame();

    let lastMove;

    function handleClick (e) {
        if (e.target.classList.contains(playerTwo.mark) || 
            (e.target.classList.contains(playerOne.mark))) {
            return
        }
        e.target.classList.add(activePlayer.mark);
        lastMove = getIndexOfK(board, e.target);
        checkWin(activePlayer.mark, lastMove);
        switchPlayerTurn();
        makeMove();
    }

    function makeMove() {
        //Search for empty cell
        // let bestScore = -Infinity;
        // let move;
        // for (let i = 0 ; i < board.length; i++) {
        //     for (let j = 0; j < board[i].length; j++) {
        //         if (availableCell(board[i][j])) {
        //             board[i][j].classList.add(activePlayer.mark)
        //             lastMove = getIndexOfK(board, board[i][j])
        //             let score = minimax(board, true, -Infinity, Infinity);
        //             board[i][j].classList.remove(activePlayer.mark)
        //         }   
        //         if (score > bestScore) {
        //             bestScore = score;
        //             move = {i , j};
        //         }
        //     }
        // }

        let available = availableBoard();
        let number = Math.floor(Math.random() * available.length)
        move = available[number][Math.floor(Math.random()* available[number].length)]
        move.classList.add(activePlayer.mark);
        lastMove = getIndexOfK(board, move);
        checkWin(activePlayer.mark, lastMove);
        
        switchPlayerTurn();
        return
        //bug that user can double click to the cell that bot click - fixed
    }
    

   

    //make the function to find all empty cell in board - push it to an array
    // find 5x5 available cell after lastMove
    function availableBoard(cell) {
        let available = []
        // this.cell = cell;
        // if (!cell.classList.contains(playerOne.mark) || cell.classList.contains(playerTwo.mark)) {
        //     return true
        // }
        for ( let i = 0 ; i < 15 ; i++) {
            available[i] = []
            for ( let j = 0 ; j < 15 ; j++ ) {
                // console.log(board[i][j])
                if (!(board[i][j].classList.contains(playerOne.mark) || board[i][j].classList.contains(playerTwo.mark))) {
                    available[i].push(board[i][j])
                }
            }
        }
        return available
    }

    const scores = {
        x: 1,
        o: -1,
        tie: 0
    };

    // This function is not work and still need to improve - i will comeback with this after i finish the course
    // function minimax(board, isMaximize, alpha, beta) {
    //     let result = checkWin(activePlayer.mark, lastMove);
    //     console.log(result)
    //     if (result !== undefined) {
    //         return scores[`${result.mark}`]
    //     }

    //     if (isMaximize) {
    //         let bestScore = -Infinity;
    //         for (let i = 0; i < board.length; i++) {
    //             for (let j = 0; j < board[i].length; j++) {
    //                 if (availableCell(board[i][j])) {
    //                     board[i][j].classList.add(playerOne.mark)
    //                     lastMove = getIndexOfK(board, board[i][j])
    //                     let score = minimax(board, false, alpha, beta);
                  
    //                     board[i][j].classList.remove(playerOne.mark)
    //                     bestScore = Math.max(score, bestScore);
    //                     alpha = Math.max(alpha, bestScore);
    //                     if(beta <= alpha) {
    //                         break
    //                     }  
    //                 }   
    //             }             
    //         }
    //         return bestScore

    //     } else {
    //         let bestScore = Infinity
    //         for (let i = 0; i < board.length; i++) {
    //             for (let j = 0; i < board[i].length; j++) {
    //                 if (availableCell(board[i][j])) {
    //                     board[i][j].classList.add(playerTwo.mark)
    //                     lastMove = getIndexOfK(board, board[i][j])             
    //                     let score = minimax(board, true, alpha, beta);
    //                     console.log(score)
    //                     board[i][j].classList.remove(playerTwo.mark)
    //                     bestScore = Math.min(score, bestScore);
    //                     alpha = Math.min(alpha, bestScore);
                        
    //                     if (beta <= alpha) {
    //                         break
    //                     }
    //                 }
                    
    //             }
                
    //         }
    //         return bestScore;
    //     }
    // }



    let activePlayer = playerOne;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }
    
    const lineDirection = [
        [0, 1], //horizon
        [1, 0], //vertical
        [1, -1], //diagonal1
        [1, 1], //diagonal2
    ]


    function checkWin(mark, lastMove) {
        let win = false;
        let winningPlayer;
        let requireCountWin = 5;
        for (i = 0; i < lineDirection.length & !win; i++) {
            let shift = lineDirection[i];
            let currentSquare = [lastMove[0] + shift[0], lastMove[1] + shift[1]];
            let countWin = 1;


            while (countWin < requireCountWin && legalSquare(currentSquare) && board[currentSquare[0]][currentSquare[1]].classList.contains(mark) === true) {
                countWin++;
                currentSquare[0] += shift[0];
                currentSquare[1] += shift[1];
            }

            currentSquare = [lastMove[0] - shift[0], lastMove[1] - shift[1]];

            if (board[currentSquare[0]] === undefined) {
                return
            }

            while (countWin < requireCountWin && legalSquare(currentSquare) && board[currentSquare[0]][currentSquare[1]].classList.contains(mark) === true) {
                countWin++
                currentSquare[0] -= shift[0];
                currentSquare[1] -= shift[1];
            }

            if(countWin >= requireCountWin) {
                win = true;      
                winningPlayer = activePlayer
                
                restartGame(winningPlayer)

            } else if (fullBoard() === true && countWin < requireCountWin) {
                winningPlayer = 'tie'
                restartGame(winningPlayer)
            }
        }   //bug when user click bottom of board - flxed
        return winningPlayer;

    }

    function legalSquare(square) {
        return square[0] < board.length && square[1] < board.length && square[0] >= 0 && square[1] >= 0; 
    }

    function fullBoard() {
        let count = 255;
        for(let i = 0; i <15 ; i++) {
            for (let j = 0; j < 15; j++) {
                if ((board[i][j].classList.contains(playerOne.mark) || board[i][j].classList.contains(playerTwo.mark))) {
                    count--;
                } 
            }
        }
    }


    function restartGame(player) {
        winningScreen.classList.add('show');
        if (player === 'tie') {
            winningMessage.textContent = 'Tie Game';
        }
        winningMessage.textContent = player.name + " Win";
    
        winningButton.addEventListener('click', () => {
            winningScreen.classList.remove('show');
            startGame();
        })
        return
    }

})();





