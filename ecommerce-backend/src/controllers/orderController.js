const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')

// @desc    Create new order
// @route   POST /api/orders
exports.addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress } = req.body

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        message: 'No order items'
      })
    }

    if (
      !shippingAddress?.address?.trim() ||
      !shippingAddress?.city?.trim() ||
      !shippingAddress?.postalCode?.trim() ||
      !shippingAddress?.country?.trim()
    ) {
      return res.status(400).json({
        message: 'Complete shipping address is required'
      })
    }

    let calculatedTotal = 0
    const normalizedItems = []

    for (const item of orderItems) {
      if (!item.product || !item.quantity || Number(item.quantity) <= 0) {
        return res.status(400).json({
          message: 'Invalid order item'
        })
      }

      const product = await Product.findById(item.product)

      if (!product) {
        return res.status(404).json({
          message: 'One or more products were not found'
        })
      }

      const quantity = Number(item.quantity)

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `${product.name} does not have enough stock`
        })
      }

      calculatedTotal += product.price * quantity

      normalizedItems.push({
        product: product._id,
        quantity,
        price: product.price
      })
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: normalizedItems,
      shippingAddress: {
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country.trim()
      },
      totalAmount: Number(calculatedTotal.toFixed(2))
    })

    // Reduce product stock
    for (const item of normalizedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      })
    }

    // Clear cart after successful order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] })

    return res.status(201).json(order)
  } catch (error) {
    console.error('Create order error:', error)

    return res.status(500).json({
      message: 'Unable to create order'
    })
  }
}

// @desc    Get logged in user orders
// @route   GET /api/orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id
    })
      .populate('orderItems.product')
      .sort({ createdAt: -1 })

    return res.json(orders)
  } catch (error) {
    console.error('Get orders error:', error)

    return res.status(500).json({
      message: 'Unable to fetch orders'
    })
  }
}
