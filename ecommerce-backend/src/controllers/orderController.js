const Order = require('../models/Order')
const Cart = require('../models/Cart')

// @desc    Create new order
// @route   POST /api/orders (Matches /api/order requirement)
exports.addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalAmount } = req.body

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' })
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalAmount
    })

    // Clear user cart after successful order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get logged in user orders
// @route   GET /api/orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      'orderItems.product'
    )
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
