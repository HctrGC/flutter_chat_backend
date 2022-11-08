/*

    path: api/login

*/

const {Router} = require('express');
const { check } = require('express-validator');

const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarJWT } = require('../helpers/validar_jwt');
const { validarCampos } = require('../middlewares/validar_campos');
const router = Router();

// CONFIGURACIÓN DE RUTAS

// Nuevo usuario
router.post('/new', [
    // Middlewares
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], crearUsuario);

// Login
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
], login);

router.get('/renew', validarJWT, renewToken);


module.exports = router;