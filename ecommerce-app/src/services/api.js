import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api' // Change to your local IP if testing on a physical device
})

// Automatically attach JWT token to requests if available
API.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default API
