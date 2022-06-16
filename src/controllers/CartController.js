const { restart } = require('nodemon')
const Cart = require('../models/cartModel')

const CartController = {
    // get all cart
    getAllCart: async (req, res) => {
        try {
            const carts = await Cart.find()
                .populate({
                    path: 'items',
                    populate: {
                        path: 'product',
                    },
                })
                .populate('userId')

            console.log(carts)

            const totalCount = await Cart.countDocuments()

            res.status(200).json({ carts, totalCount })
        } catch (error) {
            res.status(500).json({ error, message: 'Get all cart failed' })
        }
    },
    // get cart by userId
    getCartByUserId: async (req, res) => {
        try {
            const id = req.params.id
            const cart = await Cart.findOne({ userId: id })
                .populate({
                    path: 'items',
                    populate: {
                        path: 'product',
                    },
                })
                .populate('userId')
            if (!cart) {
                return res.status(200).json(undefined)
            }

            res.status(200).json(cart)
        } catch (error) {
            res.status(500).json({ error, message: 'Get cart by id failed' })
        }
    },
    // get by id
    getCartById: async (req, res) => {
        try {
            const id = req.params.id
            const cart = await Cart.findOne({ userId: id })
                .populate({
                    path: 'items',
                    populate: {
                        path: 'product',
                    },
                })
                .populate('userId')
            console.log(cart)
            if (!cart) {
                return res.status(200).json(undefined)
            }

            res.status(200).json(cart)
        } catch (error) {
            res.status(500).json({ error, message: 'Get cart by id failed' })
        }
    },
    // add cart
    addCart: async (req, res) => {
        try {
            // get userId to check
            const userId = req.body.userId
            const item = {
                product: req.body.product,
                quantity: req.body.quantity,
                size: req.body.size,
            }

            // console.log(item)

            const cart = await Cart.findOne({ userId })
            console.log(cart)

            // if have userId, update product and quantity
            if (cart) {
                const products = cart.items.map((item) => item.product + '')
                const getFindProduct = cart.items.find(
                    (x) => x.product == item.product && x.size === item.size
                )
                console.log(getFindProduct)
                if (products.includes(item.product) && getFindProduct?.size === item.size) {
                    const cartUpdated = await Cart.findOneAndUpdate(
                        { userId, items: { $elemMatch: { product: item.product } } },
                        {
                            $set: {
                                'items.$.quantity': getFindProduct.quantity + item.quantity,
                            },
                        },
                        { new: true }
                    )

                    return res.status(200).json({
                        cart: cartUpdated,
                        message: 'Add and update quantity in cart successfully',
                    })
                } else {
                    cart.items.push(item)
                    const saveNewCart = await cart.save()
                    return res
                        .status(200)
                        .json({ cart: saveNewCart, message: 'Add product in cart successfully' })
                }
            } else {
                // otherwise, push into items
                const userId = req.body.userId

                const newCart = new Cart({
                    userId,
                    items: [item],
                })

                const saveNewCart = await newCart.save()

                return res.status(200).json({ cart: saveNewCart, message: 'Add cart successfully' })
            }
        } catch (error) {
            res.status(500).json({ error, message: 'Can not add cart. Please try again' })
        }
    },
    // update quantity cart
    updateQuantity: async (req, res) => {
        try {
            const id = req.body.userId
            const item = {
                product: req.body.product,
                quantity: req.body.quantity,
                size: req.body.size,
            }

            const cart = await Cart.findOne({ userId: id })
            if (cart) {
                const product = cart.items.find(
                    (x) => x.product == item.product && x.size === item.size
                )

                if (product) {
                    const cartUpdated = await Cart.findOneAndUpdate(
                        {
                            userId: id,
                            items: { $elemMatch: { product: item.product, size: item.size } },
                        },
                        {
                            $set: {
                                'items.$.quantity': item.quantity,
                            },
                        },
                        { new: true }
                    )

                    res.status(200).json({
                        cart: cartUpdated,
                        message: 'Update quantity successfully',
                    })
                }
            }
        } catch (error) {
            res.status(500).json({ error, message: 'Set quantity failed' })
        }
    },
    // update cart
    updateCart: async (req, res) => {
        try {
            const id = req.body.userId
            const cart = await Cart.findOne({ userId: id })
            if (!cart) {
                return res
                    .status(404)
                    .json({ message: 'Not found cart by id. Please add new cart' })
            }
            const items = cart.items.filter((item) => item._id != req.body.product)
            console.log(items)
            const cartUpdated = await Cart.findOneAndUpdate(
                { userId: id },
                { items },
                {
                    new: true,
                }
            )

            res.status(200).json({ cart: cartUpdated, message: 'Updated successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Update cart failed' })
        }
    },
    // clear all cart of this user
    removeAllCartItem: async (req, res) => {
        try {
            const id = req.body.userId
            const cart = await Cart.findOne({ userId: id })

            if (cart) {
                await Cart.findOneAndDelete({ userId: id })
                res.status(200).json({ message: 'Delete all cart of this user successfully' })
            }
        } catch (error) {
            res.status(500).json({ error, message: 'Remove all failed' })
        }
    },
    // delete cart
    removeCart: async (req, res) => {
        try {
            const id = req.params.id
            const cart = await Cart.findById({ _id: id })
            if (!cart) {
                return res.status(404).json({ message: 'Not found cart to delete' })
            }

            await Cart.findByIdAndDelete({ _id: id })

            res.status(200).json({ message: 'Delete cart successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Delete cart failed. Please try again' })
        }
    },
}

module.exports = CartController
