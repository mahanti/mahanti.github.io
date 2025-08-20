# Image Gallery Automation

This directory contains scripts to automate the generation of image galleries in your portfolio site.

## Quick Start

```bash
# Generate all image galleries
npm run generate-galleries

# Generate specific galleries
node scripts/generate-image-galleries.js angellist square

# Run full build with galleries
npm run build
```

## How It Works

The `generate-image-galleries.js` script automatically:

1. **Scans image directories** for numbered images (01.jpg, 02.png, etc.)
2. **Sorts images numerically** to ensure consistent ordering
3. **Chooses optimal versions** (@2x retina images when available)
4. **Generates HTML** based on predefined templates
5. **Updates JSON content files** with the generated galleries

## Configuration

Gallery configurations are defined in `GALLERY_CONFIG` within the script:

```javascript
'angellist': {
  imagePath: 'img/work/angellist',      // Source directory
  preferRetina: true,                   // Use @2x images when available
  galleryClass: 'col-8 gap-12',        // CSS classes for gallery container
  imageAttributes: 'loading="lazy" data-zoomable'  // Image attributes
},
'square': {
  imagePath: 'img/work/square',
  preferRetina: true,
  galleryClass: 'col-8',
  imageAttributes: 'class="mb24" loading="lazy" data-zoomable',
  wrapInSection: true                   // Each image gets its own <section>
}
```

## Gallery Types

### Work Portfolio (angellist, ando, sidecar)
- All images in a single section
- Uses `col-8 gap-12` for grid layout
- Standard `loading="lazy" data-zoomable` attributes

### Work Portfolio - Special Layout (square)
- Each image in its own section
- Uses `col-8` container with `mb24` image class
- Individual sections for better spacing control

### Product Pages (approach, circuit, jot, sudo, terraforms)
- Each image in its own section with `mb-24` class
- Uses `col-8` container
- Individual sections for detailed product showcases

## Adding New Galleries

To add a new automated gallery:

1. **Add configuration** to `GALLERY_CONFIG` in the script
2. **Organize images** in numbered format (01.jpg, 02.png, etc.)
3. **Run the script** to generate the gallery

Example:
```javascript
'new-project': {
  imagePath: 'img/work/new-project',
  preferRetina: true,
  galleryClass: 'col-8 gap-12',
  imageAttributes: 'loading="lazy" data-zoomable'
}
```

## Image Organization

Place images in directories following this structure:
```
img/
├── work/
│   ├── angellist/
│   │   ├── 01.png
│   │   ├── 01@2x.png
│   │   ├── 02.png
│   │   └── 02@2x.png
│   └── square/
├── products/
│   ├── approach/
│   └── circuit/
```

### Naming Convention
- **Numbered files**: `01.jpg`, `02.png`, `03.jpeg`
- **Retina versions**: `01@2x.png`, `02@2x.jpg`
- **Supported formats**: `.jpg`, `.jpeg`, `.png`, `.webp`

## Build Integration

The gallery generation is integrated into the build process:

```json
{
  "scripts": {
    "generate-galleries": "node scripts/generate-image-galleries.js",
    "build": "npm run generate-galleries && npm run optimize-images && jekyll build"
  }
}
```

## Manual Usage

You can also run the script manually:

```bash
# Generate all galleries
node scripts/generate-image-galleries.js

# Generate specific galleries
node scripts/generate-image-galleries.js angellist square circuit

# The script will output progress and results
🖼️  Generating image galleries for: angellist, square, circuit

✅ Updated gallery for: angellist
✅ Updated gallery for: square  
✅ Updated gallery for: circuit

✨ Successfully updated 3/3 galleries
```

## Benefits

✅ **No more manual image management** - Just add numbered images to folders  
✅ **Automatic retina image selection** - Always uses the best available version  
✅ **Consistent ordering** - Images display in numerical order automatically  
✅ **Easy updates** - Add new images and regenerate galleries instantly  
✅ **Build integration** - Galleries update automatically during builds  
✅ **Flexible configuration** - Different layouts for different content types  

## Troubleshooting

**Gallery not updating?**
- Check that images are numbered correctly (01, 02, 03...)
- Verify the `imagePath` in configuration matches your directory structure
- Ensure images have supported extensions (.jpg, .png, .jpeg, .webp)

**Missing images?**
- The script automatically skips non-existent files
- Check console output for warnings about missing directories

**Wrong image order?**
- Images are sorted numerically, not alphabetically
- Use zero-padded numbers: `01.jpg`, `02.jpg` instead of `1.jpg`, `2.jpg`