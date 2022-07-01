const express = require('express')
const CheckoutController = require('../controllers/checkoutController')
const router = express.Router()

router.post('/payment', CheckoutController.payment)

module.exports = router
