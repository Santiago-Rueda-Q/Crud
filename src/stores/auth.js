// stores/auth.js
import { defineStore } from 'pinia'
import api from '@/configApi/Axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('auth_token') || null,
    isAuthenticated: !!localStorage.getItem('auth_token'),
  }),

  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    async register(userData) {
      try {
        const response = await api.post('/register', userData)

        if (response.status === 201) {
          const { user, token, message } = response.data

          localStorage.setItem('auth_token', token)
          localStorage.setItem('user', JSON.stringify(user))

          this.token = token
          this.user = user
          this.isAuthenticated = true

          return {
            success: true,
            message: message,
            user: user
          }
        }
      } catch (error) {
        console.error('Error en registro:', error)

        if (error.response?.status === 422) {
          return {
            success: false,
            message: 'Error de validación',
            errors: error.response.data.errors
          }
        }

        return {
          success: false,
          message: error.response?.data?.message || 'Error en el registro',
          errors: {}
        }
      }
    },

    async login(credentials) {
      try {
        const response = await api.post('/login', credentials)

        if (response.status === 200) {
          const { user, token, message } = response.data

          localStorage.setItem('auth_token', token)
          localStorage.setItem('user', JSON.stringify(user))

          this.token = token
          this.user = user
          this.isAuthenticated = true

          return {
            success: true,
            message: message,
            user: user
          }
        }
      } catch (error) {
        console.error('Error en login:', error)

        return {
          success: false,
          message: error.response?.data?.message || 'Error de autenticación',
          errors: {}
        }
      }
    },

    async logout() {
      try {
        await api.post('/logout')
      } catch (error) {
        console.error('Error en logout:', error)
      } finally {
        this.clearAuthData()
      }
    },

    clearAuthData() {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      this.token = null
      this.user = null
      this.isAuthenticated = false
    },

    async checkAuth() {
      if (!this.token) {
        return false
      }

      try {
        const response = await api.get('/user')
        this.user = response.data
        return true
      } catch (error) {
        this.clearAuthData()
        return false
      }
    }
  }
})
