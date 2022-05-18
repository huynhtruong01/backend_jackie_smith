const Products = require('../models/productsModel')

const ProductsController = {
    // get all products
    getAllProducts: async (req, res) => {
        try {
            const data = Products.find()
        } catch (error) {
            res.status(500).json({ error, message: 'Get all product failed' })
        }
    },
    // get product by id
    getProductById: async (req, res) => {
        try {
            const id = req.params.id
            const product = await Products.findById({ _id: id })
            if (!product) {
                return res.status(404).json({ message: 'Not found this product' })
            }
            res.status(200).json(product)
        } catch (error) {
            res.status(500).json({ error, message: 'Get product by id failed' })
        }
    },
    // add product
    addProduct: async (req, res) => {
        try {
            const {
                name,
                description,
                image,
                originalPrice,
                salePrice,
                promotionPercent,
                category,
                color,
                style,
                bestSeller,
            } = req.body

            const product = new Products({
                name,
                description,
                image,
                originalPrice,
                salePrice,
                promotionPercent,
                category,
                color,
                style,
                bestSeller,
            })

            await product.save()
            res.status(200).json({ product, message: 'Add product successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Add product failed' })
        }
    },
    // update product
    updateProduct: async (req, res) => {
        try {
            const id = req.params.id
            const {
                name,
                description,
                image,
                originalPrice,
                salePrice,
                promotionPercent,
                category,
                color,
                style,
                bestSeller,
            } = req.body
            const productUpdated = await Products.findByIdAndUpdate(
                { _id: id },
                {
                    name,
                    description,
                    image,
                    originalPrice,
                    salePrice,
                    promotionPercent,
                    category,
                    color,
                    style,
                    bestSeller,
                }
            )

            res.status(200).json({
                product: productUpdated,
                message: 'Updated product successfully',
            })
        } catch (error) {
            res.status(500).json({ error, message: 'Update product failed' })
        }
    },
    // delete product
    removeProduct: async (req, res) => {
        try {
            const id = req.params.id
            const product = await Products.findOne({ _id: id })
            if (!product) {
                return res.status(404).json({ message: 'Not found product to delete' })
            }
            await Products.findByIdAndDelete({ _id: id })
            res.status(200).json({ message: 'Delete product successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Delete product failed' })
        }
    },
}

module.exports = ProductsController
