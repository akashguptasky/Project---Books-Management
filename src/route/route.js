const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const auth = require('../auth/auth')

router.post('/register', userController.registration);
router.post('/login', userController.login);

router.post('/books',auth.tokenverification, bookController.createBook);
// router.get('/books',bookController);










module.exports = router;