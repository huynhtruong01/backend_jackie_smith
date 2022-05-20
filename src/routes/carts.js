const express = require('express')
const CartController = require('../controllers/CartController')
const router = express.Router()

router.get('/', CartController.getAllCart)
router.get('/:id', CartController.getCartById)
router.post('/', CartController.addCart)
router.put('/:id', CartController.updateCart)
router.delete('/:id', CartController.removeCart)

module.exports = router
