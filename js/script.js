document.addEventListener('DOMContentLoaded', () => {
  // SIMPLIFIED CURSOR - Remove expensive hover detection entirely
  const cursor = document.querySelector('.cursor_root');
  const cursorInner = document.querySelector('.cursor_cursor');
  
  if (!cursor || !cursorInner) return;
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isClicking = false;
  let animationFrameId = null;
  
  // Simple mouse tracking - no throttling needed
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });
  
  // Click events only
  document.addEventListener('mousedown', () => {
    isClicking = true;
    cursorInner.style.width = '16px';
    cursorInner.style.height = '16px';
  }, { passive: true });
  
  document.addEventListener('mouseup', () => {
    isClicking = false;
    cursorInner.style.width = '28px';
    cursorInner.style.height = '28px';
  }, { passive: true });
  
  // Simple show/hide
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  }, { passive: true });
  
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  }, { passive: true });
  
  // Ultra-simple cursor animation - no hover detection
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;
    
    const offsetX = isClicking ? 8 : 14;
    const offsetY = isClicking ? 8 : 14;
    
    cursor.style.transform = `translate3d(${cursorX - offsetX}px, ${cursorY - offsetY}px, 0)`;
    animationFrameId = requestAnimationFrame(animateCursor);
  }
  
  animateCursor();

  // SIMPLIFIED CAROUSEL - Remove complex bounds calculation and rubberbanding
  const carouselContainer = document.querySelector('.carousel-container') || document.querySelector('#image-carousel');
  const carouselSlide = document.querySelector('.carousel-slide');
  
  if (!carouselContainer || !carouselSlide) return;

  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = null;
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;
  
  // Rubberbanding configuration
  const RUBBERBAND_FACTOR = 0.3;
  const RUBBERBAND_THRESHOLD = 100;
  
  // Simple bounds - calculate once
  let maxTranslate = 0;
  let minTranslate = 0;
  
  function calculateSimpleBounds() {
    const containerWidth = carouselContainer.offsetWidth;
    const slideWidth = carouselSlide.scrollWidth;
    const containerPadding = parseInt(getComputedStyle(carouselContainer).paddingLeft) + parseInt(getComputedStyle(carouselContainer).paddingRight);
    const effectiveContainerWidth = containerWidth - containerPadding;
    
    maxTranslate = 0;
    minTranslate = -(slideWidth - effectiveContainerWidth);
  }
  
  // Calculate bounds after a short delay
  setTimeout(() => {
    calculateSimpleBounds();
    updateEdgeIndicators(); // Initialize edge indicators
  }, 100);
  
  // Rubberbanding function
  function applyRubberbanding(translate) {
    if (translate > maxTranslate) {
      const overdraw = translate - maxTranslate;
      if (overdraw > RUBBERBAND_THRESHOLD) {
        return maxTranslate + RUBBERBAND_THRESHOLD + (overdraw - RUBBERBAND_THRESHOLD) * RUBBERBAND_FACTOR;
      }
      return maxTranslate + overdraw * RUBBERBAND_FACTOR;
    } else if (translate < minTranslate) {
      const overdraw = minTranslate - translate;
      if (overdraw > RUBBERBAND_THRESHOLD) {
        return minTranslate - RUBBERBAND_THRESHOLD - (overdraw - RUBBERBAND_THRESHOLD) * RUBBERBAND_FACTOR;
      }
      return minTranslate - overdraw * RUBBERBAND_FACTOR;
    }
    return translate;
  }
  
  // Update edge indicators
  function updateEdgeIndicators() {
    carouselContainer.classList.remove('at-left-edge', 'at-right-edge');
    
    if (currentTranslate >= maxTranslate) {
      carouselContainer.classList.add('at-right-edge');
    } else if (currentTranslate <= minTranslate) {
      carouselContainer.classList.add('at-left-edge');
    }
  }
  
  // Smooth snap back to bounds
  function snapToBounds() {
    let targetTranslate = currentTranslate;
    
    if (currentTranslate > maxTranslate) {
      targetTranslate = maxTranslate;
    } else if (currentTranslate < minTranslate) {
      targetTranslate = minTranslate;
    }
    
    if (targetTranslate !== currentTranslate) {
      const startTranslate = currentTranslate;
      const distance = targetTranslate - startTranslate;
      const duration = 300;
      const startTime = Date.now();
      
      function animateSnap() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease out
        
        currentTranslate = startTranslate + (distance * easeOut);
        carouselSlide.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
        
        // Update edge indicators during snap animation
        updateEdgeIndicators();
        
        if (progress < 1) {
          animationID = requestAnimationFrame(animateSnap);
        }
      }
      
      animateSnap();
    }
  }
  
  // Simple event handlers
  carouselContainer.addEventListener('mouseenter', () => {
    carouselContainer.style.cursor = 'grab';
  }, { passive: true });

  carouselContainer.addEventListener('mouseleave', () => {
    carouselContainer.style.cursor = 'default';
    if (isDragging) {
      endDrag();
    }
  }, { passive: true });

  carouselContainer.addEventListener('mousedown', startDrag);
  carouselContainer.addEventListener('mousemove', drag);
  carouselContainer.addEventListener('mouseup', endDrag);
  carouselContainer.addEventListener('touchstart', startDrag, { passive: false });
  carouselContainer.addEventListener('touchmove', drag, { passive: false });
  carouselContainer.addEventListener('touchend', endDrag, { passive: false });
  carouselContainer.addEventListener('wheel', handleWheel, { passive: false });

  function startDrag(e) {
    isDragging = true;
    carouselContainer.style.cursor = 'grabbing';
    
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    startX = clientX;
    prevTranslate = currentTranslate;
    lastX = clientX;
    lastTime = Date.now();
    velocity = 0;
    
    if (animationID) {
      cancelAnimationFrame(animationID);
      animationID = null;
    }
  }

  function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const diff = clientX - startX;
    const rawTranslate = prevTranslate + diff;
    
    // Apply rubberbanding
    currentTranslate = applyRubberbanding(rawTranslate);
    
    // Update velocity
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    if (deltaTime > 0) {
      velocity = (clientX - lastX) / deltaTime * 16;
    }
    lastX = clientX;
    lastTime = currentTime;
    
    carouselSlide.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
    
    // Update edge indicators
    updateEdgeIndicators();
  }

  function endDrag() {
    if (!isDragging) return;
    
    isDragging = false;
    carouselContainer.style.cursor = 'grab';
    
    // Check if we need to snap back to bounds
    if (currentTranslate > maxTranslate || currentTranslate < minTranslate) {
      snapToBounds();
    } else if (Math.abs(velocity) > 1) {
      // Apply momentum only if within bounds
      applySimpleMomentum();
    }
  }

  function handleWheel(e) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      const scrollAmount = e.deltaX * 0.5;
      const rawTranslate = currentTranslate - scrollAmount;
      
      // Apply rubberbanding for wheel scrolling
      currentTranslate = applyRubberbanding(rawTranslate);
      
      carouselSlide.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
      
      // Update edge indicators
      updateEdgeIndicators();
      
      // Snap back if over bounds
      if (currentTranslate > maxTranslate || currentTranslate < minTranslate) {
        setTimeout(snapToBounds, 100);
      }
    }
  }

  function applySimpleMomentum() {
    const friction = 0.92;
    const minVelocity = 0.3;
    
    function animate() {
      if (Math.abs(velocity) < minVelocity) {
        velocity = 0;
        // Snap to bounds if needed
        if (currentTranslate > maxTranslate || currentTranslate < minTranslate) {
          snapToBounds();
        }
        return;
      }
      
      const rawTranslate = currentTranslate + velocity;
      
      // Apply rubberbanding during momentum
      currentTranslate = applyRubberbanding(rawTranslate);
      
      // Stop momentum if we hit the bounds
      if (currentTranslate === maxTranslate || currentTranslate === minTranslate) {
        velocity = 0;
      }
      
      velocity *= friction;
      carouselSlide.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
      
      // Update edge indicators during momentum
      updateEdgeIndicators();
      
      animationID = requestAnimationFrame(animate);
    }
    
    animate();
  }

  // Simple resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(calculateSimpleBounds, 150);
  }, { passive: true });

  // Cleanup
  function cleanup() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (animationID) cancelAnimationFrame(animationID);
    if (resizeTimeout) clearTimeout(resizeTimeout);
  }

  window.addEventListener('beforeunload', cleanup);
});
