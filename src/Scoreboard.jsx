export default function Scoreboard( { score, currentPlayer }) {

    const pointerCode = '0x1f449';
    const blankCode = '0x0020';
    const trophyCode = '0x1f3c6'
    let whitePointerString;
    let blackPointerString;
    let totalScore = score[0] + score[1];

    if (totalScore == 64) {
        // white wins
        if (score[0] > score[1]) {
            whitePointerString = String.fromCodePoint(trophyCode);
            blackPointerString = String.fromCodePoint(blankCode);
        }
        // black wins
        else if (score[1] > score[0]) {
            blackPointerString = String.fromCodePoint(trophyCode);
            whitePointerString = String.fromCodePoint(blankCode);
        }
        // tie
        else {
            whitePointerString = String.fromCodePoint(trophyCode);
            blackPointerString = String.fromCodePoint(trophyCode);
        }
    }
    // game is not over...whose turn is it?
    else {
        whitePointerString = currentPlayer.code == 1 ? String.fromCodePoint(pointerCode) : String.fromCodePoint(blankCode);
        blackPointerString = currentPlayer.code == 2 ? String.fromCodePoint(pointerCode) : String.fromCodePoint(blankCode);
    }

    console.log("Scoreboard.currentPlayer", totalScore, currentPlayer, whitePointerString, blackPointerString);
    return (
        <div className="score-board">
            <div><span>Scoreboard</span><hr/></div>
            <p className="white-score">{whitePointerString} White: {score[0]}</p>
            <div>
            <p className="black-score">{blackPointerString} Black: {score[1]}</p>
            </div>
        </div>
    )
}