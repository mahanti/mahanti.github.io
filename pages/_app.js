import '../assets/css/styles.css'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Theme switching logic
    function applyThemeForNow(now) {
      const hours = now.getHours()
      const isNight = (hours >= 19 || hours < 7)
      document.body.classList.remove('day', 'night')
      document.body.classList.add(isNight ? 'night' : 'day')
    }

    function msUntilNextSwitch(now) {
      const next = new Date(now)
      const hours = now.getHours()
      if (hours < 7) {
        next.setHours(7,0,0,0)
      } else if (hours < 19) {
        next.setHours(19,0,0,0)
      } else {
        next.setDate(next.getDate() + 1)
        next.setHours(7,0,0,0)
      }
      return Math.max(0, next.getTime() - now.getTime())
    }

    function schedule() {
      const now = new Date()
      applyThemeForNow(now)
      const delay = msUntilNextSwitch(now)
      setTimeout(schedule, delay === 0 ? 1000 : delay)
    }

    // Apply initial theme and start scheduling
    applyThemeForNow(new Date())
    schedule()

    // Setup medium-zoom for images
    if (typeof window !== 'undefined') {
      import('medium-zoom').then(mediumZoom => {
        mediumZoom.default('[data-zoomable]', {
          margin: 48,
          background: 'rgba(0, 0, 0, 0.8)',
          scrollOffset: 0
        })
      })
    }
  }, [])

  return <Component {...pageProps} />
}
