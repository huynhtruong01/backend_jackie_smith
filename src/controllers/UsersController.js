const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const { hashPassword } = require('../utils/common')

const UsersController = {
    // get all user
    getAllUser: async (req, res) => {
        try {
            const users = await User.find()
            const totalCount = await User.countDocuments()

            res.status(200).json({ users, totalCount })
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

            res.status(200).json({ ...other })
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

            const userAdding = new User({ ...user, password: passwordHashed })
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
            const id = req.params.id
            const userById = await User.findById({ _id: id })

            if (!userById) {
                return res.status(404).json({ message: 'Not found your account' })
            }

            let password
            if (user?.password) {
                password = await hashPassword(user.password)
            } else {
                password = userById.password
            }

            const userUpdated = await User.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        ...user,
                        password,
                    },
                },
                { new: true }
            )
            res.status(200).json({ user: userUpdated, message: 'Updated user successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Updated user failed' })
        }
    },
    updatePassword: async (req, res) => {
        try {
            const id = req.params.id
            const password = req.body.password
            console.log(id, password)

            const user = await User.findById({ _id: id })

            if (!user) {
                return res.status(404).json({ message: 'Not found user' })
            }

            // hash password
            const salt = await bcrypt.genSalt(Number.parseInt(process.env.NUMBER_SALT))
            const passwordHashed = await bcrypt.hash(password, salt)

            await User.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        password: passwordHashed,
                    },
                },
                {
                    new: true,
                }
            )

            res.status(200).json({ message: 'Change password successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Change password failed' })
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
    // check email
    checkEmail: async (req, res) => {
        try {
            const email = req.body.email
            const user = await User.findOne({ email })

            if (!user) {
                return res.status(404).json({
                    error,
                    message: 'Not found your account. Please register to create new account',
                })
            }

            res.status(200).json({ user, message: 'You have account. You can create password' })
        } catch (error) {
            res.status(500).json({
                error,
                message: 'Not found your account. Please register to create new account',
            })
        }
    },
}

module.exports = UsersController
