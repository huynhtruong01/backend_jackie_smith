const express = require('express')
const UsersController = require('../controllers/UsersController')
const router = express.Router()

router.get('/', UsersController.getAllUser)
router.get('/:id', UsersController.getUserById)
router.post('/', UsersController.addUser)
router.put('/:id', UsersController.updateUser)
router.delete('/:id', UsersController.removeUser)

module.exports = router
