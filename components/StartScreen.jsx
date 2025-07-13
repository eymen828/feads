import React from 'react'
import { QrCode, Star, Gift } from 'lucide-react'

function StartScreen({ onStartScan }) {
  return (
    <div className="screen start-screen">
      <div className="container">
        <div className="logo">
          <QrCode size={80} className="logo-icon" />
          <h1>Fead</h1>
          <p className="tagline">Feedback geben & Belohnungen sammeln</p>
        </div>

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

        <button 
          className="primary-button scan-button"
          onClick={onStartScan}
        >
          <QrCode size={20} />
          QR-Code scannen
        </button>

        <p className="help-text">
          Scanne den QR-Code eines teilnehmenden Unternehmens, 
          um Feedback zu geben und Belohnungen zu sammeln.
        </p>
      </div>
    </div>
  )
}

export default StartScreen