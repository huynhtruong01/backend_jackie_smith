const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const FeatureApi = require('../utils/features')

const ProductsController = {
    // get all products
    getAllProducts: async (req, res) => {
        try {
            const features = new FeatureApi(Product.find(), req.query)
                .pagination()
                .sorting()
                .search()
                .filtering()

            const data = await Promise.allSettled([features.query, Product.countDocuments()])
            const products = data[0].status === 'fulfilled' ? data[0].value : []
            const count = data[1].status === 'fulfilled' ? data[1].value : 0

            res.status(200).json({ products, count })
        } catch (error) {
            res.status(500).json({ error, message: 'Get all product failed' })
        }
    },
    // get product by id
    getProductById: async (req, res) => {
        try {
            const id = req.params.id
            const product = await Product.findById({ _id: id }).populate('category')
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

            if (!category) {
                return res.status(404).json({ message: 'Not found category to add' })
            }

            // get category by name
            const categoryByName = await Category.findOne({ name: category })
            if (!categoryByName) {
                return res.status(404).json({ message: 'Not found category by name' })
            }

            const product = new Product({
                name,
                description,
                image,
                originalPrice,
                salePrice,
                promotionPercent,
                category: categoryByName._id,
                color,
                style,
                bestSeller,
            })
            const saveProduct = await product.save()

            // push product into category
            await categoryByName.updateOne({ $push: { products: saveProduct._id } })

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
            const productUpdated = await Product.findByIdAndUpdate(
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
            const product = await Product.findOne({ _id: id })
            if (!product) {
                return res.status(404).json({ message: 'Not found product to delete' })
            }

            // delete product by id in array of category
            await Category.updateOne(
                { _id: product.category },
                {
                    $pullAll: {
                        products: [id],
                    },
                }
            )

            // delete product
            await Product.findByIdAndDelete({ _id: id })

            res.status(200).json({ message: 'Delete product successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Delete product failed' })
        }
    },
}

module.exports = ProductsController
