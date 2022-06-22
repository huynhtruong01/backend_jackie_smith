const Category = require('../models/categoryModel')
const Style = require('../models/styleModel')
const CategoriesController = require('./CategoriesController')

const StylesController = {
    getAllStyle: async (req, res) => {
        try {
            const styles = await Style.find().populate('products').populate('category')
            const totalCount = await Style.countDocuments()

            res.status(200).json({ styles, totalCount })
        } catch (error) {
            res.status(500).json({ error, message: 'Get all style failed' })
        }
    },
    getStyleById: async (req, res) => {
        try {
            const id = req.params.id
            const style = await Style.findById({ _id: id })
                .populate('products')
                .populate('category')

            if (!style) {
                res.status(404).json({ message: 'Not found style by id' })
                return
            }

            res.status(200).json(style)
        } catch (error) {
            res.status(500).json({ error, message: 'Get by id style failed' })
        }
    },
    addStyle: async (req, res) => {
        try {
            const name = req.body.name

            const category = await Category.findOne({ name: req.body.category })
            const style = new Style({
                name,
                category: category._id,
            })

            await style.save()

            res.status(200).json({ style, message: 'Add style successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Add style failed' })
        }
    },
    updateStyle: async (req, res) => {
        try {
            const id = req.params.id
            console.log(req.params.id, req.body.name)

            const categoryName = await Category.findOne({ name: req.body.category })

            const style = await Style.findByIdAndUpdate(
                { _id: id },
                {
                    name: req.body.name,
                    category: categoryName._id,
                },
                {
                    new: true,
                }
            )

            res.status(200).json({ style, message: 'Update style successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Update style failed' })
        }
    },
    removeStyle: async (req, res) => {
        try {
            const id = req.params.id
            await Style.findByIdAndDelete({ _id: id })
            res.status(200).json({ message: 'Delete style successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Delete style failed' })
        }
    },
}

module.exports = StylesController
