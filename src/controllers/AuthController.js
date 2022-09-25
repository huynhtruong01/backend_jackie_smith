const User = require('../models/userModel')
const {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
} = require('../utils/common')
const jwt = require('jsonwebtoken')

let refreshTokens = []

const verifyToken = async (token) => {
    try {
        return await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (error) {
        throw new Error(error)
    }
}

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
            const accessToken = generateAccessToken({ id: user._id })
            const refreshToken = generateRefreshToken({ id: user._id })
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
            console.log(error)
            res.status(500).json({ error, message: 'Login failed. Please try again' })
        }
    },
    // login google
    loginGoogle: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email })
            console.log(user)

            if (user) {
                const { password, ...rest } = user._doc
                return res.status(200).json({ user: { ...rest }, message: 'Login google success' })
            }

            const newPassword = req.body.email
            const passwordHashed = await hashPassword(newPassword)

            const newUser = new User({
                fullname: req.body.fullname,
                email: req.body.email,
                password: passwordHashed,
            })

            console.log(newUser)

            await newUser.save()

            const { password, ...rest } = newUser._doc
            console.log(rest)

            res.status(200).json({ user: { ...rest }, message: 'Login google successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Login failed' })
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
    protect: async (req, res, next) => {
        try {
            if (
                !req.headers['authorization'] &&
                !req.headers['authorization'].startsWith('Bearer')
            ) {
                return res.status(401).json({
                    message: 'Not exits token',
                })
            }

            const token = await verifyToken(req.headers['authorization'].split(' ')[1])
            if (!token) {
                return res.status(401).json({
                    message: 'You not logged in! Please login to get access',
                })
            }

            const user = await User.findById(token.id)
            if (!user) {
                return res.status(401).json({
                    message: 'Not exits user. Please register to login!',
                })
            }

            req.user = user

            next()
        } catch (error) {
            res.status(500).json({
                error,
                message: error.message,
            })
        }
    },
    restrictTo: (...roles) => {
        return async (req, res, next) => {
            try {
                if (!roles.includes(req.user.role)) {
                    return res.status(200).json({
                        message: "You don't have permission to access",
                    })
                }

                next()
            } catch (error) {
                res.status(500).json({
                    error,
                    message: error.message,
                })
            }
        }
    },
}

module.exports = AuthController
