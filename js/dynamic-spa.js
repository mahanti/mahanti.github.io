// Dynamic Single Page Application - Mike Matas Style
class DynamicSPA {
  constructor() {
    this.currentSection = null;
    this.isTransitioning = false;
    this.sections = {};
    this.contentContainer = null;
    this.header = null;
    this.cursor = null;
    
    // Define all sections and their content
    this.sectionConfig = {
      home: {
        title: 'Home',
        url: '/',
        content: this.getHomeContent()
      },
      work: {
        title: 'Work',
        url: '/work',
        content: this.getWorkContent()
      },
      products: {
        title: 'Products',
        url: '/products',
        content: this.getProductsContent()
      },
      photos: {
        title: 'Photography',
        url: '/photos',
        content: this.getPhotosContent()
      },
      about: {
        title: 'About',
        url: '/about',
        content: this.getAboutContent()
      }
    };
    
    this.init();
  }
  
  init() {
    this.contentContainer = document.querySelector('.grid');
    this.header = document.getElementById('nav');
    
    if (!this.contentContainer) {
      console.error('Content container not found');
      return;
    }
    
    // Initialize sections
    this.initializeSections();
    
    // Handle navigation clicks
    this.setupNavigation();
    
    // Handle browser back/forward
    this.setupHistory();
    
    // Load initial section
    this.loadSection(this.getCurrentSection(), false);
  }
  
  initializeSections() {
    // Create section containers
    Object.keys(this.sectionConfig).forEach(sectionId => {
      const section = document.createElement('div');
      section.className = 'section-container';
      section.dataset.section = sectionId;
      section.style.display = 'none';
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      
      // Add content
      section.innerHTML = this.sectionConfig[sectionId].content;
      
      this.contentContainer.appendChild(section);
      this.sections[sectionId] = section;
    });
  }
  
  setupNavigation() {
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = new URL(link.href).pathname;
        const sectionId = this.getSectionFromPath(path);
        
        if (sectionId && sectionId !== this.currentSection) {
          this.navigateToSection(sectionId);
        }
      });
    });
  }
  
  setupHistory() {
    window.addEventListener('popstate', (e) => {
      const sectionId = this.getCurrentSection();
      this.loadSection(sectionId, false);
    });
  }
  

  
  async navigateToSection(sectionId) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    
    // Update URL
    window.history.pushState({}, '', this.sectionConfig[sectionId].url);
    
    // Update navigation state
    this.updateNavigation(sectionId);
    
    // Load section with animation
    await this.loadSection(sectionId, true);
    
    this.isTransitioning = false;
  }
  
  async loadSection(sectionId, animate = true) {
    const targetSection = this.sections[sectionId];
    const currentSection = this.currentSection ? this.sections[this.currentSection] : null;
    
    if (!targetSection) return;
    
    if (animate) {
      // Start transition
      if (currentSection) {
        currentSection.style.opacity = '0';
        currentSection.style.transform = 'translateY(-20px)';
      }
      
      // Wait for exit animation
      await this.wait(300);
      
      // Hide current section
      if (currentSection) {
        currentSection.style.display = 'none';
      }
    }
    
    // Show target section
    targetSection.style.display = 'block';
    
    if (animate) {
      // Trigger entrance animation
      await this.wait(50);
      targetSection.style.opacity = '1';
      targetSection.style.transform = 'translateY(0)';
      
      // Wait for entrance animation
      await this.wait(600);
    } else {
      targetSection.style.opacity = '1';
      targetSection.style.transform = 'translateY(0)';
    }
    
    this.currentSection = sectionId;
    
    // Initialize section-specific features
    this.initializeSectionFeatures(sectionId);
  }
  
  updateNavigation(activeSection) {
    document.querySelectorAll('.button-link').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === this.sectionConfig[activeSection].url) {
        link.classList.add('active');
      }
    });
  }
  
  initializeSectionFeatures(sectionId) {
    switch (sectionId) {
      case 'home':
        this.initializeCarousel();
        break;
      case 'work':
        this.initializeWorkGallery();
        break;
      case 'products':
        this.initializeProductsGallery();
        break;
      case 'photos':
        this.initializePhotosGallery();
        break;
    }
  }
  
  initializeCarousel() {
    // Reinitialize carousel if it exists
    const carousel = document.querySelector('.carousel-container');
    if (carousel && window.carouselSystem) {
      window.carouselSystem.init();
    }
  }
  
  initializeWorkGallery() {
    // Initialize work gallery with smooth transitions
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        item.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
  
  initializeProductsGallery() {
    // Similar to work gallery
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        item.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
  
  initializePhotosGallery() {
    // Initialize photos gallery
    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'scale(0.9)';
      
      setTimeout(() => {
        item.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      }, index * 150);
    });
  }
  
  getCurrentSection() {
    const path = window.location.pathname;
    return this.getSectionFromPath(path);
  }
  
  getSectionFromPath(path) {
    if (path === '/' || path === '') return 'home';
    const section = path.slice(1).split('/')[0];
    return this.sectionConfig[section] ? section : 'home';
  }
  
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Content generators - these would typically load from your existing pages
  getHomeContent() {
    return `
      <div class="carousel-wrapper mb-24">
        <div id="image-carousel" class="carousel-container">
          <div class="carousel-slide">
            <img src="/img/carousel/01.jpg" loading="lazy">
            <img src="/img/carousel/02.jpg" loading="lazy">
            <img src="/img/carousel/03.jpg" loading="lazy">
            <img src="/img/carousel/04.jpg" loading="lazy">
            <img src="/img/carousel/07.jpg" loading="lazy">
            <img src="/img/carousel/05.jpg" loading="lazy">
            <img src="/img/carousel/06.jpg" loading="lazy">
          </div>
        </div>
      </div>

      <section class="mb-24">
        <div class="col-8 mb-24">
          <a href="/work" class="section-link" data-section="work">
            <span class="title">Work</span>
            <span class="subtitle">Select professional work.</span>
          </a>
        </div>
        <div class="col-8 gap-12">
          <a href="/work/block" class="image-link mb-8 work-item">
            <span class="title color-block">Block</span>
            <span class="subtitle color-block">Principal Product Designer, Proto<br>2023 — Present</span>
          </a>
          <a href="https://mahanti.co/mango_studios/" class="image-link work-item">
            <span class="title color-mango">Mango Studios</span>
            <span class="subtitle color-mango">Founder<br>2022 — Present</span>
          </a>
          <a href="/work/angellist" class="image-link work-item">
            <span class="title color-al">AngelList</span>
            <span class="subtitle color-al">Senior Product Designer<br>2022 — 2023</span>
          </a>
          <a href="/work/square" class="image-link work-item">
            <span class="title color-sq">Square</span>
            <span class="subtitle color-sq">Senior Product Designer, Restaurants<br>2017 — 2022</span>
          </a>
          <a href="/work/ando" class="image-link work-item">
            <span class="title color-ando">Ando</span>
            <span class="subtitle color-ando">Lead Designer<br>2016 – 2017</span>
          </a>
          <a href="/work/sidecar" class="image-link work-item">
            <span class="title color-sidecar">Sidecar</span>
            <span class="subtitle color-sidecar">Founding Designer<br>2012 — 2016</span>
          </a>
        </div>
      </section>

      <section class="mb-24">
        <div class="col-8 mb-24">
          <a href="/products" class="section-link" data-section="products">
            <span class="title">Products</span>
            <span class="subtitle">A collection of iOS apps that I've designed and built over the years.</span>
          </a>
        </div>
        <div class="col-8 gap-12">
          <a href="/products/approach" class="image-link product-item">
            <span class="title color-approach">Approach</span>
            <span class="subtitle color-approach">Golf products designed for fun, built for performance. Coming soon.</span>
          </a>
          <a href="/products/sudo" class="image-link product-item">
            <span class="title color-sudo">Sudo</span>
            <span class="subtitle color-sudo">Beautiful Sudoku – with a colorful twist.</span>
          </a>
          <a href="/products/circuit" class="image-link product-item">
            <span class="title color-circuit">Circuit</span>
            <span class="subtitle color-circuit">A stupidly-simple, extremely efficient, HIIT timer.</span>
          </a>
          <a href="/products/jot" class="image-link product-item">
            <span class="title color-jot">jot</span>
            <span class="subtitle color-jot">The fastest app for notes and sketches.</span>
          </a>
          <a href="/products/terraforms" class="image-link product-item">
            <span class="title color-terraforms">Terraforms</span>
            <span class="subtitle color-terraforms">An experimental app to explore Terraforms by Mathcastles.</span>
          </a>
        </div>
      </section>

      <section>
        <div class="col-8 mb-24">
          <a href="/photos" class="section-link" data-section="photos">
            <span class="title">Photography</span>
            <span class="subtitle">Select film and digital photography.</span>
          </a>
        </div>
        <div class="col-8 gap-12">
          <a href="/photos/harvest" class="image-link photo-item">
            <span class="title color-tint">Harvest</span>
            <span class="subtitle color-tint">In 2021, I joined winemaker Pascal Carole to document his premier harvest in the Loire Valley.</span>
          </a>
          <a href="/photos/pch" class="image-link photo-item">
            <span class="title color-tint">Pacific Coast Highway</span>
            <span class="subtitle color-tint">Film from our drive down the PCH.</span>
          </a>
          <a href="/photos" class="image-link photo-item">
            <span class="title color-tint">View all photos</span>
          </a>
        </div>
      </section>
    `;
  }
  
  getWorkContent() {
    return `
      <section class="mb-24">
        <div class="col-8 mb-24">
          <span class="title">Work</span>
          <span class="subtitle">Select professional work.</span>
        </div>
        <div class="col-8 gap-12">
          <a href="/work/block" class="image-link mb-8 work-item">
            <span class="title color-block">Block</span>
            <span class="subtitle color-block">Principal Product Designer, Proto<br>2023 — Present</span>
          </a>
          <a href="https://mahanti.co/mango_studios/" class="image-link work-item">
            <span class="title color-mango">Mango Studios</span>
            <span class="subtitle color-mango">Founder<br>2022 — Present</span>
          </a>
          <a href="/work/angellist" class="image-link work-item">
            <span class="title color-al">AngelList</span>
            <span class="subtitle color-al">Senior Product Designer<br>2022 — 2023</span>
          </a>
          <a href="/work/square" class="image-link work-item">
            <span class="title color-sq">Square</span>
            <span class="subtitle color-sq">Senior Product Designer, Restaurants<br>2017 — 2022</span>
          </a>
          <a href="/work/ando" class="image-link work-item">
            <span class="title color-ando">Ando</span>
            <span class="subtitle color-ando">Lead Designer<br>2016 – 2017</span>
          </a>
          <a href="/work/sidecar" class="image-link work-item">
            <span class="title color-sidecar">Sidecar</span>
            <span class="subtitle color-sidecar">Founding Designer<br>2012 — 2016</span>
          </a>
        </div>
      </section>
    `;
  }
  
  getProductsContent() {
    return `
      <section class="mb-24">
        <div class="col-8 mb-24">
          <span class="title">Products</span>
          <span class="subtitle">A collection of iOS apps that I've designed and built over the years.</span>
        </div>
        <div class="col-8 gap-12">
          <a href="/products/approach" class="image-link product-item">
            <span class="title color-approach">Approach</span>
            <span class="subtitle color-approach">Golf products designed for fun, built for performance. Coming soon.</span>
          </a>
          <a href="/products/sudo" class="image-link product-item">
            <span class="title color-sudo">Sudo</span>
            <span class="subtitle color-sudo">Beautiful Sudoku – with a colorful twist.</span>
          </a>
          <a href="/products/circuit" class="image-link product-item">
            <span class="title color-circuit">Circuit</span>
            <span class="subtitle color-circuit">A stupidly-simple, extremely efficient, HIIT timer.</span>
          </a>
          <a href="/products/jot" class="image-link product-item">
            <span class="title color-jot">jot</span>
            <span class="subtitle color-jot">The fastest app for notes and sketches.</span>
          </a>
          <a href="/products/terraforms" class="image-link product-item">
            <span class="title color-terraforms">Terraforms</span>
            <span class="subtitle color-terraforms">An experimental app to explore Terraforms by Mathcastles.</span>
          </a>
        </div>
      </section>
    `;
  }
  
  getPhotosContent() {
    return `
      <section class="mb-24">
        <div class="col-8 mb-24">
          <span class="title">Photography</span>
          <span class="subtitle">Select film and digital photography.</span>
        </div>
        <div class="col-8 gap-12">
          <a href="/photos/harvest" class="image-link photo-item">
            <span class="title color-tint">Harvest</span>
            <span class="subtitle color-tint">In 2021, I joined winemaker Pascal Carole to document his premier harvest in the Loire Valley.</span>
          </a>
          <a href="/photos/pch" class="image-link photo-item">
            <span class="title color-tint">Pacific Coast Highway</span>
            <span class="subtitle color-tint">Film from our drive down the PCH.</span>
          </a>
          <a href="/photos" class="image-link photo-item">
            <span class="title color-tint">View all photos</span>
          </a>
        </div>
      </section>
    `;
  }
  
  getAboutContent() {
    return `
      <section class="mb-24">
        <div class="col-8 mb-24">
          <span class="title">About</span>
          <span class="subtitle">A multidisciplinary designer building delightful solutions to complex problems.</span>
        </div>
        <div class="col-8">
          <p>I'm Arjun Mahanti, a designer and developer based in Brooklyn. I focus on creating thoughtful, user-centered experiences that solve real problems.</p>
          <p>Currently working at Block as a Principal Product Designer on Proto, and running Mango Studios, a design consultancy.</p>
        </div>
      </section>
    `;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.dynamicSPA = new DynamicSPA();
}); 