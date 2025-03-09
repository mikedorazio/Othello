import {useState, useEffect} from 'react';
import { dataGrid, Player } from './data';
import Cell from './Cell';
import useOthello from './useOthello';
import { Fragment } from 'react';
import Scoreboard from './Scoreboard';

export default function Board() {
    const [board, setBoard] = useState(dataGrid);
    const [score, setScore] = useState([2,2]);
    const [currentPlayer, setCurrentPlayer] = useState(Player.BLACK);

    const {isGameOver, handleMouseup} = useOthello(board, setBoard, currentPlayer, setCurrentPlayer, setScore);

    useEffect(() => {
        window.addEventListener("mouseup", handleMouseup);

        if (isGameOver) {
            window.removeEventListener("mouseup", handleMouseup);
        }
        return () => {
            window.removeEventListener("mouseup", handleMouseup);
        };
    }, [handleMouseup]);


    console.log("Board.board", board);

    return (
        <>
            <Scoreboard  score={score} />
            <div className="othello-board">
                {board.map((row, rowIndex) => (
                    <Fragment key={rowIndex}>
                        {row.map((entry, itemIndex) => (
                        <Cell key={rowIndex*8+itemIndex} entry={entry} />
                        ))}
                    </Fragment>
                ))}
            </div>
        </>
      );
};