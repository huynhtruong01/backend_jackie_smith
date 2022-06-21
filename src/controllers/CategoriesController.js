const Category = require('../models/categoryModel')
const Product = require('../models/productModel')

const CategoriesController = {
    // get all category
    getAllCategory: async (req, res) => {
        try {
            const categories = await Category.find().populate('products')
            const totalCount = await Category.countDocuments()

            res.status(200).json({ categories, totalCount })
        } catch (error) {
            res.status(500).json({ error, message: 'Get all category failed' })
        }
    },
    // get category by id
    getCategoryById: async (req, res) => {
        try {
            const id = req.params.id
            const category = await Category.findOne({ _id: id }).populate('products')
            if (!category) {
                return res.status(404).json({ message: 'Not found this category' })
            }
            res.status(200).json(category)
        } catch (error) {
            res.status(500).json({ error, message: 'Get category by id failed' })
        }
    },
    // add category
    addCategory: async (req, res) => {
        try {
            const category = new Category({
                name: req.body.name,
            })
            await category.save()
            res.status(200).json({ category, message: 'Add category successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Add category failed' })
        }
    },
    // update category
    updateCategory: async (req, res) => {
        try {
            const id = req.params.id
            const category = await Category.findOne({ _id: id })
            if (!category) {
                return res.status(404).json({ message: 'Not found category to update' })
            }
            const categoryUpdated = await Category.findByIdAndUpdate(
                { _id: id },
                {
                    name: req.body.name,
                },
                { new: true }
            )
            res.status(200).json({
                category: categoryUpdated,
                message: 'Updated category successfully',
            })
        } catch (error) {
            res.status(500).json({ error, message: 'Update category failed' })
        }
    },
    //delete category
    removeCategory: async (req, res) => {
        try {
            const id = req.params.id
            await Product.updateMany({ category: id }, { category: null })
            await Category.findByIdAndDelete({ _id: id })

            res.status(200).json({ message: 'Delete category successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Delete this category failed' })
        }
    },
}

module.exports = CategoriesController
