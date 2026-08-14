import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useContext, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { AuthContext } from '../context/AuthContext'
import API from '../services/api'

export default function ProfileScreen () {
  const { user, logout } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      fetchOrders()
    }, [])
  )

  const fetchOrders = async () => {
    try {
      const response = await API.get('/orders')
      setOrders(response.data || [])
    } catch (error) {
      setOrders([])
    } finally {
      setLoading(false)
    }
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
      {/* User Info Header Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name='person' size={32} color='#4f46e5' />
        </View>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'No email set'}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons
            name='log-out-outline'
            size={18}
            color='#dc2626'
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Order History Section */}
      <Text style={styles.sectionTitle}>Order history</Text>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name='receipt-outline' size={48} color='#9ca3af' />
          <Text style={styles.emptyText}>No past orders found</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>
                  Order ID: #{item._id.slice(-6)}
                </Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {item.status || 'Completed'}
                  </Text>
                </View>
              </View>
              <View style={styles.orderFooter}>
                <Text style={styles.orderInfo}>
                  Items: {item.orderItems?.length || 1}
                </Text>
                <Text style={styles.orderTotal}>
                  ${Number(item.totalAmount || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 52,
    paddingHorizontal: 16
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0px 6px 16px rgba(15, 23, 42, 0.05)',
    elevation: 3,
    alignItems: 'center'
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    items: 'center',
    marginBottom: 12
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 18
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fee2e2',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  logoutIcon: {
    marginRight: 6
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40
  },
  emptyText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0px 4px 12px rgba(15, 23, 42, 0.04)',
    elevation: 2
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  orderId: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 14
  },
  statusBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dcfce7'
  },
  statusText: {
    color: '#16a34a',
    fontWeight: '700',
    fontSize: 11
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10
  },
  orderInfo: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600'
  },
  orderTotal: {
    color: '#4f46e5',
    fontWeight: '800',
    fontSize: 16
  }
})
