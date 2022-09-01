const express = require('express')
const CheckoutController = require('../controllers/CheckoutController')
const router = express.Router()

router.post('/payment', CheckoutController.payment)

module.exports = router
