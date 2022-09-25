const mongoose = require('mongoose')

const userModel = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ['admin', 'user', 'leader-guide', 'guide'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', userModel)

// async function getIndex() {
//     const index = await User.collection.getIndexes()
//     return index
// }

// User.collection.dropIndex('phoneNumber_1')
// console.log(getIndex())

module.exports = User
