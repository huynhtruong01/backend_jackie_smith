const Color = require('../models/colorModel')

const ColorsController = {
    getAllColor: async (req, res) => {
        try {
            const colors = await Color.find().populate('products')
            const totalCount = await Color.countDocuments()

            res.status(200).json({ colors, totalCount })
        } catch (error) {
            res.status(500).json({ error, message: 'Get all color failed' })
        }
    },
    getColorById: async (req, res) => {
        try {
            const id = req.params.id
            const color = await Color.findById({ _id: id }).populate('products')

            if (!color) {
                res.status(404).json({ message: 'Not found color by id' })
                return
            }

            res.status(200).json(color)
        } catch (error) {
            res.status(500).json({ error, message: 'Get by id color failed' })
        }
    },
    addColor: async (req, res) => {
        try {
            const name = req.body.name
            const color = new Color({
                name,
            })

            await color.save()

            res.status(200).json({ color, message: 'Add color successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Add color failed' })
        }
    },
    updateColor: async (req, res) => {
        try {
            const id = req.params.id
            const name = req.body.name

            const color = await Color.findByIdAndUpdate(
                { _id: id },
                {
                    name,
                },
                {
                    new: true,
                }
            )

            res.status(200).json({ color, message: 'Update color successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Update color failed' })
        }
    },
    removeColor: async (req, res) => {
        try {
            const id = req.params.id
            await Color.findByIdAndDelete({ _id: id })
            res.status(200).json({ message: 'Delete color successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Delete color failed' })
        }
    },
}

module.exports = ColorsController
