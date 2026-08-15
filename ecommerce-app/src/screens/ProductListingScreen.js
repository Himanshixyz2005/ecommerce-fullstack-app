import { Ionicons } from '@expo/vector-icons'
import { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import API from '../services/api'

export default function ProductListingScreen ({ navigation }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortOption, setSortOption] = useState('featured')

  const [showFilters, setShowFilters] = useState(false)
  const [selectedSort, setSelectedSort] = useState('featured')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)

      const response = await API.get('/products')

      setProducts(response.data || [])
    } catch (error) {
      console.log(
        'Failed to fetch products:',
        error.response?.data || error.message
      )

      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map(product => product.category).filter(Boolean))
    )

    return ['All', ...uniqueCategories]
  }, [products])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        product =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()

      result = result.filter(product => {
        const name = product.name?.toLowerCase() || ''
        const category = product.category?.toLowerCase() || ''
        const description = product.description?.toLowerCase() || ''

        return (
          name.includes(query) ||
          category.includes(query) ||
          description.includes(query)
        )
      })
    }

    // Sorting
    if (sortOption === 'priceLow') {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
    }

    if (sortOption === 'priceHigh') {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
    }

    if (sortOption === 'rating') {
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    }

    if (sortOption === 'name') {
      result.sort((a, b) =>
        String(a.name || '').localeCompare(String(b.name || ''))
      )
    }

    return result
  }, [products, selectedCategory, searchQuery, sortOption])

  const openProduct = product => {
    navigation.navigate('ProductDetail', {
      product,
      relatedProducts: products
    })
  }

  const applySort = option => {
    setSelectedSort(option)
    setSortOption(option)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSortOption('featured')
    setSelectedSort('featured')
    setShowFilters(false)
  }

  const getSortLabel = () => {
    switch (sortOption) {
      case 'priceLow':
        return 'Price: Low to High'

      case 'priceHigh':
        return 'Price: High to Low'

      case 'rating':
        return 'Top Rated'

      case 'name':
        return 'Name: A-Z'

      default:
        return 'Featured'
    }
  }

  const renderProduct = product => {
    const rating = Number(product.rating || 4.5)

    return (
      <TouchableOpacity
        key={product._id}
        style={styles.productCard}
        activeOpacity={0.92}
        onPress={() => openProduct(product)}
      >
        <View style={styles.imageContainer}>
          {product.images?.[0] ? (
            <Image
              source={{
                uri: product.images[0]
              }}
              style={styles.productImage}
              resizeMode='cover'
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name='image-outline' size={32} color='#a78bfa' />
            </View>
          )}

          <TouchableOpacity
            style={styles.wishlistButton}
            activeOpacity={0.8}
            onPress={event => {
              event.stopPropagation()
            }}
          >
            <Ionicons name='heart-outline' size={18} color='#475569' />
          </TouchableOpacity>

          {rating >= 4.5 && (
            <View style={styles.topRatedBadge}>
              <Ionicons name='star' size={10} color='#ffffff' />

              <Text style={styles.topRatedText}>TOP RATED</Text>
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productCategory} numberOfLines={1}>
            {product.category || 'Collection'}
          </Text>

          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>

          <View style={styles.bottomRow}>
            <Text style={styles.productPrice}>
              ${Number(product.price || 0).toFixed(2)}
            </Text>

            <View style={styles.ratingBadge}>
              <Ionicons name='star' size={11} color='#f59e0b' />

              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size='large' color='#7c3aed' />

          <Text style={styles.loadingText}>Loading our collection...</Text>
        </View>
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
          <View>
            <Text style={styles.eyebrow}>DISCOVER</Text>

            <Text style={styles.title}>Explore products</Text>

            <Text style={styles.subtitle}>Find something you'll love.</Text>
          </View>

          <TouchableOpacity
            style={styles.filterIconButton}
            onPress={() => setShowFilters(true)}
            activeOpacity={0.85}
          >
            <Ionicons name='options-outline' size={21} color='#7c3aed' />

            {sortOption !== 'featured' && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIconWrapper}>
            <Ionicons name='search-outline' size={19} color='#7c3aed' />
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder='Search products, categories...'
            placeholderTextColor='#94a3b8'
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize='none'
            autoCorrect={false}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name='close-circle' size={19} color='#94a3b8' />
            </TouchableOpacity>
          )}
        </View>

        {/* CATEGORIES */}
        <View style={styles.categoryHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>

          <Text style={styles.resultCount}>
            {filteredProducts.length} items
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map(category => {
            const active = selectedCategory === category

            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryPill,
                  active && styles.categoryPillActive
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.85}
              >
                {category === 'All' && (
                  <Ionicons
                    name='apps-outline'
                    size={14}
                    color={active ? '#ffffff' : '#7c3aed'}
                  />
                )}

                <Text
                  style={[
                    styles.categoryText,
                    active && styles.categoryTextActive
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* FILTER / SORT ROW */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => setShowFilters(true)}
            activeOpacity={0.85}
          >
            <Ionicons name='options-outline' size={17} color='#475569' />

            <Text style={styles.toolbarText}>Filter & Sort</Text>
          </TouchableOpacity>

          <View style={styles.sortLabel}>
            <Ionicons name='swap-vertical-outline' size={15} color='#7c3aed' />

            <Text style={styles.sortText}>{getSortLabel()}</Text>
          </View>
        </View>

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <View style={styles.productGrid}>
            {filteredProducts.map(renderProduct)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name='search-outline' size={30} color='#7c3aed' />
            </View>

            <Text style={styles.emptyTitle}>No products found</Text>

            <Text style={styles.emptyText}>
              We couldn't find anything matching your search or selected
              category.
            </Text>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFilters}
              activeOpacity={0.85}
            >
              <Text style={styles.clearButtonText}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* FILTER MODAL */}
      <Modal
        visible={showFilters}
        transparent
        animationType='slide'
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>REFINE</Text>

                <Text style={styles.modalTitle}>Sort products</Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFilters(false)}
              >
                <Ionicons name='close' size={20} color='#475569' />
              </TouchableOpacity>
            </View>

            {[
              {
                value: 'featured',
                label: 'Featured',
                icon: 'sparkles-outline'
              },
              {
                value: 'priceLow',
                label: 'Price: Low to High',
                icon: 'arrow-up-outline'
              },
              {
                value: 'priceHigh',
                label: 'Price: High to Low',
                icon: 'arrow-down-outline'
              },
              {
                value: 'rating',
                label: 'Top Rated',
                icon: 'star-outline'
              },
              {
                value: 'name',
                label: 'Name: A-Z',
                icon: 'text-outline'
              }
            ].map(option => {
              const active = selectedSort === option.value

              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.sortOption, active && styles.sortOptionActive]}
                  onPress={() => applySort(option.value)}
                  activeOpacity={0.85}
                >
                  <View
                    style={[styles.sortIcon, active && styles.sortIconActive]}
                  >
                    <Ionicons
                      name={option.icon}
                      size={18}
                      color={active ? '#ffffff' : '#7c3aed'}
                    />
                  </View>

                  <Text
                    style={[
                      styles.sortOptionText,
                      active && styles.sortOptionTextActive
                    ]}
                  >
                    {option.label}
                  </Text>

                  {active && (
                    <Ionicons
                      name='checkmark-circle'
                      size={21}
                      color='#7c3aed'
                    />
                  )}
                </TouchableOpacity>
              )
            })}

            <TouchableOpacity
              style={styles.resetButton}
              onPress={clearFilters}
              activeOpacity={0.85}
            >
              <Text style={styles.resetButtonText}>Reset all filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 110
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f3ff'
  },

  loadingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 36,
    paddingVertical: 30,
    alignItems: 'center',
    shadowColor: '#1f2937',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6
  },

  loadingText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 14
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },

  eyebrow: {
    color: '#7c3aed',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 5
  },

  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4
  },

  subtitle: {
    color: '#64748b',
    fontSize: 14
  },

  filterIconButton: {
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

  filterDot: {
    position: 'absolute',
    top: 9,
    right: 9,
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

  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827'
  },

  resultCount: {
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: '700'
  },

  categoryList: {
    paddingRight: 18,
    paddingBottom: 3
  },

  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ebe8ff',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 9
  },

  categoryPillActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
    shadowColor: '#7c3aed',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3
  },

  categoryText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 5
  },

  categoryTextActive: {
    color: '#ffffff'
  },

  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 14
  },

  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#ebe8ff'
  },

  toolbarText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6
  },

  sortLabel: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  sortText: {
    color: '#7c3aed',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 5
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
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3
  },

  imageContainer: {
    position: 'relative'
  },

  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f1f5f9'
  },

  imagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#f4f3ff',
    justifyContent: 'center',
    alignItems: 'center'
  },

  wishlistButton: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 33,
    height: 33,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.94)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  topRatedBadge: {
    position: 'absolute',
    bottom: 9,
    left: 9,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5
  },

  topRatedText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft: 3
  },

  productInfo: {
    padding: 12
  },

  productCategory: {
    color: '#7c3aed',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },

  productName: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
    minHeight: 38,
    marginBottom: 9
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  productPrice: {
    color: '#7c3aed',
    fontSize: 15,
    fontWeight: '800'
  },

  ratingBadge: {
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

  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#eeeaff'
  },

  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#f4f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },

  emptyTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 7
  },

  emptyText: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 18
  },

  clearButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 13,
    paddingHorizontal: 18,
    paddingVertical: 11
  },

  clearButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.5)'
  },

  modalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 28
  },

  modalHandle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
    marginBottom: 20
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },

  modalEyebrow: {
    color: '#7c3aed',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginBottom: 4
  },

  modalTitle: {
    color: '#111827',
    fontSize: 23,
    fontWeight: '800'
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center'
  },

  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 10,
    marginBottom: 8
  },

  sortOptionActive: {
    backgroundColor: '#f4f3ff'
  },

  sortIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f4f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },

  sortIconActive: {
    backgroundColor: '#7c3aed'
  },

  sortOptionText: {
    flex: 1,
    color: '#475569',
    fontSize: 14,
    fontWeight: '600'
  },

  sortOptionTextActive: {
    color: '#111827',
    fontWeight: '800'
  },

  resetButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10
  },

  resetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800'
  }
})
