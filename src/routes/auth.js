const express = require('express')
const passport = require('passport')
const AuthController = require('../controllers/AuthController')
const { verifyToken } = require('../utils/verify')
const router = express.Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/login-google', AuthController.loginGoogle)
router.post('/refresh', AuthController.requestRefreshToken)
router.post('/logout', verifyToken, AuthController.logout)

// passport
router.get('/login/success', (req, res) => {
    if (req.user) {
        return res.status(200).json({
            success: true,
            message: 'successful',
            user: req.user,
        })
    }

    res.status(404).json({ error: true, message: 'Not Authorized' })
})

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'failure',
    })
})

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get(
    '/google/callback',
    passport.authenticate('google', {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: '/login/failed',
    })
)

// google login

module.exports = router
