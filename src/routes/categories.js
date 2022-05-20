const express = require('express')
const CategoriesController = require('../controllers/CategoriesController')
const router = express.Router()

router.get('/', CategoriesController.getAllCategory)
router.get('/:id', CategoriesController.getCategoryById)
router.post('/', CategoriesController.addCategory)
router.put('/:id', CategoriesController.updateCategory)
router.delete('/:id', CategoriesController.removeCategory)

module.exports = router
