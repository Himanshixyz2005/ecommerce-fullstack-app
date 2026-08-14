import { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'

export default function SplashScreen ({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false
      })
    ]).start()

    const timer = setTimeout(() => {
      navigation.replace('Login')
    }, 1800)

    return () => clearTimeout(timer)
  }, [fadeAnim, navigation, scaleAnim])

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoWrap,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.logoBubble}>
          <Text style={styles.logoText}>S</Text>
        </View>
      </Animated.View>
      <Text style={styles.brand}>ShopSphere</Text>
      <Text style={styles.tagline}>Premium essentials for everyday living</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  },
  logoWrap: {
    marginBottom: 18
  },
  logoBubble: {
    width: 110,
    height: 110,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    boxShadow: '0px 12px 24px rgba(79, 70, 229, 0.3)',
    elevation: 8
  },
  logoText: {
    color: '#fff',
    fontSize: 44,
    fontWeight: '900'
  },
  brand: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 6,
    letterSpacing: 0.5
  },
  tagline: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3
  }
})
