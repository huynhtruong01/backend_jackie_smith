const User = require('../models/userModel')
const {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
} = require('../utils/common')
const jwt = require('jsonwebtoken')

let refreshTokens = []

const AuthController = {
    // register
    register: async (req, res) => {
        try {
            const password = await hashPassword(req.body.password)
            const user = new User({ ...req.body, password })
            await user.save()

            res.status(200).json({ user, message: 'Register user successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Invalid register. Please try again' })
        }
    },
    // login
    login: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(404).json({ message: 'Not found this user' })
            }

            const isPasswordEqual = await comparePassword(req.body?.password, user.password)
            if (!req.body?.email || !isPasswordEqual) {
                return res
                    .status(403)
                    .json({ message: 'Wrong email or password. Please try again' })
            }

            // generate jwt
            const accessToken = generateAccessToken({ id: user._id, email: user.email })
            const refreshToken = generateRefreshToken({ id: user._id, email: user.email })
            refreshTokens.push(refreshToken)

            // save refreshToken into cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            })

            const { password, ...other } = user._doc

            res.status(200).json({
                user: { ...other },
                accessToken,
                refreshToken,
                message: 'Login successfully',
            })
        } catch (error) {
            res.status(500).json({ error, message: 'Login failed. Please try again' })
        }
    },
    // request refresh token
    requestRefreshToken: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                return res.status(404).json({ message: 'Not authenticated' })
            }

            if (!refreshTokens.includes(refreshToken)) {
                return res.status(403).json({ message: 'Token is not valid' })
            }

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
                if (error) {
                    return res.status(500).json({ error })
                }

                refreshTokens = refreshToken.filter((x) => x !== refreshToken)
                const newAccessToken = generateAccessToken(user)
                const newRefreshToken = generateRefreshToken(user)

                refreshTokens.push(refreshToken)
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                })

                res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
            })
        } catch (error) {
            res.status(500).json({ message: 'Request refresh token failed' })
        }
    },
    // logout
    logout: async (req, res) => {
        try {
            refreshTokens = refreshTokens.filter((x) => x !== req.body.token)
            res.clearCookie('refreshToken')

            res.status(200).json({ message: 'Logout successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Logout failed' })
        }
    },
}

module.exports = AuthController
