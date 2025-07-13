import React, { useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import { ArrowLeft, Camera, AlertCircle } from 'lucide-react'

function QRScannerComponent({ onQRScanned, onBack }) {
  const videoRef = useRef(null)
  const qrScannerRef = useRef(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const startScanner = async () => {
      try {
        // Prüfe ob Kamera verfügbar ist
        const hasCamera = await QrScanner.hasCamera()
        if (!hasCamera) {
          setError('Keine Kamera gefunden')
          setIsLoading(false)
          return
        }

        // Erstelle QR Scanner
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          (result) => {
            // QR-Code erfolgreich gescannt
            onQRScanned(result.data)
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        )

        // Starte Scanner
        await qrScannerRef.current.start()
        setIsLoading(false)
      } catch (err) {
        console.error('Scanner Fehler:', err)
        setError('Kamera-Zugriff verweigert oder nicht verfügbar')
        setIsLoading(false)
      }
    }

    startScanner()

    // Cleanup beim Verlassen der Komponente
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop()
        qrScannerRef.current.destroy()
      }
    }
  }, [onQRScanned])

  return (
    <div className="screen scanner-screen">
      <div className="scanner-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>QR-Code scannen</h2>
      </div>

      <div className="scanner-container">
        {isLoading && (
          <div className="scanner-loading">
            <Camera size={48} />
            <p>Kamera wird geladen...</p>
          </div>
        )}

        {error && (
          <div className="scanner-error">
            <AlertCircle size={48} />
            <p>{error}</p>
            <button className="secondary-button" onClick={onBack}>
              Zurück
            </button>
          </div>
        )}

        {!error && (
          <div className="video-container">
            <video ref={videoRef} className="scanner-video"></video>
            <div className="scan-overlay">
              <div className="scan-frame"></div>
            </div>
          </div>
        )}
      </div>

      <div className="scanner-instructions">
        <p>Halte den QR-Code in den Rahmen</p>
        <p className="small-text">Der Code wird automatisch erkannt</p>
      </div>
    </div>
  )
}

export default QRScannerComponent