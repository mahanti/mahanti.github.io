// Single Page Application Router
class SPARouter {
  constructor() {
    this.routes = {
      '/': 'home',
      '/work': 'work',
      '/work/block': 'block',
      '/work/angellist': 'angellist',
      '/work/square': 'square',
      '/work/ando': 'ando',
      '/work/sidecar': 'sidecar',
      '/products': 'products',
      '/products/approach': 'approach',
      '/products/sudo': 'sudo',
      '/products/circuit': 'circuit',
      '/products/jot': 'jot',
      '/products/terraforms': 'terraforms',
      '/photos': 'photos',
      '/photos/harvest': 'harvest',
      '/photos/pch': 'pch',
      '/about': 'about'
    };
    
    this.currentPage = null;
    this.contentContainer = null;
    this.isTransitioning = false;
    
    this.init();
  }
  
  init() {
    this.contentContainer = document.getElementById('spa-content');
    if (!this.contentContainer) {
      console.error('SPA content container not found');
      return;
    }
    
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      this.handleRoute(window.location.pathname, false);
    });
    
    // Handle initial load
    this.handleRoute(window.location.pathname, false);
    
    // Intercept all link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && link.href.includes(window.location.origin)) {
        e.preventDefault();
        const path = new URL(link.href).pathname;
        this.navigate(path);
      }
    });
  }
  
  async navigate(path, updateHistory = true) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    
    // Update URL without page reload
    if (updateHistory) {
      window.history.pushState({}, '', path);
    }
    
    await this.handleRoute(path, true);
    this.isTransitioning = false;
  }
  
  async handleRoute(path, animate = true) {
    const pageId = this.routes[path] || 'home';
    
    if (pageId === this.currentPage) return;
    
    try {
      // Start transition
      if (animate) {
        await this.startTransition();
      }
      
      // Load content
      const content = await this.loadPageContent(pageId);
      this.contentContainer.innerHTML = content;
      
      // Update current page
      this.currentPage = pageId;
      
      // Reinitialize page-specific scripts
      this.initializePageScripts();
      
      // End transition
      if (animate) {
        await this.endTransition();
      }
      
      // Scroll to top
      window.scrollTo(0, 0);
      
    } catch (error) {
      console.error('Error loading page:', error);
      // Fallback to home page
      if (pageId !== 'home') {
        this.navigate('/', false);
      }
    }
  }
  
  async loadPageContent(pageId) {
    // For now, we'll load content from a data structure
    // In a real implementation, you might load from JSON files or an API
    const pageData = await this.getPageData(pageId);
    return this.renderPage(pageData);
  }
  
  async getPageData(pageId) {
    // This would typically load from JSON files or an API
    // For now, we'll return a basic structure
    const pages = {
      home: {
        title: 'Home',
        content: await this.loadMarkdownContent('index')
      },
      work: {
        title: 'Work',
        content: await this.loadMarkdownContent('work')
      },
      block: {
        title: 'Block',
        content: await this.loadMarkdownContent('block')
      },
      angellist: {
        title: 'AngelList',
        content: await this.loadMarkdownContent('angellist')
      },
      square: {
        title: 'Square',
        content: await this.loadMarkdownContent('square')
      },
      ando: {
        title: 'Ando',
        content: await this.loadMarkdownContent('ando')
      },
      sidecar: {
        title: 'Sidecar',
        content: await this.loadMarkdownContent('sidecar')
      },
      products: {
        title: 'Products',
        content: await this.loadMarkdownContent('products')
      },
      approach: {
        title: 'Approach',
        content: await this.loadMarkdownContent('approach')
      },
      sudo: {
        title: 'Sudo',
        content: await this.loadMarkdownContent('sudo')
      },
      circuit: {
        title: 'Circuit',
        content: await this.loadMarkdownContent('circuit')
      },
      jot: {
        title: 'jot',
        content: await this.loadMarkdownContent('jot')
      },
      terraforms: {
        title: 'Terraforms',
        content: await this.loadMarkdownContent('terraforms')
      },
      photos: {
        title: 'Photography',
        content: await this.loadMarkdownContent('photos')
      },
      harvest: {
        title: 'Harvest',
        content: await this.loadMarkdownContent('harvest')
      },
      pch: {
        title: 'Pacific Coast Highway',
        content: await this.loadMarkdownContent('pch')
      },
      about: {
        title: 'About',
        content: await this.loadMarkdownContent('about')
      }
    };
    
    return pages[pageId] || pages.home;
  }
  
  async loadMarkdownContent(pageName) {
    // Check if we have initial page data (first load)
    if (window.initialPageData && pageName === 'index') {
      return window.initialPageData.content;
    }
    
    try {
      const response = await fetch(`/api/content/${pageName}.json`);
      if (response.ok) {
        const data = await response.json();
        return data.content;
      }
    } catch (error) {
      console.warn(`Could not load ${pageName} content:`, error);
    }
    
    // Fallback: return a placeholder
    return `<div class="loading-placeholder">
      <h1>${pageName.charAt(0).toUpperCase() + pageName.slice(1)}</h1>
      <p>Content loading...</p>
    </div>`;
  }
  
  renderPage(pageData) {
    return `
      <div class="page-content" data-page="${this.currentPage}">
        <div class="page-inner">
          ${pageData.content}
        </div>
      </div>
    `;
  }
  
  async startTransition() {
    return new Promise((resolve) => {
      this.contentContainer.style.opacity = '0';
      this.contentContainer.style.transform = 'translateY(20px)';
      
      setTimeout(resolve, 150);
    });
  }
  
  async endTransition() {
    return new Promise((resolve) => {
      this.contentContainer.style.opacity = '1';
      this.contentContainer.style.transform = 'translateY(0)';
      
      setTimeout(resolve, 150);
    });
  }
  
  initializePageScripts() {
    // Reinitialize carousel if present
    if (this.currentPage === 'home') {
      this.initializeCarousel();
    }
    
    // Reinitialize any other page-specific scripts
    this.initializeCursor();
  }
  
  initializeCarousel() {
    // Re-run carousel initialization
    const carouselContainer = document.querySelector('.carousel-container') || document.querySelector('#image-carousel');
    if (carouselContainer) {
      // Re-initialize carousel logic here
      console.log('Carousel reinitialized');
    }
  }
  
  initializeCursor() {
    // Re-initialize cursor if needed
    console.log('Cursor reinitialized');
  }
}

// Initialize SPA when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.spaRouter = new SPARouter();
}); 