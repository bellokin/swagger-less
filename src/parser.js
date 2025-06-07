const fs = require('fs');

function parseRoutes(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const routeRegex = /router\.(get|post|put|delete|patch)\(['"`]([^'"`]+)['"`]\s*,\s*swaggerless\(['"`]([^'"`]+)['"`]\s*,\s*['"`]([^'"`]+)['"`]\)([\s\S]*?)\.build\(\)/g;
  
  const routes = [];
  let match;

  while ((match = routeRegex.exec(content)) !== null) {
    const method = match[1].toLowerCase();
    const path = match[2];
    const builderChain = match[5];
    
    const config = parseBuilderChain(builderChain);
    routes.push({ method, path, config });
  }

  return routes;
}

function parseBuilderChain(chain) {
  const config = {
    summary: '',
    tags: [],
    params: [],
    responses: {},
    requestBody: null
  };

  // Extract summary
  const summaryMatch = chain.match(/\.summary\(['"`]([^'"`]+)['"`]\)/);
  if (summaryMatch) config.summary = summaryMatch[1];

  // Extract tags
  const tagMatches = chain.match(/\.tag\(['"`]([^'"`]+)['"`]\)/g) || [];
  config.tags = tagMatches.map(t => t.match(/['"`]([^'"`]+)['"`]/)[1]);

  // Extract parameters - improved parsing
  const paramRegex = /\.param\(['"`]([^'"`]+)['"`]\s*,\s*['"`]([^'"`]+)['"`]\s*,\s*({[^}]*})/g;
  let paramMatch;
  while ((paramMatch = paramRegex.exec(chain)) !== null) {
    try {
      // Clean and parse the options object
      const optionsStr = paramMatch[3]
        .replace(/'/g, '"')  // Replace single quotes with double quotes
        .replace(/(\w+):/g, '"$1":');  // Wrap property names in quotes
      
      const options = JSON.parse(optionsStr);
      config.params.push({
        name: paramMatch[2],
        in: paramMatch[1],
        required: options.required !== false,
        description: options.description || '',
        schema: { type: options.type || 'string' }
      });
    } catch (e) {
      console.error('Error parsing param:', e);
      console.log('Problematic param string:', paramMatch[3]);
    }
  }

  // Extract request body - improved parsing
  const bodyRegex = /\.body\(({[^}]*})\s*,\s*({[^}]*})/g;
  const bodyMatch = bodyRegex.exec(chain);
  if (bodyMatch) {
    try {
      // Clean and parse the schema and options
      const schemaStr = bodyMatch[1]
        .replace(/'/g, '"')
        .replace(/(\w+):/g, '"$1":');
      
      const optionsStr = bodyMatch[2]
        .replace(/'/g, '"')
        .replace(/(\w+):/g, '"$1":');
      
      const schema = JSON.parse(schemaStr);
      const options = JSON.parse(optionsStr);
      
      config.requestBody = {
        description: options.description || '',
        required: options.required !== false,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: Object.entries(schema).reduce((acc, [key, type]) => {
                acc[key] = { type: typeof type === 'string' ? type : 'string' };
                return acc;
              }, {}),
              required: options.requiredFields || Object.keys(schema)
            }
          }
        }
      };
    } catch (e) {
      console.error('Error parsing body:', e);
      console.log('Problematic body schema:', bodyMatch[1]);
      console.log('Problematic body options:', bodyMatch[2]);
    }
  }

  // Extract responses - improved parsing
  const responseRegex = /\.response\((\d+)\s*,\s*({[^}]*}|null)\s*(?:,\s*['"`]([^'"`]*)['"`])?/g;
  let responseMatch;
  while ((responseMatch = responseRegex.exec(chain)) !== null) {
    try {
      const code = responseMatch[1];
      const schemaStr = responseMatch[2] !== 'null' 
        ? responseMatch[2]
            .replace(/'/g, '"')
            .replace(/(\w+):/g, '"$1":')
        : null;
      const description = responseMatch[3] || '';
      
      config.responses[code] = { description };
      if (schemaStr) {
        const schema = JSON.parse(schemaStr);
        config.responses[code].content = {
          'application/json': { 
            schema: { 
              type: 'object', 
              properties: Object.entries(schema).reduce((acc, [key, type]) => {
                acc[key] = { type: typeof type === 'string' ? type : 'string' };
                return acc;
              }, {})
            }
          }
        };
      }
    } catch (e) {
      console.error('Error parsing response:', e);
      console.log('Problematic response schema:', responseMatch[2]);
    }
  }

  return config;
}

module.exports = { parseRoutes };