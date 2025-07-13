import React, { useState } from 'react'
import { ArrowLeft, Star, Send, CheckCircle } from 'lucide-react'

function FeedbackScreen({ scannedData, onSubmit, onBack }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Bitte gib eine Bewertung ab')
      return
    }

    setIsSubmitting(true)
    
    // Simuliere API-Aufruf
    setTimeout(() => {
      setIsSubmitting(false)
      onSubmit({
        rating,
        comment,
        scannedData,
        timestamp: new Date().toISOString()
      })
    }, 1000)
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1
      return (
        <button
          key={starNumber}
          type="button"
          className={`star ${starNumber <= rating ? 'active' : ''}`}
          onClick={() => setRating(starNumber)}
        >
          <Star size={32} fill={starNumber <= rating ? 'currentColor' : 'none'} />
        </button>
      )
    })
  }

  return (
    <div className="screen feedback-screen">
      <div className="feedback-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>Feedback geben</h2>
      </div>

      <div className="feedback-content">
        <div className="business-info">
          <CheckCircle size={24} className="success-icon" />
          <h3>QR-Code erfolgreich gescannt!</h3>
          <p className="scanned-data">Code: {scannedData}</p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="rating-section">
            <label>Wie war deine Erfahrung?</label>
            <div className="stars-container">
              {renderStars()}
            </div>
            <div className="rating-labels">
              <span>Schlecht</span>
              <span>Ausgezeichnet</span>
            </div>
          </div>

          <div className="comment-section">
            <label htmlFor="comment">
              Zusätzliche Kommentare (optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Teile deine Gedanken mit uns..."
              rows={4}
            />
          </div>

          <button 
            type="submit" 
            className="primary-button submit-button"
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <>Wird gesendet...</>
            ) : (
              <>
                <Send size={20} />
                Feedback senden
              </>
            )}
          </button>
        </form>

        <div className="reward-preview">
          <Gift size={24} />
          <p>Nach dem Senden erhältst du einen Stempel für deine Belohnungskarte!</p>
        </div>
      </div>
    </div>
  )
}

export default FeedbackScreen