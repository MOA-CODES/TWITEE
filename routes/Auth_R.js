const express = require('express');
const router = express.Router();
const auth = require('../middleware/authentication')
const {register, login, logout} = require('../controllers/Auth_C')

router.post('/login', login)
router.post('/register', register)
router.post('/logout', auth, logout)

module.exports = router
