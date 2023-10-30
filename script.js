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

    function handleClick (e) {
        console.log(e.target.classList);
        e.target.classList.add(activePlayer.mark);
        lastMove = getIndexOfK(board, e.target)
        checkWin(activePlayer.mark, lastMove)
        switchPlayerTurn();
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

            if(countWin >= requireCountWin) {
                win = true;      
                winningPlayer = activePlayer
                restartGame(winningPlayer)
            }
        }
        return win, winningPlayer;
    }

    function legalSquare(square) {
        return square[0] < board.length && square[1] < board.length && square[0] >= 0 && square[1] >= 0; 
    }


    function restartGame(player) {
        const winningScreen = document.querySelector('.winning-message');
        const winningMessage = document.querySelector('[data-winning-message-text]');
        winningScreen.classList.add('show');
        winningMessage.textContent = player.name + " Win";
    
        const winningButton = document.querySelector('#restartButton');
        const cells = document.querySelectorAll('[data-cell]');
    
        winningButton.addEventListener('click', () => {
            winningScreen.classList.remove('show');
            startGame();
        })
        return
    }
})();





