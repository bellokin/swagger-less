const express = require('express');
const router = express.Router();
const { swaggerless } = require('../swaggerless');


/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login endpoint
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: api_key
 *         in: header
 *         required: true
 *         description: API key
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
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
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login endpoint
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: api_key
 *         in: header
 *         required: true
 *         description: API key
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
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



 