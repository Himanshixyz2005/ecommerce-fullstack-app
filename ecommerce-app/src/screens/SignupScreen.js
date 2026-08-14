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

export default function SignupScreen ({ navigation }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useContext(AuthContext)

  const handleSignup = async () => {
    const cleanName = name.trim()
    const cleanEmail = email.trim()

    if (!cleanName || !cleanEmail || !password) {
      Alert.alert('Error', 'Please complete all fields.')
      return
    }

    setLoading(true)
    const result = await register(cleanName, cleanEmail, password)
    setLoading(false)

    if (!result.success) {
      Alert.alert('Registration Failed', result.message)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.eyebrow}>Create account</Text>
        <Text style={styles.title}>Start shopping smarter</Text>
        <Text style={styles.subtitle}>
          Sign up to unlock premium offers and instant checkout.
        </Text>
      </View>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder='Full name'
          placeholderTextColor='#94a3b8'
          value={name}
          onChangeText={setName}
        />

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
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text style={styles.buttonText}>Create account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Login</Text>
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
    backgroundColor: '#f8fafc',
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
  button: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
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
