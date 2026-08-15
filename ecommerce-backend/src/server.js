const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'E-Commerce API is running successfully!' })
})
const orderRoutes = require('./routes/orderRoutes')

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/cart', require('./routes/cartRoutes'))
app.use('/api/orders', orderRoutes)
app.use('/api/order', orderRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
