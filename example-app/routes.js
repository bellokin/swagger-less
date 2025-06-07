const express = require('express');
const { swaggerless } = require('../src/index');
const router = express.Router();

// Route 1: Login with Bearer token in header
router.post('/login', swaggerless('post', '/login')
  .summary('Login User')
  .tag('Auth')
  .param('header', 'authorization', { required: true, description: 'Bearer token' })
  .body(
    { username: 'string', password: 'string', sample: 'integer' },
    { description: 'Login payload', required: true }
  )
  .response(200, { token: 'string', body: 'answer' }, 'Success')
  .response(401, null, 'Unauthorized')
  .build(),
  (req, res) => {
    res.json({ token: 'abc123' });
  }
);

// Route 2: Upload a file with form-data
router.post('/upload', swaggerless('post', '/upload')
  .summary('Upload a File')
  .tag('Uploads')
  .param('formData', 'file', { required: true, description: 'File to upload', type: 'file' })
  .param('formData', 'description', { required: false, description: 'Optional file description' })
  .response(200, { message: 'string', fileUrl: 'string' }, 'File uploaded successfully')
  .response(400, null, 'Bad Request')
  .build(),
  (req, res) => {
    res.json({ message: 'Upload successful', fileUrl: '/uploads/myfile.png' });
  }
);

module.exports = router;
