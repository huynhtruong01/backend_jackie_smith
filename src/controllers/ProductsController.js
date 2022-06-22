const Category = require('../models/categoryModel')
const Color = require('../models/colorModel')
const Product = require('../models/productModel')
const Style = require('../models/styleModel')
const FeatureApi = require('../utils/features')

const ProductsController = {
    // get all products
    getAllProducts: async (req, res) => {
        try {
            const features = new FeatureApi(
                Product.find().populate('category').populate('style').populate('color'),
                req.query
            )
                .pagination()
                .sorting()
                .search()
                .filtering()

            console.log(req.query, features.querystring)

            const data = await Promise.allSettled([
                features.query,
                Product.count(features.querystring),
            ])
            const products = data[0].status === 'fulfilled' ? data[0].value : []
            const totalCount = data[1].status === 'fulfilled' ? data[1].value : 0

            res.status(200).json({ products, totalCount })
        } catch (error) {
            res.status(500).json({ error, message: 'Get all product failed' })
        }
    },
    // get product by id
    getProductById: async (req, res) => {
        try {
            const id = req.params.id
            const product = await Product.findById({ _id: id })
                .populate('category')
                .populate('style')
                .populate('color')

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
                originalPrice,
                salePrice,
                promotionPercent,
                category,
                color,
                style,
            } = req.body

            const urlImage = `${req.protocol}://${req.get('host')}/${req.file.path
                .split('\\')
                .slice(1)
                .join('/')}`

            if (!category) {
                return res.status(404).json({ message: 'Not found category to add' })
            }

            // get category by name
            const categoryName = await Category.findOne({ name: category })

            // get color by name
            const colorName = await Color.findOne({ name: color })

            // get style by name
            const styleName = await Style.findOne({ name: style })

            if (!categoryName || !styleName || !colorName) {
                return res.status(404).json({ message: 'Not found category by name' })
            }

            const product = new Product({
                name,
                description,
                image: urlImage,
                originalPrice,
                salePrice,
                promotionPercent,
                category: categoryName._id,
                color: colorName._id,
                style: styleName._id,
            })
            const saveProduct = await product.save()

            // push product into category
            await categoryName.updateOne({ $push: { products: saveProduct._id } })
            await colorName.updateOne({ $push: { products: saveProduct._id } })
            await styleName.updateOne({ $push: { products: saveProduct._id } })

            res.status(200).json({ product, message: 'Add product successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Add product failed' })
            console.log(error)
        }
    },
    // update product
    updateProduct: async (req, res) => {
        try {
            const id = req.params.id
            const {
                name,
                description,
                originalPrice,
                salePrice,
                promotionPercent,
                category,
                color,
                style,
            } = req.body

            let image

            if (!req.file) {
                image = req.body.image
            } else {
                const urlImage = `${req.protocol}://${req.get('host')}/${req.file.path
                    .split('\\')
                    .slice(1)
                    .join('/')}`
                image = urlImage
            }

            // get category by name
            const categoryId = await Category.findOne({ name: category })
            // get style by name
            const styleId = await Style.findOne({ name: style })
            // get color by name
            const colorId = await Color.findOne({ name: color })

            if (!categoryId) {
                return res.status(404).json({ message: 'Not found category by name' })
            }

            const productUpdated = await Product.findByIdAndUpdate(
                { _id: id },
                {
                    name,
                    description,
                    image,
                    originalPrice,
                    salePrice,
                    promotionPercent,
                    category: categoryId?._id,
                    color: colorId?._id,
                    style: styleId?._id,
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
