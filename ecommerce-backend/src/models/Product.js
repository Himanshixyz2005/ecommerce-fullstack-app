const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String, required: true }],
    rating: { type: Number, default: 4.5 },
    stock: { type: Number, required: true, default: 10 }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
