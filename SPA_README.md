# Single Page Application Setup

This site has been converted to a Single Page Application (SPA) that loads all content dynamically without page refreshes.

## Features

- **Smooth transitions** between pages
- **No page reloads** - all navigation happens client-side
- **URL routing** - browser back/forward buttons work
- **SEO friendly** - initial page loads with content
- **Fast navigation** - subsequent page loads are instant

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the setup script:**
   ```bash
   ./scripts/setup-spa.sh
   ```

3. **Build the site:**
   ```bash
   npm run build
   ```

4. **Start development server:**
   ```bash
   jekyll serve
   ```

## How it works

### File Structure
- `js/spa.js` - Main SPA router
- `_layouts/spa.html` - SPA layout template
- `api/content/` - JSON files containing page content
- `scripts/convert-to-spa.js` - Converts markdown to JSON

### Routing
The SPA handles these routes:
- `/` - Home page
- `/work` - Work overview
- `/work/block` - Block project
- `/work/angellist` - AngelList project
- `/work/square` - Square project
- `/work/ando` - Ando project
- `/work/sidecar` - Sidecar project
- `/products` - Products overview
- `/products/approach` - Approach app
- `/products/sudo` - Sudo app
- `/products/circuit` - Circuit app
- `/products/jot` - jot app
- `/products/terraforms` - Terraforms app
- `/photos` - Photography overview
- `/photos/harvest` - Harvest photos
- `/photos/pch` - Pacific Coast Highway photos
- `/about` - About page

### Content Loading
1. Initial page load includes content in the HTML
2. Subsequent navigation loads content from JSON files
3. Smooth transitions between pages
4. Browser history is maintained

### Server Configuration

#### Apache (.htaccess)
The setup script creates an `.htaccess` file that handles client-side routing.

#### Nginx
Use the provided `nginx.conf` file for nginx configuration.

## Development

### Adding new pages
1. Create a markdown file in `_pages/`
2. Run `npm run convert-spa` to generate JSON
3. Add the route to `js/spa.js` routes object

### Modifying content
1. Edit the markdown files in `_pages/`
2. Run `npm run convert-spa` to update JSON
3. Rebuild the site

### Custom transitions
Modify the transition functions in `js/spa.js`:
- `startTransition()` - Called before content change
- `endTransition()` - Called after content change

## Performance

- JSON content is cached for 1 hour
- Static assets are cached for 1 year
- Smooth transitions are hardware accelerated
- Minimal JavaScript footprint

## Browser Support

- Modern browsers with ES6+ support
- Graceful fallback for older browsers
- Progressive enhancement approach 