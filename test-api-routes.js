#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Routes from the SPA (updated)
const routes = {
  '/': 'index',
  '/work': 'work',
  '/products': 'products',
  '/photos': 'photos',
  '/about': 'about',
  
  // Work pages
  '/work/block': 'proto',
  '/work/angellist': 'angellist',
  '/work/square': 'square',
  '/work/ando': 'ando',
  '/work/sidecar': 'sidecar',
  
  // Product pages
  '/products/approach': 'approach',
  '/products/sudo': 'sudo',
  '/products/circuit': 'circuit',
  '/products/jot': 'jot',
  '/products/terraforms': 'terraforms',
  '/products/proto': 'proto',
  
  // Photo pages
  '/photos/harvest': 'harvest',
  '/photos/pch': 'pch'
};

function main() {
  log(`${colors.bold}🧪 Testing API route mappings${colors.reset}\n`);
  
  const apiDir = path.join(__dirname, 'api/content');
  let passCount = 0;
  let failCount = 0;
  
  Object.entries(routes).forEach(([route, pageId]) => {
    const jsonFile = `${pageId}.json`;
    const filePath = path.join(apiDir, jsonFile);
    
    if (fs.existsSync(filePath)) {
      log(`✅ ${route} → api/content/${jsonFile}`, colors.green);
      passCount++;
    } else {
      log(`❌ ${route} → api/content/${jsonFile} (NOT FOUND)`, colors.red);
      failCount++;
    }
  });
  
  log(`\n${colors.bold}📊 Results:${colors.reset}`);
  log(`  ✅ Working routes: ${passCount}`, colors.green);
  log(`  ❌ Broken routes: ${failCount}`, colors.red);
  
  if (failCount === 0) {
    log(`\n${colors.green}${colors.bold}🎉 All routes are properly mapped!${colors.reset}`);
  } else {
    log(`\n${colors.yellow}${colors.bold}⚠️  Some routes need attention${colors.reset}`);
  }
  
  // Check for orphaned JSON files
  log(`\n${colors.bold}🔍 Checking for orphaned JSON files:${colors.reset}`);
  const jsonFiles = fs.readdirSync(apiDir).filter(f => f.endsWith('.json'));
  const expectedFiles = Object.values(routes).map(id => `${id}.json`);
  const orphaned = jsonFiles.filter(file => !expectedFiles.includes(file));
  
  if (orphaned.length > 0) {
    log(`${colors.yellow}⚠️  Orphaned files (no route mapping):${colors.reset}`);
    orphaned.forEach(file => {
      log(`  - ${file}`, colors.yellow);
    });
  } else {
    log(`${colors.green}✅ No orphaned files found${colors.reset}`);
  }
}

main();