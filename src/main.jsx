import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import Landing from './Landing.jsx'
import SchoolOS from './SchoolOS.jsx'
import StudentApp from './App.jsx'
import './index.css'

function BackBtn({ onBack }) {
  return (
    <button
      onClick={onBack}
      style={{
        position: 'fixed', top: 12, left: 12, zIndex: 9999,
        background: '#1C2B4A', color: 'white', border: 'none',
        borderRadius: 20, padding: '6px 14px', fontSize: 12,
        fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}
    >
      ← Views
    </button>
  )
}

function Root() {
  const [view, setView] = useState('landing')
  if (view === 'os')      return (<div><BackBtn onBack={() => setView('landing')} /><SchoolOS /></div>)
  if (view === 'student') return (<div><BackBtn onBack={() => setView('landing')} /><StudentApp /></div>)
  return <Landing onSelect={setView} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
