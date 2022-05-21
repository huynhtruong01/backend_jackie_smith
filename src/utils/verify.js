const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const verifyToken = async (req, res, next) => {
    try {
        const hasToken = req.headers.token
        if (!hasToken) {
            return res.status(404).json({ message: 'You are not authenticate' })
        }

        const token = hasToken.split(' ')[1]

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error) {
                return res.status(403).json({ message: 'Invalid token' })
            }

            next()
        })
    } catch (error) {
        res.status(500).json({ error, message: 'Verify failed' })
    }
}

const verifyTokenAndIsAdmin = async (req, res, next) => {
    try {
        const hasToken = req.headers.token
        if (!hasToken) {
            return res.status(404).json({ message: 'You are not authenticate' })
        }

        const token = hasToken.split(' ')[1]

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
            if (error) {
                return res.status(403).json({ message: 'Invalid token' })
            }

            const hasUser = await User.findById({ _id: user.id })
            if (!hasUser) {
                return res.status(404).json({ message: 'Not found this user' })
            }

            const isAdmin = hasUser.isAdmin
            if (!isAdmin) {
                return res.status(403).json({ message: 'You are not admin' })
            }

            next()
        })
    } catch (error) {
        res.status(500).json({ error, message: 'Verify token failed or you are not admin' })
    }
}

module.exports = {
    verifyToken,
    verifyTokenAndIsAdmin,
}
