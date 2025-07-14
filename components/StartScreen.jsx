import React from 'react'
import { QrCode, Star, Gift, User, Award } from 'lucide-react'

function StartScreen({ onStartScan, onShowStamps, onShowProfile, user }) {
  return (
    <div className="screen start-screen">
      <div className="container">
        <div className="logo">
          <QrCode size={80} className="logo-icon" />
          <h1>Fead</h1>
          <p className="tagline">Feedback geben & Belohnungen sammeln</p>
        </div>

        {user && (
          <div className="user-welcome">
            <User size={20} />
            <span>Willkommen zurück!</span>
          </div>
        )}

        <div className="features">
          <div className="feature">
            <QrCode size={24} />
            <span>QR-Code scannen</span>
          </div>
          <div className="feature">
            <Star size={24} />
            <span>Feedback geben</span>
          </div>
          <div className="feature">
            <Gift size={24} />
            <span>Belohnung erhalten</span>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="primary-button scan-button"
            onClick={onStartScan}
          >
            <QrCode size={20} />
            QR-Code scannen
          </button>

          {user && (
            <div className="secondary-buttons">
              <button 
                className="secondary-button"
                onClick={onShowStamps}
              >
                <Award size={20} />
                Meine Stempel
              </button>
              <button 
                className="secondary-button"
                onClick={onShowProfile}
              >
                <User size={20} />
                Profil
              </button>
            </div>
          )}
        </div>

        <p className="help-text">
          {user 
            ? 'Scanne QR-Codes, sammle Stempel und löse Belohnungen ein!'
            : 'Registriere dich kostenlos, um Stempel zu sammeln und Belohnungen zu erhalten.'
          }
        </p>
      </div>
    </div>
  )
}

export default StartScreen