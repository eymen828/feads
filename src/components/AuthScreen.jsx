import React, { useState } from 'react'
import { ArrowLeft, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function AuthScreen({ onBack }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        if (!name.trim()) {
          throw new Error('Name ist erforderlich')
        }
        await signUp(email, password, name)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen auth-screen">
      <div className="auth-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>{isLogin ? 'Anmelden' : 'Registrieren'}</h2>
      </div>

      <div className="auth-content">
        <div className="auth-container">
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="input-group">
                <User size={20} className="input-icon" />
                <input
                  type="text"
                  placeholder="Dein Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="input-group">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                placeholder="E-Mail Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Lock size={20} className="input-icon" />
              <input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="primary-button auth-button"
              disabled={loading}
            >
              {loading ? (
                'Wird verarbeitet...'
              ) : isLogin ? (
                <>
                  <LogIn size={20} />
                  Anmelden
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Registrieren
                </>
              )}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              {isLogin ? 'Noch kein Konto?' : 'Bereits registriert?'}
              <button 
                type="button"
                className="link-button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
              >
                {isLogin ? 'Registrieren' : 'Anmelden'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthScreen