const mongoose = require('mongoose')

const categoriesModel = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
)

const Categories = mongoose.model('Categories', categoriesModel)

module.exports = Categories
