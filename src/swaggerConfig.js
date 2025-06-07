let userSwaggerDefinition = null;

function configure(def) {
  userSwaggerDefinition = def;
}

function getUserSwaggerDefinition() {
  if (!userSwaggerDefinition) {
    throw new Error("Swagger config not defined. Call swaggerless.configure({...})");
  }
  return userSwaggerDefinition;
}

module.exports = { configure, getUserSwaggerDefinition };
