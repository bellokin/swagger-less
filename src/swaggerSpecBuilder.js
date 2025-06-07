const { getUserSwaggerDefinition } = require('./swaggerConfig');
const { getRegisteredRoutes } = require('./swaggerStore');

function buildSwaggerSpec() {
  const userConfig = getUserSwaggerDefinition();
  const paths = {};

  for (const { method, path, config } of getRegisteredRoutes()) {
    if (!paths[path]) paths[path] = {};
    paths[path][method] = {
      summary: config.summary,
      tags: config.tags,
      parameters: config.params,
      requestBody: config.requestBody,
      responses: config.responses
    };
  }

  return {
    ...userConfig,
    paths
  };
}

module.exports = { buildSwaggerSpec };
