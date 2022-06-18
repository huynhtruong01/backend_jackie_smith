const Style = require('../models/styleModel')

const StylesController = {
    getAllStyle: async (req, res) => {
        try {
            const styles = await Style.find().populate('product')
            const totalCount = await Style.countDocuments()

            res.status(200).json({ styles, totalCount })
        } catch (error) {
            res.status(500).json({ error, message: 'Get all style failed' })
        }
    },
    getStyleById: async (req, res) => {
        try {
            const id = req.params.id
            const style = await Style.findById({ _id: id }).populate('product')
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
            const style = new Style({
                name,
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
            const name = req.body.name

            const style = Style.findByIdAndUpdate(
                { _id: id },
                {
                    name,
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
