import { Ionicons } from '@expo/vector-icons'
import { useContext, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import { AuthContext } from '../context/AuthContext'
import API from '../services/api'

export default function HomeScreen ({ navigation }) {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const { user } = useContext(AuthContext)

  const categories = Array.from(
    new Set(products.map(product => product.category).filter(Boolean))
  )

  const visibleCategories = ['All', ...categories]

  /*
   * Hero products
   * We use real products from the backend rather than
   * hardcoded/dummy content.
   */
  const heroProducts = products.slice(0, 3)

  /*
   * Featured products
   */
  const featuredProducts = products.slice(0, 6)

  /*
   * Trending products
   * Using rating as a simple ranking signal.
   */
  const trendingProducts = [...products]
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    .slice(0, 4)

  /*
   * Special offer products
   * Products with a discount field are preferred.
   * If the backend doesn't provide discounts, we still
   * show a small promotional collection using products.
   */
  const offerProducts = products
    .filter(product => Number(product.discount || 0) > 0)
    .slice(0, 4)

  const displayedOffers =
    offerProducts.length > 0 ? offerProducts : products.slice(0, 4)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products')

      const productList = response.data || []

      setProducts(productList)
      setFilteredProducts(productList)

      if (productList.length > 0 && selectedCategory !== 'All') {
        filterProducts(searchQuery, selectedCategory, productList)
      }
    } catch (error) {
      setProducts([])
      setFilteredProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = (query, category, sourceProducts = products) => {
    let temp = [...sourceProducts]

    if (category !== 'All') {
      temp = temp.filter(
        item =>
          item.category &&
          item.category.toLowerCase() === category.toLowerCase()
      )
    }

    if (query.trim() !== '') {
      temp = temp.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    }

    setFilteredProducts(temp)
  }

  const handleSearch = text => {
    setSearchQuery(text)
    filterProducts(text, selectedCategory)
  }

  const handleCategorySelect = category => {
    setSelectedCategory(category)
    filterProducts(searchQuery, category)
  }

  const openProduct = product => {
    navigation.navigate('ProductDetail', {
      product,
      relatedProducts: products
    })
  }

  const renderHeroCard = (item, index) => (
    <TouchableOpacity
      key={`hero-${item._id}`}
      style={styles.heroCard}
      activeOpacity={0.94}
      onPress={() => openProduct(item)}
    >
      <Image
        source={{ uri: item.images?.[0] }}
        style={styles.heroImage}
        resizeMode='cover'
      />

      <View style={styles.heroOverlay} />

      <View style={styles.heroContent}>
        <View style={styles.heroBadge}>
          <Ionicons name='sparkles' size={12} color='#ffffff' />

          <Text style={styles.heroBadgeText}>
            {index === 0
              ? 'CURATED FOR YOU'
              : index === 1
              ? 'TRENDING NOW'
              : 'EDITOR’S PICK'}
          </Text>
        </View>

        <Text style={styles.heroTitle} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.heroBottomRow}>
          <View>
            <Text style={styles.heroPriceLabel}>Starting from</Text>

            <Text style={styles.heroPrice}>
              ${Number(item.price || 0).toFixed(2)}
            </Text>
          </View>

          <View style={styles.heroArrow}>
            <Ionicons name='arrow-forward' size={18} color='#7c3aed' />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderFeaturedProduct = item => (
    <TouchableOpacity
      key={`featured-${item._id}`}
      style={styles.featureCard}
      activeOpacity={0.92}
      onPress={() => openProduct(item)}
    >
      <View style={styles.featureImageWrapper}>
        <Image
          source={{ uri: item.images?.[0] }}
          style={styles.featureImage}
          resizeMode='cover'
        />

        <View style={styles.imageHeart}>
          <Ionicons name='heart-outline' size={16} color='#475569' />
        </View>
      </View>

      <Text style={styles.featureName} numberOfLines={1}>
        {item.name}
      </Text>

      <View style={styles.featureBottom}>
        <Text style={styles.featurePrice}>
          ${Number(item.price || 0).toFixed(2)}
        </Text>

        <View style={styles.smallRating}>
          <Ionicons name='star' size={11} color='#f59e0b' />

          <Text style={styles.smallRatingText}>
            {Number(item.rating || 4.5).toFixed(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderTrendingProduct = item => (
    <TouchableOpacity
      key={`trending-${item._id}`}
      style={styles.trendingCard}
      activeOpacity={0.92}
      onPress={() => openProduct(item)}
    >
      <View style={styles.trendingImageWrapper}>
        <Image
          source={{ uri: item.images?.[0] }}
          style={styles.trendingImage}
          resizeMode='cover'
        />

        <View style={styles.trendingBadge}>
          <Text style={styles.trendingBadgeText}>TRENDING</Text>
        </View>
      </View>

      <View style={styles.trendingInfo}>
        <Text style={styles.trendingName} numberOfLines={1}>
          {item.name}
        </Text>

        <Text style={styles.trendingCategory}>
          {item.category || 'Featured'}
        </Text>

        <View style={styles.trendingPriceRow}>
          <Text style={styles.trendingPrice}>
            ${Number(item.price || 0).toFixed(2)}
          </Text>

          <View style={styles.ratingPill}>
            <Ionicons name='star' size={10} color='#f59e0b' />

            <Text style={styles.ratingPillText}>
              {Number(item.rating || 4.5).toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderOfferProduct = item => {
    const hasDiscount = Number(item.discount || 0) > 0

    const oldPrice = hasDiscount
      ? Number(item.price) / (1 - Number(item.discount) / 100)
      : Number(item.price || 0) * 1.15

    return (
      <TouchableOpacity
        key={`offer-${item._id}`}
        style={styles.offerCard}
        activeOpacity={0.92}
        onPress={() => openProduct(item)}
      >
        <View style={styles.offerImageWrapper}>
          <Image
            source={{ uri: item.images?.[0] }}
            style={styles.offerImage}
            resizeMode='cover'
          />

          <View style={styles.offerBadge}>
            <Text style={styles.offerBadgeText}>
              {hasDiscount ? `${item.discount}% OFF` : 'SPECIAL'}
            </Text>
          </View>
        </View>

        <View style={styles.offerInfo}>
          <Text style={styles.offerName} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.offerPriceRow}>
            <Text style={styles.offerPrice}>
              ${Number(item.price || 0).toFixed(2)}
            </Text>

            <Text style={styles.oldPrice}>${oldPrice.toFixed(2)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <View style={styles.loaderCircle}>
          <ActivityIndicator size='large' color='#7c3aed' />
        </View>

        <Text style={styles.loadingText}>
          Curating your shopping experience...
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>Welcome back,</Text>

            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || 'Shopper'} 👋
            </Text>
          </View>

          <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.8}>
            <Ionicons name='notifications-outline' size={21} color='#334155' />

            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIconWrapper}>
            <Ionicons name='search-outline' size={18} color='#7c3aed' />
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder='Search your next favorite...'
            placeholderTextColor='#94a3b8'
            value={searchQuery}
            onChangeText={handleSearch}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name='close-circle' size={19} color='#94a3b8' />
            </TouchableOpacity>
          )}
        </View>

        {products.length > 0 && (
          <>
            {/* HERO */}
            <View style={styles.heroHeader}>
              <View>
                <Text style={styles.heroEyebrow}>DISCOVER MORE</Text>

                <Text style={styles.heroSectionTitle}>
                  Made for your lifestyle
                </Text>
              </View>

              <View style={styles.heroDots}>
                <View style={styles.heroDotActive} />
                <View style={styles.heroDot} />
                <View style={styles.heroDot} />
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.heroList}
            >
              {heroProducts.map(renderHeroCard)}
            </ScrollView>

            {/* CATEGORIES */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>EXPLORE</Text>

                <Text style={styles.sectionTitle}>Categories</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {visibleCategories.map((cat, index) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryPill,
                    selectedCategory === cat
                      ? styles.categoryPillActive
                      : styles.categoryPillInactive
                  ]}
                  onPress={() => handleCategorySelect(cat)}
                  activeOpacity={0.85}
                >
                  {index === 0 && (
                    <Ionicons
                      name='apps-outline'
                      size={14}
                      color={selectedCategory === cat ? '#ffffff' : '#7c3aed'}
                    />
                  )}

                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === cat
                        ? styles.categoryTextActive
                        : styles.categoryTextInactive
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* FEATURED */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>HANDPICKED</Text>

                <Text style={styles.sectionTitle}>Featured products</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('ProductListing')}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionLink}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featureRow}
            >
              {featuredProducts.map(renderFeaturedProduct)}
            </ScrollView>

            {/* SPECIAL OFFERS */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>LIMITED TIME</Text>

                <Text style={styles.sectionTitle}>Special offers</Text>
              </View>

              <View style={styles.offerTimer}>
                <Ionicons name='flash' size={12} color='#7c3aed' />

                <Text style={styles.offerTimerText}>HOT</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.offerRow}
            >
              {displayedOffers.map(renderOfferProduct)}
            </ScrollView>

            {/* TRENDING */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>WHAT'S POPULAR</Text>

                <Text style={styles.sectionTitle}>Trending now</Text>
              </View>

              <View style={styles.trendingIcon}>
                <Ionicons name='trending-up' size={16} color='#7c3aed' />
              </View>
            </View>

            <View style={styles.trendingGrid}>
              {trendingProducts.map(renderTrendingProduct)}
            </View>

            {/* POPULAR / FILTERED */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>FOR YOU</Text>

                <Text style={styles.sectionTitle}>Popular picks</Text>
              </View>

              {selectedCategory !== 'All' && (
                <View style={styles.activeFilter}>
                  <Text style={styles.activeFilterText}>
                    {selectedCategory}
                  </Text>
                </View>
              )}
            </View>

            {filteredProducts.length > 0 ? (
              <View style={styles.productGrid}>
                {filteredProducts.map(item => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.productCard}
                    activeOpacity={0.92}
                    onPress={() => openProduct(item)}
                  >
                    <View style={styles.productImageWrapper}>
                      <Image
                        source={{
                          uri: item.images?.[0]
                        }}
                        style={styles.productImage}
                        resizeMode='cover'
                      />

                      <TouchableOpacity
                        style={styles.productHeart}
                        onPress={event => {
                          event.stopPropagation()
                        }}
                      >
                        <Ionicons
                          name='heart-outline'
                          size={17}
                          color='#475569'
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.productMeta}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {item.name}
                      </Text>

                      <Text style={styles.productCategory}>
                        {item.category || 'Featured'}
                      </Text>

                      <View style={styles.priceRow}>
                        <Text style={styles.productPrice}>
                          ${Number(item.price || 0).toFixed(2)}
                        </Text>

                        <View style={styles.rating}>
                          <Ionicons name='star' size={11} color='#f59e0b' />

                          <Text style={styles.ratingText}>
                            {Number(item.rating || 4.5).toFixed(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noResults}>
                <View style={styles.noResultsIcon}>
                  <Ionicons name='search-outline' size={28} color='#7c3aed' />
                </View>

                <Text style={styles.noResultsTitle}>No products found</Text>

                <Text style={styles.noResultsDescription}>
                  Try another search or category.
                </Text>

                <TouchableOpacity
                  style={styles.clearFilterButton}
                  onPress={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                    filterProducts('', 'All')
                  }}
                >
                  <Text style={styles.clearFilterText}>Clear filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* EMPTY STATE */}
        {products.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name='bag-outline' size={42} color='#7c3aed' />
            </View>

            <Text style={styles.emptyTitle}>No products available yet</Text>

            <Text style={styles.emptyDescription}>
              Items will appear here once the catalog is loaded from the
              backend.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ff'
  },

  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 18,
    paddingBottom: 48
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f3ff'
  },

  loaderCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5
  },

  loadingText: {
    marginTop: 16,
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },

  headerLeft: {
    flex: 1,
    paddingRight: 16
  },

  welcomeText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 3
  },

  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827'
  },

  notificationBtn: {
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

  notificationDot: {
    position: 'absolute',
    top: 11,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#7c3aed'
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#e9e5ff',
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginBottom: 24,
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3
  },

  searchIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#f4f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    paddingVertical: 8
  },

  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12
  },

  heroEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#7c3aed',
    marginBottom: 4
  },

  heroSectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827'
  },

  heroDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 3
  },

  heroDotActive: {
    width: 18,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#7c3aed'
  },

  heroDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#c4b5fd'
  },

  heroList: {
    paddingRight: 18,
    paddingBottom: 4
  },

  heroCard: {
    width: 316,
    height: 205,
    borderRadius: 25,
    marginRight: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1e1b4b',
    shadowColor: '#7c3aed',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 7
  },

  heroImage: {
    width: '100%',
    height: '100%'
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.48)'
  },

  heroContent: {
    position: 'absolute',
    left: 20,
    right: 18,
    top: 18,
    bottom: 17,
    justifyContent: 'space-between'
  },

  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.88)',
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 6
  },

  heroBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginLeft: 5
  },

  heroTitle: {
    color: '#ffffff',
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '800',
    maxWidth: '88%'
  },

  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },

  heroPriceLabel: {
    color: '#cbd5e1',
    fontSize: 10,
    marginBottom: 2
  },

  heroPrice: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800'
  },

  heroArrow: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 28,
    marginBottom: 12
  },

  sectionEyebrow: {
    color: '#7c3aed',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 3
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827'
  },

  sectionLink: {
    fontSize: 13,
    color: '#7c3aed',
    fontWeight: '800',
    paddingBottom: 2
  },

  categoryList: {
    paddingRight: 18,
    paddingBottom: 3
  },

  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 15,
    marginRight: 9
  },

  categoryPillActive: {
    backgroundColor: '#7c3aed',
    shadowColor: '#7c3aed',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3
  },

  categoryPillInactive: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ebe8ff'
  },

  categoryText: {
    fontWeight: '700',
    fontSize: 13
  },

  categoryTextActive: {
    color: '#ffffff'
  },

  categoryTextInactive: {
    color: '#475569'
  },

  featureRow: {
    paddingRight: 18,
    paddingBottom: 4
  },

  featureCard: {
    width: 174,
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
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3
  },

  featureImageWrapper: {
    position: 'relative'
  },

  featureImage: {
    width: '100%',
    height: 132,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: '#f1f5f9'
  },

  imageHeart: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 31,
    height: 31,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  featureName: {
    fontWeight: '700',
    color: '#0f172a',
    fontSize: 13,
    marginBottom: 7
  },

  featureBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  featurePrice: {
    fontWeight: '800',
    color: '#7c3aed',
    fontSize: 15
  },

  smallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 4
  },

  smallRatingText: {
    color: '#92400e',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 3
  },

  offerTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ede9fe',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9
  },

  offerTimerText: {
    color: '#7c3aed',
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.6
  },

  offerRow: {
    paddingRight: 18,
    paddingBottom: 4
  },

  offerCard: {
    width: 205,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eeeaff',
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 7
    },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3
  },

  offerImageWrapper: {
    position: 'relative'
  },

  offerImage: {
    width: '100%',
    height: 145,
    backgroundColor: '#f1f5f9'
  },

  offerBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#7c3aed',
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 5
  },

  offerBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },

  offerInfo: {
    padding: 12
  },

  offerName: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7
  },

  offerPriceRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  offerPrice: {
    color: '#7c3aed',
    fontSize: 15,
    fontWeight: '800',
    marginRight: 7
  },

  oldPrice: {
    color: '#94a3b8',
    fontSize: 11,
    textDecorationLine: 'line-through'
  },

  trendingIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center'
  },

  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  trendingCard: {
    width: '48.2%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 13,
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

  trendingImageWrapper: {
    position: 'relative'
  },

  trendingImage: {
    width: '100%',
    height: 145,
    backgroundColor: '#f1f5f9'
  },

  trendingBadge: {
    position: 'absolute',
    top: 9,
    left: 9,
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5
  },

  trendingBadgeText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6
  },

  trendingInfo: {
    padding: 11
  },

  trendingName: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3
  },

  trendingCategory: {
    color: '#64748b',
    fontSize: 10,
    marginBottom: 8
  },

  trendingPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  trendingPrice: {
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: '800'
  },

  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 4
  },

  ratingPillText: {
    color: '#92400e',
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 3
  },

  activeFilter: {
    backgroundColor: '#ede9fe',
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 6
  },

  activeFilterText: {
    color: '#7c3aed',
    fontSize: 10,
    fontWeight: '800'
  },

  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  productCard: {
    width: '48.2%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
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

  productImageWrapper: {
    position: 'relative'
  },

  productImage: {
    width: '100%',
    height: 155,
    backgroundColor: '#f1f5f9'
  },

  productHeart: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.94)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  productMeta: {
    padding: 12
  },

  productName: {
    fontWeight: '700',
    color: '#0f172a',
    fontSize: 14,
    marginBottom: 3
  },

  productCategory: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'capitalize'
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  productPrice: {
    fontWeight: '800',
    color: '#7c3aed',
    fontSize: 15
  },

  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 4
  },

  ratingText: {
    color: '#92400e',
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 3
  },

  noResults: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eeeaff'
  },

  noResultsIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#f4f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14
  },

  noResultsTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 5
  },

  noResultsDescription: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16
  },

  clearFilterButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    paddingHorizontal: 17,
    paddingVertical: 10
  },

  clearFilterText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },

  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginTop: 50
  },

  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 25,
    backgroundColor: '#f4f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 7
  },

  emptyDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: '#64748b',
    textAlign: 'center'
  }
})
