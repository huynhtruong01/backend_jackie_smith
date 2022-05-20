const User = require('../models/userModel')
const { hashPassword, comparePassword } = require('../utils/common')

const AuthController = {
    // register
    register: async (req, res) => {
        try {
            const password = await hashPassword(req.body.password)
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password,
            })
            await user.save()

            res.status(200).json({ user, message: 'Register user successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Invalid register. Please try again' })
        }
    },
    // login
    login: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username })
            if (!user) {
                return res.status(404).json({ message: 'Wrong username. Please try again' })
            }

            const isPasswordEqual = await comparePassword(req.body.password, user.password)
            if (!isPasswordEqual) {
                return res.status(403).json({ message: 'Wrong password. Please try again' })
            }

            const { password, ...other } = user._doc

            res.status(200).json({ user: { ...other }, message: 'Login successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Login failed. Please try again' })
        }
    },
}

module.exports = AuthController
