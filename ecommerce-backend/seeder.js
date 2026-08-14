const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Product = require('./src/models/Product')
const connectDB = require('./src/config/db')

dotenv.config()
connectDB()

const sampleProducts = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    description:
      'Experience crystal clear sound with active noise cancellation and 30-hour battery life.',
    price: 199.99,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 15
  },
  {
    name: 'Minimalist Smart Watch',
    description:
      'Track your fitness, heart rate, and notifications seamlessly with an elegant design.',
    price: 149.99,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 20
  },
  {
    name: 'Classic Leather Backpack',
    description:
      'Handcrafted genuine leather backpack with dedicated compartment for up to 15-inch laptops.',
    price: 89.99,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 10
  },
  {
    name: 'Ergonomic Running Shoes',
    description:
      'Lightweight, breathable sneakers built for ultimate comfort during long runs.',
    price: 79.99,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 25
  },
  {
    name: 'Ultra HD 4K Webcam',
    description:
      'Professional-grade webcam with auto-focus and crystal clear 4K video for streaming.',
    price: 129.99,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1598075645509-16d37ffc4abf?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 8
  },
  {
    name: 'Premium Organic Skincare Set',
    description:
      'Complete skincare routine with 100% natural and organic ingredients for all skin types.',
    price: 64.99,
    category: 'Beauty',
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 30
  }
]

const seedData = async () => {
  try {
    await Product.deleteMany()
    await Product.insertMany(sampleProducts)
    console.log('Sample Products Imported!')
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

seedData()
