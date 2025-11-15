'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [status, setStatus] = useState('Loading...')
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStatus()
    fetchHistory()
    startScheduler()
  }, [])

  const startScheduler = () => {
    // Check every minute if it's 4 PM IST
    setInterval(async () => {
      const now = new Date()
      const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
      const hours = istTime.getHours()
      const minutes = istTime.getMinutes()

      // If it's 4 PM IST (16:00)
      if (hours === 16 && minutes === 0) {
        try {
          await fetch('/api/cron')
          console.log('Scheduled task executed at 4 PM IST')
          fetchHistory() // Refresh history after sending
        } catch (error) {
          console.error('Error executing scheduled task:', error)
        }
      }
    }, 60000) // Check every minute
  }

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status')
      const data = await res.json()
      setStatus(data.message)
    } catch (error) {
      setStatus('Error loading status')
    }
  }

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history')
      const data = await res.json()
      setHistory(data.history || [])
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const triggerManual = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/trigger', { method: 'POST' })
      const data = await res.json()
      alert(data.message || 'Email sent successfully!')
      fetchHistory()
    } catch (error) {
      alert('Error sending email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <h1 style={styles.title}>📊 LTC Price Tracker</h1>
        <p style={styles.subtitle}>Daily Litecoin price monitoring at 4 PM IST</p>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>System Status</h2>
          <p style={styles.status}>{status}</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Manual Trigger</h2>
          <p style={styles.description}>Send a price report email immediately</p>
          <button
            style={styles.button}
            onClick={triggerManual}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Report Now'}
          </button>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Price History</h2>
          {history.length === 0 ? (
            <p style={styles.noData}>No price data yet. Waiting for first 4 PM IST update...</p>
          ) : (
            <div style={styles.historyList}>
              {history.slice(0, 10).map((record, idx) => (
                <div key={idx} style={styles.historyItem}>
                  <div style={styles.historyDate}>
                    {new Date(record.timestamp).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </div>
                  <div style={styles.historyPrice}>
                    ₹{record.priceInr?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                  <div style={styles.historyTotal}>
                    Total: ₹{record.totalValue?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.info}>
          <p>💌 Daily reports sent to: sweyjotdhillon@gmail.com</p>
          <p>⏰ Scheduled time: 4:00 PM IST</p>
          <p>💰 Tracking: 2000 LTC</p>
        </div>
      </div>
    </main>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: '100vh',
    padding: '2rem',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: '0.5rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  subtitle: {
    fontSize: '1.2rem',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '2rem',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#667eea',
  },
  status: {
    fontSize: '1rem',
    color: '#666',
    lineHeight: '1.6',
  },
  description: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '1rem',
  },
  button: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  historyItem: {
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  historyDate: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500',
  },
  historyPrice: {
    fontSize: '1.1rem',
    color: '#667eea',
    fontWeight: '600',
  },
  historyTotal: {
    fontSize: '0.95rem',
    color: '#764ba2',
    fontWeight: '600',
  },
  noData: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '2rem',
  },
  info: {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    color: 'white',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
}
