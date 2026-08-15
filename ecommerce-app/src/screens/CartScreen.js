import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

import API from '../services/api'

export default function CartScreen ({ navigation }) {
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(true)
  const [updatingProduct, setUpdatingProduct] = useState(null)

  useFocusEffect(
    useCallback(() => {
      fetchCart()
    }, [])
  )

  const fetchCart = async () => {
    try {
      setLoading(true)

      const response = await API.get('/cart')

      setCart(response.data || { items: [] })
    } catch (error) {
      console.log('Cart fetch error:', error.response?.data || error.message)

      setCart({ items: [] })
    } finally {
      setLoading(false)
    }
  }

  const calculateSubtotal = () => {
    return (cart?.items || []).reduce(
      (total, item) =>
        total + Number(item.product?.price || 0) * Number(item.quantity || 0),
      0
    )
  }

  const calculateItemCount = () => {
    return (cart?.items || []).reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    )
  }

  const updateQuantity = async (productId, change) => {
    const item = cart?.items?.find(entry => entry.product?._id === productId)

    if (!item) return

    const nextQuantity = Number(item.quantity) + change

    if (nextQuantity <= 0) {
      removeItem(productId)
      return
    }

    setUpdatingProduct(productId)

    // Optimistic UI update
    const updatedItems = cart.items.map(entry =>
      entry.product?._id === productId
        ? {
            ...entry,
            quantity: nextQuantity
          }
        : entry
    )

    setCart({
      ...cart,
      items: updatedItems
    })

    try {
      await API.post('/cart', {
        productId,
        quantity: change
      })
    } catch (error) {
      console.log('Quantity sync error:', error.response?.data || error.message)

      await fetchCart()
    } finally {
      setUpdatingProduct(null)
    }
  }

  const removeItem = async productId => {
    const previousCart = cart

    const updatedItems = (cart?.items || []).filter(
      entry => entry.product?._id !== productId
    )

    setCart({
      ...cart,
      items: updatedItems
    })

    setUpdatingProduct(productId)

    try {
      await API.post('/cart', {
        productId,
        quantity: -999
      })
    } catch (error) {
      console.log('Remove sync error:', error.response?.data || error.message)

      setCart(previousCart)

      Alert.alert(
        'Unable to remove',
        'The item could not be removed. Please try again.'
      )
    } finally {
      setUpdatingProduct(null)
    }
  }

  const handleCheckout = () => {
    if (!cart?.items || cart.items.length === 0) {
      Alert.alert(
        'Your cart is empty',
        'Add some products before checking out.'
      )

      return
    }

    navigation.navigate('Checkout', {
      cart
    })
  }

  const renderCartItem = ({ item }) => {
    const product = item.product

    if (!product) return null

    const price = Number(product.price || 0)

    const quantity = Number(item.quantity || 0)

    const itemTotal = price * quantity

    const isUpdating = updatingProduct === product._id

    return (
      <View style={styles.itemCard}>
        {/* IMAGE */}

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate('ProductDetail', {
              product,
              relatedProducts: cart.items
                .map(entry => entry.product)
                .filter(Boolean)
            })
          }
        >
          {product.images?.[0] ? (
            <Image
              source={{
                uri: product.images[0]
              }}
              style={styles.itemImage}
              resizeMode='cover'
            />
          ) : (
            <View style={styles.itemImagePlaceholder}>
              <Ionicons name='image-outline' size={28} color='#a78bfa' />
            </View>
          )}
        </TouchableOpacity>

        {/* INFORMATION */}

        <View style={styles.itemInfo}>
          <Text style={styles.itemCategory} numberOfLines={1}>
            {product.category || 'Collection'}
          </Text>

          <Text style={styles.itemName} numberOfLines={2}>
            {product.name}
          </Text>

          <Text style={styles.itemPrice}>${price.toFixed(2)}</Text>

          {/* QUANTITY */}

          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(product._id, -1)}
              disabled={isUpdating}
              activeOpacity={0.8}
            >
              <Ionicons name='remove' size={15} color='#475569' />
            </TouchableOpacity>

            <Text style={styles.quantityValue}>{quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(product._id, 1)}
              disabled={isUpdating}
              activeOpacity={0.8}
            >
              <Ionicons name='add' size={15} color='#475569' />
            </TouchableOpacity>

            {isUpdating && (
              <ActivityIndicator
                size='small'
                color='#7c3aed'
                style={styles.itemLoader}
              />
            )}
          </View>
        </View>

        {/* RIGHT SIDE */}

        <View style={styles.itemRight}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeItem(product._id)}
            disabled={isUpdating}
            activeOpacity={0.8}
          >
            <Ionicons name='trash-outline' size={17} color='#ef4444' />
          </TouchableOpacity>

          <Text style={styles.itemTotal}>${itemTotal.toFixed(2)}</Text>
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <View style={styles.loaderCard}>
          <View style={styles.loaderIcon}>
            <Ionicons name='cart-outline' size={27} color='#7c3aed' />
          </View>

          <ActivityIndicator size='small' color='#7c3aed' />

          <Text style={styles.loadingText}>Loading your cart...</Text>
        </View>
      </View>
    )
  }

  const items = cart?.items || []

  const isEmpty = items.length === 0

  const subtotal = calculateSubtotal()

  const itemCount = calculateItemCount()

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>YOUR SHOPPING BAG</Text>

          <Text style={styles.title}>My cart</Text>

          {!isEmpty && (
            <Text style={styles.itemCountText}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'} ready for
              checkout
            </Text>
          )}
        </View>

        {!isEmpty && (
          <View style={styles.cartIcon}>
            <Ionicons name='bag-handle-outline' size={21} color='#7c3aed' />
          </View>
        )}
      </View>

      {isEmpty ? (
        /* EMPTY CART */
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name='cart-outline' size={42} color='#7c3aed' />
          </View>

          <Text style={styles.emptyTitle}>Your cart is waiting</Text>

          <Text style={styles.emptyDescription}>
            Looks like you haven't added anything yet. Discover something you'll
            love.
          </Text>

          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Shop')}
            activeOpacity={0.85}
          >
            <Ionicons name='search-outline' size={18} color='#ffffff' />

            <Text style={styles.shopButtonText}>Start shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          {/* CART LIST */}

          <FlatList
            data={items}
            keyExtractor={item => item._id || item.product?._id}
            renderItem={renderCartItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />

          {/* SUMMARY */}

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View>
                <Text style={styles.summaryEyebrow}>ORDER SUMMARY</Text>

                <Text style={styles.summaryTitle}>Your total</Text>
              </View>

              <View style={styles.freeShippingBadge}>
                <Ionicons name='car-outline' size={13} color='#166534' />

                <Text style={styles.freeShippingText}>FREE DELIVERY</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>

              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>

              <Text style={styles.freeText}>Free</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Total</Text>

                <Text style={styles.totalSubtext}>Inclusive of shipping</Text>
              </View>

              <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutText}>Proceed to checkout</Text>

              <View style={styles.checkoutIcon}>
                <Ionicons name='arrow-forward' size={18} color='#7c3aed' />
              </View>
            </TouchableOpacity>

            <View style={styles.secureRow}>
              <Ionicons
                name='shield-checkmark-outline'
                size={14}
                color='#64748b'
              />

              <Text style={styles.secureText}>
                Secure checkout • Free delivery
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ff',
    paddingTop: 45,
    paddingHorizontal: 18
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f3ff'
  },

  loaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 35,
    paddingVertical: 30,
    alignItems: 'center',
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5
  },

  loaderIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: '#f4f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },

  loadingText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18
  },

  eyebrow: {
    color: '#7c3aed',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 4
  },

  title: {
    color: '#111827',
    fontSize: 29,
    fontWeight: '800'
  },

  itemCountText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4
  },

  cartIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 7
    },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4
  },

  content: {
    flex: 1
  },

  listContent: {
    paddingBottom: 12
  },

  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 21,
    padding: 11,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eeeaff',
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 7
    },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3
  },

  itemImage: {
    width: 82,
    height: 94,
    borderRadius: 15,
    backgroundColor: '#f1f5f9'
  },

  itemImagePlaceholder: {
    width: 82,
    height: 94,
    borderRadius: 15,
    backgroundColor: '#f4f3ff',
    justifyContent: 'center',
    alignItems: 'center'
  },

  itemInfo: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 5
  },

  itemCategory: {
    color: '#7c3aed',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },

  itemName: {
    color: '#111827',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    marginBottom: 5
  },

  itemPrice: {
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 9
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: '#f4f3ff',
    justifyContent: 'center',
    alignItems: 'center'
  },

  quantityValue: {
    minWidth: 30,
    textAlign: 'center',
    color: '#111827',
    fontSize: 12,
    fontWeight: '800'
  },

  itemLoader: {
    marginLeft: 7
  },

  itemRight: {
    height: 94,
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },

  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center'
  },

  itemTotal: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '800'
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 60
  },

  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 29,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 19
  },

  emptyTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8
  },

  emptyDescription: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: 22
  },

  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#7c3aed',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.23,
    shadowRadius: 12,
    elevation: 4
  },

  shopButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 7
  },

  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eeeaff',
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 5
  },

  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },

  summaryEyebrow: {
    color: '#7c3aed',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 3
  },

  summaryTitle: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '800'
  },

  freeShippingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6
  },

  freeShippingText: {
    color: '#166534',
    fontSize: 8,
    fontWeight: '800',
    marginLeft: 4
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9
  },

  summaryLabel: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600'
  },

  summaryValue: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700'
  },

  freeText: {
    color: '#16a34a',
    fontSize: 13,
    fontWeight: '800'
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#eef2f7',
    marginVertical: 7
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },

  totalLabel: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800'
  },

  totalSubtext: {
    color: '#94a3b8',
    fontSize: 9,
    marginTop: 2
  },

  totalValue: {
    color: '#7c3aed',
    fontSize: 22,
    fontWeight: '800'
  },

  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 15,
    paddingLeft: 18,
    paddingRight: 7,
    paddingVertical: 7,
    shadowColor: '#7c3aed',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5
  },

  checkoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8
  },

  checkoutIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },

  secureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },

  secureText: {
    color: '#94a3b8',
    fontSize: 9,
    marginLeft: 5
  }
})
