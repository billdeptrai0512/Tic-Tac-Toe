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
    const board = [];
    
    for (let r = 0; r <= 15; r++) {
        board[r] = [];
        for (let c = 0; c <= 15; c++) {
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
    
    cells.forEach((cell) => {
        cell.addEventListener('click', () => {
            cell.classList.add(activePlayer.mark);
            lastMove = getIndexOfK(board, cell)
            checkWin(activePlayer.mark, lastMove)
            switchPlayerTurn();
        }, { once: true})
    });

    let lastMove;
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
        let requireCountWin = 5;
        for (i = 0; i < lineDirection.length & !win; i++) {
            let shift = lineDirection[i];
            let currentSquare = [lastMove[0] + shift[0], lastMove[1] + shift[1]];
            let countWin = 1;

            while (countWin < requireCountWin && legalSquare(currentSquare) && board[currentSquare[0]][currentSquare[1]].classList.contains(mark) === true ) {
                countWin++;
                currentSquare[0] += shift[0];
                currentSquare[1] += shift[1];
                
            }

            currentSquare = [lastMove[0] - shift[0], lastMove[1] - shift[1]];

            while (countWin < requireCountWin && legalSquare(currentSquare) && board[currentSquare[0]][currentSquare[1]].classList.contains(mark) === true) {
                countWin++
                currentSquare[0] -= shift[0];
                currentSquare[1] -= shift[1];
            }
            console.log(countWin)

            if(countWin >= requireCountWin) {
                win = true;      
                console.log('be diu de thuong')
            }
        }
        return win;
    }

    function legalSquare(square) {
        return square[0] < board.length && square[1] < board.length && square[0] >= 0 && square[1] >= 0; 
    }

})();


