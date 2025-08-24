// Single Page Application with Static Header and Smooth Content Transitions
class StaticHeaderSPA {
  constructor() {
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
  }
  
  setupSPA() {
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
    this.currentPage = this.routes[currentPath] || 'home';
    
    console.log(`🏁 SPA Initialization - Path: "${currentPath}", Page: "${this.currentPage}"`);
    
    // Set initial body class
    this.updateBodyClass(this.currentPage, currentPath);
    
    // Cache initial content
    this.cacheCurrentContent();
    
    // Setup loading state
    document.body.classList.remove('loading');
    document.body.classList.add('spa-ready');
    
    console.log('✅ Static Header SPA initialized successfully');
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
    if (this.isTransitioning) return;
    
    // Check if we have a route for this path, or if it's a valid page
    let pageId = this.routes[path];
    
    // If no exact route match, try to infer page ID from path
    if (!pageId) {
      pageId = this.inferPageId(path);
    }
    
    // If still no page ID, allow default Jekyll navigation
    if (!pageId) {
      console.log(`No SPA route found for ${path}, using default navigation`);
      window.location.href = path;
      return;
    }
    
    if (pageId === this.currentPage && path === window.location.pathname) return;
    
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
    // Check cache first
    if (this.pageCache.has(pageId)) {
      return this.pageCache.get(pageId);
    }
    
    try {
      // Try to load from JSON API first
      const response = await fetch(`/api/content/${pageId}.json`);
      if (response.ok) {
        const data = await response.json();
        const content = this.renderPageFromData(data);
        this.pageCache.set(pageId, content);
        return content;
      }
    } catch (error) {
      console.log('JSON API not available, using fallback');
    }
    
    // Fallback: try to load the actual page and extract content
    try {
      const response = await fetch(path);
      if (response.ok) {
        const html = await response.text();
        const content = this.extractContentFromHTML(html);
        this.pageCache.set(pageId, content);
        return content;
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
    let html = `<div class="col-8 row">`;
    
    if (data.title) {
      html += `<h1 class="title">${data.title}</h1>`;
    }
    
    if (data.subtitle) {
      html += `<p class="subtitle">${data.subtitle}</p>`;
    }
    
    if (data.content) {
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
    
    html += `</div>`;
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.staticHeaderSPA = new StaticHeaderSPA();
});

// Also initialize immediately if DOM is already ready
if (document.readyState !== 'loading') {
  window.staticHeaderSPA = new StaticHeaderSPA();
}