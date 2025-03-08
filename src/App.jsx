import { useState } from 'react'
import Board from './Board'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="app-container">
            <Board />
      </div>
    </>
  )
}

export default App
