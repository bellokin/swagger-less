const routes = [];

function registerRoute(builder) {
  routes.push(builder.getConfig());
}

function getRegisteredRoutes() {
  return routes;
}

module.exports = { registerRoute, getRegisteredRoutes };
