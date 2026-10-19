import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App() {
  return <div className="app">Simple Kanban</div>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
