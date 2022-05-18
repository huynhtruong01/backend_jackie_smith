const express = require('express')
const ProductsController = require('../controllers/ProductsController')
const router = express.Router()

router.get('/', ProductsController.getAllProducts)
router.get('/:id', ProductsController.getProductById)
router.post('/', ProductsController.addProduct)
router.put('/:id', ProductsController.updateProduct)
router.delete('/:id', ProductsController.removeProduct)

module.exports = router
