#!/bin/bash

echo "Setting up Single Page Application..."

# Install dependencies
npm install

# Convert markdown pages to JSON
npm run convert-spa

# Create .htaccess for Apache (if needed)
cat > .htaccess << 'EOF'
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ / [L,QSA]

# Cache JSON content
<FilesMatch "\.json$">
    Header set Cache-Control "max-age=3600"
</FilesMatch>
EOF

echo "SPA setup complete!"
echo "Run 'npm run build' to build the site"
echo "Run 'jekyll serve' to start the development server" 