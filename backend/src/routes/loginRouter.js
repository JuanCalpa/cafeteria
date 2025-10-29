const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login/loginController');

router.post('/login', loginController.login);
router.post('/logout', loginController.logout);
router.post('/registro', loginController.registro);

module.exports = router;
