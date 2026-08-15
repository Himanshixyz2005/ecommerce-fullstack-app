import { useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import API from '../services/api'

export default function ResetPasswordScreen ({ navigation, route }) {
  const { token } = route.params || {}

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)

  const handleResetPassword = async () => {
    if (!token) {
      setErrorMessage('This password reset session is invalid or incomplete.')
      setShowErrorModal(true)
      return
    }

    if (!password || !confirmPassword) {
      setErrorMessage('Please enter and confirm your new password.')
      setShowErrorModal(true)
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.')
      setShowErrorModal(true)
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Please make sure both passwords are the same.')
      setShowErrorModal(true)
      return
    }

    try {
      setLoading(true)

      await API.post('/auth/reset-password', {
        token,
        password
      })

      setShowSuccessModal(true)
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          'Unable to reset your password. Please request a new reset link.'
      )

      setShowErrorModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleGoToLogin = () => {
    setShowSuccessModal(false)
    navigation.navigate('Login')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Create new password</Text>

      <Text style={styles.title}>Reset your password</Text>

      <Text style={styles.subtitle}>
        Choose a strong password with at least 6 characters.
      </Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder='New password'
          placeholderTextColor='#94a3b8'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize='none'
        />

        <TextInput
          style={styles.input}
          placeholder='Confirm new password'
          placeholderTextColor='#94a3b8'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize='none'
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text style={styles.buttonText}>Update password</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.backText}>Back to login</Text>
        </TouchableOpacity>
      </View>

      {/* SUCCESS MODAL */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType='fade'
        onRequestClose={handleGoToLogin}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.successIcon}>
              <Text style={styles.checkmark}>✓</Text>
            </View>

            <Text style={styles.modalTitle}>Password Updated!</Text>

            <Text style={styles.modalMessage}>
              Your password has been reset successfully. You can now log in with
              your new password.
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleGoToLogin}
            >
              <Text style={styles.modalButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ERROR MODAL */}
      <Modal
        visible={showErrorModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.errorIcon}>
              <Text style={styles.errorMark}>!</Text>
            </View>

            <Text style={styles.modalTitle}>Something went wrong</Text>

            <Text style={styles.modalMessage}>{errorMessage}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={styles.modalButtonText}>Try Again</Text>
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
    marginBottom: 16,
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
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },

  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.2,
    shadowRadius: 20
  },

  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18
  },

  checkmark: {
    fontSize: 34,
    fontWeight: '800',
    color: '#16a34a'
  },

  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18
  },

  errorMark: {
    fontSize: 32,
    fontWeight: '800',
    color: '#dc2626'
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 10,
    textAlign: 'center'
  },

  modalMessage: {
    fontSize: 15,
    lineHeight: 22,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24
  },

  modalButton: {
    width: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center'
  },

  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  }
})
