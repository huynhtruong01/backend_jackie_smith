const Order = require('../models/orderModel')
const Product = require('../models/productModel')

const OrderController = {
    // get all order
    getAllOrder: async (req, res) => {
        try {
            const orders = await Order.find()
                .populate({
                    path: 'items',
                    populate: {
                        path: 'product',
                    },
                })
                .populate('userId')

            const totalCount = await Order.countDocuments()
            const newOrders = orders.filter((order) => order.mode === 'successful delivery')

            res.status(200).json({ orders: newOrders, totalCount })
        } catch (error) {
            res.status(500).json({ error, message: 'Get all order failed' })
        }
    },
    getAllOrderApproved: async (req, res) => {
        try {
            const orders = await Order.find()
                .populate({
                    path: 'items',
                    populate: {
                        path: 'product',
                    },
                })
                .populate('userId')

            const totalCount = await Order.countDocuments()
            const newOrders = orders.filter(
                (order) => order.mode === 'approves' || order.mode === 'approved'
            )

            res.status(200).json({ orders: newOrders, totalCount })
        } catch (error) {
            res.status(500).json({ error, message: 'Get all order failed' })
        }
    },
    // get all order successful
    getAllOrderSuccess: async (req, res) => {
        try {
            const orders = await Order.find()
                .populate({
                    path: 'items',
                    populate: {
                        path: 'product',
                    },
                })
                .populate('userId')

            const totalCount = await Order.countDocuments()
            const newOrders = orders.filter((order) => order.mode === 'successful delivery')

            res.status(200).json({ orders: newOrders, totalCount })
        } catch (error) {
            res.status(500).json({ error, message: 'Get all order failed' })
        }
    },
    // get all by userId
    getAllByUserId: async (req, res) => {
        try {
            console.log(req.body)
            const orders = await Order.find({ userId: req.body.userId })
            const newOrders = orders.filter(
                (order) => order.mode === 'approves' || order.mode === 'approved'
            )

            res.status(200).json({
                orders: newOrders,
                message: 'Get all order by userId successfully',
            })
        } catch (error) {
            res.status(500).json({ error, message: 'Get all order by userId failed' })
        }
    },
    // get order by id
    getOrderById: async (req, res) => {
        try {
            const id = req.params.id
            const order = await Order.findById({ _id: id })
                .populate({
                    path: 'items',
                    populate: {
                        path: 'product',
                    },
                })
                .populate('userId')

            if (!order) {
                return res.status(404).json({ message: 'Not found this order' })
            }

            res.status(200).json(order)
        } catch (error) {
            res.status(500).json({ error, message: 'Get order by id failed' })
        }
    },
    // get all order shipping
    getAllOrderShipping: async (req, res) => {
        try {
            const orders = await Order.find()
                .populate({
                    path: 'items',
                    populate: {
                        path: 'product',
                    },
                })
                .populate('userId')

            const newOrders = orders.filter((order) => order.mode === 'approved')

            res.status(200).json({ orders: newOrders })
        } catch (error) {
            res.status(500).json({ error, message: 'Get all order shipping failed' })
        }
    },
    // add order
    addOrder: async (req, res) => {
        try {
            console.log(req.body)
            // get order by userId, item
            const userId = req.body.userId

            const productList = req.body.productList
            const quantity = Number.parseInt(req.body.totalQuantity)
            const price = Number.parseInt(req.body.totalPrice)
            const address = req.body.address

            // const order = await Order.findOne({ userId })
            // // console.log('Order', order)
            // if (order) {
            //     const newProductList = productList.map((item) => {
            //         return {
            //             product: item.product._id,
            //             quantity: item.quantity,
            //             size: item.size,
            //         }
            //     })

            //     order.items.push(...newProductList)
            //     const totalQuantity = order.totalQuantity + quantity
            //     const totalPrice = order.totalPrice + price
            //     const numberInvoice = order.numberInvoice + 1

            //     const orderUpdate = await Order.findOneAndUpdate(
            //         { userId },
            //         {
            //             $set: {
            //                 items: order.items,
            //                 totalQuantity,
            //                 totalPrice,
            //                 numberInvoice,
            //                 address,
            //             },
            //         },
            //         {
            //             new: true,
            //         }
            //     )

            //     res.status(200).json({
            //         order: orderUpdate,
            //         message: 'Add product and quantity successfully',
            //     })
            // } else {
            // otherwise, create order
            const newProductList = req.body.productList.map((item) => {
                return {
                    product: item.product,
                    quantity: item.quantity,
                    size: item.size,
                }
            })

            // console.log(newProductList)
            const newOrder = new Order({
                userId,
                fullname: req.body.fullname,
                email: req.body.email,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                items: [...newProductList],
                totalPrice: price,
                totalQuantity: quantity,
                isCheckout: req.body.isCheckout,
                mode: req.body.mode,
            })

            // console.log('newOrder', newOrder)

            const saveNewOrder = await newOrder.save()

            return res
                .status(200)
                .json({ order: saveNewOrder, message: 'Added order successfully' })
            // }
        } catch (error) {
            res.status(500).json({ error, message: 'Added order failed. Please try again' })
        }
    },
    // update order
    // updateOrder: async (req, res) => {
    //     try {
    //         const id = req.params.id

    //         const order = await Order.findById({ _id: id })

    //         if (!order) {
    //             return res.status(404).json({ message: 'Not found order to update' })
    //         }

    // const items = order.items.filter(
    //     (item) => String(item.product) !== String(req.body.product)
    // )

    // const quantity = order.items.find((x) => String(x.product) == String(req.body.product))
    // const product = await Product.findById({ _id: req.body.product })
    // const priceProduct = Number.parseInt(product.salePrice) * Number.parseInt(quantity)

    // console.log(quantity)
    // const orderUpdated = await Order.findByIdAndUpdate(
    //     { _id: req.params.id },
    //     {
    //         $set: {
    //             items: items,
    //             totalPrice: Number.parseInt(order.totalPrice) - priceProduct,
    //         },
    //     },
    //     {
    //         new: true,
    //     }
    // )

    //         res.status(200).json({ order: orderUpdated, message: 'Updated order success' })
    //     } catch (error) {
    //         res.status(500).json({ error, message: 'Updated order failed' })
    //     }
    // },
    // update approved
    updateApproved: async (req, res) => {
        try {
            const id = req.params.id
            const order = await Order.findById({ _id: id })

            if (!order) {
                return res.status(404).json({ message: 'Not found this order' })
            }

            await Order.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        mode: req.body.mode,
                    },
                },
                {
                    new: true,
                }
            )

            res.status(200).json({ message: 'Update approved successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Update approved failed' })
        }
    },
    // update shipping
    updateShipping: async (req, res) => {
        try {
            const id = req.params.id
            const order = await Order.findById({ _id: id })

            if (!order) {
                return res.status(404).json({ message: 'Not found this order' })
            }

            await Order.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        mode: req.body.mode,
                        isCheckout: req.body.isCheckout,
                    },
                },
                {
                    new: true,
                }
            )

            res.status(200).json({ message: 'Update mode shipping successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Update mode shipping failed' })
        }
    },
    // update mode successful delivery
    updateSuccessfulDelivery: async (req, res) => {
        try {
            const id = req.params.id
            const order = await Order.findById({ _id: id })

            if (!order) {
                return res.status(404).json({ message: 'Not found this order' })
            }

            await Order.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        mode: req.body.mode,
                    },
                },
                {
                    new: true,
                }
            )

            res.status(200).json({ message: 'Update approved successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Update approved failed' })
        }
    },
    // delete order
    removeOrder: async (req, res) => {
        try {
            const id = req.params.id
            const order = await Order.findById({ _id: id })

            if (!order) {
                return res.status(500).json({ message: 'Not found order to delete' })
            }

            await Order.findByIdAndDelete({ _id: id })
            res.status(200).json({ message: 'Deleted order successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Delete order failed' })
        }
    },
}

module.exports = OrderController
