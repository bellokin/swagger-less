const { registerRoute } = require('./swaggerStore');

class SwaggerBuilder {
  constructor(method, path) {
    this.method = method;
    this.path = path;
    this.config = {
      summary: '',
      description: '',
      tags: [],
      params: [],
      requestBody: null,
      responses: {},
      deprecated: false,       // added deprecated flag
      security: []             // added security array
    };
  }

  summary(text) {
    this.config.summary = text;
    return this;
  }

  description(text) {
    this.config.description = text;
    return this;
  }

  tag(tag) {
    this.config.tags.push(tag);
    return this;
  }

  param(location, name, options = {}) {
    this.config.params.push({
      name,
      in: location,
      required: options.required !== false,
      description: options.description || '',
      schema: { type: options.type || 'string' }
    });
    return this;
  }

  body(schema, options = {}) {
    this.config.requestBody = {
      description: options.description || '',
      required: options.required !== false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: Object.entries(schema).reduce((acc, [key, type]) => {
              acc[key] = { type };
              return acc;
            }, {}),
            required: options.requiredFields || Object.keys(schema)
          }
        }
      }
    };
    return this;
  }

  response(code, schema, description = '') {
    const response = { description };

    if (schema) {
      response.content = {
        'application/json': {
          schema: {
            type: 'object',
            properties: Object.entries(schema).reduce((acc, [key, type]) => {
              acc[key] = { type };
              return acc;
            }, {})
          }
        }
      };
    }

    this.config.responses[code] = response;
    return this;
  }

  deprecated() {
    this.config.deprecated = true;
    return this;
  }

  /**
   * Add security requirements.
   * 
   * Example:
   *   .security([{ bearerAuth: [] }])
   *   .security([{ apiKeyAuth: [] }])
   * 
   * @param {Array<Object>} securityArr
   */
  security(securityArr) {
    if (Array.isArray(securityArr)) {
      this.config.security = securityArr;
    }
    return this;
  }

  build() {
    // Register this route for internal swagger merging
    registerRoute(this);
    return (req, res, next) => next();
  }

  getConfig() {
    return {
      method: this.method,
      path: this.path,
      config: this.config
    };
  }
}

function swaggerless(method, path) {
  return new SwaggerBuilder(method, path);
}

module.exports = { swaggerless };
