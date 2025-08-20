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
      // Main pages
      '/': 'home',
      '/work': 'work',
      '/products': 'products',
      '/photos': 'photos',
      '/about': 'about',
      
      // Work pages
      '/work/block': 'work-block',
      '/work/angellist': 'work-angellist',
      '/work/square': 'work-square',
      '/work/ando': 'work-ando',
      '/work/sidecar': 'work-sidecar',
      
      // Product pages
      '/products/approach': 'products-approach',
      '/products/sudo': 'products-sudo',
      '/products/circuit': 'products-circuit',
      '/products/jot': 'products-jot',
      '/products/terraforms': 'products-terraforms',
      '/products/proto': 'products-proto',
      
      // Photo pages
      '/photos/harvest': 'photos-harvest',
      '/photos/pch': 'photos-pch'
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
    
    // Cache initial content
    this.cacheCurrentContent();
    
    // Setup loading state
    document.body.classList.remove('loading');
    document.body.classList.add('spa-ready');
    
    console.log('Static Header SPA initialized');
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
  
  async transitionToPage(pageId, path) {
    // Start exit animation
    await this.animateContentOut();
    
    // Load new content
    const content = await this.loadPageContent(pageId, path);
    
    // Update content
    this.contentContainer.innerHTML = content;
    
    // Start enter animation
    await this.animateContentIn();
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  async animateContentOut() {
    return new Promise(resolve => {
      this.contentContainer.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      this.contentContainer.style.opacity = '0';
      this.contentContainer.style.transform = 'translateY(-20px)';
      
      setTimeout(resolve, 300);
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
    
    return '<div class="col-8"><p>Content not found</p></div>';
  }
  
  renderPageFromData(data) {
    // Render page from JSON data structure
    let html = `<div class="col-8">`;
    
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
        <div class="col-8">
          <section class="mb-24">
            <span class="title">Welcome</span>
            <p class="subtitle">A multidisciplinary designer building delightful solutions to complex problems.</p>
          </section>
        </div>
      `,
      'work': `
        <div class="col-8">
          <section class="mb-24">
            <span class="title">Work</span>
            <p class="subtitle">Selected projects and collaborations</p>
          </section>
        </div>
      `,
      'products': `
        <div class="col-8">
          <section class="mb-24">
            <span class="title">Products</span>
            <p class="subtitle">Apps and tools I've built</p>
          </section>
        </div>
      `,
      'photos': `
        <div class="col-8">
          <section class="mb-24">
            <span class="title">Photography</span>
            <p class="subtitle">Visual stories and moments</p>
          </section>
        </div>
      `,
      'about': `
        <div class="col-8">
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.staticHeaderSPA = new StaticHeaderSPA();
});

// Also initialize immediately if DOM is already ready
if (document.readyState !== 'loading') {
  window.staticHeaderSPA = new StaticHeaderSPA();
}