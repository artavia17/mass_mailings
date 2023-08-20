// Routes all
const { Router } = require('express');
const router = Router();

// Moter
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Validadores
const { validarCampos } = require('../middlewares/validators');
const {check } = require('express-validator');

// Middleware
const bearerToken = require('../middlewares/bearerToken');

// Controllers publics

const { login } = require('../controllers/public/LoginController');
const { register } = require('../controllers/public/RegisterController');
const { reset } = require('../controllers/public/ResetPasswordController');
const { newPassword } = require('../controllers/public/NewPasswordController');



const { Home, get_email } = require('../controllers/auth/HomeController');
const { FTPConfig } = require('../controllers/auth/FTPController');
const { ExelUsers, SaveIndividual, UpdateIndividual, DeleteIndividual, GetIndividual, SearchIndividual} = require('../controllers/auth/EmailsUser');
const { SendEmail } = require('../controllers/auth/SendEmail');
const { segurityUser }= require('../controllers/auth/Segurity');

router.post('/register', [
    check('email').isEmail(),
    check('name').not().isEmpty(),
    check('password').not().isEmpty(),
    validarCampos
],register);

router.post('/login', [
    check('email').not().isEmpty(),
    check('password').not().isEmpty(),
    validarCampos
], login);

router.post('/reset-password', [
    check('email').not().isEmpty(),
    validarCampos
], reset);


router.post('/reset-password/:token', [
    check('email').not().isEmpty(),
    check('password').not().isEmpty(),
    check('confirm_password').not().isEmpty(),
    validarCampos
], newPassword);


// Protected routes


//Seguryti users
router.post('/segurity', bearerToken, segurityUser);

// Save html code email
router.post('/home', [
    check('title').not().isEmpty(),
    check('html').not().isEmpty(),
    validarCampos
],bearerToken, Home);

// Get code email
router.get('/home/get', bearerToken, get_email);

// Save config smtp
router.post('/smtp/save', [
    check('transport').not().isEmpty(),
    check('host').not().isEmpty(),
    check('port').not().isEmpty(),
    check('encryption').not().isEmpty(),
    check('username').not().isEmpty(),
    check('password').not().isEmpty(),
    validarCampos
],bearerToken, FTPConfig);


//Save excel users
router.post('/excel-save', bearerToken, upload.single('archivo'), ExelUsers);

// Save contact
router.post('/email/save-individual', [
    check('name').not().isEmpty(),
    check('email').not().isEmpty(),
    validarCampos
],bearerToken, SaveIndividual);

// Update contact
router.put('/email/update-individual', [
    check('name').not().isEmpty(),
    check('email').not().isEmpty(),
    validarCampos
],bearerToken, UpdateIndividual);

// Delete contact
router.delete('/email/delete-individual',bearerToken, DeleteIndividual);

// Get contact
router.get('/email/get-individual',bearerToken, GetIndividual);

// Get contact
router.get('/email/search-individual',[
    check('search').not().isEmpty(),
    validarCampos
],bearerToken, SearchIndividual);


// Send email
router.post('/email/send-email',bearerToken, SendEmail);

module.exports = router;