const Categories = require('../models/categoriesModel')

const CategoriesController = {
    // get all category
    getAllCategory: async (req, res) => {
        try {
            const categories = await Categories.find()
            res.status(200).json(categories)
        } catch (error) {
            res.status(500).json({ error, message: 'Get all category failed' })
        }
    },
    // get category by id
    getCategoryById: async (req, res) => {
        try {
            const id = req.params.id
            const category = await Categories.findOne({ _id: id })
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
            const category = new Categories({
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
            const category = await Categories.findOne({ _id: id })
            if (!category) {
                return res.status(404).json({ message: 'Not found category to update' })
            }
            const categoryUpdating = await Categories.findByIdAndUpdate(
                { _id: id },
                {
                    name: req.body.name,
                },
                { new: true }
            )
            res.status(200).json({
                category: categoryUpdating,
                message: 'Updated category successfully',
            })
        } catch (error) {
            res.status(500).json({ error, message: 'Update category failed' })
        }
    },
}

module.exports = CategoriesController
