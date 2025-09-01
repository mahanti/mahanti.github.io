import { useEffect } from 'react'

export default function Carousel() {
  useEffect(() => {
    // Initialize carousel functionality
    const carouselContainer = document.querySelector('.carousel-container') || document.querySelector('#image-carousel')
    const carouselSlide = document.querySelector('.carousel-slide')
    
    if (!carouselContainer || !carouselSlide) return

    let isDragging = false
    let startX = 0
    let currentTranslate = 0
    let prevTranslate = 0
    let animationID = null
    let velocity = 0
    let lastX = 0
    let lastTime = 0
    
    // Rubberbanding configuration
    const RUBBERBAND_FACTOR = 0.3
    const RUBBERBAND_THRESHOLD = 100
    
    // Simple bounds - calculate once
    let maxTranslate = 0
    let minTranslate = 0
    
    function calculateSimpleBounds() {
      const containerWidth = carouselContainer.offsetWidth
      const slideWidth = carouselSlide.scrollWidth
      const containerPadding = parseInt(getComputedStyle(carouselContainer).paddingLeft) + parseInt(getComputedStyle(carouselContainer).paddingRight)
      const effectiveContainerWidth = containerWidth - containerPadding
      
      maxTranslate = 0
      minTranslate = -(slideWidth - effectiveContainerWidth)
    }
    
    // Calculate bounds after a short delay
    setTimeout(() => {
      calculateSimpleBounds()
      updateEdgeIndicators() // Initialize edge indicators
    }, 100)
    
    // Rubberbanding function
    function applyRubberbanding(translate) {
      if (translate > maxTranslate) {
        const overdraw = translate - maxTranslate
        if (overdraw > RUBBERBAND_THRESHOLD) {
          return maxTranslate + RUBBERBAND_THRESHOLD + (overdraw - RUBBERBAND_THRESHOLD) * RUBBERBAND_FACTOR
        }
        return maxTranslate + overdraw * RUBBERBAND_FACTOR
      } else if (translate < minTranslate) {
        const overdraw = minTranslate - translate
        if (overdraw > RUBBERBAND_THRESHOLD) {
          return minTranslate - RUBBERBAND_THRESHOLD - (overdraw - RUBBERBAND_THRESHOLD) * RUBBERBAND_FACTOR
        }
        return minTranslate - overdraw * RUBBERBAND_FACTOR
      }
      return translate
    }
    
    // Update edge indicators
    function updateEdgeIndicators() {
      carouselContainer.classList.remove('at-left-edge', 'at-right-edge')
      
      if (currentTranslate >= maxTranslate) {
        carouselContainer.classList.add('at-right-edge')
      } else if (currentTranslate <= minTranslate) {
        carouselContainer.classList.add('at-left-edge')
      }
    }
    
    // Smooth snap back to bounds
    function snapToBounds() {
      let targetTranslate = currentTranslate
      
      if (currentTranslate > maxTranslate) {
        targetTranslate = maxTranslate
      } else if (currentTranslate < minTranslate) {
        targetTranslate = minTranslate
      }
      
      if (targetTranslate !== currentTranslate) {
        const startTranslate = currentTranslate
        const distance = targetTranslate - startTranslate
        const duration = 300
        const startTime = Date.now()
        
        function animateSnap() {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease out
          
          currentTranslate = startTranslate + (distance * easeOut)
          carouselSlide.style.transform = `translate3d(${currentTranslate}px, 0, 0)`
          
          // Update edge indicators during snap animation
          updateEdgeIndicators()
          
          if (progress < 1) {
            animationID = requestAnimationFrame(animateSnap)
          }
        }
        
        animateSnap()
      }
    }
    
    // Event handlers
    function startDrag(e) {
      isDragging = true
      
      const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
      startX = clientX
      prevTranslate = currentTranslate
      lastX = clientX
      lastTime = Date.now()
      velocity = 0
      
      if (animationID) {
        cancelAnimationFrame(animationID)
        animationID = null
      }
    }

    function drag(e) {
      if (!isDragging) return
      
      e.preventDefault()
      const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
      const diff = clientX - startX
      const rawTranslate = prevTranslate + diff
      
      // Apply rubberbanding
      currentTranslate = applyRubberbanding(rawTranslate)
      
      // Update velocity
      const currentTime = Date.now()
      const deltaTime = currentTime - lastTime
      if (deltaTime > 0) {
        velocity = (clientX - lastX) / deltaTime * 16
      }
      lastX = clientX
      lastTime = currentTime
      
      carouselSlide.style.transform = `translate3d(${currentTranslate}px, 0, 0)`
      
      // Update edge indicators
      updateEdgeIndicators()
    }

    function endDrag() {
      if (!isDragging) return
      
      isDragging = false
      
      // Check if we need to snap back to bounds
      if (currentTranslate > maxTranslate || currentTranslate < minTranslate) {
        snapToBounds()
      } else if (Math.abs(velocity) > 1) {
        // Apply momentum only if within bounds
        applySimpleMomentum()
      }
    }

    function handleWheel(e) {
      // Only handle horizontal scrolling, and only if there's significant horizontal movement
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 5) {
        e.preventDefault()
        const scrollAmount = e.deltaX * 0.8 // Increased sensitivity for better trackpad feel
        const rawTranslate = currentTranslate - scrollAmount
        
        // Apply rubberbanding for wheel scrolling
        currentTranslate = applyRubberbanding(rawTranslate)
        
        carouselSlide.style.transform = `translate3d(${currentTranslate}px, 0, 0)`
        
        // Update edge indicators
        updateEdgeIndicators()
        
        // Snap back if over bounds - increased delay for smoother trackpad scrolling
        if (currentTranslate > maxTranslate || currentTranslate < minTranslate) {
          setTimeout(snapToBounds, 200)
        }
      }
    }

    function applySimpleMomentum() {
      const friction = 0.92
      const minVelocity = 0.3
      
      function animate() {
        if (Math.abs(velocity) < minVelocity) {
          velocity = 0
          // Snap to bounds if needed
          if (currentTranslate > maxTranslate || currentTranslate < minTranslate) {
            snapToBounds()
          }
          return
        }
        
        const rawTranslate = currentTranslate + velocity
        
        // Apply rubberbanding during momentum
        currentTranslate = applyRubberbanding(rawTranslate)
        
        // Stop momentum if we hit the bounds
        if (currentTranslate === maxTranslate || currentTranslate === minTranslate) {
          velocity = 0
        }
        
        velocity *= friction
        carouselSlide.style.transform = `translate3d(${currentTranslate}px, 0, 0)`
        
        // Update edge indicators during momentum
        updateEdgeIndicators()
        
        animationID = requestAnimationFrame(animate)
      }
      
      animate()
    }

    // Add event listeners
    carouselContainer.addEventListener('mouseleave', () => {
      if (isDragging) {
        endDrag()
      }
    }, { passive: true })

    carouselContainer.addEventListener('mousedown', startDrag)
    carouselContainer.addEventListener('mousemove', drag)
    carouselContainer.addEventListener('mouseup', endDrag)
    carouselContainer.addEventListener('touchstart', startDrag, { passive: false })
    carouselContainer.addEventListener('touchmove', drag, { passive: false })
    carouselContainer.addEventListener('touchend', endDrag, { passive: false })
    carouselContainer.addEventListener('wheel', handleWheel, { passive: false })
    
    // Also listen for scroll events as a fallback for some trackpad behaviors
    carouselContainer.addEventListener('scroll', (e) => {
      // Reset scroll position if it somehow gets scrolled
      carouselContainer.scrollLeft = 0
    }, { passive: true })

    // Resize handler
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(calculateSimpleBounds, 150)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    // Cleanup function
    return () => {
      if (animationID) cancelAnimationFrame(animationID)
      if (resizeTimeout) clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
      carouselContainer.removeEventListener('mouseleave', endDrag)
      carouselContainer.removeEventListener('mousedown', startDrag)
      carouselContainer.removeEventListener('mousemove', drag)
      carouselContainer.removeEventListener('mouseup', endDrag)
      carouselContainer.removeEventListener('touchstart', startDrag)
      carouselContainer.removeEventListener('touchmove', drag)
      carouselContainer.removeEventListener('touchend', endDrag)
      carouselContainer.removeEventListener('wheel', handleWheel)
      carouselContainer.removeEventListener('scroll', (e) => { carouselContainer.scrollLeft = 0 })
    }
  }, [])

  return (
    <div className="carousel-wrapper mb-24">
      <div id="image-carousel" className="carousel-container">
        <div className="carousel-slide">
          <img src="/img/carousel/01.jpg" loading="lazy" alt="Carousel image 1" />
          <img src="/img/carousel/02.png" className="image-border" loading="lazy" alt="Carousel image 2" />
          <img src="/img/carousel/03.jpg" loading="lazy" alt="Carousel image 3" />
          <img src="/img/carousel/08.jpg" loading="lazy" alt="Carousel image 4" />
          <img src="/img/carousel/04.jpg" loading="lazy" alt="Carousel image 5" />
          <img src="/img/carousel/07.jpg" loading="lazy" alt="Carousel image 6" />
          <img src="/img/carousel/05.jpg" loading="lazy" alt="Carousel image 7" />
          <img src="/img/carousel/06.jpg" loading="lazy" alt="Carousel image 8" />
        </div>
      </div>
    </div>
  )
}
