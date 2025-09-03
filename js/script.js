document.addEventListener('DOMContentLoaded', () => {

  // ================================
  // PAGE ENTRANCE ANIMATIONS
  // ================================
  
  function initPageAnimations() {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; // Skip animations if user prefers reduced motion
    }
    
    // Get all elements that should be animated
    const headerElements = document.querySelectorAll('#name, .subtitle, nav');
    const carouselElement = document.querySelector('.embla');
    const sectionElements = document.querySelectorAll('section, .section');
    const linkElements = document.querySelectorAll('.image-link');
    const logoElement = document.querySelector('.logo-link');
    
    // Immediately set initial hidden state with inline styles (like nelson.co)
    const allElements = [
      ...(logoElement ? [logoElement] : []),
      ...headerElements,
      ...(carouselElement ? [carouselElement] : []),
      ...sectionElements,
      ...linkElements
    ];
    
    allElements.forEach(el => {
      el.style.opacity = '0';
      el.style.filter = 'blur(6px)';
      el.style.transform = 'translateY(12px) translateZ(0)';
      el.style.transition = 'all 0.4s cubic-bezier(0.24, 0.48, 0.48, 0.96)';
    });
    
    // Trigger animations after page load
    requestAnimationFrame(() => {
      setTimeout(() => {
        // Animate elements with staggered timing
        if (logoElement) {
          setTimeout(() => {
            logoElement.style.opacity = '1';
            logoElement.style.filter = 'blur(0px)';
            logoElement.style.transform = 'translateY(0px) translateZ(0)';
          }, 100);
        }
        
        headerElements.forEach((el, index) => {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.filter = 'blur(0px)';
            el.style.transform = 'translateY(0px) translateZ(0)';
          }, 150 + index * 50);
        });
        
        if (carouselElement) {
          setTimeout(() => {
            carouselElement.style.opacity = '1';
            carouselElement.style.filter = 'blur(0px)';
            carouselElement.style.transform = 'translateY(0px) translateZ(0)';
          }, 400);
        }
        
        sectionElements.forEach((el, index) => {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.filter = 'blur(0px)';
            el.style.transform = 'translateY(0px) translateZ(0)';
          }, 500 + index * 100);
        });
        
        linkElements.forEach((el, index) => {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.filter = 'blur(0px)';
            el.style.transform = 'translateY(0px) translateZ(0)';
          }, 700 + index * 30);
        });
      }, 100); // Small delay after page load
    });
  }
  
  // Page transition handling for navigation
  function handlePageTransition(href) {
    // Only handle internal links
    if (href.startsWith('/') || href.includes(window.location.hostname)) {
      // Get all animated elements - target the main containers, not child elements
      const logoElement = document.querySelector('.logo-link');
      const nameElement = document.querySelector('#name');
      const subtitleElement = document.querySelector('.subtitle.hideable'); // Only the main subtitle
      const navElement = document.querySelector('nav');
      const carouselElement = document.querySelector('.embla');
      const sectionElements = document.querySelectorAll('section');
      const linkElements = document.querySelectorAll('a.image-link.row'); // Specific to the work/product links
      
      const allElements = [
        ...(logoElement ? [logoElement] : []),
        ...(nameElement ? [nameElement] : []),
        ...(subtitleElement ? [subtitleElement] : []),
        ...(navElement ? [navElement] : []),
        ...(carouselElement ? [carouselElement] : []),
        ...sectionElements,
        ...linkElements
      ];
      
      // Animate elements out quickly
      allElements.forEach((el, index) => {
        // Force override any existing transition
        el.style.transition = 'none';
        requestAnimationFrame(() => {
          el.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          setTimeout(() => {
            el.style.opacity = '0';
            el.style.filter = 'blur(6px)';
            el.style.transform = 'translateY(12px) translateZ(0)';
          }, index * 20); // Very quick stagger
        });
      });
      
      // Also fade the page container
      const pageContent = document.querySelector('.page-content');
      if (pageContent) {
        pageContent.style.transition = 'opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        setTimeout(() => {
          pageContent.style.opacity = '0.3';
        }, 100);
      }
      
      setTimeout(() => {
        window.location.href = href;
      }, 400); // Give enough time for exit animation
      
      return false; // Prevent immediate navigation
    }
    return true; // Allow navigation for external links
  }
  
  // Add transition handling to navigation links
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.hasAttribute('href')) {
      const href = e.target.getAttribute('href');
      if (href && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        if (!handlePageTransition(href)) {
          e.preventDefault();
        }
      }
    }
  });
  
  // Initialize animations
  let animationsInitialized = false;
  
  function safeInitAnimations() {
    if (!animationsInitialized) {
      animationsInitialized = true;
      initPageAnimations();
    }
  }
  
  // Initialize immediately
  safeInitAnimations();
  
  // Also trigger on window load as a fallback
  window.addEventListener('load', safeInitAnimations);

  // ================================
  // EMBLA CAROUSEL IMPLEMENTATION
  // ================================
  
  function initEmblaCarousel() {
    const emblaNode = document.getElementById('embla-viewport');
    if (!emblaNode) return;

    // Initialize Embla with options
    const options = {
      loop: false,
      align: 'start',
      containScroll: 'trimSnaps',
      dragFree: true,
      slidesToScroll: 1
    };
    
    const embla = EmblaCarousel(emblaNode, options);
    
    // Initialize pagination dots for Embla carousel
    const emblaPagination = document.getElementById('embla-pagination');
    const emblaDots = emblaPagination ? emblaPagination.querySelectorAll('.carousel-dot') : [];
    
    function updateEmblaPagination() {
      const selectedIndex = embla.selectedScrollSnap();
      emblaDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === selectedIndex);
      });
    }
    
    // Add click handlers to Embla pagination dots
    emblaDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        embla.scrollTo(index);
      });
    });
    
    // Update pagination on slide change
    embla.on('select', updateEmblaPagination);
    embla.on('reInit', updateEmblaPagination);
    
    // Initialize pagination
    updateEmblaPagination();
    
    // Add wheel/trackpad support with throttling
    let wheelTimer = null;
    emblaNode.addEventListener('wheel', (e) => {
      // Clear existing timer
      if (wheelTimer) {
        clearTimeout(wheelTimer);
      }
      
      // Detect horizontal scrolling (trackpad swipe) or shift+vertical scroll
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        e.preventDefault();
        
        // Get the scroll amount
        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
        
        // Use threshold to prevent too sensitive scrolling
        if (Math.abs(delta) > 5) {
          // Throttle the scrolling
          wheelTimer = setTimeout(() => {
            if (delta > 0) {
              embla.scrollNext();
            } else {
              embla.scrollPrev();
            }
          }, 50);
        }
      }
    }, { passive: false });
    
    // Update the carousel animations reference
    const carouselElement = document.querySelector('.embla');
    if (carouselElement) {
      // Update animations to target embla instead of carousel-wrapper
      const animationElements = [
        ...(document.querySelector('.logo-link') ? [document.querySelector('.logo-link')] : []),
        ...document.querySelectorAll('#name, .subtitle, nav'),
        ...(carouselElement ? [carouselElement] : []),
        ...document.querySelectorAll('section, .section'),
        ...document.querySelectorAll('.image-link')
      ];
      
      // Re-apply animation targeting for the carousel
      carouselElement.style.opacity = '0';
      carouselElement.style.filter = 'blur(6px)';
      carouselElement.style.transform = 'translateY(12px) translateZ(0)';
      carouselElement.style.transition = 'all 0.4s cubic-bezier(0.24, 0.48, 0.48, 0.96)';
    }
    
    return embla;
  }
  
  // Initialize Embla carousel
  const emblaCarousel = initEmblaCarousel();

  // ================================
  // SIMPLE IMAGE CAROUSEL
  // ================================
  
  function initImageCarousels() {
    console.log('DOM ready state:', document.readyState);
    console.log('Body exists:', !!document.body);
    console.log('Looking for .image-carousel elements...');
    
    const carousels = document.querySelectorAll('.image-carousel');
    console.log('Found carousels:', carousels.length);
    
    // Debug: let's see what elements are actually in the DOM
    const allDivs = document.querySelectorAll('div');
    console.log('Total divs found:', allDivs.length);
    
    // Check if any divs have carousel-related classes
    const carouselRelated = document.querySelectorAll('[class*="carousel"]');
    console.log('Elements with carousel in class name:', carouselRelated.length);
    
    carousels.forEach((carousel, index) => {
      // Skip if already initialized
      if (carousel.dataset.initialized === 'true') {
        console.log(`Carousel ${index + 1} already initialized, skipping`);
        return;
      }
      
      console.log(`Initializing carousel ${index + 1}`);
      const images = carousel.querySelectorAll('.carousel-image');
      const leftNav = carousel.querySelector('.carousel-nav.left');
      const rightNav = carousel.querySelector('.carousel-nav.right');
      
      if (images.length === 0) {
        console.log(`No images found in carousel ${index + 1}`);
        return;
      }
      
      let currentIndex = 0;
      
      // Find pagination dots for this carousel
      const paginationContainer = carousel.querySelector('.carousel-pagination');
      const paginationDots = paginationContainer ? paginationContainer.querySelectorAll('.carousel-dot') : [];
      
      function updateCarousel() {
        images.forEach((img, index) => {
          img.classList.toggle('active', index === currentIndex);
        });
        
        // Update pagination dots
        paginationDots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentIndex);
        });
      }
      
      function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
      }
      
      function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
      }
      
      // Add click handlers to navigation areas
      if (leftNav) {
        leftNav.addEventListener('click', prevImage);
      }
      
      if (rightNav) {
        rightNav.addEventListener('click', nextImage);
      }
      
      // Add click handlers directly to images as backup
      images.forEach(img => {
        img.addEventListener('click', (e) => {
          const rect = img.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const imageWidth = rect.width;
          
          if (clickX < imageWidth / 2) {
            prevImage();
          } else {
            nextImage();
          }
        });
        
        // Add mousemove handler to change cursor based on position
        img.addEventListener('mousemove', (e) => {
          const rect = img.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const imageWidth = rect.width;
          
          if (mouseX < imageWidth / 2) {
            img.style.cursor = 'w-resize';
          } else {
            img.style.cursor = 'e-resize';
          }
        });
        
        // Reset cursor when mouse leaves
        img.addEventListener('mouseleave', () => {
          img.style.cursor = 'pointer';
        });
      });
      
      // Add click handlers to pagination dots
      paginationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateCarousel();
        });
      });
      
      // Initialize first image as active
      updateCarousel();
      
      // Mark as initialized
      carousel.dataset.initialized = 'true';
      console.log(`Carousel ${index + 1} initialized successfully with ${images.length} images`);
    });
  }
  
  // Initialize image carousels with multiple timing strategies
  initImageCarousels();
  
  // Also initialize on window load as backup
  window.addEventListener('load', () => {
    setTimeout(() => {
      initImageCarousels();
    }, 500);
  });
  
  // Use MutationObserver to detect when carousel elements are added
  const observer = new MutationObserver((mutations) => {
    let shouldInitialize = false;
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          if (node.classList && node.classList.contains('image-carousel')) {
            shouldInitialize = true;
          } else if (node.querySelector && node.querySelector('.image-carousel')) {
            shouldInitialize = true;
          }
        }
      });
    });
    
    if (shouldInitialize) {
      setTimeout(() => {
        initImageCarousels();
      }, 100);
    }
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Final backup - initialize after a longer delay
  setTimeout(() => {
    initImageCarousels();
  }, 2000);
});
