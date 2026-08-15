import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import API from '../services/api'

export default function CheckoutScreen ({ navigation, route }) {
  const cart = route?.params?.cart || { items: [] }

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')

  const [loading, setLoading] = useState(false)

  const calculateSubtotal = () => {
    return (cart?.items || []).reduce(
      (sum, item) =>
        sum + Number(item.product?.price || 0) * Number(item.quantity || 0),
      0
    )
  }

  const calculateItemCount = () => {
    return (cart?.items || []).reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    )
  }

  const subtotal = calculateSubtotal()

  const itemCount = calculateItemCount()

  const validateAddress = () => {
    if (!address.trim()) {
      Alert.alert('Address required', 'Please enter your street address.')
      return false
    }

    if (!city.trim()) {
      Alert.alert('City required', 'Please enter your city.')
      return false
    }

    if (!postalCode.trim()) {
      Alert.alert('Postal code required', 'Please enter your postal code.')
      return false
    }

    if (!/^\d{4,10}$/.test(postalCode.trim())) {
      Alert.alert('Invalid postal code', 'Please enter a valid postal code.')
      return false
    }

    if (!country.trim()) {
      Alert.alert('Country required', 'Please enter your country.')
      return false
    }

    return true
  }

  const handlePlaceOrder = async () => {
    if (!cart?.items || cart.items.length === 0) {
      Alert.alert('Cart is empty', 'Add items before checking out.')
      return
    }

    if (!validateAddress()) {
      return
    }

    setLoading(true)

    try {
      const orderItems = cart.items.map(item => ({
        product: item.product?._id,
        quantity: item.quantity,
        price: Number(item.product?.price || 0)
      }))

      await API.post('/orders', {
        orderItems,
        shippingAddress: {
          address: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
          country: country.trim()
        },
        totalAmount: subtotal
      })

      Alert.alert(
        'Order placed successfully 🎉',
        'Your order has been successfully created.',
        [
          {
            text: 'Continue shopping',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Home'
              })
          }
        ]
      )
    } catch (error) {
      console.log('Checkout error:', error.response?.data || error.message)

      Alert.alert(
        'Checkout failed',
        error.response?.data?.message ||
          'Something went wrong while placing your order.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name='arrow-back' size={21} color='#111827' />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>SECURE CHECKOUT</Text>

            <Text style={styles.title}>Checkout</Text>
          </View>

          <View style={styles.secureIcon}>
            <Ionicons
              name='shield-checkmark-outline'
              size={21}
              color='#7c3aed'
            />
          </View>
        </View>

        {/* PROGRESS */}

        <View style={styles.progressCard}>
          <View style={styles.progressStep}>
            <View style={styles.progressCircleDone}>
              <Ionicons name='checkmark' size={13} color='#ffffff' />
            </View>

            <Text style={styles.progressTextDone}>Cart</Text>
          </View>

          <View style={styles.progressLineActive} />

          <View style={styles.progressStep}>
            <View style={styles.progressCircleActive}>
              <Text style={styles.progressNumber}>2</Text>
            </View>

            <Text style={styles.progressTextActive}>Delivery</Text>
          </View>

          <View style={styles.progressLine} />

          <View style={styles.progressStep}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressNumberInactive}>3</Text>
            </View>

            <Text style={styles.progressText}>Complete</Text>
          </View>
        </View>

        {/* DELIVERY DETAILS */}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons name='location-outline' size={18} color='#7c3aed' />
          </View>

          <View>
            <Text style={styles.sectionTitle}>Delivery details</Text>

            <Text style={styles.sectionSubtitle}>
              Where should we deliver your order?
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Street address</Text>

          <View style={styles.inputWrapper}>
            <Ionicons name='home-outline' size={18} color='#94a3b8' />

            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder='Enter your street address'
              placeholderTextColor='#94a3b8'
              autoCapitalize='words'
            />
          </View>

          <Text style={styles.inputLabel}>City</Text>

          <View style={styles.inputWrapper}>
            <Ionicons name='business-outline' size={18} color='#94a3b8' />

            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder='Enter your city'
              placeholderTextColor='#94a3b8'
              autoCapitalize='words'
            />
          </View>

          <View style={styles.twoColumn}>
            <View style={styles.halfColumn}>
              <Text style={styles.inputLabel}>Postal code</Text>

              <View style={styles.inputWrapper}>
                <Ionicons name='mail-outline' size={17} color='#94a3b8' />

                <TextInput
                  style={styles.input}
                  value={postalCode}
                  onChangeText={setPostalCode}
                  placeholder='Postal code'
                  placeholderTextColor='#94a3b8'
                  keyboardType='number-pad'
                  maxLength={10}
                />
              </View>
            </View>

            <View style={styles.halfColumn}>
              <Text style={styles.inputLabel}>Country</Text>

              <View style={styles.inputWrapper}>
                <Ionicons name='globe-outline' size={17} color='#94a3b8' />

                <TextInput
                  style={styles.input}
                  value={country}
                  onChangeText={setCountry}
                  placeholder='Country'
                  placeholderTextColor='#94a3b8'
                  autoCapitalize='words'
                />
              </View>
            </View>
          </View>
        </View>

        {/* PAYMENT */}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons name='card-outline' size={18} color='#7c3aed' />
          </View>

          <View>
            <Text style={styles.sectionTitle}>Payment</Text>

            <Text style={styles.sectionSubtitle}>
              Your payment is processed securely
            </Text>
          </View>
        </View>

        <View style={styles.paymentCard}>
          <View style={styles.paymentIcon}>
            <Ionicons name='cash-outline' size={23} color='#7c3aed' />
          </View>

          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Cash on delivery</Text>

            <Text style={styles.paymentSubtitle}>
              Pay when your order arrives
            </Text>
          </View>

          <View style={styles.selectedPayment}>
            <Ionicons name='checkmark' size={14} color='#ffffff' />
          </View>
        </View>

        {/* ORDER SUMMARY */}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons name='receipt-outline' size={18} color='#7c3aed' />
          </View>

          <View>
            <Text style={styles.sectionTitle}>Order summary</Text>

            <Text style={styles.sectionSubtitle}>Review your purchase</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          {/* ITEMS */}

          {(cart?.items || []).slice(0, 3).map(item => (
            <View
              key={item._id || item.product?._id}
              style={styles.summaryItem}
            >
              <View style={styles.summaryItemImage}>
                {item.product?.images?.[0] ? (
                  <Image
                    source={{
                      uri: item.product.images[0]
                    }}
                    style={styles.productImage}
                    resizeMode='cover'
                  />
                ) : (
                  <Ionicons name='image-outline' size={20} color='#a78bfa' />
                )}
              </View>

              <View style={styles.summaryItemInfo}>
                <Text style={styles.summaryItemName} numberOfLines={1}>
                  {item.product?.name}
                </Text>

                <Text style={styles.summaryItemQuantity}>
                  Qty: {item.quantity}
                </Text>
              </View>

              <Text style={styles.summaryItemPrice}>
                $
                {(
                  Number(item.product?.price || 0) * Number(item.quantity || 0)
                ).toFixed(2)}
              </Text>
            </View>
          ))}

          {cart?.items?.length > 3 && (
            <Text style={styles.moreItems}>
              + {cart.items.length - 3} more items
            </Text>
          )}

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items</Text>

            <Text style={styles.summaryValue}>{itemCount}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>

            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>

            <Text style={styles.freeText}>FREE</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>

              <Text style={styles.totalSubtext}>Final amount</Text>
            </View>

            <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* TRUST */}

        <View style={styles.trustCard}>
          <View style={styles.trustIcon}>
            <Ionicons name='lock-closed-outline' size={17} color='#16a34a' />
          </View>

          <View style={styles.trustTextContainer}>
            <Text style={styles.trustTitle}>Safe & secure checkout</Text>

            <Text style={styles.trustText}>
              Your order information is securely processed and protected.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* BOTTOM ACTION */}

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotalLabel}>Total</Text>

          <Text style={styles.bottomTotal}>${subtotal.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            loading && styles.placeOrderDisabled
          ]}
          onPress={handlePlaceOrder}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color='#ffffff' />
          ) : (
            <>
              <Text style={styles.placeOrderText}>Place order</Text>

              <Ionicons name='arrow-forward' size={18} color='#ffffff' />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f3ff'
  },

  container: {
    flex: 1
  },

  content: {
    paddingTop: 42,
    paddingHorizontal: 18,
    paddingBottom: 130
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18
  },

  backButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3
  },

  headerText: {
    flex: 1
  },

  eyebrow: {
    color: '#7c3aed',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 3
  },

  title: {
    color: '#111827',
    fontSize: 27,
    fontWeight: '800'
  },

  secureIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },

  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#eeeaff'
  },

  progressStep: {
    alignItems: 'center'
  },

  progressCircleDone: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center'
  },

  progressCircleActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ede9fe',
    borderWidth: 2,
    borderColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center'
  },

  progressCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center'
  },

  progressNumber: {
    color: '#7c3aed',
    fontSize: 11,
    fontWeight: '800'
  },

  progressNumberInactive: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700'
  },

  progressTextDone: {
    color: '#7c3aed',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 4
  },

  progressTextActive: {
    color: '#7c3aed',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 4
  },

  progressText: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4
  },

  progressLineActive: {
    flex: 1,
    height: 2,
    backgroundColor: '#7c3aed',
    marginHorizontal: 7,
    marginBottom: 14
  },

  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 7,
    marginBottom: 14
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },

  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },

  sectionTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2
  },

  sectionSubtitle: {
    color: '#94a3b8',
    fontSize: 10
  },

  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 24,
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

  inputLabel: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 7
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    marginBottom: 14
  },

  input: {
    flex: 1,
    color: '#0f172a',
    fontSize: 14,
    paddingHorizontal: 9,
    paddingVertical: 12
  },

  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  halfColumn: {
    width: '48%'
  },

  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#7c3aed'
  },

  paymentIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#f4f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11
  },

  paymentInfo: {
    flex: 1
  },

  paymentTitle: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 3
  },

  paymentSubtitle: {
    color: '#94a3b8',
    fontSize: 10
  },

  selectedPayment: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center'
  },

  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 17,
    marginBottom: 16,
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

  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11
  },

  summaryItemImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f4f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 10
  },

  productImage: {
    width: '100%',
    height: '100%'
  },

  summaryItemInfo: {
    flex: 1
  },

  summaryItemName: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3
  },

  summaryItemQuantity: {
    color: '#94a3b8',
    fontSize: 10
  },

  summaryItemPrice: {
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 8
  },

  moreItems: {
    color: '#7c3aed',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#eef2f7',
    marginVertical: 11
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9
  },

  summaryLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600'
  },

  summaryValue: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700'
  },

  freeText: {
    color: '#16a34a',
    fontSize: 11,
    fontWeight: '800'
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    fontSize: 21,
    fontWeight: '800'
  },

  trustCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: '#dcfce7'
  },

  trustIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9
  },

  trustTextContainer: {
    flex: 1
  },

  trustTitle: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2
  },

  trustText: {
    color: '#4d7c5a',
    fontSize: 9,
    lineHeight: 14
  },

  bottomSpacing: {
    height: 20
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eeeaff',
    paddingHorizontal: 18,
    paddingTop: 11,
    paddingBottom: 19,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: -7
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10
  },

  bottomTotalLabel: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 2
  },

  bottomTotal: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800'
  },

  placeOrderButton: {
    flex: 1,
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 15,
    paddingVertical: 14,
    shadowColor: '#7c3aed',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5
  },

  placeOrderDisabled: {
    opacity: 0.7
  },

  placeOrderText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginRight: 7
  }
})
