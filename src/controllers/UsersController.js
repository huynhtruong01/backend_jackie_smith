const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const { hashPassword } = require('../utils/common')

const UsersController = {
    // get all user
    getAllUser: async (req, res) => {
        try {
            const users = await User.find()
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json({ error, message: 'Get all user failed' })
        }
    },
    // get user by id
    getUserById: async (req, res) => {
        try {
            const id = req.params.id
            const user = await User.findById({ _id: id })
            if (!user) {
                return res.status(404).json({ message: 'Not found this user' })
            }
            const { password, ...other } = user._doc
            res.status(200).json(other)
        } catch (error) {
            res.status(500).json({ error, message: 'Get user by id failed' })
        }
    },
    // add user
    addUser: async (req, res) => {
        try {
            const user = req.body
            const salt = await bcrypt.genSalt(Number.parseInt(process.env.NUMBER_SALT))
            const passwordHashed = await bcrypt.hash(user.password, salt)
            const userAdding = new User({
                username: user.username,
                email: user.email,
                password: passwordHashed,
            })
            await userAdding.save()
            res.status(200).json({ user: userAdding, message: 'Add user successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Added user failed' })
        }
    },
    // update user
    updateUser: async (req, res) => {
        try {
            const user = req.body
            console.log(user)
            const id = req.params.id
            const password = await hashPassword(user.password)
            const userUpdated = await Users.findOneAndUpdate(
                { _id: id },
                {
                    username: user.username,
                    password,
                },
                { new: true }
            )
            res.status(200).json({ user: userUpdated, message: 'Updated user successfully' })
        } catch (error) {
            req.status(500).json({ error, message: 'Updated user failed' })
        }
    },
    // remove user
    removeUser: async (req, res) => {
        try {
            const id = req.params.id
            const user = await User.findOne({ _id: id })
            if (!user) {
                return res.status(404).json({ message: 'Not found user to delete' })
            }
            await User.findByIdAndDelete({ _id: id })
            res.status(200).json({ message: 'Delete user successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Delete user failed' })
        }
    },
}

module.exports = UsersController
