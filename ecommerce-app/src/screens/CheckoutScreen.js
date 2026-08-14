import { useState } from 'react'
import {
  Alert,
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

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0
    return cart.items.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    )
  }

  const handlePlaceOrder = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      Alert.alert('Cart is empty', 'Add items before checkout.')
      return
    }

    setLoading(true)
    try {
      const orderItems = cart.items.map(item => ({
        product: item.product?._id,
        quantity: item.quantity,
        price: item.product?.price
      }))

      await API.post('/orders', {
        orderItems,
        shippingAddress: { address, city, postalCode, country },
        totalAmount: calculateTotal()
      })

      Alert.alert('Order placed', 'Your order has been successfully created.')
      navigation.navigate('Main', { screen: 'Cart' })
    } catch (error) {
      Alert.alert(
        'Checkout failed',
        error.response?.data?.message || 'Something went wrong.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.subtitle}>Delivery details</Text>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder='Street address'
          placeholderTextColor='#94a3b8'
        />
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder='City'
          placeholderTextColor='#94a3b8'
        />
        <View style={styles.twoColumn}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder='Postal code'
            placeholderTextColor='#94a3b8'
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            value={country}
            onChangeText={setCountry}
            placeholder='Country'
            placeholderTextColor='#94a3b8'
          />
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items</Text>
          <Text style={styles.summaryValue}>{cart?.items?.length || 0}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>Free</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Placing order...' : 'Place order'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  content: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 40
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6
  },
  subtitle: {
    color: '#64748b',
    fontSize: 15,
    marginBottom: 20
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0px 6px 16px rgba(15, 23, 42, 0.05)',
    elevation: 2
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 12,
    color: '#0f172a',
    fontSize: 15
  },
  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  halfInput: {
    width: '48%'
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0px 6px 16px rgba(15, 23, 42, 0.05)',
    elevation: 2
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12
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
  totalValue: {
    color: '#4f46e5',
    fontSize: 20,
    fontWeight: '800'
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    boxShadow: '0px 6px 16px rgba(79, 70, 229, 0.25)',
    elevation: 3
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800'
  }
})
