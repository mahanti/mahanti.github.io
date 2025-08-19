// Modern Animation System for Jekyll
class AnimationSystem {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.currentPage = window.location.pathname;
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupHoverEffects();
    this.setupSmoothScrolling();
    this.setupParallaxEffects();
    this.setupStaticHeader();
  }

  // Static header: no animation, never moves
  setupStaticHeader() {
    // Header now scrolls with content - no fixed positioning
    const header = document.getElementById('nav');
    if (header) {
      header.style.position = 'relative';
      header.style.background = 'transparent';
      header.style.backdropFilter = 'none';
      header.style.transform = 'none';
      header.classList.remove('header-hidden');
    }
  }



  // Update active navigation state
  updateActiveNavigation(newPath) {
    document.querySelectorAll('.button-link').forEach(link => {
      link.classList.remove('active');
      if (link.href.includes(newPath)) {
        link.classList.add('active');
      }
    });
  }

  // Intersection Observer for scroll-triggered animations
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, this.observerOptions);
    document.querySelectorAll('.fade-in, .slide-up, .scale-in, .slide-left, .slide-right').forEach(el => {
      observer.observe(el);
    });
  }

  // Enhanced hover effects
  setupHoverEffects() {
    document.querySelectorAll('.button-link').forEach(link => {
      link.addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'translateY(-2px) scale(1.02)';
      });
      link.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'translateY(0) scale(1)';
      });
    });
    document.querySelectorAll('.interactive').forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
      });
      element.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
      });
    });
  }

  // Smooth scrolling for anchor links
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Subtle parallax effects
  setupParallaxEffects() {
    window.addEventListener('scroll', throttle(() => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax');
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }, 16));
  }

  // Utility method to add animation classes
  static addAnimationClass(element, animationType) {
    element.classList.add(animationType);
  }

  // Utility method for staggered animations
  static staggerAnimation(elements, delay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-in');
      }, index * delay);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AnimationSystem();
  document.body.classList.add('loading');
  window.addEventListener('load', () => {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  });
});

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

window.AnimationSystem = AnimationSystem; 