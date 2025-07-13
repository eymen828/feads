import React, { useState } from 'react'
import StartScreen from './components/StartScreen'
import QRScanner from './components/QRScanner'
import FeedbackScreen from './components/FeedbackScreen'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('start') // 'start', 'scanner', 'feedback'
  const [scannedData, setScannedData] = useState(null)

  const handleStartScan = () => {
    setCurrentScreen('scanner')
  }

  const handleQRScanned = (data) => {
    setScannedData(data)
    setCurrentScreen('feedback')
  }

  const handleBackToStart = () => {
    setCurrentScreen('start')
    setScannedData(null)
  }

  const handleFeedbackSubmitted = () => {
    // Hier würdest du das Feedback speichern
    alert('Vielen Dank für dein Feedback! 🎉')
    handleBackToStart()
  }

  return (
    <div className="app">
      {currentScreen === 'start' && (
        <StartScreen onStartScan={handleStartScan} />
      )}
      
      {currentScreen === 'scanner' && (
        <QRScanner 
          onQRScanned={handleQRScanned}
          onBack={handleBackToStart}
        />
      )}
      
      {currentScreen === 'feedback' && (
        <FeedbackScreen 
          scannedData={scannedData}
          onSubmit={handleFeedbackSubmitted}
          onBack={handleBackToStart}
        />
      )}
    </div>
  )
}

export default App