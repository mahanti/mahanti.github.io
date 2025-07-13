const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Create API directory for JSON content
const apiDir = path.join(__dirname, '../api/content');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

// Convert markdown files to JSON
const pagesDir = path.join(__dirname, '../_pages');
const files = fs.readdirSync(pagesDir).filter(file => file.endsWith('.md'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: markdownContent } = matter(content);
  
  // Remove frontmatter and convert to HTML-like content
  const cleanContent = markdownContent
    .replace(/---\n[\s\S]*?\n---\n/, '') // Remove any remaining frontmatter
    .trim();
  
  const pageName = file.replace('.md', '');
  const jsonContent = {
    title: data.title || pageName,
    layout: data.layout || 'default',
    content: cleanContent,
    permalink: data.permalink || `/${pageName === 'index' ? '' : pageName}`
  };
  
  // Write JSON file
  const jsonPath = path.join(apiDir, `${pageName}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 2));
  
  console.log(`Converted ${file} to ${pageName}.json`);
});

console.log('All pages converted to JSON format for SPA!'); 