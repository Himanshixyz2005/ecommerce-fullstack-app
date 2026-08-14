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
        filterProducts(searchQuery, selectedCategory)
      }
    } catch (error) {
      setProducts([])
      setFilteredProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = (query, category) => {
    let temp = [...products]

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

  const renderFeaturedProduct = item => (
    <TouchableOpacity
      key={item._id}
      style={styles.featureCard}
      onPress={() =>
        navigation.navigate('ProductDetail', {
          product: item,
          relatedProducts: products
        })
      }
    >
      <Image
        source={{ uri: item.images?.[0] }}
        style={styles.featureImage}
        resizeMode='cover'
      />
      <Text style={styles.featureName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.featurePrice}>
        ${Number(item.price || 0).toFixed(2)}
      </Text>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size='large' color='#7c3aed' />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Shopper'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name='notifications-outline' size={20} color='#334155' />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name='search-outline'
            size={18}
            color='#94a3b8'
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder='Search high-end products...'
            placeholderTextColor='#94a3b8'
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {products.length > 0 && (
          <>
            {/* Categories Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {visibleCategories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryPill,
                    selectedCategory === cat
                      ? styles.categoryPillActive
                      : styles.categoryPillInactive
                  ]}
                  onPress={() => handleCategorySelect(cat)}
                >
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

            {/* Featured Products */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured products</Text>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featureRow}
            >
              {products.slice(0, 6).map(renderFeaturedProduct)}
            </ScrollView>

            {/* Popular Picks Grid */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular picks</Text>
            </View>

            <View style={styles.productGrid}>
              {filteredProducts.map(item => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.productCard}
                  onPress={() =>
                    navigation.navigate('ProductDetail', {
                      product: item,
                      relatedProducts: products
                    })
                  }
                >
                  <Image
                    source={{ uri: item.images?.[0] }}
                    style={styles.productImage}
                    resizeMode='cover'
                  />
                  <View style={styles.productMeta}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.productCategory}>{item.category}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.productPrice}>
                        ${Number(item.price || 0).toFixed(2)}
                      </Text>
                      <Text style={styles.rating}>
                        ★ {Number(item.rating || 4.5).toFixed(1)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {products.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name='bag-outline' size={52} color='#94a3b8' />
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
    backgroundColor: '#f8fafc'
  },
  scrollContent: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 40
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  welcomeText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a'
  },
  notificationBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 10,
    boxShadow: '0px 4px 12px rgba(15, 23, 42, 0.08)',
    elevation: 3
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a'
  },
  heroList: {
    paddingRight: 16,
    marginBottom: 8
  },
  heroBanner: {
    width: 290,
    height: 155,
    borderRadius: 22,
    marginRight: 14,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0px 6px 16px rgba(79, 70, 229, 0.15)',
    elevation: 4
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.75
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.35)'
  },
  heroContent: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18
  },
  heroTag: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a'
  },
  sectionLink: {
    fontSize: 13,
    color: '#4f46e5',
    fontWeight: '700'
  },
  categoryList: {
    paddingBottom: 4
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 10
  },
  categoryPillActive: {
    backgroundColor: '#4f46e5'
  },
  categoryPillInactive: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0'
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
    paddingRight: 16,
    paddingBottom: 4
  },
  featureCard: {
    width: 155,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0px 4px 12px rgba(15, 23, 42, 0.05)',
    elevation: 2
  },
  featureImage: {
    width: '100%',
    height: 115,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f1f5f9'
  },
  featureName: {
    fontWeight: '700',
    color: '#0f172a',
    fontSize: 13,
    marginBottom: 4
  },
  featurePrice: {
    fontWeight: '800',
    color: '#4f46e5',
    fontSize: 14
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 4
  },
  productCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0px 6px 16px rgba(15, 23, 42, 0.05)',
    elevation: 3
  },
  productImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#f1f5f9'
  },
  productMeta: {
    padding: 12
  },
  productName: {
    fontWeight: '700',
    color: '#0f172a',
    fontSize: 14,
    marginBottom: 2
  },
  productCategory: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'capitalize'
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  productPrice: {
    fontWeight: '800',
    color: '#4f46e5',
    fontSize: 15
  },
  rating: {
    color: '#f59e0b',
    fontWeight: '700',
    fontSize: 12
  }
})
