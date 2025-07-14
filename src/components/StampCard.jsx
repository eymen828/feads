import React, { useState, useEffect } from 'react'
import { ArrowLeft, Star, Gift, Award } from 'lucide-react'
import { getUserStamps, claimReward } from '../lib/supabase'

function StampCard({ onBack }) {
  const [stamps, setStamps] = useState([])
  const [loading, setLoading] = useState(true)
  const [claimingReward, setClaimingReward] = useState(null)

  useEffect(() => {
    loadStamps()
  }, [])

  const loadStamps = async () => {
    try {
      const data = await getUserStamps()
      setStamps(data)
    } catch (error) {
      console.error('Error loading stamps:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClaimReward = async (businessId, businessName) => {
    setClaimingReward(businessId)
    try {
      await claimReward(businessId)
      alert(`🎉 Belohnung von ${businessName} erfolgreich eingelöst!`)
      loadStamps() // Reload to update counts
    } catch (error) {
      alert(`Fehler: ${error.message}`)
    } finally {
      setClaimingReward(null)
    }
  }

  // Group stamps by business
  const stampsByBusiness = stamps.reduce((acc, stamp) => {
    const businessId = stamp.businesses.id
    if (!acc[businessId]) {
      acc[businessId] = {
        business: stamp.businesses,
        stamps: []
      }
    }
    acc[businessId].stamps.push(stamp)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="screen stamp-card-screen">
        <div className="loading-container">
          <Award size={48} />
          <p>Lade deine Stempelkarten...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="screen stamp-card-screen">
      <div className="stamp-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>Meine Stempelkarten</h2>
      </div>

      <div className="stamp-content">
        {Object.keys(stampsByBusiness).length === 0 ? (
          <div className="empty-state">
            <Award size={64} />
            <h3>Noch keine Stempel</h3>
            <p>Scanne QR-Codes und gib Feedback, um Stempel zu sammeln!</p>
          </div>
        ) : (
          <div className="stamp-cards">
            {Object.values(stampsByBusiness).map(({ business, stamps }) => {
              const stampCount = stamps.length
              const threshold = business.reward_threshold
              const canClaim = stampCount >= threshold
              const progress = Math.min((stampCount / threshold) * 100, 100)

              return (
                <div key={business.id} className="stamp-card">
                  <div className="stamp-card-header">
                    <h3>{business.name}</h3>
                    <div className="stamp-count">
                      {stampCount}/{threshold}
                    </div>
                  </div>

                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="stamps-grid">
                    {Array.from({ length: threshold }, (_, index) => (
                      <div 
                        key={index}
                        className={`stamp-slot ${index < stampCount ? 'filled' : ''}`}
                      >
                        {index < stampCount ? (
                          <Star size={16} fill="currentColor" />
                        ) : (
                          <div className="empty-stamp"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="reward-info">
                    <Gift size={16} />
                    <span>{business.reward_description}</span>
                  </div>

                  {canClaim && (
                    <button 
                      className="claim-button"
                      onClick={() => handleClaimReward(business.id, business.name)}
                      disabled={claimingReward === business.id}
                    >
                      {claimingReward === business.id ? (
                        'Wird eingelöst...'
                      ) : (
                        <>
                          <Gift size={16} />
                          Belohnung einlösen
                        </>
                      )}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default StampCard