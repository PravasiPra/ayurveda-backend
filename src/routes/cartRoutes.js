const router = require('express').Router()
const cartController = require('../controllers/cartController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/add', authMiddleware, cartController.addToCart)
router.get('/', authMiddleware, cartController.getCart)
router.delete('/:id', authMiddleware, cartController.removeFromCart)

module.exports = router