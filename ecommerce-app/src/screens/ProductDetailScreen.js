import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
  ActivityIndicator,
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

  const [addingToCart, setAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  if (!product) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Ionicons name='bag-outline' size={34} color='#7c3aed' />
        </View>

        <Text style={styles.emptyTitle}>Product not found</Text>

        <TouchableOpacity
          style={styles.backToShopButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backToShopText}>Go back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const images = product.images || []

  const rating = Number(product.rating || 4.5)

  const stock = Number(product.stock ?? 10)

  const totalPrice = Number(product.price || 0) * quantity

  const addToCart = async () => {
    try {
      setAddingToCart(true)

      await API.post('/cart', {
        productId: product._id,
        quantity
      })

      Alert.alert(
        'Added to cart',
        `${product.name} has been added to your cart.`,
        [
          {
            text: 'Continue shopping',
            style: 'cancel'
          },
          {
            text: 'View cart',
            onPress: () => navigation.navigate('Cart')
          }
        ]
      )
    } catch (error) {
      Alert.alert(
        'Unable to add item',
        error.response?.data?.message || 'Please try again.'
      )
    } finally {
      setAddingToCart(false)
    }
  }

  const increaseQuantity = () => {
    if (quantity >= stock) {
      Alert.alert(
        'Stock limit',
        `Only ${stock} item${stock === 1 ? '' : 's'} available.`
      )
      return
    }

    setQuantity(previous => previous + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(previous => previous - 1)
    }
  }

  const openRelatedProduct = item => {
    navigation.push('ProductDetail', {
      product: item,
      relatedProducts
    })
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP BAR */}

        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name='arrow-back' size={21} color='#111827' />
          </TouchableOpacity>

          <Text style={styles.topBarTitle}>Product details</Text>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsFavorite(previous => !previous)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={21}
              color={isFavorite ? '#7c3aed' : '#334155'}
            />
          </TouchableOpacity>
        </View>

        {/* PRODUCT IMAGE */}

        <View style={styles.imageCard}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.mainImage}
              resizeMode='cover'
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name='image-outline' size={48} color='#a78bfa' />
            </View>
          )}

          <View style={styles.imageBadge}>
            <Ionicons name='sparkles' size={12} color='#ffffff' />

            <Text style={styles.imageBadgeText}>PREMIUM PICK</Text>
          </View>
        </View>

        {/* THUMBNAILS */}

        {images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailRow}
          >
            {images.map((image, index) => {
              const active = selectedImage === image

              return (
                <TouchableOpacity
                  key={`${image}-${index}`}
                  onPress={() => setSelectedImage(image)}
                  activeOpacity={0.85}
                  style={[
                    styles.thumbnailWrapper,
                    active && styles.thumbnailWrapperActive
                  ]}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.thumbnail}
                    resizeMode='cover'
                  />

                  {active && (
                    <View style={styles.thumbnailCheck}>
                      <Ionicons name='checkmark' size={11} color='#ffffff' />
                    </View>
                  )}
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        )}

        {/* PRODUCT INFORMATION */}

        <View style={styles.infoCard}>
          <View style={styles.categoryRatingRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {product.category || 'Collection'}
              </Text>
            </View>

            <View style={styles.ratingBadge}>
              <Ionicons name='star' size={13} color='#f59e0b' />

              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
          </View>

          <Text style={styles.title}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ${Number(product.price || 0).toFixed(2)}
            </Text>

            <View style={styles.stockBadge}>
              <View style={styles.stockDot} />

              <Text style={styles.stockText}>
                {stock > 0 ? `${stock} available` : 'Out of stock'}
              </Text>
            </View>
          </View>

          {/* DESCRIPTION */}

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>About this product</Text>

          <Text style={styles.description}>
            {product.description ||
              'Discover premium quality and carefully selected details designed to give you an excellent shopping experience.'}
          </Text>

          {/* BENEFITS */}

          <View style={styles.benefitsRow}>
            <View style={styles.benefit}>
              <View style={styles.benefitIcon}>
                <Ionicons
                  name='shield-checkmark-outline'
                  size={18}
                  color='#7c3aed'
                />
              </View>

              <Text style={styles.benefitText}>Quality{'\n'}assured</Text>
            </View>

            <View style={styles.benefit}>
              <View style={styles.benefitIcon}>
                <Ionicons name='car-outline' size={18} color='#7c3aed' />
              </View>

              <Text style={styles.benefitText}>Free{'\n'}delivery</Text>
            </View>

            <View style={styles.benefit}>
              <View style={styles.benefitIcon}>
                <Ionicons name='refresh-outline' size={18} color='#7c3aed' />
              </View>

              <Text style={styles.benefitText}>Easy{'\n'}returns</Text>
            </View>
          </View>
        </View>

        {/* QUANTITY */}

        <View style={styles.quantityCard}>
          <View>
            <Text style={styles.quantityLabel}>Quantity</Text>

            <Text style={styles.quantitySubtext}>
              Select how many you'd like
            </Text>
          </View>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decreaseQuantity}
              activeOpacity={0.8}
            >
              <Ionicons name='remove' size={17} color='#475569' />
            </TouchableOpacity>

            <Text style={styles.quantityValue}>{quantity}</Text>

            <TouchableOpacity
              style={[
                styles.quantityButton,
                stock <= quantity && styles.quantityButtonDisabled
              ]}
              onPress={increaseQuantity}
              activeOpacity={0.8}
              disabled={stock <= quantity}
            >
              <Ionicons
                name='add'
                size={17}
                color={stock <= quantity ? '#cbd5e1' : '#475569'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* RELATED PRODUCTS */}

        {relatedProducts.filter(item => item._id !== product._id).length >
          0 && (
          <View style={styles.relatedSection}>
            <View style={styles.relatedHeader}>
              <View>
                <Text style={styles.relatedEyebrow}>YOU MAY ALSO LIKE</Text>

                <Text style={styles.relatedTitle}>Related products</Text>
              </View>

              <Ionicons name='sparkles-outline' size={19} color='#7c3aed' />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedRow}
            >
              {relatedProducts
                .filter(item => item._id !== product._id)
                .slice(0, 6)
                .map(item => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.relatedCard}
                    onPress={() => openRelatedProduct(item)}
                    activeOpacity={0.9}
                  >
                    <View style={styles.relatedImageWrapper}>
                      <Image
                        source={{
                          uri: item.images?.[0]
                        }}
                        style={styles.relatedImage}
                        resizeMode='cover'
                      />

                      <View style={styles.relatedHeart}>
                        <Ionicons
                          name='heart-outline'
                          size={13}
                          color='#475569'
                        />
                      </View>
                    </View>

                    <Text style={styles.relatedCategory} numberOfLines={1}>
                      {item.category || 'Collection'}
                    </Text>

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
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* BOTTOM ACTION BAR */}

      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>

          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            (addingToCart || stock <= 0) && styles.addButtonDisabled
          ]}
          onPress={addToCart}
          disabled={addingToCart || stock <= 0}
          activeOpacity={0.85}
        >
          {addingToCart ? (
            <ActivityIndicator color='#ffffff' />
          ) : (
            <>
              <Ionicons name='bag-add-outline' size={19} color='#ffffff' />

              <Text style={styles.addButtonText}>
                {stock <= 0 ? 'Out of stock' : 'Add to cart'}
              </Text>
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

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },

  topBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827'
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4
  },

  imageCard: {
    width: '100%',
    height: 330,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    position: 'relative',
    shadowColor: '#7c3aed',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5
  },

  mainImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f5f9'
  },

  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f3ff'
  },

  imageBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 7
  },

  imageBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginLeft: 5
  },

  thumbnailRow: {
    paddingTop: 13,
    paddingBottom: 2,
    paddingRight: 12
  },

  thumbnailWrapper: {
    width: 68,
    height: 68,
    borderRadius: 15,
    padding: 2,
    marginRight: 9,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#ffffff'
  },

  thumbnailWrapperActive: {
    borderColor: '#7c3aed'
  },

  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 11,
    backgroundColor: '#f1f5f9'
  },

  thumbnailCheck: {
    position: 'absolute',
    right: -3,
    bottom: -3,
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f4f3ff'
  },

  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#eeeaff',
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.06,
    shadowRadius: 17,
    elevation: 4
  },

  categoryRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11
  },

  categoryBadge: {
    backgroundColor: '#ede9fe',
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 6
  },

  categoryText: {
    color: '#7c3aed',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },

  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6
  },

  ratingText: {
    color: '#92400e',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4
  },

  title: {
    color: '#111827',
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '800',
    marginBottom: 8
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  price: {
    color: '#7c3aed',
    fontSize: 24,
    fontWeight: '800'
  },

  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6
  },

  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginRight: 5
  },

  stockText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '700'
  },

  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 18
  },

  sectionLabel: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 7
  },

  description: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 22
  },

  benefitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9'
  },

  benefit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },

  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#f4f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7
  },

  benefitText: {
    color: '#475569',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700'
  },

  quantityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginTop: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eeeaff'
  },

  quantityLabel: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 3
  },

  quantitySubtext: {
    color: '#94a3b8',
    fontSize: 10
  },

  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 13,
    padding: 4
  },

  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },

  quantityButtonDisabled: {
    opacity: 0.6
  },

  quantityValue: {
    minWidth: 32,
    textAlign: 'center',
    color: '#111827',
    fontSize: 14,
    fontWeight: '800'
  },

  relatedSection: {
    marginTop: 28
  },

  relatedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12
  },

  relatedEyebrow: {
    color: '#7c3aed',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 3
  },

  relatedTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800'
  },

  relatedRow: {
    paddingRight: 15
  },

  relatedCard: {
    width: 164,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#eeeaff',
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 7
    },
    shadowOpacity: 0.05,
    shadowRadius: 13,
    elevation: 3
  },

  relatedImageWrapper: {
    position: 'relative'
  },

  relatedImage: {
    width: '100%',
    height: 120,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    marginBottom: 9
  },

  relatedHeart: {
    position: 'absolute',
    right: 7,
    top: 7,
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.94)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  relatedCategory: {
    color: '#7c3aed',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 3
  },

  relatedName: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 5
  },

  relatedPrice: {
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: '800'
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
    paddingTop: 12,
    paddingBottom: 20,
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

  totalContainer: {
    marginRight: 14,
    minWidth: 82
  },

  totalLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2
  },

  totalPrice: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '800'
  },

  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 15,
    paddingVertical: 15,
    shadowColor: '#7c3aed',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5
  },

  addButtonDisabled: {
    opacity: 0.6
  },

  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 7
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f3ff',
    paddingHorizontal: 30
  },

  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 25,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },

  emptyTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 15
  },

  backToShopButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12
  },

  backToShopText: {
    color: '#ffffff',
    fontWeight: '700'
  }
})
