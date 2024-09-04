const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida de ejemplo
router.get('/me', auth, (req, res) => {
  res.send(req.user);
});

module.exports = router;