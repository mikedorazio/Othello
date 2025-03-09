export default function Scoreboard( { score }) {
    
    return (
        <div className="score-board">
            <span>Scoreboard</span>
            <p class="white-score">White: {score[0]}</p>
            <p class="black-score">Black: {score[1]}</p>
        </div>
    )
}