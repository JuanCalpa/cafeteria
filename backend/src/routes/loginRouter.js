const router = require('./baseRouter');
const productosController = require('../controllers/login/loginController');

router.get('/login', productosController.login);
router.post('/logout', productosController.logout);

module.exports = router;