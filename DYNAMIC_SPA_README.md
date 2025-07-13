# Dynamic SPA System - Mike Matas Style

This implementation transforms your Jekyll site into a fluid, dynamic single-page application similar to Mike Matas's website, while preserving your current design and layouts.

## 🎯 Key Features

### Fluid Navigation
- **No page reloads** - All navigation happens client-side
- **Smooth transitions** - Content fades in/out with elegant animations
- **Persistent header** - Navigation stays visible and updates state
- **Browser history** - Back/forward buttons work seamlessly

### Dynamic Content Loading
- **Instant navigation** - Content appears/disappears based on navigation
- **Staggered animations** - Items animate in sequence for visual appeal
- **Custom cursor** - Interactive cursor that responds to hover states
- **Performance optimized** - Hardware-accelerated animations

### Preserved Design
- **Your existing layouts** - All current styling and structure maintained
- **Color schemes** - All your custom colors and themes preserved
- **Responsive design** - Mobile and desktop layouts intact
- **Typography** - Your font choices and spacing maintained

## 🚀 How It Works

### 1. Dynamic SPA Router (`js/dynamic-spa.js`)
The core system that handles:
- **Section management** - Creates and manages content sections
- **Navigation interception** - Prevents default link behavior
- **History management** - Updates URLs without page reloads
- **Animation coordination** - Orchestrates smooth transitions

### 2. Enhanced CSS (`_sass/main.scss`)
New styles that support:
- **Section containers** - Smooth opacity and transform transitions
- **Staggered animations** - Items animate in sequence
- **Enhanced cursor** - Responsive hover states
- **Performance optimizations** - Hardware acceleration

### 3. Updated Layout (`_layouts/default.html`)
Modified to:
- **Include dynamic scripts** - Loads the SPA system
- **Initialize loading states** - Smooth page load experience
- **Maintain structure** - Preserves your existing layout

## 📁 File Structure

```
├── js/
│   ├── dynamic-spa.js          # Main SPA system
│   └── script.js               # Existing scripts (preserved)
├── _sass/
│   └── main.scss               # Enhanced styles
├── _layouts/
│   └── default.html            # Updated layout
├── _includes/
│   └── header.html             # Enhanced navigation
└── test-dynamic.html           # Test page
```

## 🎨 Animation System

### Section Transitions
```css
.section-container {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
              transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-container.active {
  opacity: 1;
  transform: translateY(0);
}
```

### Staggered Item Animations
```css
.work-item,
.product-item,
.photo-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
              transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Custom Cursor
```css
.cursor_root {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
  transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🔧 Implementation Details

### Navigation Flow
1. **User clicks link** → Event intercepted by SPA
2. **URL updated** → `history.pushState()` called
3. **Content transition** → Current section fades out
4. **New content loads** → Target section fades in
5. **Navigation updates** → Active state updated

### Content Management
- **Pre-loaded content** - All sections created on page load
- **Dynamic switching** - Sections shown/hidden as needed
- **State preservation** - Content remains in DOM
- **Performance optimized** - Minimal re-rendering

### Animation Timing
- **Exit animation** → 300ms fade out
- **Content switch** → 50ms delay
- **Entrance animation** → 600ms fade in
- **Staggered items** → 100ms intervals

## 🎯 Usage

### Basic Navigation
The system automatically intercepts all internal links:
```html
<a href="/work" class="button-link">Work</a>
<a href="/products" class="button-link">Products</a>
```

### Section Links
Use section links for smooth transitions:
```html
<a href="/work" class="section-link" data-section="work">
  <span class="title">Work</span>
  <span class="subtitle">Select professional work.</span>
</a>
```

### Custom Animations
Add animation classes to elements:
```html
<div class="work-item fade-in-up">Content</div>
<div class="product-item slide-in-left">Content</div>
```

## 🎨 Customization

### Adding New Sections
1. **Update section config** in `dynamic-spa.js`:
```javascript
this.sectionConfig = {
  // ... existing sections
  newSection: {
    title: 'New Section',
    url: '/new-section',
    content: this.getNewSectionContent()
  }
};
```

2. **Add content method**:
```javascript
getNewSectionContent() {
  return `<section>Your content here</section>`;
}
```

3. **Add navigation link**:
```html
<a href="/new-section" class="button-link" data-section="newSection">New Section</a>
```

### Custom Animations
Add new animation classes in CSS:
```css
@keyframes customAnimation {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

.custom-animation {
  animation: customAnimation 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

### Performance Tuning
Adjust animation timing and easing:
```css
.section-container {
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}
```

## 🔍 Testing

### Test Page
Use `test-dynamic.html` to verify the system:
1. Open the test page in your browser
2. Click navigation links
3. Check browser console for initialization messages
4. Verify smooth transitions between sections

### Browser Console
Monitor for these messages:
```
Dynamic SPA test page loaded
Dynamic SPA initialized successfully
Current section: home
```

## 🚀 Performance Benefits

### Optimizations
- **Hardware acceleration** - `transform3d()` and `will-change`
- **Reduced reflows** - Minimal DOM manipulation
- **Efficient animations** - `requestAnimationFrame()` usage
- **Memory management** - Content preserved in DOM

### Loading Performance
- **No additional requests** - Content pre-loaded
- **Instant navigation** - No network delays
- **Smooth transitions** - 60fps animations
- **Reduced bandwidth** - No page reloads

## 🎯 Accessibility

### Reduced Motion
The system respects user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Keyboard Navigation
- **Tab navigation** - All links remain accessible
- **Focus management** - Focus moves appropriately
- **Screen readers** - Content structure preserved

## 🔧 Troubleshooting

### Common Issues

**Navigation not working**
- Check browser console for errors
- Verify `dynamic-spa.js` is loaded
- Ensure links have correct `href` attributes

**Animations not smooth**
- Check for CSS conflicts
- Verify hardware acceleration is enabled
- Monitor browser performance

**Content not loading**
- Check section configuration
- Verify content methods exist
- Check for JavaScript errors

### Debug Mode
Enable debug logging:
```javascript
// In dynamic-spa.js
this.debug = true;
```

## 🎉 Result

Your site now behaves like Mike Matas's with:
- ✅ **Fluid navigation** - No page reloads
- ✅ **Smooth animations** - Elegant transitions
- ✅ **Persistent header** - Always visible navigation
- ✅ **Custom cursor** - Interactive hover states
- ✅ **Preserved design** - Your existing styling intact
- ✅ **Performance optimized** - Fast and smooth experience

The transformation maintains your current design while adding the fluid, dynamic experience you admired in Mike Matas's site! 