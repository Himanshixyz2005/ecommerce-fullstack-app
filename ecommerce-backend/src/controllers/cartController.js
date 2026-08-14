const Cart = require('../models/Cart')

// @desc    Get user cart
// @route   GET /api/cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product'
    )
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] })
    }
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Add product to cart
// @route   POST /api/cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const normalizedQuantity = Number(quantity) || 1

    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [
          {
            product: productId,
            quantity: normalizedQuantity > 0 ? normalizedQuantity : 1
          }
        ]
      })
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      )

      if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + normalizedQuantity
        if (newQuantity <= 0) {
          cart.items.splice(itemIndex, 1)
        } else {
          cart.items[itemIndex].quantity = newQuantity
        }
      } else if (normalizedQuantity > 0) {
        cart.items.push({ product: productId, quantity: normalizedQuantity })
      }

      await cart.save()
    }

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product'
    )
    res.json(updatedCart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
