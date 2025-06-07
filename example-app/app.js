const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { configure, generateSpec } = require('../src/index');
const userConfig = require('./swagger-config');

const app = express();
app.use(express.json());

// Step 1: Provide your config to swaggerless
configure(userConfig);

// Step 2: Register all your swaggerless routes
require('./routes');

// Step 3: Generate Swagger Spec & Serve Docs
const spec = generateSpec();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

// Example: Just to confirm server is alive
app.get('/', (req, res) => {
  res.send('Swaggerless Dev API Running');
});

// Start server
app.listen(3000, () => {
  console.log('🚀 Swaggerless Test App running on http://localhost:3000/api-docs');
});
