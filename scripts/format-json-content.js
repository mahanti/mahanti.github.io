#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function formatHTMLContent(htmlString) {
  // Replace escaped newlines with actual newlines and add proper indentation
  let formatted = htmlString
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t');
  
  // Split into lines and add proper indentation
  const lines = formatted.split('\n');
  let indentLevel = 0;
  const indentSize = 2; // 2 spaces per indent level
  
  const formattedLines = lines.map((line, index) => {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      return ''; // Empty line
    }
    
    // Decrease indent for closing tags
    if (trimmedLine.startsWith('</')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add indentation
    const indent = ' '.repeat(indentLevel * indentSize + 4); // +4 for JSON indentation
    const formattedLine = indent + trimmedLine;
    
    // Increase indent for opening tags (but not self-closing tags)
    if (trimmedLine.startsWith('<') && 
        !trimmedLine.startsWith('</') && 
        !trimmedLine.endsWith('/>') &&
        !isSelfClosingTag(trimmedLine)) {
      indentLevel++;
    }
    
    return formattedLine;
  });
  
  return formattedLines.join('\n');
}

function isSelfClosingTag(line) {
  // Common self-closing HTML tags
  const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];
  const tagMatch = line.match(/<(\w+)/);
  if (tagMatch) {
    const tagName = tagMatch[1].toLowerCase();
    return selfClosingTags.includes(tagName) || line.includes('/>');
  }
  return false;
}

function processJSONFile(filePath, filename) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(content);
    
    if (!jsonData.content) {
      log(`  Skipping ${filename} - no content field`, colors.yellow);
      return false;
    }
    
    const originalContent = jsonData.content;
    
    // Check if content needs formatting (contains escaped newlines or is one long line)
    const hasEscapedNewlines = originalContent.indexOf('\\n') !== -1;
    const isOneLongLine = !originalContent.includes('\n    '); // Not properly indented
    
    if (!hasEscapedNewlines && !isOneLongLine) {
      log(`  ${filename} already formatted`, colors.blue);
      return false;
    }
    
    // Format the HTML content
    const formattedContent = formatHTMLContent(originalContent);
    jsonData.content = formattedContent;
    
    // Write back to file with proper JSON formatting
    const formattedJSON = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync(filePath, formattedJSON);
    
    log(`  ✅ Formatted ${filename}`, colors.green);
    return true;
    
  } catch (error) {
    log(`  ❌ Error processing ${filename}: ${error.message}`, colors.red);
    return false;
  }
}

function main() {
  log(`${colors.bold}🎨 Formatting JSON content files for better readability${colors.reset}\n`);
  
  const apiDir = path.join(__dirname, '../api/content');
  
  if (!fs.existsSync(apiDir)) {
    log('❌ API content directory not found!', colors.red);
    return;
  }
  
  const jsonFiles = fs.readdirSync(apiDir).filter(file => file.endsWith('.json'));
  log(`Found ${jsonFiles.length} JSON files to process\n`, colors.blue);
  
  let formattedCount = 0;
  
  jsonFiles.forEach(filename => {
    const filePath = path.join(apiDir, filename);
    log(`Processing ${filename}...`, colors.blue);
    
    if (processJSONFile(filePath, filename)) {
      formattedCount++;
    }
  });
  
  log(`\n${colors.bold}📊 Summary:${colors.reset}`);
  log(`  Files processed: ${jsonFiles.length}`);
  log(`  Files formatted: ${formattedCount}`);
  log(`  Files skipped: ${jsonFiles.length - formattedCount}`);
  
  if (formattedCount > 0) {
    log(`\n${colors.green}${colors.bold}🎉 Successfully formatted JSON content files!${colors.reset}`);
    log(`${colors.green}✅ Content is now properly indented and readable${colors.reset}`);
  } else {
    log(`\n${colors.yellow}ℹ️  All files were already formatted${colors.reset}`);
  }
}

main();