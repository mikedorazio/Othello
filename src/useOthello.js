import { useState } from "react";
import { CodeColor, Player } from './data.js';

export default function useOthello(board, setBoard, currentPlayer, setCurrentPlayer) {
    const [validSpots, setValidSpots] = useState();
    const [isGameOver, setIsGameOver] = useState(false);
    let tempBoard = [];
    let tempPlayer;
    let checker = 0;

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

        if ((r + dr < 0) || (r + dr > 7)) {
            //console.log("adjacentSupport. off board - row", r, dr);
            return false;
        }
        if ((c + dc < 0) || (c + dc > 7)) {
            //console.log("adjacentSupport. off board - column", c, dc);
            return false;
        }
        return checkLineMatch(player, dr, dc, r + dr, c + dc);
    }

    // for every spot on the board, see if a relative position (north, south east, west etc) is a valid spot for the player whos turn it is.
    // if you find a spot that is eligible in any direction, pass it to 
    function calculateValidSpots() {
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
    }

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

    function checkForValidMove(element, number) {
        const row = Math.floor(number / 8);
        const column = number % 8;
        console.log("checkForValidMove", number, tempBoard[row][column]);
        if (tempBoard[row][column].code == CodeColor.OPTION_BLACK.code || tempBoard[row][column].code == CodeColor.OPTION_WHITE.code) {
            console.log("checkForValidMove says YES");
        }
        else {
            console.log("checkForValidMoves says NO");
        }
                    
    }

    function handleMouseup(event) {
        tempPlayer = currentPlayer;
        tempBoard = JSON.parse(JSON.stringify(board));
        console.log("handleMouseup", event.target);
        const cellContainer = event.target;
        const childCell = cellContainer.firstChild;
        const cellNumber = childCell.getAttribute("number");
        console.log("handleMouseup.cellNumber", cellNumber, cellContainer);
        if (cellNumber == null) return;

        // check if it is a valid move
        checkForValidMove(childCell, cellNumber);

        // flip the ones that are captured
        // flipCapturedSpots();

        // update any current valid spots and make them blank
        clearOutOldOptions();

        // change the current player 
        tempPlayer = tempPlayer == Player.WHITE ? Player.BLACK : Player.WHITE;
        console.log("handleMouseup.tempPlayer", tempPlayer);

        // calculate the valid spots for the new color
        calculateValidSpots();
        setCurrentPlayer(tempPlayer);
        setBoard(tempBoard);
    }

    return {isGameOver, handleMouseup, validSpots}

 }