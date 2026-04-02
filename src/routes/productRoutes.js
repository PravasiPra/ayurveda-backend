const router = require('express').Router()
const productController = require('../controllers/productController')
const authMiddleware = require('../middleware/authMiddleware')

// Protected routes
router.get('/', authMiddleware, productController.getProducts)
router.get('/:id', authMiddleware, productController.getProductById)

module.exports = router