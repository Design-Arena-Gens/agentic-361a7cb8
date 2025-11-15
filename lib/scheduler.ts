// This file runs a client-side scheduler as a fallback
// since Vercel Cron limit is reached

let schedulerInitialized = false

export function initScheduler() {
  if (schedulerInitialized || typeof window === 'undefined') {
    return
  }

  schedulerInitialized = true

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
      } catch (error) {
        console.error('Error executing scheduled task:', error)
      }
    }
  }, 60000) // Check every minute
}
