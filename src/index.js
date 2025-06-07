// index.js
const { swaggerless } = require('./builder');
const { configure } = require('./swaggerConfig');
const { buildSwaggerSpec } = require('./swaggerSpecBuilder');

module.exports = {
  swaggerless,
  configure,
  generateSpec: buildSwaggerSpec
};
