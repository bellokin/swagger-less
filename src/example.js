const express = require('express');
const router = express.Router();
const { swaggerless } = require('../swaggerless');


router.post('/login', swaggerless('post', '/login')
  .summary('User login endpoint')
  .tag('bearerAuth')
  .param('header', 'api_key', { required: true, description: 'API key' })
  .body({ username: 'string', password: 'string',userName:'string' }, { description: 'User credentials', required: true })
  .response(200, { token: 'string',name:"string" }, 'Successful login')
  .response(401, null, 'Unauthorized')
  .build(), 
  (req, res) => res.json({ token: 'abc123' })
);
// router.post('/login', swaggerless('post', '/login')
//   .summary('User login endpoint')
//   .tag('Auth')
//   .param('header', 'api_key', { required: true, description: 'API key' })
//   .body({ username: 'string', password: 'string' }, { description: 'User credentials', required: true })
//   .response(200, { token: 'string' }, 'Successful login')
//   .response(401, null, 'Unauthorized')
//   .build(), 
//   (req, res) => res.json({ token: 'abc123' })
// );



 