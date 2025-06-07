# swagger-less

> 🧼 A clean, programmatic way to define Swagger/OpenAPI documentation for Express.js routes — no JSDoc comments, no YAML, no clutter.

---

## ✨ Features

* ✅ Programmatic Swagger config attached directly to your Express routes
* 🚫 No JSDoc comments needed
* 🔁 Reusable, composable structure
* 📄 Automatically supports route parameters, request bodies, and responses
* 🔐 Supports `.security()` for JWT/API key-based auth
* 🛑 Supports `.deprecated()` flagging
* 🔎 Clean and intuitive chaining API

---

## 📦 Installation

```bash
npm install swagger-less
```

---

## 🧠 Concept

Instead of cluttering your codebase with verbose Swagger comments or YAML files, `swagger-less` lets you define documentation using a fluent builder API:

```js
swaggerless('post', '/api/user/login')
  .summary('Login user')
  .description('Authenticates a user and returns a JWT')
  .tag('Authentication')
  .body({ email: 'string', password: 'string' }, { description: 'User credentials' })
  .response(200, { token: 'string' }, 'Login successful')
  .build()
```

---

## 🚀 Basic Usage

### 1. Define Routes with Swagger Metadata

```js
 
const { swaggerless } = require('swagger-less');
const router = express.Router();
 
router.post(
  '/login',
  swaggerless('post', '/api/auth/login')
    .summary('User login')
    .description('Log in a user and return a JWT')
    .tag('Auth')
    .body({ email: 'string', password: 'string' })
    .response(200, { token: 'string' }, 'Login successful')
    .response(401, null, 'Invalid credentials')
    .security([{ bearerAuth: [] }])
    .build(),
  controller.login
);

module.exports = router;
```

---

### 2. Set Up Global Swagger Metadata in `main.js`

```js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { configure, generateSpec } = require('swagger-less');
const routes = require('./routes');

const app = express();

// ✅ Global Swagger metadata setup
configure({
  openapi: '3.0.0',
  info: {
    title: 'Your API',
    version: '1.0.0',
    description: 'Auto-generated Swagger docs from swagger-less',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local dev' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
});

app.use(express.json());
app.use('/api', routes);

// 📄 Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(generateSpec()));

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## 🧱 Full Builder API

| Method                                 | Description                          |
| -------------------------------------- | ------------------------------------ |
| `.summary(text)`                       | Summary of the endpoint              |
| `.description(text)`                   | Full description                     |
| `.tag(name)`                           | Tag for grouping endpoints           |
| `.param(location, name, options)`      | Define query/path/header param       |
| `.body(schema, options)`               | Define request body with type object |
| `.response(code, schema, description)` | Add a response                       |
| `.deprecated()`                        | Mark route as deprecated             |
| `.security(schemes)`                   | Add security (e.g., JWT bearerAuth)  |
| `.build()`                             | Finalize and register the route      |

---

## 🔧 Param Examples

```js
.param('query', 'limit', { type: 'integer', required: false, description: 'Number of items' })
.param('path', 'id', { type: 'string', required: true, description: 'Resource ID' })
```

---

## 🔐 Security Example

Add `.security()` to your route:

```js
.security([{ bearerAuth: [] }])
```

And define the scheme globally using `configure()`:

```js
configure({
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
});
```

---

## ♻ Reusable Route Template Example

You can define reusable builder templates:

```js
// shared/swaggerTemplates.js
const { swaggerless } = require('swagger-less');

function authPostRoute(path, summary, bodySchema, responses = {}) {
  const builder = swaggerless('post', path)
    .summary(summary)
    .tag('Auth')
    .body(bodySchema)
    .security([{ bearerAuth: [] }]);

  for (const [code, desc] of Object.entries(responses)) {
    builder.response(parseInt(code), null, desc);
  }

  return builder;
}

module.exports = { authPostRoute };
```

Use it in your route files:

```js
// routes.js
const { authPostRoute } = require('./shared/swaggerTemplates');

router.post(
  '/refresh',
  authPostRoute('/api/auth/refresh', 'Refresh JWT', { token: 'string' }, {
    200: 'Token refreshed',
    401: 'Invalid token'
  }).build(),
  controller.refreshToken
);
```

---

## 🧹 CLI (Legacy/Optional)

A deprecated CLI exists for static comment injection, though `swagger-less` now works at runtime with `configure()` + `generateSpec()`:

```bash
npx swagger-less -i ./src/routes.js -o ./src/routes.injected.js
```

*Not recommended unless you're generating static documentation for legacy reasons.*

---

## 📄 License

MIT © [Code-Hashira](https://www.npmjs.com/~code-hashira)

---
 