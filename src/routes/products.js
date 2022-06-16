const express = require('express')
const ProductsController = require('../controllers/ProductsController')
const upload = require('../utils/upload')
const router = express.Router()

router.get('/', ProductsController.getAllProducts)
router.get('/:id', ProductsController.getProductById)
router.post('/', upload.single('image'), ProductsController.addProduct)
router.put('/:id', upload.single('image'), ProductsController.updateProduct)
router.delete('/:id', ProductsController.removeProduct)

module.exports = router
