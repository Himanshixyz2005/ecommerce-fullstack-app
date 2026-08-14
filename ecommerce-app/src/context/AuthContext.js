import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useEffect, useState } from 'react'
import API from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for saved user session on app launch
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token')
        const storedUser = await AsyncStorage.getItem('user')
        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Failed to load storage data', error)
      } finally {
        setLoading(false)
      }
    }
    loadStorageData()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password })
      const { token, ...userData } = response.data
      setToken(token)
      setUser(userData)
      await AsyncStorage.setItem('token', token)
      await AsyncStorage.setItem('user', JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await API.post('/auth/register', {
        name,
        email,
        password
      })
      const { token, ...userData } = response.data
      setToken(token)
      setUser(userData)
      await AsyncStorage.setItem('token', token)
      await AsyncStorage.setItem('user', JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  const logout = async () => {
    setToken(null)
    setUser(null)
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
