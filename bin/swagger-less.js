#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parseRoutes } = require('../src/parser');
const { generateSwaggerComment } = require('../src/commentGenerator');
const { program } = require('commander');

program
  .option('-i, --input <path>', 'Input file path', './src/example.js')
  .option('-o, --output <path>', 'Output file path', './src/example.injected.js')
  .parse(process.argv);

const options = program.opts();

function processFile(inputPath, outputPath) {
  try {
    const content = fs.readFileSync(inputPath, 'utf8');
    const routes = parseRoutes(inputPath);
    
    if (routes.length === 0) {
      console.log('No swaggerless routes found');
      return;
    }

    const routeComments = {};
    routes.forEach(route => {
      routeComments[`${route.method} ${route.path}`] = 
        generateSwaggerComment(route);
    });

    const lines = content.split('\n');
    const outputLines = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      
      // Look for router.METHOD() calls
      const routeMatch = line.match(/router\.(get|post|put|delete|patch)\(['"`]([^'"`]+)/);
      if (routeMatch) {
        const method = routeMatch[1];
        const path = routeMatch[2];
        const key = `${method} ${path}`;
        
        // Check if we have a comment for this route
        if (routeComments[key]) {
          // Ensure we haven't already added this comment
          const prevLines = outputLines.slice(-5).join('\n');
          if (!prevLines.includes(`@swagger\n * ${path}:`)) {
            outputLines.push(routeComments[key]);
          }
        }
      }
      
      outputLines.push(line);
      i++;
    }

    fs.writeFileSync(outputPath, outputLines.join('\n'), 'utf8');
    console.log(`✅ Generated Swagger docs in ${outputPath}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Resolve paths and process file
const inputPath = path.resolve(options.input);
const outputPath = path.resolve(options.output);
processFile(inputPath, outputPath);