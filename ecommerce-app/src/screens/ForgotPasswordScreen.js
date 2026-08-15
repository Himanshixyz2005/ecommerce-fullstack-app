import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import API from '../services/api'

export default function ForgotPasswordScreen ({ navigation }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail) {
      Alert.alert('Missing email', 'Please enter your email address.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(cleanEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.')
      return
    }

    try {
      setLoading(true)

      const response = await API.post('/auth/forgot-password', {
        email: cleanEmail
      })

      const resetToken = response.data?.resetToken

      // Demo mode:
      // The backend returns the token when NODE_ENV is not production.
      if (resetToken) {
        navigation.navigate('ResetPassword', {
          token: resetToken,
          email: cleanEmail
        })
        return
      }

      Alert.alert(
        'Check your email',
        'If an account exists with this email, password reset instructions have been generated.'
      )
    } catch (error) {
      Alert.alert(
        'Reset failed',
        error.response?.data?.message ||
          'Unable to process your request. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Reset password</Text>

      <Text style={styles.title}>Forgot your password?</Text>

      <Text style={styles.subtitle}>
        Enter your registered email address to continue with password reset.
      </Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder='Email address'
          placeholderTextColor='#94a3b8'
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType='email-address'
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.backText}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f8fafc'
  },

  eyebrow: {
    color: '#4f46e5',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: 'uppercase'
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8
  },

  subtitle: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 24
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6
  },

  input: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    fontSize: 16,
    color: '#0f172a'
  },

  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3
  },

  buttonDisabled: {
    opacity: 0.7
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },

  backText: {
    color: '#4f46e5',
    fontWeight: '700',
    textAlign: 'center'
  }
})
