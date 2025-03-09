import { useState } from "react";
import { CodeColor, Player } from './data.js';

export default function useOthello(board, setBoard, currentPlayer, setCurrentPlayer, setScore) {
    const [validSpots, setValidSpots] = useState();
    const [isGameOver, setIsGameOver] = useState(false);    // TOFIX: should be a state variable of Board not this custom hook
    let tempBoard = [];
    let tempPlayer;
    let checker = 0;

    // Determines if the adjacent spots of a particular cell are possible valid selection spots
    // dr is the delta move in the row direction and dc is the delta move in the column direction
    function adjacentSupport(player, dr, dc, r, c) {
        let otherPlayer = player == Player.BLACK ? Player.WHITE : Player.BLACK;
        const index = `(${r+dr},${c+dc})`;
        // make sure the spot in question is on the board
        if ((r + dr < 0) || (r + dr > 7)) {
            //console.log("adjacentSupport. row off board - ", index);
            return false;
        }
        if ((c + dc < 0) || (c + dc > 7)) {
            //console.log("adjacentSupport. column off board - ", index);
            return false;
        }
        
        // check to see if the opposite color (code) is next to us
        if (tempBoard[r + dr][c + dc].code !== otherPlayer.code) {
            //console.log("adjacentSupport.spot is not the right color", index, tempBoard[r + dr][c + dc], otherPlayer);
            return false;
        }

        if ((r + dr + dr < 0) || (r + dr + dr > 7)) {
            //console.log("adjacentSupport. plus one off board - row", index);
            return false;
        }
        if ((c + dc + dc < 0) || (c + dc + dc > 7)) {
            //console.log("adjacentSupport. plus one off board - column", index);
            return false;
        }

        //console.log("adjacentSupport. ON board - ", index);
        return checkLineMatch(player, dr, dc, r+dr+dr, c+dc+dc);
    }

    function checkLineMatch(player, dr, dc, r, c) {
        checker = checker + 1;
        //console.log("checkLineMatch", dr, dc, r, c);
        if (checker > 300) {
            //console.log("CHECKER SAVES THE DAY");
            return true;
        }
        if (tempBoard[r][c].code == player.code) {
            return true;
        }

        // check if there is a space next to us and if so...return false
        if (tempBoard[r][c].code == CodeColor.BLANK.code) {
            //console.log("checkLineMatch found a blank...returning false");
            return false;
        }

        if ((r + dr < 0) || (r + dr > 7)) {
            //console.log("checkLineMatch. off board - row", r, dr);
            return false;
        }
        if ((c + dc < 0) || (c + dc > 7)) {
            //console.log("checkLineMatch. off board - column", c, dc);
            return false;
        }
        return checkLineMatch(player, dr, dc, r + dr, c + dc);
    }

    // for every spot on the board, see if a surrounding position (north, south east, west etc) is a valid spot for the player whos turn it is.
    // if you find a spot that is eligible in any direction, pass it to other functions that can further investigate if it is a valid spot.
    function calculateValidSpots() {
        let spotsFound = false;
        //const tempBoard = JSON.parse(JSON.stringify(board));
        for (let i = 0; i < 8; i++) {;
            for (let j = 0; j < 8; j++) {
                let row = i
                let column = j;
                //console.log("calculateValidSpots.row - column", row, column);
                // if the spot is not taken, it is a candidate
                if (tempBoard[i][j].code == CodeColor.BLANK.code) {
                    //console.log("calculateValidSpots.trying", tempBoard[i][j]);
                    let nw = adjacentSupport(tempPlayer, -1, -1, row, column);
                    let nn = adjacentSupport(tempPlayer, -1,  0, row, column);
                    let ne = adjacentSupport(tempPlayer, -1,  1, row, column);

                    let ww = adjacentSupport(tempPlayer, 0, -1, row, column);
                    let ee = adjacentSupport(tempPlayer, 0,  1,  row, column);

                    let sw = adjacentSupport(tempPlayer, 1, -1, row, column);
                    let ss = adjacentSupport(tempPlayer, 1, 0, row, column);
                    let se = adjacentSupport(tempPlayer, 1, 1, row, column);

                    if (nw || nn || ne || ww || ee || sw || ss || se) {
                        console.log("calculateValidSpots.adding row,col", row, column);
                        spotsFound = true;
                        if (tempPlayer == Player.WHITE) {
                            tempBoard[i][j].code = CodeColor.OPTION_WHITE.code;
                            tempBoard[i][j].color = CodeColor.OPTION_WHITE.color;
                        }
                        else {
                            tempBoard[i][j].code = CodeColor.OPTION_BLACK.code;
                            tempBoard[i][j].color = CodeColor.OPTION_BLACK.color;
                        }
                    }
                }
                else {
                    //console.log("calculateValidSpots.Occupied", tempBoard[i][j]);
                }
            } 
        }
        return spotsFound;
    }

    // Clears out all of the current players possible moves so the next player's moves can be determined
    function clearOutOldOptions() {
        //const tempBoard = JSON.parse(JSON.stringify(board));
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                //console.log("clearOutOldOptions.code", tempBoard[i][j].code);
                if (tempBoard[i][j].code == CodeColor.OPTION_BLACK.code || tempBoard[i][j].code == CodeColor.OPTION_WHITE.code) {
                    console.log("clearOutOldOptions.clearing out", tempBoard[i][j]);
                    tempBoard[i][j].code = CodeColor.BLANK.code;
                    tempBoard[i][j].color = CodeColor.BLANK.color;
                }
            }   
        }
        console.log("clearOutOldOptions", tempBoard);
    }

    // determines if the cell that was selected was a valid move
    function isValidMove(row, column) {
        console.log("checkForValidMove", row, column, tempBoard[row][column]);
        if (tempBoard[row][column].code == CodeColor.OPTION_BLACK.code || tempBoard[row][column].code == CodeColor.OPTION_WHITE.code) {
            console.log("checkForValidMove says YES");
            return true;
        }
        else {
            console.log("checkForValidMoves says NO");
            return false;
        }          
    }

    // after a turn, determine the line of spots that need to be flipped over.  Just turn their color in the
    // board grid and let the re-render handle the process of turning the color over.
    function flipLine(dr, dc, r, c) {
        checker = checker + 1;
        //console.log("checkLineMatch", dr, dc, r, c);
        if (checker > 500) {
            //console.log("CHECKER SAVES THE DAY in flipLine()");
            return true;
        }
        // make sure the spot in question is on the board
        if ((r + dr < 0) || (r + dr > 7)) {
            //console.log("adjacentSupport. row off board - ", index);
            return false;
        }
        if ((c + dc < 0) || (c + dc > 7)) {
            //console.log("adjacentSupport. column off board - ", index);
            return false;
        }
        if (tempBoard[r + dr][c + dc].code == CodeColor.BLANK.code) {
            return false;
        }
        if (tempBoard[r + dr][c + dc].code == tempPlayer.code) {
            return true;
        }
        else {
            if (flipLine(dr, dc, r + dr, c + dc)) {
                if (tempPlayer == Player.BLACK) {
                    tempBoard[r + dr][c + dc].code = CodeColor.BLACK.code;  
                    tempBoard[r + dr][c + dc].color = CodeColor.BLACK.color;
                }
                else {
                    tempBoard[r + dr][c + dc].code = CodeColor.WHITE.code;  
                    tempBoard[r + dr][c + dc].color = CodeColor.WHITE.color;
                }
                return true;
            }
            else {
                return false;
            }
        }
    }

    // after a turn, flip all of the spots that have been captured during this move
    function flipCapturedSpots(row, column) {
        flipLine(-1, -1, row, column);
        flipLine(-1,  0, row, column);
        flipLine(-1,  1, row, column);
        flipLine( 0, -1, row, column);
        flipLine( 0,  1, row, column)
        flipLine( 1, -1, row, column);
        flipLine( 1, 0, row, column);
        flipLine( 1, 1, row, column);
    }

    // turn the selected cell to the current player's color
    function turnSelectedCell(row, column) {
        console.log("turnSelectedCell", row, column );
        if (tempPlayer == Player.BLACK) {
            tempBoard[row][column].code = CodeColor.BLACK.code;  
            tempBoard[row][column].color = CodeColor.BLACK.color;
        }
        else {
            tempBoard[row][column].code = CodeColor.WHITE.code;  
            tempBoard[row][column].color = CodeColor.WHITE.color;
        }
    }

    function countCompletedSquares() {
        let completedSquares = [0,0];
        for (let row = 0; row < 8; row++) {
            for (let column = 0; column < 8; column++) {
                if (tempBoard[row][column].code == 1) {
                    completedSquares[0] = completedSquares[0] + 1;
                }
                if (tempBoard[row][column].code == 2) {
                    completedSquares[1] = completedSquares[1] + 1;
                }
            }
        }
        return completedSquares;
    }

    // Handle the Mouse Up event.  
    function handleMouseup(event) {
        // TOFIX: do we really need tempPlayer or can we just use currentPlayer
        tempPlayer = currentPlayer;
        tempBoard = JSON.parse(JSON.stringify(board));
        console.log("handleMouseup", event.target);
        const selectedElement = event.target;
        if (selectedElement.tagName == "BODY") {
            console.log("handleMouseup. Body selected...returning");
            return;
        }
        // we have turned off pointer events for everything but the cell-container that is the parent to the child container
        const childCell = selectedElement.firstChild;
        const cellNumber = childCell.getAttribute("number");
        console.log("handleMouseup.cellNumber", cellNumber, selectedElement);
        if (cellNumber == null) return;

        // calculate row and column from index
        const row = Math.floor(cellNumber / 8);
        const column = cellNumber % 8;

        // check if it is a valid move
        const move = isValidMove(row, column);
        if (!move) {
            console.log("handleMouseup.Move was not in an eligible spot");
            return;
        }

        // turn the current grid location to the current player's color
        turnSelectedCell(row, column);

        // flip the ones that are captured
        flipCapturedSpots(row, column);

        // update any current valid spots and make them blank
        clearOutOldOptions();

        // check if game is over
        let score = countCompletedSquares();
        console.log("handleMouseup.completedSquares", score, tempBoard);
        let whiteTotal = score[0];
        let blackTotal = score[1];
        setScore(score);

        if (whiteTotal + blackTotal == 64) {
            setIsGameOver(true);
            console.log("Game Over");
            setBoard(tempBoard);
            return;
        }

        // change the current player 
        tempPlayer = tempPlayer == Player.WHITE ? Player.BLACK : Player.WHITE;
        console.log("handleMouseup.tempPlayer", tempPlayer);

        // calculate the valid spots for the new color if there are any
        let spotsFound = calculateValidSpots();

        if (spotsFound) {
            setCurrentPlayer(tempPlayer);
        }
        else {
            console.log("handleMouseup.No spots found for next player....continuing ");
            tempPlayer = tempPlayer == Player.WHITE ? Player.BLACK : Player.WHITE;
            spotsFound = calculateValidSpots();

        }
        setBoard(tempBoard);
    }

    return {isGameOver, handleMouseup, validSpots}

 }