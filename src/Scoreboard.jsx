export default function Scoreboard( { score, currentPlayer }) {

    const whitePointerString = currentPlayer.code == 1 ? String.fromCodePoint('0x1f449') : String.fromCodePoint('0xe0020');
    const blackPointerString = currentPlayer.code == 2 ? String.fromCodePoint('0x1f449') : String.fromCodePoint('0xe0020');
    
    console.log("Scoreboard.currentPlayer", currentPlayer, whitePointerString, blackPointerString);
    return (
        <div className="score-board">
            <span>Scoreboard</span>
            <div>
            <p className="white-score">{whitePointerString} White: {score[0]}</p>
            </div>
            <p className="black-score">{blackPointerString} Black: {score[1]}</p>
        </div>
    )
}