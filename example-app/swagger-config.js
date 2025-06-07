module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Swaggerless Test API',
    version: '1.0.0',
    description: 'Example of Swaggerless Runtime Docs',
    contact: {
      name: 'Your Name',
      email: 'your_email@example.com'
    }
  },
  servers: [
    {
      url: `http://localhost:${process.env.SERVER_PORT || 3000}`,
      description: 'Development server'
    },
    {
      url: 'https://neuralearn-node-js-backend.onrender.com',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      BearerAuth: []
    }
  ]
};
