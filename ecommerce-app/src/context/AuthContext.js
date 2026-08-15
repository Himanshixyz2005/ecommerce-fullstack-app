import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useEffect, useState } from 'react'
import API from '../services/api'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem('token'),
          AsyncStorage.getItem('user')
        ])

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Failed to restore session:', error)
        await AsyncStorage.multiRemove(['token', 'user'])
      } finally {
        setLoading(false)
      }
    }

    loadStorageData()
  }, [])

  const saveSession = async (authToken, userData) => {
    setToken(authToken)
    setUser(userData)

    await AsyncStorage.multiSet([
      ['token', authToken],
      ['user', JSON.stringify(userData)]
    ])
  }

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', {
        email,
        password
      })

      const { token: authToken, ...userData } = response.data

      await saveSession(authToken, userData)

      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Unable to login. Please try again.'
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

      const { token: authToken, ...userData } = response.data

      await saveSession(authToken, userData)

      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Unable to create your account. Please try again.'
      }
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user'])
    } finally {
      setToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
