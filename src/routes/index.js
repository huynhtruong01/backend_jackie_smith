const express = require('express')
const router = express.Router()
const routerProducts = require('./products')
const routerUsers = require('./users')
const routerCategories = require('./categories')

const routes = [
    router.use('/products', routerProducts),
    router.use('/users', routerUsers),
    router.use('/categories', routerCategories),
]

module.exports = routes
