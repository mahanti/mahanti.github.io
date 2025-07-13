// Mike Matas-style Gallery System
class GallerySystem {
  constructor() {
    this.currentIndex = 0;
    this.isScrolling = false;
    this.galleryContainer = null;
    this.galleryItems = [];
    this.timelineContainer = null;
    this.timelineItems = [];
    this.isTimelineMode = false;
    
    this.init();
  }
  
  init() {
    this.galleryContainer = document.querySelector('.gallery-container');
    this.timelineContainer = document.querySelector('.timeline-container');
    
    if (!this.galleryContainer) {
      console.error('Gallery container not found');
      return;
    }
    
    this.setupGallery();
    this.setupTimeline();
    this.setupNavigation();
    this.setupKeyboard();
    this.setupTouch();
    
    // Initial position
    this.goToIndex(0);
  }
  
  setupGallery() {
    this.galleryItems = Array.from(this.galleryContainer.querySelectorAll('.gallery-item'));
    
    // Add click handlers for play buttons
    this.galleryItems.forEach((item, index) => {
      const playButton = item.querySelector('.play-button');
      if (playButton) {
        playButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.playVideo(index);
        });
      }
    });
  }
  
  setupTimeline() {
    if (!this.timelineContainer) return;
    
    this.timelineItems = Array.from(this.timelineContainer.querySelectorAll('.timeline-item'));
    
    this.timelineItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.goToIndex(index);
      });
    });
  }
  
  setupNavigation() {
    // Back button
    const backButton = document.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', () => {
        this.toggleTimelineMode();
      });
    }
    
    // Navigation dots
    const dots = document.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToIndex(index);
      });
    });
  }
  
  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previous();
      } else if (e.key === 'ArrowRight') {
        this.next();
      } else if (e.key === 'Escape') {
        this.toggleTimelineMode();
      }
    });
  }
  
  setupTouch() {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    
    this.galleryContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = false;
    });
    
    this.galleryContainer.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;
      
      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;
      
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        isDragging = true;
        e.preventDefault();
      }
    });
    
    this.galleryContainer.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.changedTouches[0].clientX - startX;
      
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.previous();
        } else {
          this.next();
        }
      }
      
      startX = 0;
      startY = 0;
      isDragging = false;
    });
  }
  
  goToIndex(index) {
    if (this.isScrolling || index < 0 || index >= this.galleryItems.length) return;
    
    this.isScrolling = true;
    this.currentIndex = index;
    
    // Calculate scroll position
    const itemWidth = this.galleryContainer.offsetWidth;
    const scrollX = index * itemWidth;
    
    // Smooth scroll
    this.galleryContainer.style.transform = `translateX(-${scrollX}px)`;
    
    // Update active states
    this.updateActiveStates();
    
    // Update URL
    this.updateURL();
    
    // Reset scrolling flag after animation
    setTimeout(() => {
      this.isScrolling = false;
    }, 300);
  }
  
  next() {
    this.goToIndex(this.currentIndex + 1);
  }
  
  previous() {
    this.goToIndex(this.currentIndex - 1);
  }
  
  toggleTimelineMode() {
    this.isTimelineMode = !this.isTimelineMode;
    
    if (this.isTimelineMode) {
      document.body.classList.add('timeline-mode');
    } else {
      document.body.classList.remove('timeline-mode');
    }
  }
  
  playVideo(index) {
    const item = this.galleryItems[index];
    const video = item.querySelector('video');
    
    if (video) {
      video.play();
      item.classList.add('playing');
    }
  }
  
  updateActiveStates() {
    // Update gallery items
    this.galleryItems.forEach((item, index) => {
      if (index === this.currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // Update timeline items
    this.timelineItems.forEach((item, index) => {
      if (index === this.currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // Update dots
    const dots = document.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  updateURL() {
    const currentItem = this.galleryItems[this.currentIndex];
    const slug = currentItem.dataset.slug;
    
    if (slug) {
      window.history.pushState({}, '', `/${slug}`);
    }
  }
  
  // Handle URL changes
  handleURLChange() {
    const path = window.location.pathname;
    const index = this.galleryItems.findIndex(item => {
      return item.dataset.slug === path.slice(1);
    });
    
    if (index !== -1 && index !== this.currentIndex) {
      this.goToIndex(index);
    }
  }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.gallerySystem = new GallerySystem();
  
  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    window.gallerySystem.handleURLChange();
  });
}); 