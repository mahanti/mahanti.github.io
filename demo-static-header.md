---
layout: default
title: Static Header Demo
---

# Static Header Demo

This page demonstrates the **static header with animated content transitions**.

## 🎯 How It Works

1. **Header stays fixed** at the top while you scroll
2. **Content animates** in/out when navigating between pages
3. **Navigation state updates** smoothly
4. **Header hides/shows** based on scroll direction

## ✨ Features

### Static Header
- **Always visible** at the top
- **Glass morphism effect** with backdrop blur
- **Smooth scroll behavior** (hides when scrolling down, shows when scrolling up)
- **Dark mode support**

### Content Transitions
- **Fade in/out** when navigating
- **Smooth animations** with cubic-bezier timing
- **No page reload** feel (like a SPA)

### Navigation
- **Active state indicators** with orange underline
- **Hover effects** with subtle lifts
- **Staggered entrance** animations

## 🚀 Try It Out

Navigate between pages using the header links to see the smooth transitions!

### Test Pages
- [Work](/work) - See content animate in
- [Products](/products) - Smooth transitions
- [Photos](/photos) - Header stays static
- [About](/about) - Content-only animations

## 📱 Mobile Optimized

The header adapts to mobile screens with:
- **Smaller padding** for mobile
- **Touch-friendly** navigation
- **Optimized backdrop blur**

## 🎨 Customization

You can easily customize the behavior:

```javascript
// Adjust header scroll behavior
const header = document.getElementById('nav');
header.style.transform = 'translateY(-100%)'; // Hide
header.style.transform = 'translateY(0)'; // Show
```

```css
/* Customize header appearance */
#nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}
```

The static header creates a **modern, app-like experience** while maintaining the simplicity of Jekyll! 