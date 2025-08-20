#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Configuration for image gallery generation
 * Define which content files should have their image galleries automated
 */
const GALLERY_CONFIG = {
  // Work portfolio images
  'angellist': {
    imagePath: 'img/work/angellist',
    preferRetina: true, // Use @2x versions when available
    galleryClass: 'col-8 gap-12',
    imageAttributes: 'loading="lazy" data-zoomable'
  },
  'square': {
    imagePath: 'img/work/square',
    preferRetina: true,
    galleryClass: 'col-8',
    imageAttributes: 'class="mb24" loading="lazy" data-zoomable',
    wrapInSection: true // Square has custom layout with individual sections (no sectionClass = no class on section)
  },
  'ando': {
    imagePath: 'img/work/ando',
    preferRetina: true,
    galleryClass: 'col-8 gap-12',
    imageAttributes: 'loading="lazy" data-zoomable'
  },
  'sidecar': {
    imagePath: 'img/work/sidecar',
    preferRetina: true,
    galleryClass: 'col-8 gap-12',
    imageAttributes: 'loading="lazy" data-zoomable'
  },
  
  // Product images
  'approach': {
    imagePath: 'img/products/approach',
    preferRetina: true,
    galleryClass: 'col-8',
    imageAttributes: 'data-zoomable',
    wrapInSection: true // Each image gets its own section
  },
  'circuit': {
    imagePath: 'img/products/circuit',
    preferRetina: false, // Circuit uses .jpg without @2x
    galleryClass: 'col-8',
    imageAttributes: 'loading="lazy" data-zoomable',
    wrapInSection: true
  },
  'jot': {
    imagePath: 'img/products/jot',
    preferRetina: true,
    galleryClass: 'col-8',
    imageAttributes: 'loading="lazy" data-zoomable',
    wrapInSection: true
  },
  'sudo': {
    imagePath: 'img/products/sudo',
    preferRetina: true,
    galleryClass: 'col-8',
    imageAttributes: 'loading="lazy" data-zoomable',
    wrapInSection: true
  },
  'terraforms': {
    imagePath: 'img/products/terraforms',
    preferRetina: true,
    galleryClass: 'col-8',
    imageAttributes: 'loading="lazy" data-zoomable',
    wrapInSection: true
  }
};

/**
 * Get all image files from a directory and sort them numerically
 */
function getImageFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return [];
  }

  const files = fs.readdirSync(dirPath)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && 
             !file.startsWith('.') && 
             !file.startsWith('DS_Store');
    })
    .sort((a, b) => {
      // Extract number from filename (e.g., "01.jpg" -> 1, "05@2x.png" -> 5)
      const getNum = (filename) => {
        const match = filename.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      };
      return getNum(a) - getNum(b);
    });

  return files;
}

/**
 * Choose the best image file based on preferences
 */
function chooseBestImage(files, baseNumber, preferRetina = true) {
  const baseStr = baseNumber.toString().padStart(2, '0');
  
  if (preferRetina) {
    // Look for @2x version first
    const retinaVariants = files.filter(f => 
      f.startsWith(baseStr) && f.includes('@2x')
    );
    if (retinaVariants.length > 0) {
      return retinaVariants[0];
    }
  }
  
  // Look for regular version
  const regularVariants = files.filter(f => 
    f.startsWith(baseStr) && !f.includes('@2x')
  );
  if (regularVariants.length > 0) {
    return regularVariants[0];
  }
  
  return null;
}

/**
 * Generate gallery HTML for a given configuration
 */
function generateGalleryHTML(config, galleryId) {
  const { imagePath, preferRetina, galleryClass, imageAttributes, wrapInSection, sectionClass } = config;
  const fullPath = path.join(process.cwd(), imagePath);
  const files = getImageFiles(fullPath);
  
  if (files.length === 0) {
    console.warn(`No images found in ${imagePath}`);
    return [];
  }

  // Get unique base numbers
  const baseNumbers = [...new Set(files.map(f => {
    const match = f.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }))].sort((a, b) => a - b);

  const galleryHTML = [];
  const sectionClassAttr = sectionClass ? ` class="${sectionClass}"` : '';
  
  if (wrapInSection) {
    // Each image gets its own section (for products and special layouts)
    baseNumbers.forEach(num => {
      const imageFile = chooseBestImage(files, num, preferRetina);
      if (imageFile) {
        galleryHTML.push(`        <section${sectionClassAttr}>`);
        galleryHTML.push(`          <div class="${galleryClass}">`);
        galleryHTML.push(`            <img src="/${imagePath}/${imageFile}" ${imageAttributes}>`);
        galleryHTML.push(`          </div>`);
        galleryHTML.push(`        </section>`);
      }
    });
  } else {
    // All images in one section (for work portfolio)
    galleryHTML.push(`      <section>`);
    galleryHTML.push(`        <div class="${galleryClass}">`);
    
    baseNumbers.forEach(num => {
      const imageFile = chooseBestImage(files, num, preferRetina);
      if (imageFile) {
        galleryHTML.push(`          <img src="/${imagePath}/${imageFile}" ${imageAttributes}>`);
      }
    });
    
    galleryHTML.push(`        </div>`);
    galleryHTML.push(`      </section>`);
  }

  return galleryHTML;
}

/**
 * Update a JSON content file with generated gallery
 */
function updateContentFile(contentId) {
  const config = GALLERY_CONFIG[contentId];
  if (!config) {
    console.warn(`No gallery config found for: ${contentId}`);
    return false;
  }

  const filePath = path.join(process.cwd(), 'api', 'content', `${contentId}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`Content file not found: ${filePath}`);
    return false;
  }

  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const galleryHTML = generateGalleryHTML(config, contentId);
    
    if (galleryHTML.length === 0) {
      console.warn(`No gallery HTML generated for: ${contentId}`);
      return false;
    }

    // Find and replace the gallery section in content
    let updatedContent = [...content.content];
    let galleryStart = -1;
    let galleryEnd = -1;

    // Look for existing gallery sections (sections with images)
    for (let i = 0; i < updatedContent.length; i++) {
      const line = updatedContent[i];
      if (line.includes('<img src=')) {
        if (galleryStart === -1) {
          // Find the start of the section containing this image
          for (let j = i; j >= 0; j--) {
            if (updatedContent[j].includes('<section')) {
              galleryStart = j;
              break;
            }
          }
        }
        // Find the end of the section
        for (let j = i; j < updatedContent.length; j++) {
          if (updatedContent[j].includes('</section>')) {
            galleryEnd = j;
            break;
          }
        }
      }
    }

    if (galleryStart !== -1 && galleryEnd !== -1) {
      // Replace existing gallery
      updatedContent.splice(galleryStart, galleryEnd - galleryStart + 1, ...galleryHTML);
    } else {
      // Append gallery at the end
      updatedContent.push(...galleryHTML);
    }

    // Write back to file
    content.content = updatedContent;
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    
    console.log(`✅ Updated gallery for: ${contentId}`);
    return true;
    
  } catch (error) {
    console.error(`Error updating ${contentId}:`, error);
    return false;
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Update all configured galleries
    console.log('🖼️  Generating image galleries for all configured content files...\n');
    
    let successCount = 0;
    const allConfigs = Object.keys(GALLERY_CONFIG);
    
    allConfigs.forEach(contentId => {
      if (updateContentFile(contentId)) {
        successCount++;
      }
    });
    
    console.log(`\n✨ Successfully updated ${successCount}/${allConfigs.length} galleries`);
    
  } else {
    // Update specific content files
    console.log(`🖼️  Generating image galleries for: ${args.join(', ')}\n`);
    
    let successCount = 0;
    args.forEach(contentId => {
      if (updateContentFile(contentId)) {
        successCount++;
      }
    });
    
    console.log(`\n✨ Successfully updated ${successCount}/${args.length} galleries`);
  }
}

// Export for use as module
module.exports = {
  GALLERY_CONFIG,
  generateGalleryHTML,
  updateContentFile,
  getImageFiles,
  chooseBestImage
};

// Run if called directly
if (require.main === module) {
  main();
}