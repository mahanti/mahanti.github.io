#!/bin/bash

# Dynamic SPA Setup Script
# This script helps set up the dynamic SPA system

echo "🚀 Setting up Dynamic SPA System..."

# Check if we're in the right directory
if [ ! -f "_config.yml" ]; then
    echo "❌ Error: Please run this script from your Jekyll site root directory"
    exit 1
fi

# Create necessary directories if they don't exist
echo "📁 Creating directories..."
mkdir -p js
mkdir -p _sass
mkdir -p _layouts
mkdir -p _includes

# Check if dynamic-spa.js exists
if [ ! -f "js/dynamic-spa.js" ]; then
    echo "❌ Error: js/dynamic-spa.js not found. Please ensure the file exists."
    exit 1
fi

# Check if main.scss has been updated
if ! grep -q "Dynamic SPA Styles" _sass/main.scss; then
    echo "⚠️  Warning: _sass/main.scss may not have the dynamic SPA styles"
    echo "   Please ensure the CSS has been updated with the new styles"
fi

# Check if default.html has been updated
if ! grep -q "dynamic-spa.js" _layouts/default.html; then
    echo "⚠️  Warning: _layouts/default.html may not include the dynamic SPA script"
    echo "   Please ensure the layout has been updated"
fi

# Check if header.html has been updated
if ! grep -q "data-section" _includes/header.html; then
    echo "⚠️  Warning: _includes/header.html may not have data-section attributes"
    echo "   Please ensure the header has been updated"
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Run 'jekyll serve' to start your development server"
echo "2. Open your site in a browser"
echo "3. Test navigation between sections"
echo "4. Check browser console for any errors"
echo ""
echo "📖 For more information, see DYNAMIC_SPA_README.md"
echo ""
echo "🔧 To test the system:"
echo "   - Open test-dynamic.html in your browser"
echo "   - Click navigation links"
echo "   - Verify smooth transitions"
echo ""
echo "🎉 Your site should now behave like Mike Matas's with fluid navigation!" 