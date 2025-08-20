# Modern Animation System

Your Jekyll site now has a comprehensive animation system that provides smooth, performant animations without the overhead of React or Framer Motion.

## 🎯 Features

- **Scroll-triggered animations** using Intersection Observer
- **Smooth page transitions** with loading states
- **Enhanced hover effects** with micro-interactions
- **Parallax scrolling** for depth
- **Staggered animations** for lists and grids
- **Accessibility support** with reduced motion preferences
- **Performance optimized** with throttled scroll events

## 🚀 How to Use

### Basic Animation Classes

Add these classes to any element for automatic animations:

```html
<!-- Fade in from bottom -->
<div class="fade-in">Content</div>

<!-- Slide up from bottom -->
<div class="slide-up">Content</div>

<!-- Slide in from left -->
<div class="slide-left">Content</div>

<!-- Slide in from right -->
<div class="slide-right">Content</div>

<!-- Scale in -->
<div class="scale-in">Content</div>
```

### Staggered Animations

For lists or grids that animate in sequence:

```html
<div class="stagger-children">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Interactive Elements

Add hover effects to any element:

```html
<div class="interactive">
  Hover me for a lift effect
</div>
```

### Parallax Effects

Add depth to background elements:

```html
<div class="parallax" data-speed="0.5">
  This will move slower than the scroll
</div>
```

## 🎨 Customization

### Animation Timing

Modify the timing in `_sass/main.scss`:

```scss
.fade-in {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Custom Animations

Add your own animations:

```scss
@keyframes myCustomAnimation {
  from {
    opacity: 0;
    transform: rotate(180deg);
  }
  to {
    opacity: 1;
    transform: rotate(0deg);
  }
}

.my-custom-animation {
  animation: myCustomAnimation 0.8s ease-out;
}
```

## 🔧 JavaScript API

### Manual Animation Control

```javascript
// Add animation class to element
AnimationSystem.addAnimationClass(element, 'fade-in');

// Stagger animation for multiple elements
const elements = document.querySelectorAll('.my-list > *');
AnimationSystem.staggerAnimation(elements, 100); // 100ms delay between each
```

### Performance Tips

- Use `will-change: transform` for elements that animate frequently
- Avoid animating `height` or `width` - use `transform` instead
- Use `opacity` and `transform` for best performance
- The system automatically throttles scroll events for performance

## ♿ Accessibility

The animation system respects user preferences:

- Automatically disables animations when `prefers-reduced-motion` is set
- Maintains keyboard navigation
- Screen reader friendly

## 🎯 Best Practices

1. **Don't over-animate** - Use animations to enhance, not distract
2. **Keep it subtle** - Small movements feel more polished
3. **Test on mobile** - Ensure animations work well on touch devices
4. **Performance first** - Use transform and opacity for smooth 60fps animations

## 🔄 What's Included

- ✅ Scroll-triggered animations
- ✅ Page loading states
- ✅ Smooth hover effects
- ✅ Parallax scrolling
- ✅ Staggered animations
- ✅ Performance optimizations
- ✅ Accessibility support
- ✅ Dark mode compatibility

Your site now has modern, fluid animations that rival React/Framer Motion implementations while maintaining the simplicity and performance of vanilla JavaScript! 