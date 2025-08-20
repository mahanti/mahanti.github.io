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

class JSONEndpointTester {
  constructor() {
    this.apiDir = path.join(__dirname, 'api/content');
    this.pagesDir = path.join(__dirname, '_pages');
    this.results = {
      passed: [],
      failed: [],
      warnings: []
    };
  }

  log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
  }

  async testJSONFile(filename) {
    const filePath = path.join(this.apiDir, filename);
    
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        this.results.failed.push(`${filename}: File does not exist`);
        return false;
      }

      // Read and parse JSON
      const content = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(content);

      // Validate required fields
      const requiredFields = ['layout', 'content', 'permalink'];
      const missingFields = requiredFields.filter(field => !(field in jsonData));
      
      if (missingFields.length > 0) {
        this.results.warnings.push(`${filename}: Missing fields - ${missingFields.join(', ')}`);
      }

      // Check if content is not empty (unless it's intentionally empty)
      if (!jsonData.content || jsonData.content.trim() === '') {
        this.results.warnings.push(`${filename}: Content is empty`);
      }

      // Check permalink format
      if (jsonData.permalink && !jsonData.permalink.startsWith('/')) {
        this.results.warnings.push(`${filename}: Permalink should start with /`);
      }

      this.results.passed.push(`${filename}: Valid JSON structure`);
      return true;

    } catch (error) {
      this.results.failed.push(`${filename}: ${error.message}`);
      return false;
    }
  }

  async findMarkdownFiles() {
    if (!fs.existsSync(this.pagesDir)) {
      this.log('No _pages directory found', colors.yellow);
      return [];
    }

    return fs.readdirSync(this.pagesDir)
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', '.json'));
  }

  async testContentQuality(filename) {
    const filePath = path.join(this.apiDir, filename);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(content);
      
      // Check for common content issues
      const contentStr = jsonData.content || '';
      
      // Check for broken image paths
      const imgMatches = contentStr.match(/src="[^"]*"/g);
      if (imgMatches) {
        imgMatches.forEach(match => {
          const src = match.match(/src="([^"]*)"/)[1];
          if (src.startsWith('/img/') || src.startsWith('/assets/')) {
            const imgPath = path.join(__dirname, src.substring(1));
            if (!fs.existsSync(imgPath)) {
              this.results.warnings.push(`${filename}: Image not found - ${src}`);
            }
          }
        });
      }

      // Check for broken internal links
      const linkMatches = contentStr.match(/href="\/[^"]*"/g);
      if (linkMatches) {
        linkMatches.forEach(match => {
          const href = match.match(/href="([^"]*)"/)[1];
          if (href.startsWith('/') && !href.startsWith('//') && !href.includes('mailto:') && !href.includes('http')) {
            // This is an internal link, should have corresponding page or be external
            const linkedPage = href.substring(1).replace('/', '') || 'index';
            const jsonFile = `${linkedPage}.json`;
            const jsonPath = path.join(this.apiDir, jsonFile);
            
            if (!fs.existsSync(jsonPath)) {
              this.results.warnings.push(`${filename}: Internal link may be broken - ${href}`);
            }
          }
        });
      }

    } catch (error) {
      // Already handled in testJSONFile
    }
  }

  async runTests() {
    this.log(`${colors.bold}🧪 Testing JSON API Endpoints${colors.reset}\n`);

    // Get all JSON files
    const jsonFiles = fs.readdirSync(this.apiDir).filter(file => file.endsWith('.json'));
    
    // Get corresponding markdown files
    const expectedFromMarkdown = await this.findMarkdownFiles();

    this.log(`Found ${jsonFiles.length} JSON files to test`, colors.blue);
    this.log(`Expected ${expectedFromMarkdown.length} files based on markdown\n`, colors.blue);

    // Test each JSON file
    for (const filename of jsonFiles) {
      this.log(`Testing ${filename}...`, colors.blue);
      await this.testJSONFile(filename);
      await this.testContentQuality(filename);
    }

    // Check for missing JSON files that should exist based on markdown
    const missingFiles = expectedFromMarkdown.filter(jsonFile => !jsonFiles.includes(jsonFile));
    if (missingFiles.length > 0) {
      this.results.failed.push(`Missing JSON files: ${missingFiles.join(', ')}`);
    }

    this.displayResults();
  }

  displayResults() {
    this.log(`\n${colors.bold}📊 Test Results${colors.reset}\n`);

    // Passed tests
    if (this.results.passed.length > 0) {
      this.log(`${colors.green}✅ Passed (${this.results.passed.length}):${colors.reset}`);
      this.results.passed.forEach(result => {
        this.log(`  ${result}`, colors.green);
      });
      console.log();
    }

    // Warnings
    if (this.results.warnings.length > 0) {
      this.log(`${colors.yellow}⚠️  Warnings (${this.results.warnings.length}):${colors.reset}`);
      this.results.warnings.forEach(result => {
        this.log(`  ${result}`, colors.yellow);
      });
      console.log();
    }

    // Failed tests
    if (this.results.failed.length > 0) {
      this.log(`${colors.red}❌ Failed (${this.results.failed.length}):${colors.reset}`);
      this.results.failed.forEach(result => {
        this.log(`  ${result}`, colors.red);
      });
      console.log();
    }

    // Summary
    const total = this.results.passed.length + this.results.failed.length;
    const passRate = total > 0 ? Math.round((this.results.passed.length / total) * 100) : 0;

    this.log(`${colors.bold}📈 Summary:${colors.reset}`);
    this.log(`  Total files tested: ${total}`);
    this.log(`  Pass rate: ${passRate}%`);
    this.log(`  Warnings: ${this.results.warnings.length}`);

    if (this.results.failed.length === 0) {
      this.log(`\n${colors.green}${colors.bold}🎉 All tests passed! Your JSON endpoints are ready.${colors.reset}`);
      this.log(`${colors.green}✅ Safe to remove markdown files from _pages${colors.reset}`);
    } else {
      this.log(`\n${colors.red}${colors.bold}🚨 Some tests failed. Fix issues before removing markdown files.${colors.reset}`);
    }
  }
}

// Run the tests
const tester = new JSONEndpointTester();
tester.runTests().catch(console.error);