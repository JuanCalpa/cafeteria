const router = require('./baseRouter');
const multer = require('multer');
const comprobanteController = require('../controllers/comprobante/comprobanteController');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB - ajustar según necesidad
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('Sólo se permiten imágenes'));
  }
});

// rutas
router.post('/createComprobante', upload.single('comprobante'), comprobanteController.createComprobante);
router.get('/getComprobante/:id_confirmacion', comprobanteController.getComprobante);
router.get('/getComprobanteFile/:id_confirmacion', comprobanteController.getComprobanteFile);

module.exports = router;