const express = require('express')
const AuthController = require('../controllers/AuthController')
const { verifyToken } = require('../utils/verify')
const router = express.Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/refresh', AuthController.requestRefreshToken)
router.post('/logout', verifyToken, AuthController.logout)

module.exports = router
