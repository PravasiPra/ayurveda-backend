const router = require('express').Router()
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/checkout', authMiddleware, orderController.checkout)
router.get('/', authMiddleware, orderController.getOrders)

module.exports = router