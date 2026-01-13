const express = require('express');
const multer = require('multer');
const verificarRol = require('./intermedios/verificarRol');
const comprobanteController = require('../controllers/comprobante/comprobanteController');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/createComprobante', upload.single('comprobante'), comprobanteController.createComprobante);

router.get('/getComprobante/:id_confirmacion', comprobanteController.getComprobante);

router.get('/getComprobanteFile/:id_confirmacion', verificarRol(['administrador']), comprobanteController.getComprobanteFile);

router.get('/comprobante/:id_confirmacion', comprobanteController.getComprobanteFile);

router.get('/welcome', comprobanteController.welcome);

module.exports = router;
