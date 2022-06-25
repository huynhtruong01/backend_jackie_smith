const express = require('express')
const OrderController = require('../controllers/OrderController')
const router = express.Router()

router.get('/', OrderController.getAllOrder)
router.get('/:id', OrderController.getOrderById)
router.post('/', OrderController.addOrder)
// router.put('/:id', OrderController.updateOrder)
router.delete('/:id', OrderController.removeOrder)

module.exports = router
