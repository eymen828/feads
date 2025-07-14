import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import StartScreen from './components/StartScreen'
import QRScanner from './components/QRScanner'
import FeedbackScreen from './components/FeedbackScreen'
import AuthScreen from './components/AuthScreen'
import StampCard from './components/StampCard'
import ProfileScreen from './components/ProfileScreen'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()
  const [currentScreen, setCurrentScreen] = useState('start') // 'start', 'scanner', 'feedback', 'auth', 'stamps', 'profile'
  const [scannedData, setScannedData] = useState(null)
  const [businessData, setBusinessData] = useState(null)

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Fead wird geladen...</p>
          </div>
        </div>
      </div>
    )
  }

  const handleStartScan = () => {
    if (!user) {
      setCurrentScreen('auth')
      return
    }
    setCurrentScreen('scanner')
  }

  const handleQRScanned = async (data) => {
    try {
      const { getBusinessByQRCode } = await import('./lib/supabase')
      const business = await getBusinessByQRCode(data)
      setScannedData(data)
      setBusinessData(business)
      setCurrentScreen('feedback')
    } catch (error) {
      alert('QR-Code nicht erkannt. Bitte versuche es erneut.')
      console.error('Error finding business:', error)
    }
  }

  const handleBackToStart = () => {
    setCurrentScreen('start')
    setScannedData(null)
    setBusinessData(null)
  }

  const handleFeedbackSubmitted = async (feedbackData) => {
    try {
      const { submitFeedback } = await import('./lib/supabase')
      await submitFeedback(businessData.id, feedbackData.rating, feedbackData.comment)
      alert('Vielen Dank für dein Feedback! Du hast einen Stempel erhalten! 🎉')
    } catch (error) {
      alert('Fehler beim Speichern des Feedbacks')
      console.error('Error submitting feedback:', error)
    }
    handleBackToStart()
  }

  const handleShowStamps = () => {
    if (!user) {
      setCurrentScreen('auth')
      return
    }
    setCurrentScreen('stamps')
  }

  const handleShowProfile = () => {
    if (!user) {
      setCurrentScreen('auth')
      return
    }
    setCurrentScreen('profile')
  }

  return (
    <div className="app">
      {currentScreen === 'start' && (
        <StartScreen 
          onStartScan={handleStartScan}
          onShowStamps={handleShowStamps}
          onShowProfile={handleShowProfile}
          user={user}
        />
      )}
      
      {currentScreen === 'auth' && (
        <AuthScreen onBack={handleBackToStart} />
      )}
      
      {currentScreen === 'scanner' && (
        <QRScanner 
          onQRScanned={handleQRScanned}
          onBack={handleBackToStart}
        />
      )}
      
      {currentScreen === 'feedback' && (
        <FeedbackScreen 
          businessData={businessData}
          onSubmit={handleFeedbackSubmitted}
          onBack={handleBackToStart}
        />
      )}
      
      {currentScreen === 'stamps' && (
        <StampCard onBack={handleBackToStart} />
      )}
      
      {currentScreen === 'profile' && (
        <ProfileScreen onBack={handleBackToStart} />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App