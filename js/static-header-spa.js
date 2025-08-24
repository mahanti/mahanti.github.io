// Single Page Application with Static Header and Smooth Content Transitions
console.log('🚀 Static Header SPA script loaded!');

class StaticHeaderSPA {
  constructor() {
    console.log('StaticHeaderSPA constructor called');
    this.currentPage = null;
    this.isTransitioning = false;
    this.contentContainer = null;
    this.header = null;
    this.routes = {};
    this.pageCache = new Map();
    
    // Define all routes
    this.setupRoutes();
    this.init();
  }
  
  setupRoutes() {
    this.routes = {
      // Main pages - 1:1 mapping with JSON files
      '/': 'index',
      '/work': 'work',
      '/products': 'products',
      '/photos': 'photos',
      '/about': 'about',
      
      // Work pages - routes to JSON files
      '/work/block': 'proto',
      '/work/proto': 'proto',
      '/work/angellist': 'angellist',
      '/work/square': 'square',
      '/work/ando': 'ando',
      '/work/sidecar': 'sidecar',
      
      // Product pages - 1:1 mapping with JSON files
      '/products/approach': 'approach',
      '/products/sudo': 'sudo',
      '/products/circuit': 'circuit',
      '/products/jot': 'jot',
      '/products/terraforms': 'terraforms',
      
      // Photo pages - 1:1 mapping with JSON files
      '/photos/harvest': 'harvest',
      '/photos/pch': 'pch'
    };
  }
  
  async init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupSPA());
    } else {
      this.setupSPA();
    }
    
    // Also initialize carousel and medium-zoom on first load
    setTimeout(() => {
      this.initializeCarousel();
      this.initializeMediumZoom();
    }, 500);
  }
  
  setupSPA() {
    console.log('🚀 setupSPA called');
    
    // Find or create content container
    this.contentContainer = document.querySelector('#spa-content');
    if (!this.contentContainer) {
      // Create content container after header
      const header = document.querySelector('#nav');
      const container = document.createElement('div');
      container.id = 'spa-content';
      container.className = 'spa-content-container';
      
      // Move existing content into SPA container
      const existingContent = document.querySelector('.grid .col-8');
      if (existingContent && existingContent.parentNode !== header) {
        container.appendChild(existingContent.cloneNode(true));
        existingContent.remove();
      }
      
      // Insert after header
      if (header && header.parentNode) {
        header.parentNode.insertBefore(container, header.nextSibling);
      }
      
      this.contentContainer = container;
    }
    
    // Setup header as static
    this.setupStaticHeader();
    
    // Setup navigation intercception
    this.interceptNavigation();
    
    // Setup browser history
    this.setupHistory();
    
    // Get current page from URL
    const currentPath = window.location.pathname;
    let detectedPage = this.routes[currentPath];
    
    // Try with trailing slash if exact match failed
    if (!detectedPage && !currentPath.endsWith('/')) {
      detectedPage = this.routes[currentPath + '/'];
    }
    
    // Try without trailing slash if exact match failed
    if (!detectedPage && currentPath.endsWith('/') && currentPath !== '/') {
      detectedPage = this.routes[currentPath.slice(0, -1)];
    }
    
    // If no exact route match, try to infer page ID from path
    if (!detectedPage) {
      detectedPage = this.inferPageId(currentPath);
    }
    
    // Final fallback to home
    if (!detectedPage) {
      detectedPage = 'home';
    }
    
    console.log('🔍 SPA Setup - Current Path:', currentPath);
    console.log('🔍 SPA Setup - Detected Page:', detectedPage);
    
    // Load the correct content for any page, including home
    if (detectedPage !== 'home' && currentPath !== '/') {
      console.log('🔄 Loading correct page content for:', detectedPage);
      this.currentPage = detectedPage;
      // Load the correct page content without animation and without scrolling to top
      this.transitionToPage(detectedPage, currentPath, false, false);
    } else {
      console.log('🔄 Loading home page content from API');
      this.currentPage = detectedPage;
      // Load home page content from API instead of caching placeholder, without scrolling to top
      this.transitionToPage('index', '/', false, false);
    }
    
    // Setup loading state
    document.body.classList.remove('loading');
    document.body.classList.add('spa-ready');
    
    // Hide loading screen if present
    this.hideLoadingScreen();
    
    console.log('Static Header SPA initialized');
  }
  
  setupStaticHeader() {
    const header = document.querySelector('#nav.static-header');
    if (header) {
      // Header is already styled with CSS, just ensure it's setup
      this.header = header;
    }
  }
  
  interceptNavigation() {
    // Intercept all navigation links globally
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      
      const href = link.getAttribute('href');
      
      // Handle all internal links (exclude external, anchors, and special protocols)
      if (href && 
          href.startsWith('/') && 
          !href.includes('#') && 
          !href.includes('mailto:') && 
          !href.includes('tel:') &&
          !link.hasAttribute('target') &&
          !link.hasAttribute('download')) {
        
        e.preventDefault();
        e.stopPropagation();
        
        // Add special handling for logo clicks to home
        if (link.classList.contains('logo-link') || href === '/') {
          console.log('Logo/home navigation detected');
        }
        
        // Trigger header exit animation when leaving home page
        if (this.currentPage === 'index' && href !== '/') {
          console.log('🚪 Leaving home page - triggering header exit animation');
          this.triggerHeaderExitAnimation();
        }
        
        this.navigateTo(href);
      }
    });
  }
  
  setupHistory() {
    window.addEventListener('popstate', (e) => {
      const path = window.location.pathname;
      this.navigateTo(path, false);
    });
  }
  
  async navigateTo(path, updateHistory = true) {
    if (this.isTransitioning) return;
    
    console.log(`🚀 NavigateTo called: from "${this.currentPage}" to "${path}"`);
    
    // Check if we have a route for this path, or if it's a valid page
    let pageId = this.routes[path];
    
    // If no exact route match, try to infer page ID from path
    if (!pageId) {
      pageId = this.inferPageId(path);
    }
    
    console.log(`🗺️ Route mapping: "${path}" → "${pageId}"`);
    
    // If still no page ID, allow default Jekyll navigation
    if (!pageId) {
      console.log(`No SPA route found for ${path}, using default navigation`);
      window.location.href = path;
      return;
    }
    
    // Special handling for home page - always reload to ensure fresh content
    if (path === '/' && pageId === 'home') {
      // Clear home page cache to ensure fresh load
      this.pageCache.delete('home');
    }
    
    // Don't skip navigation if we're already on the page (except for home page which should always refresh)
    if (pageId === this.currentPage && path === window.location.pathname && path !== '/') {
      console.log(`🚫 Skipping navigation - already on page "${pageId}"`);
      return;
    }
    
    this.isTransitioning = true;
    
    try {
      console.log(`📦 Starting transition from "${this.currentPage}" to "${pageId}" (${path})`);
      
      // Update browser history
      if (updateHistory) {
        history.pushState({ pageId, path }, '', path);
      }
      
      // Update navigation state
      this.updateNavigation(path);
      
      // Load and transition to new content
      await this.transitionToPage(pageId, path);
      
      this.currentPage = pageId;
      console.log(`✅ Navigation complete: now on "${pageId}"`);
    
      
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to default navigation
      window.location.href = path;
    } finally {
      this.isTransitioning = false;
    }
  }
  
  inferPageId(path) {
    // Try to infer page ID from path structure
    if (path === '/') return 'home';
    
    // Remove leading slash and replace slashes with dashes
    const pathParts = path.replace(/^\//, '').replace(/\/$/, '');
    return pathParts.replace(/\//g, '-') || null;
  }
  
  updateNavigation(currentPath) {
    // Update active navigation states for both header and content nav
    const navLinks = document.querySelectorAll('.button-link, nav a, .home-header nav a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath.startsWith(href) && href !== '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Update document title if possible
    const pageTitle = this.getPageTitle(currentPath);
    if (pageTitle) {
      document.title = pageTitle;
    }
  }
  
  getPageTitle(path) {
    const titleMap = {
      '/': '• Home',
      '/work': '• Work',
      '/products': '', 
      '/photos': '• Photos',
      '/about': '• About',
      '/work/block': '• Block',
      '/work/angellist': '• AngelList',
      '/work/square': '• Square',
      '/work/ando': '• Ando',
      '/work/sidecar': '• Sidecar',
      '/products/approach': '• Approach',
      '/products/sudo': '• Sudo',
      '/products/circuit': '• Circuit',
      '/products/jot': '• jot',
      '/products/terraforms': '• Terraforms',
      '/photos/harvest': '• Harvest',
      '/photos/pch': '• Pacific Coast Highway'
    };
    
    return titleMap[path];
  }
  
  async transitionToPage(pageId, path, animate = true, shouldScrollToTop = true) {
    console.log(`🎭 transitionToPage called: pageId="${pageId}", path="${path}", animate=${animate}`);
    
    if (animate) {
      console.log(`🎬 Starting animated transition with exit animation`);
      // Start exit animation and update body class simultaneously for header fade
      await this.animateContentOut(pageId);
    } else {
      console.log(`⚡ Non-animated transition - updating body class immediately`);
      // Update body class immediately for non-animated transitions
      this.updateBodyClass(pageId);
    }
    
    // Load new content
    const content = await this.loadPageContent(pageId, path);
    
    // Update content
    this.contentContainer.innerHTML = content;
    
    // Initialize medium-zoom for new content
    this.initializeMediumZoom();
    
    if (animate) {
      // Start enter animation
      await this.animateContentIn();
      
      // Reinitialize carousel after animation completes
      setTimeout(() => {
        this.initializeCarousel();
      }, 100);
      
      // Only scroll to top if this is a user navigation (not initial page load)
      if (shouldScrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // No animation, just initialize carousel if needed
      setTimeout(() => {
        this.initializeCarousel();
      }, 50);
    }
  }
  
  async animateContentOut(newPageId = null) {
    return new Promise(resolve => {
      console.log(`🎬 Starting exit animation - Content + Header for page: ${newPageId}`);
      
      this.contentContainer.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      this.contentContainer.style.opacity = '0';
      this.contentContainer.style.transform = 'translateY(20px)';
      this.contentContainer.style.filter = 'blur(4px)';
      
      // Update body class immediately to trigger header exit animation in parallel
      if (newPageId) {
        console.log(`🏷️ Updating body class during exit animation to trigger header fade`);
        this.updateBodyClass(newPageId);
      }
      
      setTimeout(() => {
        console.log(`⏰ Exit animation complete (300ms)`);
        resolve();
      }, 300);
    });
  }
  
  async animateContentIn() {
    return new Promise(resolve => {
      // Reset position for entrance
      this.contentContainer.style.transform = 'translateY(20px)';
      this.contentContainer.style.opacity = '0';
      this.contentContainer.style.filter = 'blur(4px)';
      
      // Force reflow
      this.contentContainer.offsetHeight;
      
      // Animate in
      requestAnimationFrame(() => {
        this.contentContainer.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), filter 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        this.contentContainer.style.opacity = '1';
        this.contentContainer.style.transform = 'translateY(0)';
        this.contentContainer.style.filter = 'blur(0px)';
        
        setTimeout(() => {
          // Clean up inline styles
          this.contentContainer.style.transition = '';
          this.contentContainer.style.transform = '';
          this.contentContainer.style.filter = '';
          resolve();
        }, 400);
      });
    });
  }
  
  async loadPageContent(pageId, path) {
    console.log(`📄 Loading content for pageId: "${pageId}"`);
    
    // For home page, always try to load fresh content first
    if (pageId === 'home' && path === '/') {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const html = await response.text();
          const content = this.extractContentFromHTML(html);
          this.pageCache.set(pageId, content);
          return content;
        }
      } catch (error) {
        console.log('Failed to load fresh home content, using cache/fallback');
      }
    }
    
    // Check cache for non-home pages or if home page fetch failed
    // Skip cache if we're in development mode (localhost:4000)
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (this.pageCache.has(pageId) && pageId !== 'home' && !isDevelopment) {
      console.log(`📦 Loading ${pageId} from cache`);
      return this.pageCache.get(pageId);
    }
    
    // In development, always bypass cache to see changes immediately
    if (isDevelopment && this.pageCache.has(pageId)) {
      console.log(`🔄 Development mode: bypassing cache for ${pageId}`);
      this.pageCache.delete(pageId);
    }
    
    try {
      // Try to load from JSON API first
      // Add cache busting in development
      const cacheBuster = window.location.hostname === 'localhost' ? `?t=${Date.now()}` : '';
      const response = await fetch(`/api/content/${pageId}.json${cacheBuster}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Loaded content for ${pageId}`);
        const content = this.renderPageFromData(data);
        this.pageCache.set(pageId, content);
        return content;
      }
    } catch (error) {
      console.log('❌ JSON API not available, using fallback:', error);
    }
    
    // Fallback: try to load the actual page and extract content
    try {
      let fetchPath = path;
      
      // Handle Jekyll's trailing slash redirects
      if (!path.endsWith('/') && path !== '/') {
        fetchPath = path + '/';
      }
      
      const response = await fetch(fetchPath);
      if (response.ok) {
        const html = await response.text();
        const content = this.extractContentFromHTML(html);
        this.pageCache.set(pageId, content);
        return content;
      }
      
      // If that fails, try without trailing slash
      if (fetchPath !== path) {
        const response2 = await fetch(path);
        if (response2.ok) {
          const html = await response2.text();
          const content = this.extractContentFromHTML(html);
          this.pageCache.set(pageId, content);
          return content;
        }
      }
    } catch (error) {
      console.error('Failed to load page content:', error);
    }
    
    // Final fallback: return placeholder
    return this.getPlaceholderContent(pageId);
  }
  
  extractContentFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // First try to extract from SPA content container
    const spaContent = doc.querySelector('#spa-content');
    if (spaContent) {
      return spaContent.innerHTML;
    }
    
    // Fallback: Extract the main content (everything after header)
    const content = doc.querySelector('.grid');
    if (content) {
      // Remove header from content
      const header = content.querySelector('#nav');
      if (header) {
        header.remove();
      }
      
      // Remove footer 
      const footer = content.querySelector('footer');
      if (footer) {
        footer.remove();
      }
      
      return content.innerHTML;
    }
    
    return '<div class="col-8 row"><p>Content not found</p></div>';
  }
  
  renderPageFromData(data) {
    // Render page from JSON data structure - titles are handled separately
    let html = '';
    
    if (data.content) {
      // Handle content as string or array
      if (Array.isArray(data.content)) {
        html += data.content.join('\n');
      } else {
        html += data.content;
      }
    }
    
    if (data.sections) {
      data.sections.forEach(section => {
        html += `<section class="mb-24">`;
        if (section.title) {
          html += `<h2 class="title">${section.title}</h2>`;
        }
        if (section.content) {
          html += section.content;
        }
        html += `</section>`;
      });
    }
    
    return html;
  }
  
  updateBodyClass(pageId) {
    console.log(`🏷️ updateBodyClass called with pageId: "${pageId}"`);
    
    // Don't interfere if exit animation is running
    if (document.body.classList.contains('home-page-exiting')) {
      console.log('🚫 Skipping updateBodyClass - exit animation in progress');
      return;
    }
    
    // Remove existing page classes
    const oldClasses = Array.from(document.body.classList);
    document.body.classList.remove('home-page', 'work-page', 'products-page', 'photos-page', 'about-page');
    
    // Add appropriate page class
    if (pageId === 'index') {
      document.body.classList.add('home-page');
    } else if (pageId.startsWith('work') || ['angellist', 'square', 'ando', 'sidecar', 'block'].includes(pageId)) {
      document.body.classList.add('work-page');
    } else if (pageId.startsWith('product') || ['approach', 'sudo', 'circuit', 'jot', 'terraforms', 'proto'].includes(pageId)) {
      document.body.classList.add('products-page');
    } else if (pageId.startsWith('photo') || ['harvest', 'pch'].includes(pageId)) {
      document.body.classList.add('photos-page');
    } else if (pageId === 'about') {
      document.body.classList.add('about-page');
    }
    
    const newClasses = Array.from(document.body.classList);
    console.log(`🏷️ Body class change: "${oldClasses.join(' ')}" → "${newClasses.join(' ')}"`);
    console.log(`🎯 Key change: home-page removed = ${oldClasses.includes('home-page') && !newClasses.includes('home-page')}`);
  }
  
  triggerHeaderExitAnimation() {
    console.log('🎬 Triggering CSS-based header exit animation (like enter animation)');
    
    // Step 1: Add exiting class WHILE home-page class is still present
    document.body.classList.add('home-page-exiting');
    console.log('🏷️ Added home-page-exiting class, body classes:', Array.from(document.body.classList));
    
    // Step 2: Remove home-page class to trigger exit animation (like enter animation in reverse)
    setTimeout(() => {
      document.body.classList.remove('home-page');
      console.log('🏷️ Removed home-page class, body classes:', Array.from(document.body.classList));
    }, 10); // Small delay to ensure CSS processes the exiting class first
    
    // Step 3: Clean up exiting class after animation completes
    setTimeout(() => {
      console.log('🏁 Header exit animation complete - removing exiting class');
      document.body.classList.remove('home-page-exiting');
    }, 350);
  }
  
  getPlaceholderContent(pageId) {
    const placeholders = {
      'home': `
        <div class="col-8 row">
          <section class="mb-24">
            <span class="title">Welcome</span>
            <p class="subtitle">A multidisciplinary designer building delightful solutions to complex problems.</p>
          </section>
        </div>
      `,
      'work': `
        <div class="col-8 row">
          <section class="mb-24">
            <span class="title">Work</span>
            <p class="subtitle">Selected projects and collaborations</p>
          </section>
        </div>
      `,
      'products': `
        <div class="col-8 row">
          <section class="mb-24">
            <span class="title">Products</span>
            <p class="subtitle">Apps and tools I've built</p>
          </section>
        </div>
      `,
      'photos': `
        <div class="col-8 row">
          <section class="mb-24">
            <span class="title">Photography</span>
            <p class="subtitle">Visual stories and moments</p>
          </section>
        </div>
      `,
      'about': `
        <div class="col-8 row">
          <section class="mb-24">
            <span class="title">About</span>
            <p class="subtitle">A multidisciplinary designer building delightful solutions to complex problems. with a passion for creating beautiful, functional experiences.</p>
          </section>
        </div>
      `
    };
    
    return placeholders[pageId] || placeholders['home'];
  }
  
  cacheCurrentContent() {
    // Cache the initial page content
    const currentContent = this.contentContainer?.innerHTML;
    if (currentContent && this.currentPage) {
      this.pageCache.set(this.currentPage, currentContent);
    }
  }
  
  hideLoadingScreen() {
    // Hide the loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 300);
    }
  }
  
  initializeCarousel() {
    // Check if carousel exists
    const carouselContainer = document.querySelector('.carousel-container') || document.querySelector('#image-carousel');
    const carouselSlide = document.querySelector('.carousel-slide');
    
    if (!carouselContainer || !carouselSlide) {
      console.log('No carousel found to initialize');
      return;
    }
    
    console.log('Initializing enhanced carousel...', carouselContainer, carouselSlide);
    
    // Try enhanced version first, with fallback to simple version
    try {
      // Clean up any existing event listeners
      const newContainer = carouselContainer.cloneNode(true);
      const newSlide = newContainer.querySelector('.carousel-slide');
      
      if (carouselContainer.parentNode) {
        carouselContainer.parentNode.replaceChild(newContainer, carouselContainer);
        
        // Set up carousel functionality with a small delay
        setTimeout(() => {
          this.setupCarousel(newContainer, newSlide);
        }, 100);
      }
    } catch (error) {
      console.error('Enhanced carousel failed, falling back to simple version:', error);
      this.setupSimpleCarousel(carouselContainer, carouselSlide);
    }
  }
  
  setupCarousel(carouselContainer, carouselSlide) {
    console.log('Setting up carousel with elements:', carouselContainer, carouselSlide);
    
    if (!carouselContainer || !carouselSlide) {
      console.error('Carousel elements not found');
      return;
    }
    
    // Enhanced carousel with physics and rubberbanding
    let currentTranslate = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let velocity = 0;
    let lastTime = 0;
    let animationId = null;
    let isHorizontalDrag = false;
    let wheelVelocity = 0;
    let wheelAnimId = null;
    
    // Physics constants
    const MOMENTUM_MULTIPLIER = 0.95;
    const FRICTION = 0.95;
    const RUBBER_BAND_STRENGTH = 0.3;
    const MIN_VELOCITY = 0.5;
    
    // Calculate boundaries
    function getBounds() {
      const containerWidth = carouselContainer.offsetWidth;
      const slideWidth = carouselSlide.scrollWidth;
      const containerPaddingLeft = parseInt(getComputedStyle(carouselContainer).paddingLeft) || 0;
      const containerPaddingRight = parseInt(getComputedStyle(carouselContainer).paddingRight) || 0;
      const containerPadding = containerPaddingLeft + containerPaddingRight;
      
      const maxTranslate = 0;
      const minTranslate = Math.min(0, -(slideWidth - containerWidth + containerPadding));
      
      console.log('Bounds:', { 
        containerWidth, 
        slideWidth, 
        containerPadding, 
        minTranslate, 
        maxTranslate 
      });
      
      return { min: minTranslate, max: maxTranslate, slideWidth, containerWidth };
    }

    // Edge indicators to match styles.css gradients at edges
    function updateEdgeIndicators() {
      const { min, max } = getBounds();
      carouselContainer.classList.remove('at-left-edge', 'at-right-edge');
      if (currentTranslate <= min) {
        carouselContainer.classList.add('at-left-edge');
      } else if (currentTranslate >= max) {
        carouselContainer.classList.add('at-right-edge');
      }
    }
    
    // Apply rubberbanding when past boundaries
    function applyRubberBanding(translate) {
      const bounds = getBounds();
      
      if (translate > bounds.max) {
        const overflow = translate - bounds.max;
        return bounds.max + (overflow * RUBBER_BAND_STRENGTH);
      } else if (translate < bounds.min) {
        const overflow = bounds.min - translate;
        return bounds.min - (overflow * RUBBER_BAND_STRENGTH);
      }
      
      return translate;
    }
    
    // Smooth position update with transform3d
    function updatePosition(translate = currentTranslate) {
      const finalTranslate = applyRubberBanding(translate);
      console.log('Setting transform to:', `translate3d(${finalTranslate}px, 0, 0)`);
      
      // Force the transform with important priority
      carouselSlide.style.setProperty('transform', `translate3d(${finalTranslate}px, 0, 0)`, 'important');
      carouselSlide.style.setProperty('opacity', '1', 'important');
      carouselSlide.style.setProperty('filter', 'none', 'important');
      carouselSlide.style.setProperty('animation', 'none', 'important');
      
      console.log('Final computed transform:', window.getComputedStyle(carouselSlide).transform);
      updateEdgeIndicators();
    }
    
    // Momentum animation with physics
    function animateMomentum() {
      if (!isDragging && Math.abs(velocity) > MIN_VELOCITY) {
        currentTranslate += velocity;
        velocity *= FRICTION;
        
        // Check boundaries and apply spring back
        const bounds = getBounds();
        if (currentTranslate > bounds.max || currentTranslate < bounds.min) {
          velocity *= 0.8; // Reduce velocity when hitting boundaries
          
          // Spring back to bounds
          if (currentTranslate > bounds.max) {
            currentTranslate = lerp(currentTranslate, bounds.max, 0.1);
          } else if (currentTranslate < bounds.min) {
            currentTranslate = lerp(currentTranslate, bounds.min, 0.1);
          }
        }
        
        updatePosition();
        animationId = requestAnimationFrame(animateMomentum);
      } else if (!isDragging) {
        // Final snap to boundaries if needed
        const bounds = getBounds();
        if (currentTranslate > bounds.max) {
          snapToPosition(bounds.max);
        } else if (currentTranslate < bounds.min) {
          snapToPosition(bounds.min);
        }
        updateEdgeIndicators();
      }
    }
    
    // Linear interpolation helper
    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }
    
    // Smooth snap to position
    function snapToPosition(targetPosition) {
      const startPosition = currentTranslate;
      const distance = targetPosition - startPosition;
      let startTime = null;
      
      function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / 300, 1); // 300ms animation
        const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease out
        
        currentTranslate = startPosition + (distance * easeOut);
        updatePosition();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }
      
      requestAnimationFrame(animate);
    }
    
    function startDrag(e) {
      console.log('Start drag event:', e.type);
      isDragging = true;
      const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
      const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
      startX = clientX;
      startY = clientY;
      lastX = clientX;
      lastTime = Date.now();
      velocity = 0;
      isHorizontalDrag = false; // We'll determine this in the drag function
      
      // Cancel any ongoing momentum animation
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      
      carouselContainer.classList.add('dragging');
      carouselContainer.style.cursor = 'grabbing';
      
      // Don't prevent default yet - wait to see if it's horizontal
    }
    
    function drag(e) {
      if (!isDragging) return;
      
      const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
      const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
      const currentTime = Date.now();
      const deltaX = currentX - lastX;
      const deltaY = currentY - startY;
      const deltaTime = currentTime - lastTime;
      
      // Determine if this is a horizontal or vertical drag on first significant movement
      if (!isHorizontalDrag && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
        const totalDeltaX = Math.abs(currentX - startX);
        const totalDeltaY = Math.abs(currentY - startY);
        
        // If horizontal movement is dominant, it's a carousel drag
        isHorizontalDrag = totalDeltaX > totalDeltaY && totalDeltaX > 10;
        
        // If it's not horizontal, stop dragging and allow normal scrolling
        if (!isHorizontalDrag) {
          endDrag();
          return;
        }
      }
      
      // Only handle carousel dragging if it's confirmed horizontal
      if (isHorizontalDrag) {
        console.log('Dragging:', { currentX, deltaX, currentTranslate });
        
        // Calculate velocity for momentum
        if (deltaTime > 0) {
          velocity = deltaX / deltaTime * 16; // Normalize to 60fps
        }
        
        currentTranslate += deltaX;
        lastX = currentX;
        lastTime = currentTime;
        
        updatePosition();
        e.preventDefault();
      }
    }
    
    function endDrag() {
      if (!isDragging) return;
      
      isDragging = false;
      carouselContainer.classList.remove('dragging');
      carouselContainer.style.cursor = 'grab';
      
      // Apply momentum with physics
      velocity *= MOMENTUM_MULTIPLIER;
      animateMomentum();
    }
    
    // Wheel/trackpad support with momentum - only for horizontal scrolling
    function handleWheel(e) {
      // Prioritize horizontal intent (or Shift for horizontal)
      const horizontalIntent = Math.abs(e.deltaX) >= Math.abs(e.deltaY) * 0.75 || e.shiftKey;
      if (!horizontalIntent) return; // Let vertical scroll pass through

      e.preventDefault();

      // Convert wheel to horizontal delta (Shift converts vertical to horizontal)
      const rawDelta = e.shiftKey ? -e.deltaY : -e.deltaX;

      // Cancel drag momentum if active
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }

      // Accumulate wheel velocity for smoothing
      const MAX_WHEEL_VELOCITY = 120; // clamp extreme deltas
      wheelVelocity += Math.max(-MAX_WHEEL_VELOCITY, Math.min(MAX_WHEEL_VELOCITY, rawDelta)) * 0.35;

      // Start wheel animation loop if not running
      if (!wheelAnimId) {
        const WHEEL_FRICTION = 0.88;
        const MIN_WHEEL_SPEED = 0.25;

        const step = () => {
          // Apply velocity
          currentTranslate += wheelVelocity;

          // Apply rubberbanding at edges by reducing velocity
          const bounds = getBounds();
          if (currentTranslate > bounds.max || currentTranslate < bounds.min) {
            wheelVelocity *= 0.6;
          }

          updatePosition();

          // Decay velocity
          wheelVelocity *= WHEEL_FRICTION;

          if (Math.abs(wheelVelocity) > MIN_WHEEL_SPEED && !isDragging) {
            wheelAnimId = requestAnimationFrame(step);
          } else {
            wheelAnimId = null;
            wheelVelocity = 0;
            // Snap to bounds softly if out of range
            const after = getBounds();
            if (currentTranslate > after.max) {
              snapToPosition(after.max);
            } else if (currentTranslate < after.min) {
              snapToPosition(after.min);
            }
          }
        };
        wheelAnimId = requestAnimationFrame(step);
      }
    }
    
    // Add event listeners
    console.log('Adding event listeners to carousel container');
    carouselContainer.addEventListener('mousedown', startDrag);
    carouselContainer.addEventListener('mousemove', drag);
    carouselContainer.addEventListener('mouseup', endDrag);
    carouselContainer.addEventListener('mouseleave', endDrag);
    carouselContainer.addEventListener('touchstart', startDrag, { passive: false });
    carouselContainer.addEventListener('touchmove', drag, { passive: false });
    carouselContainer.addEventListener('touchend', endDrag);
    carouselContainer.addEventListener('wheel', handleWheel, { passive: false });
    
    // Set initial cursor and position
    carouselContainer.style.cursor = 'grab';
    console.log('Carousel setup complete, calling initial updatePosition');
    updatePosition();
    // Mark as initialized so other scripts can skip re-init
    try { carouselContainer.dataset.carouselInitialized = 'true'; } catch (e) {}
  }
  
  setupSimpleCarousel(carouselContainer, carouselSlide) {
    console.log('Setting up simple carousel fallback');
    
    let currentTranslate = 0;
    let isDragging = false;
    let startX = 0;
    
    function updatePosition() {
      carouselSlide.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
    }
    
    function startDrag(e) {
      console.log('Simple carousel: start drag');
      isDragging = true;
      startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
      carouselContainer.style.cursor = 'grabbing';
      e.preventDefault();
    }
    
    function drag(e) {
      if (!isDragging) return;
      
      const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
      const deltaX = currentX - startX;
      currentTranslate += deltaX;
      startX = currentX;
      
      updatePosition();
      e.preventDefault();
    }
    
    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      carouselContainer.style.cursor = 'grab';
    }
    
    // Add event listeners
    carouselContainer.addEventListener('mousedown', startDrag);
    carouselContainer.addEventListener('mousemove', drag);
    carouselContainer.addEventListener('mouseup', endDrag);
    carouselContainer.addEventListener('mouseleave', endDrag);
    carouselContainer.addEventListener('touchstart', startDrag, { passive: false });
    carouselContainer.addEventListener('touchmove', drag, { passive: false });
    carouselContainer.addEventListener('touchend', endDrag);
    
    // Set initial cursor
    carouselContainer.style.cursor = 'grab';
    updatePosition();
  }
  
  initializeMediumZoom() {
    // Initialize medium-zoom for all images with data-zoomable attribute
    if (typeof mediumZoom !== 'undefined') {
      try {
        // Detach any existing zoom instances to avoid conflicts
        if (this.zoomInstance) {
          this.zoomInstance.detach();
        }
        
        // Create new zoom instance for all zoomable images
        this.zoomInstance = mediumZoom('[data-zoomable]', {
          margin: 24,
          background: 'rgba(0, 0, 0, 0.9)',
          scrollOffset: 40,
          container: null,
          template: null
        });
        
        console.log('Medium zoom initialized for images');
      } catch (error) {
        console.warn('Failed to initialize medium-zoom:', error);
      }
    } else {
      console.warn('medium-zoom library not found');
    }
  }
}

// Initialize the SPA
function initializeSPA() {
  console.log('initializeSPA called');
  try {
    if (!window.staticHeaderSPA) {
      console.log('Creating new StaticHeaderSPA instance');
      window.staticHeaderSPA = new StaticHeaderSPA();
      console.log('SPA initialized successfully');
    } else {
      console.log('SPA already exists, trying to initialize carousel');
      window.staticHeaderSPA.initializeCarousel();
    }
  } catch (error) {
    console.error('Failed to initialize SPA:', error);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure everything is loaded
  setTimeout(initializeSPA, 100);
});

// Also initialize immediately if DOM is already ready
if (document.readyState !== 'loading') {
  setTimeout(initializeSPA, 100);
}

// Backup initialization after window load
window.addEventListener('load', () => {
  if (!window.staticHeaderSPA) {
    setTimeout(initializeSPA, 50);
  }
});