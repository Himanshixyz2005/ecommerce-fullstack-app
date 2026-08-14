import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import API from '../services/api'

export default function ProductDetailScreen ({ route, navigation }) {
  const { product, relatedProducts = [] } = route.params || {}
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || '')

  if (!product) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>Product not found.</Text>
      </View>
    )
  }

  const addToCart = async () => {
    try {
      await API.post('/cart', {
        productId: product._id,
        quantity: 1
      })
      Alert.alert('Success', `${product.name} added to cart.`)
    } catch (error) {
      Alert.alert(
        'Unable to add item',
        error.response?.data?.message || 'Please try again.'
      )
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name='arrow-back' size={22} color='#111827' />
      </TouchableOpacity>

      <Image
        source={{ uri: selectedImage }}
        style={styles.mainImage}
        resizeMode='cover'
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbnailRow}
      >
        {(product.images || []).map((image, index) => (
          <TouchableOpacity
            key={`${image}-${index}`}
            onPress={() => setSelectedImage(image)}
          >
            <Image
              source={{ uri: image }}
              style={[
                styles.thumbnail,
                selectedImage === image && styles.thumbnailActive
              ]}
              resizeMode='cover'
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.infoBlock}>
        <View style={styles.priceRow}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.rating}>
            ★ {Number(product.rating || 4.5).toFixed(1)}
          </Text>
        </View>

        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>
          ${Number(product.price || 0).toFixed(2)}
        </Text>

        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Delivery</Text>
            <Text style={styles.metaValue}>Free</Text>
          </View>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Stock</Text>
            <Text style={styles.metaValue}>{product.stock ?? 10} left</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.secondaryText}>View Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={addToCart}>
          <Text style={styles.primaryText}>Add to cart</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.relatedSection}>
        <Text style={styles.relatedTitle}>Related products</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.relatedRow}
        >
          {(relatedProducts || [])
            .filter(item => item._id !== product._id)
            .slice(0, 4)
            .map(item => (
              <TouchableOpacity
                key={item._id}
                style={styles.relatedCard}
                onPress={() =>
                  navigation.push('ProductDetail', {
                    product: item,
                    relatedProducts
                  })
                }
              >
                <Image
                  source={{ uri: item.images?.[0] }}
                  style={styles.relatedImage}
                  resizeMode='cover'
                />
                <Text style={styles.relatedName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.relatedPrice}>
                  ${Number(item.price || 0).toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(15, 23, 42, 0.08)',
    elevation: 3
  },
  mainImage: {
    width: '100%',
    height: 280,
    borderRadius: 24,
    backgroundColor: '#e2e8f0'
  },
  thumbnailRow: {
    marginTop: 14,
    paddingBottom: 4
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  thumbnailActive: {
    borderColor: '#4f46e5'
  },
  infoBlock: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0px 6px 16px rgba(15, 23, 42, 0.05)',
    elevation: 2
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  category: {
    color: '#4f46e5',
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  rating: {
    color: '#f59e0b',
    fontWeight: '700'
  },
  title: {
    color: '#0f172a',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8
  },
  price: {
    color: '#4f46e5',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12
  },
  description: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 18
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  metaBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  metaLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  metaValue: {
    color: '#0f172a',
    fontWeight: '700'
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 24
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    boxShadow: '0px 6px 16px rgba(79, 70, 229, 0.25)',
    elevation: 4
  },
  primaryText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  secondaryText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 15
  },
  relatedSection: {
    marginTop: 8
  },
  relatedTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12
  },
  relatedRow: {
    paddingRight: 16
  },
  relatedCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginRight: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0px 6px 16px rgba(15, 23, 42, 0.05)',
    elevation: 2
  },
  relatedImage: {
    width: '100%',
    height: 110,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#f1f5f9'
  },
  relatedName: {
    color: '#0f172a',
    fontWeight: '700',
    marginBottom: 4,
    fontSize: 13
  },
  relatedPrice: {
    color: '#4f46e5',
    fontWeight: '800',
    fontSize: 14
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  },
  emptyText: {
    color: '#334155',
    fontSize: 18,
    fontWeight: '700'
  }
})
