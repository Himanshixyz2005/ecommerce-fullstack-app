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

  useFocusEffect(
    useCallback(() => {
      fetchCart()
    }, [])
  )

  const fetchCart = async () => {
    try {
      const response = await API.get('/cart')
      setCart(response.data || { items: [] })
    } catch (error) {
      setCart({ items: [] })
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0
    return cart.items.reduce(
      (acc, item) => acc + (item.product?.price || 0) * item.quantity,
      0
    )
  }

  const updateQuantity = async (productId, change) => {
    const item = cart?.items?.find(entry => entry.product?._id === productId)
    if (!item) return

    const nextQuantity = item.quantity + change
    if (nextQuantity <= 0) {
      removeItem(productId)
      return
    }

    // Optimistic UI update for speed
    const updatedItems = cart.items.map(entry =>
      entry.product?._id === productId
        ? { ...entry, quantity: nextQuantity }
        : entry
    )
    setCart({ ...cart, items: updatedItems })

    try {
      await API.post('/cart', { productId, quantity: change })
    } catch (error) {
      console.log('Sync error, re-fetching cart')
      fetchCart()
    }
  }

  const removeItem = productId => {
    const updatedItems = (cart?.items || []).filter(
      entry => entry.product?._id !== productId
    )
    setCart({ ...cart, items: updatedItems })

    try {
      API.post('/cart', { productId, quantity: -999 })
    } catch (error) {
      console.log('Delete sync error')
    }
  }

  const handleCheckout = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Add some items before checking out.')
      return
    }

    navigation.navigate('Checkout', { cart })
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size='large' color='#4f46e5' />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My cart</Text>

      {!cart || !cart.items || cart.items.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name='cart-outline' size={64} color='#9ca3af' />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart.items}
            keyExtractor={item => item._id || item.product?._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                <Image
                  source={{ uri: item.product?.images?.[0] }}
                  style={styles.itemImage}
                  resizeMode='cover'
                />

                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.product?.name}
                  </Text>
                  <Text style={styles.itemPrice}>
                    ${Number(item.product?.price || 0).toFixed(2)}
                  </Text>

                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => updateQuantity(item.product?._id, -1)}
                    >
                      <Text style={styles.qtyText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => updateQuantity(item.product?._id, 1)}
                    >
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeItem(item.product?._id)}
                >
                  <Ionicons name='trash-outline' size={18} color='#ef4444' />
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                ${calculateTotal().toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ${calculateTotal().toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>Proceed to checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 20
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 18
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600'
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0px 4px 12px rgba(15, 23, 42, 0.05)',
    elevation: 2
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: '#f1f5f9'
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4
  },
  itemPrice: {
    color: '#4f46e5',
    fontWeight: '800',
    fontSize: 15,
    marginBottom: 10
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  qtyText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 18
  },
  qtyValue: {
    minWidth: 28,
    textAlign: 'center',
    color: '#0f172a',
    fontWeight: '700',
    marginHorizontal: 10
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0px 6px 16px rgba(15, 23, 42, 0.05)',
    elevation: 3
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  summaryLabel: {
    color: '#64748b',
    fontWeight: '600'
  },
  summaryValue: {
    color: '#0f172a',
    fontWeight: '700'
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0'
  },
  totalLabel: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 16
  },
  totalValue: {
    color: '#4f46e5',
    fontWeight: '800',
    fontSize: 20
  },
  checkoutButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 14,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(79, 70, 229, 0.2)',
    elevation: 3
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800'
  }
})
