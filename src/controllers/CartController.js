const { restart } = require('nodemon')
const Cart = require('../models/cartModel')

const CartController = {
    // get all cart
    getAllCart: async (req, res) => {
        try {
            const carts = await Cart.find().populate({
                path: 'items',
                populate: {
                    path: 'product',
                },
            })

            const totalCount = await Cart.countDocuments()

            res.status(200).json({ carts, totalCount })
        } catch (error) {
            res.status(500).json({ error, message: 'Get all cart failed' })
        }
    },
    // get cart by id
    getCartById: async (req, res) => {
        try {
            const id = req.params.id
            const cart = await Cart.findOne({ userId: id }).populate({
                path: 'items',
                populate: {
                    path: 'product',
                },
            })
            if (!cart) {
                return res.status(404).json({ message: 'Not found this cart' })
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
            }

            const cart = await Cart.findOne({ userId })
            console.log(cart)

            // if have userId, update product and quantity
            if (cart) {
                const products = cart.items.map((item) => item.product + '')
                if (products.includes(item.product)) {
                    const cartUpdated = await Cart.findOneAndUpdate(
                        { userId, items: { $elemMatch: { product: item.product } } },
                        {
                            $set: {
                                'items.$.quantity': item.quantity,
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
    // update cart
    updateCart: async (req, res) => {
        try {
            const id = req.params.id
            const cart = await Cart.findById({ _id: id })
            if (!cart) {
                return res
                    .status(404)
                    .json({ message: 'Not found cart by id. Please add new cart' })
            }
            const items = cart.items.filter((item) => item.product != req.body.product)
            const cartUpdated = await Cart.findByIdAndUpdate(
                { _id: id },
                { userId: cart.userId, items: items },
                {
                    new: true,
                }
            )

            res.status(200).json({ cart: cartUpdated, message: 'Updated successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Update cart failed' })
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
