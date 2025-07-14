import React, { useState, useEffect } from 'react'
import { ArrowLeft, User, Mail, Award, Gift, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getUserRewards, getUserStamps } from '../lib/supabase'

function ProfileScreen({ onBack }) {
  const { user, signOut } = useAuth()
  const [rewards, setRewards] = useState([])
  const [totalStamps, setTotalStamps] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const [rewardsData, stampsData] = await Promise.all([
        getUserRewards(),
        getUserStamps()
      ])
      
      setRewards(rewardsData)
      setTotalStamps(stampsData.length)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="screen profile-screen">
        <div className="loading-container">
          <User size={48} />
          <p>Lade Profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="screen profile-screen">
      <div className="profile-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>Mein Profil</h2>
      </div>

      <div className="profile-content">
        <div className="profile-info">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-details">
            <h3>{user?.user_metadata?.name || 'Fead Nutzer'}</h3>
            <div className="profile-email">
              <Mail size={16} />
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <Award size={24} />
            <div className="stat-number">{totalStamps}</div>
            <div className="stat-label">Gesammelte Stempel</div>
          </div>
          <div className="stat-card">
            <Gift size={24} />
            <div className="stat-number">{rewards.length}</div>
            <div className="stat-label">Eingelöste Belohnungen</div>
          </div>
        </div>

        {rewards.length > 0 && (
          <div className="rewards-history">
            <h3>Eingelöste Belohnungen</h3>
            <div className="rewards-list">
              {rewards.map((reward) => (
                <div key={reward.id} className="reward-item">
                  <Gift size={20} />
                  <div className="reward-details">
                    <div className="reward-business">{reward.businesses.name}</div>
                    <div className="reward-description">{reward.businesses.reward_description}</div>
                    <div className="reward-date">
                      {new Date(reward.created_at).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          className="sign-out-button"
          onClick={handleSignOut}
        >
          <LogOut size={20} />
          Abmelden
        </button>
      </div>
    </div>
  )
}

export default ProfileScreen