const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', require('./routes/authRoutes'))
app.use('/products', require('./routes/productRoutes'))
app.use('/cart', require('./routes/cartRoutes'))
app.use('/orders', require('./routes/orderRoutes'))
app.use('/profile', require('./routes/profileRoutes'))

app.get('/', (req, res) => {
  res.send('Ayurveda API running 🚀')
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})