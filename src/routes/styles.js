const express = require('express')
const StylesController = require('../controllers/StylesController')
const router = express.Router()

router.get('/', StylesController.getAllStyle)
router.get('/:id', StylesController.getStyleById)
router.get('/category/:id', StylesController.getStyleByCategory)
router.post('/', StylesController.addStyle)
router.put('/:id', StylesController.updateStyle)
router.delete('/:id', StylesController.removeStyle)

module.exports = router
