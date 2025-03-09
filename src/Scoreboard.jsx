export default function Scoreboard( { score, currentPlayer }) {

    let whitePointerString;
    let blackPointerString;
    let totalScore = score[0] + score[1];

    if (totalScore == 64) {
        // white wins
        if (score[0] > score[1]) {
            whitePointerString = String.fromCodePoint('0x1f3c6');
            blackPointerString = String.fromCodePoint('0xe0020');
        }
        // black wins
        else if (score[1] > score[0]) {
            blackPointerString = String.fromCodePoint('0x1f3c6');
            whitePointerString = String.fromCodePoint('0xe0020');
        }
        // tie
        else {
            whitePointerString = String.fromCodePoint('0x1f3c6');
            blackPointerString = String.fromCodePoint('0x1f3c6');
        }
    }
    // game is not over...whose turn is it?
    else {
        whitePointerString = currentPlayer.code == 1 ? String.fromCodePoint('0x1f449') : String.fromCodePoint('0xe0020');
        blackPointerString = currentPlayer.code == 2 ? String.fromCodePoint('0x1f449') : String.fromCodePoint('0xe0020');
    }

    console.log("Scoreboard.currentPlayer", totalScore, currentPlayer, whitePointerString, blackPointerString);
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