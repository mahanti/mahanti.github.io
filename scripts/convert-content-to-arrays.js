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

function convertContentToArray(htmlString) {
  // Replace escaped newlines with actual newlines
  let content = htmlString.replace(/\\n/g, '\n').replace(/\\t/g, '  ');
  
  // Split by lines and clean up
  let lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Add proper indentation based on HTML structure
  let indentLevel = 0;
  const formattedLines = [];
  
  for (let line of lines) {
    // Decrease indent for closing tags
    if (line.startsWith('</')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add indentation
    const indent = '  '.repeat(indentLevel);
    formattedLines.push(indent + line);
    
    // Increase indent for opening tags (but not self-closing tags)
    if (line.startsWith('<') && 
        !line.startsWith('</') && 
        !line.endsWith('/>') &&
        !isSelfClosingTag(line)) {
      indentLevel++;
    }
  }
  
  return formattedLines;
}

function isSelfClosingTag(line) {
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
    
    // Skip if content is already an array
    if (Array.isArray(jsonData.content)) {
      log(`  ${filename} already formatted as array`, colors.blue);
      return false;
    }
    
    const originalContent = jsonData.content;
    
    // Convert to array format
    const contentArray = convertContentToArray(originalContent);
    jsonData.content = contentArray;
    
    // Write back to file with proper JSON formatting
    const formattedJSON = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync(filePath, formattedJSON);
    
    log(`  ✅ Converted ${filename} to array format (${contentArray.length} lines)`, colors.green);
    return true;
    
  } catch (error) {
    log(`  ❌ Error processing ${filename}: ${error.message}`, colors.red);
    return false;
  }
}

function main() {
  log(`${colors.bold}🔄 Converting JSON content to readable array format${colors.reset}\n`);
  
  const apiDir = path.join(__dirname, '../api/content');
  
  if (!fs.existsSync(apiDir)) {
    log('❌ API content directory not found!', colors.red);
    return;
  }
  
  const jsonFiles = fs.readdirSync(apiDir).filter(file => file.endsWith('.json'));
  log(`Found ${jsonFiles.length} JSON files to process\n`, colors.blue);
  
  let convertedCount = 0;
  
  jsonFiles.forEach(filename => {
    const filePath = path.join(apiDir, filename);
    log(`Processing ${filename}...`, colors.blue);
    
    if (processJSONFile(filePath, filename)) {
      convertedCount++;
    }
  });
  
  log(`\n${colors.bold}📊 Summary:${colors.reset}`);
  log(`  Files processed: ${jsonFiles.length}`);
  log(`  Files converted: ${convertedCount}`);
  log(`  Files skipped: ${jsonFiles.length - convertedCount}`);
  
  if (convertedCount > 0) {
    log(`\n${colors.green}${colors.bold}🎉 Successfully converted content to array format!${colors.reset}`);
    log(`${colors.green}✅ Content is now properly structured and readable${colors.reset}`);
  } else {
    log(`\n${colors.yellow}ℹ️  All files were already in array format${colors.reset}`);
  }
}

main();