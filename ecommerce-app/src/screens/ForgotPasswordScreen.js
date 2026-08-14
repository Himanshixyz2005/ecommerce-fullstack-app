import { useState } from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

export default function ForgotPasswordScreen ({ navigation }) {
  const [email, setEmail] = useState('')

  const handleReset = () => {
    if (!email.trim()) {
      Alert.alert('Missing email', 'Please enter your email address.')
      return
    }

    Alert.alert(
      'Link sent',
      'Password reset instructions have been sent to your email.'
    )
    navigation.navigate('Login')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Reset password</Text>
      <Text style={styles.title}>Forgot your password?</Text>
      <Text style={styles.subtitle}>
        We will send a reset link to your email so you can get back in.
      </Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder='Email address'
          placeholderTextColor='#94a3b8'
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
          keyboardType='email-address'
        />

        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Send reset link</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
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
    boxShadow: '0px 8px 24px rgba(15, 23, 42, 0.06)',
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
    boxShadow: '0px 4px 12px rgba(79, 70, 229, 0.25)',
    elevation: 3
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
