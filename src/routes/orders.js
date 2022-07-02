const express = require('express')
const OrderController = require('../controllers/OrderController')
const router = express.Router()

router.get('/', OrderController.getAllOrder)
router.get('/orders-approved', OrderController.getAllOrderApproved)
router.get('/orders-shipping', OrderController.getAllOrderShipping)
router.get('/orders-success', OrderController.getAllOrderSuccess)
router.get('/:id', OrderController.getOrderById)
router.post('/orders-userid', OrderController.getAllByUserId)
router.post('/', OrderController.addOrder)
router.put('/update-approved/:id', OrderController.updateApproved)
router.put('/update-shipping/:id', OrderController.updateShipping)
router.put('/update-delivery/:id', OrderController.updateSuccessfulDelivery)
router.delete('/:id', OrderController.removeOrder)

module.exports = router
