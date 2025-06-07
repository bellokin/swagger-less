// swagger-middleware.js
const fs = require('fs');
const path = require('path');

function swaggerDocsCollector(app, options = {}) {
  const docs = {
    openapi: '3.0.0',
    info: {
      title: options.title || 'API Documentation',
      version: options.version || '1.0.0'
    },
    paths: {},
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  };

  // Middleware to collect docs from routes
  app.use((req, res, next) => {
    if (req._swaggerDoc) {
      Object.assign(docs.paths, req._swaggerDoc);
    }
    next();
  });

  // Endpoint to serve the generated spec
  app.get('/swagger.json', (req, res) => {
    res.json(docs);
  });

  // Optionally serve Swagger UI
  if (options.serveUI !== false) {
    const swaggerUi = require('swagger-ui-express');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs));
  }
}

module.exports = swaggerDocsCollector;