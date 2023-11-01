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


    function handleClick (e) {
        if (e.target.classList.contains(playerTwo.mark) || 
            (e.target.classList.contains(playerOne.mark))) {
            return
        }
        e.target.classList.add(activePlayer.mark);
        let lastMove = getIndexOfK(board, e.target);
        checkWin(activePlayer.mark, lastMove);
        switchPlayerTurn();
        makeMove();
        switchPlayerTurn();
    }

    function makeMove() {
        //create empty board - update it
        let available = [];
        for ( i = 0 ; i < 15 ; i++) {
            available[i] = []
            for ( j = 0 ; j < 15 ; j++ ) {
                // console.log(board[i][j])
                if (!(board[i][j].classList.contains(playerOne.mark) || board[i][j].classList.contains(activePlayer.mark))) {
                    available[i].push(board[i][j])
                }
            }
        }
        //make random move
        let number = Math.floor(Math.random() * available.length)
        let move = available[number][Math.floor(Math.random()* available[number].length)]
        move.classList.add(activePlayer.mark)
        let lastMove = getIndexOfK(board, move)
        return checkWin(activePlayer.mark, lastMove)
        //bug that user can double click to the cell that bot click - fixed
    }
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
            }
        }
        return win, winningPlayer;
        //bug when user click bottom of board
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





