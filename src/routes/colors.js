const express = require('express')
const ColorsController = require('../controllers/ColorsController')
const router = express.Router()

router.get('/', ColorsController.getAllColor)
router.get('/:id', ColorsController.getColorById)
router.post('/', ColorsController.addColor)
router.put('/:id', ColorsController.updateColor)
router.delete('/:id', ColorsController.removeColor)

module.exports = router
