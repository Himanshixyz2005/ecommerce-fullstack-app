import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useContext, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
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
      setLoading(true)

      const response = await API.get('/orders')

      setOrders(response.data || [])
    } catch (error) {
      console.log('Orders fetch error:', error.response?.data || error.message)

      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout
      }
    ])
  }

  const getInitial = () => {
    return user?.name?.trim()?.charAt(0)?.toUpperCase() || 'U'
  }

  const getOrderStatusStyle = status => {
    const normalized = String(status || 'Completed').toLowerCase()

    if (normalized.includes('cancel') || normalized.includes('fail')) {
      return {
        container: styles.statusCancelled,
        text: styles.statusCancelledText,
        icon: 'close-circle-outline'
      }
    }

    if (normalized.includes('pending') || normalized.includes('process')) {
      return {
        container: styles.statusPending,
        text: styles.statusPendingText,
        icon: 'time-outline'
      }
    }

    if (normalized.includes('deliver') || normalized.includes('complete')) {
      return {
        container: styles.statusCompleted,
        text: styles.statusCompletedText,
        icon: 'checkmark-circle-outline'
      }
    }

    return {
      container: styles.statusPending,
      text: styles.statusPendingText,
      icon: 'time-outline'
    }
  }

  const renderOrder = ({ item, index }) => {
    const status = getOrderStatusStyle(item.status)

    const orderId = item._id
      ? item._id.slice(-6).toUpperCase()
      : String(index + 1).padStart(6, '0')

    const itemCount =
      item.orderItems?.reduce(
        (total, orderItem) => total + Number(orderItem.quantity || 1),
        0
      ) || 0

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderTop}>
          <View style={styles.orderIcon}>
            <Ionicons name='receipt-outline' size={19} color='#7c3aed' />
          </View>

          <View style={styles.orderMainInfo}>
            <Text style={styles.orderLabel}>ORDER #{orderId}</Text>

            <Text style={styles.orderDate}>Recent order</Text>
          </View>

          <View style={[styles.statusBadge, status.container]}>
            <Ionicons name={status.icon} size={12} color={status.text.color} />

            <Text style={[styles.statusText, status.text]}>
              {item.status || 'Completed'}
            </Text>
          </View>
        </View>

        <View style={styles.orderDivider} />

        <View style={styles.orderBottom}>
          <View>
            <Text style={styles.orderMetaLabel}>ITEMS</Text>

            <Text style={styles.orderMetaValue}>
              {itemCount || 1} {itemCount === 1 ? 'item' : 'items'}
            </Text>
          </View>

          <View style={styles.orderAmountContainer}>
            <Text style={styles.orderMetaLabel}>TOTAL</Text>

            <Text style={styles.orderTotal}>
              ${Number(item.totalAmount || 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <View style={styles.loaderCard}>
          <View style={styles.loaderIcon}>
            <Ionicons name='person-outline' size={27} color='#7c3aed' />
          </View>

          <ActivityIndicator size='small' color='#7c3aed' />

          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item, index) => item._id || `order-${index}`}
        renderItem={renderOrder}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* HEADER */}

            <View style={styles.header}>
              <View>
                <Text style={styles.eyebrow}>YOUR ACCOUNT</Text>

                <Text style={styles.title}>Profile</Text>
              </View>

              <View style={styles.headerIcon}>
                <Ionicons name='settings-outline' size={20} color='#7c3aed' />
              </View>
            </View>

            {/* USER CARD */}

            <View style={styles.userCard}>
              <View style={styles.userTop}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitial()}</Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.welcomeText}>Welcome back</Text>

                  <Text style={styles.userName} numberOfLines={1}>
                    {user?.name || 'User'}
                  </Text>

                  <View style={styles.emailRow}>
                    <Ionicons name='mail-outline' size={13} color='#94a3b8' />

                    <Text style={styles.userEmail} numberOfLines={1}>
                      {user?.email || 'No email set'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.userDivider} />

              <View style={styles.accountStats}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{orders.length}</Text>

                  <Text style={styles.statLabel}>Orders</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.stat}>
                  <Text style={styles.statNumber}>
                    $
                    {orders
                      .reduce(
                        (total, order) =>
                          total + Number(order.totalAmount || 0),
                        0
                      )
                      .toFixed(2)}
                  </Text>

                  <Text style={styles.statLabel}>Spent</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.stat}>
                  <Ionicons name='shield-checkmark' size={21} color='#7c3aed' />

                  <Text style={styles.statLabel}>Secure</Text>
                </View>
              </View>
            </View>

            {/* ACCOUNT ACTIONS */}

            <View style={styles.actionCard}>
              <TouchableOpacity style={styles.actionRow} activeOpacity={0.8}>
                <View style={styles.actionIcon}>
                  <Ionicons name='person-outline' size={19} color='#7c3aed' />
                </View>

                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>Account details</Text>

                  <Text style={styles.actionSubtitle}>Manage your profile</Text>
                </View>

                <Ionicons name='chevron-forward' size={18} color='#94a3b8' />
              </TouchableOpacity>

              <View style={styles.actionDivider} />

              <TouchableOpacity
                style={styles.actionRow}
                activeOpacity={0.8}
                onPress={fetchOrders}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name='refresh-outline' size={19} color='#7c3aed' />
                </View>

                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>Refresh orders</Text>

                  <Text style={styles.actionSubtitle}>
                    Get your latest order status
                  </Text>
                </View>

                <Ionicons name='chevron-forward' size={18} color='#94a3b8' />
              </TouchableOpacity>
            </View>

            {/* ORDER HISTORY HEADER */}

            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderEyebrow}>SHOPPING ACTIVITY</Text>

                <Text style={styles.sectionTitle}>Order history</Text>
              </View>

              <View style={styles.orderCountBadge}>
                <Text style={styles.orderCountText}>{orders.length}</Text>
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name='receipt-outline' size={34} color='#7c3aed' />
            </View>

            <Text style={styles.emptyTitle}>No orders yet</Text>

            <Text style={styles.emptyText}>
              Your completed purchases will appear here once you place your
              first order.
            </Text>
          </View>
        }
        ListFooterComponent={
          <>
            {/* LOGOUT */}

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.85}
            >
              <View style={styles.logoutIcon}>
                <Ionicons name='log-out-outline' size={19} color='#dc2626' />
              </View>

              <Text style={styles.logoutText}>Logout</Text>

              <Ionicons name='chevron-forward' size={18} color='#f87171' />
            </TouchableOpacity>

            <Text style={styles.versionText}>
              E-Commerce App • Your shopping, simplified.
            </Text>
          </>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ff',
    paddingTop: 42,
    paddingHorizontal: 18
  },

  listContent: {
    paddingBottom: 110
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
    paddingHorizontal: 34,
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

  headerIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3
  },

  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eeeaff',
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4
  },

  userTop: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  avatar: {
    width: 67,
    height: 67,
    borderRadius: 23,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: {
      width: 0,
      height: 7
    },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4
  },

  avatarText: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: '800'
  },

  userInfo: {
    flex: 1,
    marginLeft: 13
  },

  welcomeText: {
    color: '#7c3aed',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 3
  },

  userName: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4
  },

  emailRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  userEmail: {
    color: '#64748b',
    fontSize: 11,
    marginLeft: 5,
    flex: 1
  },

  userDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 17
  },

  accountStats: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  stat: {
    flex: 1,
    alignItems: 'center'
  },

  statNumber: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 3
  },

  statLabel: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '600'
  },

  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#e2e8f0'
  },

  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 14,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: '#eeeaff'
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13
  },

  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f4f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11
  },

  actionText: {
    flex: 1
  },

  actionTitle: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2
  },

  actionSubtitle: {
    color: '#94a3b8',
    fontSize: 9
  },

  actionDivider: {
    height: 1,
    backgroundColor: '#f1f5f9'
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13
  },

  orderEyebrow: {
    color: '#7c3aed',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 3
  },

  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800'
  },

  orderCountBadge: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center'
  },

  orderCountText: {
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: '800'
  },

  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: '#eeeaff',
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.05,
    shadowRadius: 13,
    elevation: 3
  },

  orderTop: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  orderIcon: {
    width: 41,
    height: 41,
    borderRadius: 13,
    backgroundColor: '#f4f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },

  orderMainInfo: {
    flex: 1
  },

  orderLabel: {
    color: '#111827',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 3
  },

  orderDate: {
    color: '#94a3b8',
    fontSize: 9
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6
  },

  statusCompleted: {
    backgroundColor: '#f0fdf4'
  },

  statusCompletedText: {
    color: '#16a34a'
  },

  statusPending: {
    backgroundColor: '#fffbeb'
  },

  statusPendingText: {
    color: '#d97706'
  },

  statusCancelled: {
    backgroundColor: '#fef2f2'
  },

  statusCancelledText: {
    color: '#dc2626'
  },

  statusText: {
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 4,
    textTransform: 'capitalize'
  },

  orderDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 13
  },

  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  orderMetaLabel: {
    color: '#94a3b8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 3
  },

  orderMetaValue: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700'
  },

  orderAmountContainer: {
    alignItems: 'flex-end'
  },

  orderTotal: {
    color: '#7c3aed',
    fontSize: 16,
    fontWeight: '800'
  },

  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eeeaff',
    marginBottom: 15
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 23,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14
  },

  emptyTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 7
  },

  emptyText: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center'
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 17,
    padding: 13,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#fee2e2'
  },

  logoutIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },

  logoutText: {
    flex: 1,
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '800'
  },

  versionText: {
    textAlign: 'center',
    color: '#cbd5e1',
    fontSize: 9,
    marginTop: 15
  }
})
