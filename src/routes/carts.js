const express = require('express')
const CartController = require('../controllers/CartController')
const router = express.Router()

router.get('/', CartController.getAllCart)
router.get('/:id', CartController.getCartById)
router.get('/user/:id', CartController.getCartByUserId)
router.post('/', CartController.addCart)
router.post('/update-quantity', CartController.updateQuantity)
router.post('/update-cart', CartController.updateCart)
router.post('/remove-all-cart-item', CartController.removeAllCartItem)
router.delete('/:id', CartController.removeCart)

module.exports = router
