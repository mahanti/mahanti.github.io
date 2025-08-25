// Single Page Application with Static Header and Smooth Content Transitions
class StaticHeaderSPA {
  constructor() {
    this.currentPage = null;
    this.isTransitioning = false;
    this.contentContainer = null;
    this.header = null;
    this.routes = {};
    this.pageCache = new Map();
    this.debugMode = true; // Enable verbose logging for debugging
    
    // Immediate logging for direct navigation debugging
    this.log('🚀 SPA Constructor called', {
      currentURL: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      documentReadyState: document.readyState,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
    
    // Define all routes
    this.setupRoutes();
    this.init();
  }
  
  log(message, data = null) {
    if (this.debugMode) {
      console.log(`[SPA] ${message}`, data || '');
    }
  }
  
  getStoredRedirectPath() {
    // Get redirect path stored by 404.html for GitHub Pages compatibility
    try {
      const storedPath = sessionStorage.getItem('spa_redirect_path');
      if (storedPath) {
        sessionStorage.removeItem('spa_redirect_path');
        this.log('📦 Retrieved stored redirect path', { storedPath });
        return storedPath;
      }
    } catch (e) {
      this.log('❌ Failed to retrieve stored redirect path', { error: e.message });
    }
    return null;
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
      '/products/zoon': 'zoon',
      
      // Photo pages - 1:1 mapping with JSON files
      '/photos/harvest': 'harvest',
      '/photos/diamondmine': 'diamondmine',
      '/photos/pch': 'pch'
    };
    
    this.log('📋 Routes configured', {
      totalRoutes: Object.keys(this.routes).length,
      routes: this.routes,
      currentPath: window.location.pathname
    });
  }
  
  async init() {
    this.log('🎬 SPA Init started', {
      documentReadyState: document.readyState,
      currentPath: window.location.pathname
    });
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      this.log('⏳ Waiting for DOMContentLoaded...');
      document.addEventListener('DOMContentLoaded', async () => {
        this.log('✅ DOMContentLoaded fired');
        await this.setupSPA();
      });
    } else {
      this.log('✅ DOM already ready, proceeding with setup');
      await this.setupSPA();
    }
  }
  
  async setupSPA() {
    this.log('🛠️ Setting up SPA...', {
      currentPath: window.location.pathname,
      documentTitle: document.title
    });
    
    // Find or create content container
    this.contentContainer = document.querySelector('#spa-content');
    this.log('📦 Looking for SPA content container', {
      found: !!this.contentContainer,
      selector: '#spa-content'
    });
    
    if (!this.contentContainer) {
      this.log('🏗️ Creating SPA content container...');
      
      // Create content container after header
      const header = document.querySelector('#nav');
      const container = document.createElement('div');
      container.id = 'spa-content';
      container.className = 'spa-content-container';
      
      this.log('🔍 Header element found', { found: !!header });
      
      // Move existing content into SPA container
      const existingContent = document.querySelector('.grid .col-8');
      this.log('📄 Existing content found', { 
        found: !!existingContent,
        isInHeader: existingContent?.parentNode === header
      });
      
      if (existingContent && existingContent.parentNode !== header) {
        container.appendChild(existingContent.cloneNode(true));
        existingContent.remove();
        this.log('✅ Moved existing content to SPA container');
      }
      
      // Insert after header
      if (header && header.parentNode) {
        header.parentNode.insertBefore(container, header.nextSibling);
        this.log('✅ Inserted SPA container after header');
      }
      
      this.contentContainer = container;
    }
    
    // Setup header as static
    this.setupStaticHeader();
    
    // Setup navigation intercception
    this.interceptNavigation();
    
    // Setup browser history
    this.setupHistory();
    
    // Check if we're handling a redirect from 404.html (GitHub Pages compatibility)
    let currentPath = window.location.pathname;
    const redirectPath = this.getStoredRedirectPath();
    if (redirectPath && redirectPath !== currentPath) {
      this.log('🔄 Handling 404 redirect', { originalPath: currentPath, redirectPath });
      currentPath = redirectPath;
      // Update browser URL without triggering navigation
      window.history.replaceState(null, null, redirectPath);
    }
    
    // Get current page from URL
    this.currentPage = this.routes[currentPath] || this.inferPageId(currentPath) || 'home';
    
    this.log('🏁 SPA Initialization', {
      currentPath,
      mappedPage: this.routes[currentPath],
      inferredPage: this.inferPageId(currentPath),
      finalPage: this.currentPage,
      isDirectNavigation: !window.performance?.navigation?.type || window.performance.navigation.type === 0
    });
    
    // Set initial body class
    this.updateBodyClass(this.currentPage, currentPath);
    
    // Load initial page content for all pages (including home)
    const isHomePage = currentPath === '/' || this.currentPage === 'index' || this.currentPage === 'home';
    
    if (isHomePage) {
      this.log('🏠 Loading home page content', {
        currentPath,
        currentPage: this.currentPage
      });
      
      try {
        // Load home page content from API
        await this.transitionToPage('index', currentPath, false);
      } catch (error) {
        this.log('❌ Failed to load home page content', { error: error.message, stack: error.stack });
        console.error('Failed to load home page content:', error);
      }
    } else {
      this.log('🚀 Loading initial page content for non-home page', {
        currentPath,
        currentPage: this.currentPage
      });
      
      try {
        await this.transitionToPage(this.currentPage, currentPath, false);
      } catch (error) {
        this.log('❌ Failed to load initial page content', { error: error.message, stack: error.stack });
        console.error('Failed to load initial page content:', error);
      }
    }
    
    // Cache initial content
    this.cacheCurrentContent();
    
    // Setup loading state
    document.body.classList.remove('loading');
    document.body.classList.add('spa-ready');
    
    this.log('✅ Static Header SPA initialized successfully', {
      currentPage: this.currentPage,
      cachedPages: Array.from(this.pageCache.keys())
    });
  }
  
  setupStaticHeader() {
    const header = document.querySelector('#nav');
    if (header) {
      // Make header position fixed/sticky
      header.style.position = 'sticky';
      header.style.top = '0';
      header.style.zIndex = '100';
      header.style.backgroundColor = 'inherit';
      
      // Ensure it spans full width
      header.style.width = '100%';
      header.style.boxSizing = 'border-box';
      
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
    this.log('🧭 Navigate to requested', {
      path,
      updateHistory,
      isTransitioning: this.isTransitioning,
      currentPage: this.currentPage
    });
    
    if (this.isTransitioning) {
      this.log('⏸️ Navigation blocked - already transitioning');
      return;
    }
    
    // Check if we have a route for this path, or if it's a valid page
    let pageId = this.routes[path];
    
    // If no exact route match, try to infer page ID from path
    if (!pageId) {
      pageId = this.inferPageId(path);
    }
    
    this.log('🔍 Route resolution', {
      path,
      exactMatch: this.routes[path],
      inferredPageId: this.inferPageId(path),
      finalPageId: pageId
    });
    
    // If still no page ID, allow default Jekyll navigation
    if (!pageId) {
      this.log(`❌ No SPA route found for ${path}, using default navigation`);
      console.log(`No SPA route found for ${path}, using default navigation`);
      window.location.href = path;
      return;
    }
    
    if (pageId === this.currentPage && path === window.location.pathname) {
      this.log('🔄 Same page navigation - skipping');
      return;
    }
    
    this.isTransitioning = true;
    
    try {
      // Update browser history
      if (updateHistory) {
        history.pushState({ pageId, path }, '', path);
      }
      
      // Update navigation state
      this.updateNavigation(path);
      
      // Load and transition to new content
      await this.transitionToPage(pageId, path);
      
      this.currentPage = pageId;
      
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
    // Update active navigation states
    const navLinks = document.querySelectorAll('.button-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath.startsWith(href) && href !== '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  async transitionToPage(pageId, path, shouldScrollToTop = true) {
    console.log(`🚀 Starting transition from "${this.currentPage}" to "${pageId}" (${path})`);
    
    // Start exit animation first, then update body class during the animation
    await this.animateContentOut(pageId, path);
    
    // Load new content
    const content = await this.loadPageContent(pageId, path);
    
    // Update content
    this.contentContainer.innerHTML = content;
    
    // Start enter animation
    await this.animateContentIn();
    
    // Only scroll to top if this is a user navigation (not initial page load)
    if (shouldScrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    console.log(`✅ Completed transition to "${pageId}"`);
  }
  
  async animateContentOut(newPageId, newPath) {
    return new Promise(resolve => {
      console.log(`🎬 Starting exit animation - Content + Header`);
      console.log(`📝 Current body classes:`, Array.from(document.body.classList));
      
      // Start content fade out
      this.contentContainer.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      this.contentContainer.style.opacity = '0';
      this.contentContainer.style.transform = 'translateY(-20px)';
      
      // Update body class immediately to trigger header exit animation in parallel
      this.updateBodyClass(newPageId, newPath);
      console.log(`🔄 Updated body classes:`, Array.from(document.body.classList));
      
      // Check if header elements exist and their current state
      const headerElements = {
        name: document.querySelector('#nav.static-header .header-home-content #name'),
        subtitle: document.querySelector('#nav.static-header .header-home-content .subtitle'),
        nav: document.querySelector('#nav.static-header .header-home-content .header-nav')
      };
      
      console.log(`🎯 Header elements found:`, {
        name: !!headerElements.name,
        subtitle: !!headerElements.subtitle,
        nav: !!headerElements.nav
      });
      
      if (headerElements.name) {
        console.log(`👀 Header name computed style:`, {
          opacity: window.getComputedStyle(headerElements.name).opacity,
          transform: window.getComputedStyle(headerElements.name).transform,
          transition: window.getComputedStyle(headerElements.name).transition
        });
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
      
      // Force reflow
      this.contentContainer.offsetHeight;
      
      // Animate in
      requestAnimationFrame(() => {
        this.contentContainer.style.opacity = '1';
        this.contentContainer.style.transform = 'translateY(0)';
        
        setTimeout(() => {
          // Clean up inline styles
          this.contentContainer.style.transition = '';
          this.contentContainer.style.transform = '';
          resolve();
        }, 300);
      });
    });
  }
  
  async loadPageContent(pageId, path) {
    this.log('📄 Loading page content', {
      pageId,
      path,
      isCached: this.pageCache.has(pageId)
    });
    
    // Check cache first
    if (this.pageCache.has(pageId)) {
      this.log('💾 Using cached content', { pageId });
      return this.pageCache.get(pageId);
    }
    
    // Try to load from JSON API first
    const jsonUrl = `/api/content/${pageId}.json`;
    this.log('🔗 Trying JSON API', { url: jsonUrl });
    
    try {
      const response = await fetch(jsonUrl);
      this.log('📡 JSON API response', {
        url: jsonUrl,
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });
      
      if (response.ok) {
        const data = await response.json();
        this.log('✅ JSON API successful', { pageId, dataKeys: Object.keys(data) });
        
        // Update document title if available
        if (data.title) {
          document.title = data.title;
        }
        
        const content = this.renderPageFromData(data);
        this.pageCache.set(pageId, content);
        return content;
      }
    } catch (error) {
      this.log('❌ JSON API failed', { url: jsonUrl, error: error.message });
      console.log('JSON API not available, using fallback');
    }
    
    // Fallback: try to load the actual page and extract content
    this.log('🔄 Trying fallback page load', { path });
    try {
      const response = await fetch(path);
      this.log('📡 Fallback response', {
        path,
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });
      
      if (response.ok) {
        const html = await response.text();
        this.log('✅ Fallback successful', { path, htmlLength: html.length });
        const content = this.extractContentFromHTML(html);
        this.pageCache.set(pageId, content);
        return content;
      }
    } catch (error) {
      this.log('❌ Fallback failed', { path, error: error.message });
      console.error('Failed to load page content:', error);
    }
    
    // Final fallback: return placeholder
    this.log('🎭 Using placeholder content', { pageId });
    return this.getPlaceholderContent(pageId);
  }
  
  extractContentFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract the main content (everything after header)
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
    // Render page from JSON data structure
    // Note: Don't render data.title as it's meant for document title, content includes display titles
    let html = '';
    
    if (data.content && Array.isArray(data.content)) {
      html += data.content.join('\n');
    } else if (data.content) {
      html += data.content;
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
  
  updateBodyClass(pageId, path) {
    console.log(`🏷️  updateBodyClass called with pageId: "${pageId}", path: "${path}"`);
    
    // Remove existing page classes
    const oldClasses = Array.from(document.body.classList);
    document.body.classList.remove('home-page', 'work-page', 'products-page', 'photos-page', 'about-page');
    
    // Add appropriate page class based on pageId and path
    let newPageClass = null;
    if (pageId === 'home' || path === '/') {
      newPageClass = 'home-page';
      document.body.classList.add('home-page');
    } else if (pageId.startsWith('work') || pageId.includes('angellist') || pageId.includes('square') || 
               pageId.includes('ando') || pageId.includes('sidecar') || pageId.includes('proto')) {
      newPageClass = 'work-page';
      document.body.classList.add('work-page');
    } else if (pageId.startsWith('products') || pageId.includes('approach') || pageId.includes('sudo') || 
               pageId.includes('circuit') || pageId.includes('jot') || pageId.includes('terraforms')) {
      newPageClass = 'products-page';
      document.body.classList.add('products-page');
    } else if (pageId.startsWith('photos') || pageId.includes('harvest') || pageId.includes('pch')) {
      newPageClass = 'photos-page';
      document.body.classList.add('photos-page');
    } else if (pageId === 'about') {
      newPageClass = 'about-page';
      document.body.classList.add('about-page');
    }
    
    console.log(`🏷️  Body class change: "${oldClasses.join(' ')}" → "${Array.from(document.body.classList).join(' ')}"`);
    console.log(`🎯 Key change: home-page removed = ${oldClasses.includes('home-page') && !document.body.classList.contains('home-page')}`);
  }
}

// Comprehensive initialization with fallback mechanisms
(function() {
  console.log('[SPA] Script loaded', {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    pathname: window.location.pathname,
    documentReadyState: document.readyState,
    userAgent: navigator.userAgent
  });

  let spa = null;
  let hasInitialized = false;

  function initializeSPA() {
    if (hasInitialized) {
      console.log('[SPA] Already initialized, skipping');
      return;
    }
    
    console.log('[SPA] Initializing SPA', {
      timestamp: new Date().toISOString(),
      documentReadyState: document.readyState,
      pathname: window.location.pathname
    });
    
    hasInitialized = true;
    
    try {
      spa = new StaticHeaderSPA();
      window.staticHeaderSPA = spa;
      console.log('[SPA] SPA instance created successfully');
    } catch (error) {
      console.error('[SPA] Failed to create SPA instance:', error);
      hasInitialized = false;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    console.log('[SPA] Waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initializeSPA);
  } else {
    console.log('[SPA] DOM already ready, initializing immediately');
    initializeSPA();
  }

  // Fallback initialization on window load
  window.addEventListener('load', () => {
    console.log('[SPA] Window load event fired');
    if (!hasInitialized) {
      console.log('[SPA] SPA not initialized yet, trying again on window load');
      initializeSPA();
    }
  });

  // Emergency fallback after 2 seconds
  setTimeout(() => {
    if (!hasInitialized) {
      console.warn('[SPA] Emergency initialization after 2s timeout');
      initializeSPA();
    }
  }, 2000);
})();