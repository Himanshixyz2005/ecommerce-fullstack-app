import { useContext, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { AuthContext } from '../context/AuthContext'

export default function LoginScreen ({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)

  const handleLogin = async () => {
    const cleanEmail = email.trim()
    if (!cleanEmail || !password) {
      Alert.alert('Error', 'Please fill in both email and password.')
      return
    }

    setLoading(true)
    const result = await login(cleanEmail, password)
    setLoading(false)

    if (!result.success) {
      Alert.alert('Login Failed', result.message)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.eyebrow}>Welcome back</Text>
        <Text style={styles.title}>Login to your account</Text>
        <Text style={styles.subtitle}>
          Shop smarter with curated deals and faster checkout.
        </Text>
      </View>

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

        <TextInput
          style={styles.input}
          placeholder='Password'
          placeholderTextColor='#94a3b8'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.forgotLink}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>Create one</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f4f3ff',
    paddingHorizontal: 24,
    paddingVertical: 32
  },
  headerBlock: {
    marginBottom: 24
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#7c3aed',
    marginBottom: 8
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#1f2937',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8
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
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 20
  },
  forgotText: {
    color: '#7c3aed',
    fontWeight: '600'
  },
  button: {
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText: {
    color: '#64748b',
    marginRight: 6
  },
  linkText: {
    color: '#7c3aed',
    fontWeight: '700'
  }
})
