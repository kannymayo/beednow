import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button
        className="px-6 py-2 rounded bg-green-800 hover:bg-green-600 text-white"
        onClick={() => setCount((count) => count + 1)}
      >
        count is {count + 10}
      </button>
    </div>
  )
}

export default App
