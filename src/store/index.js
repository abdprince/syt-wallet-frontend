import { createStore } from 'vuex'
import axios from 'axios'

const API_URL = 'https://syt-wallet-api.onrender.com'

export default createStore({
  state: {
    user: null,
    wallet: null,
    loading: false
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_WALLET(state, wallet) {
      state.wallet = wallet
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  
  actions: {
    async login({ commit }) {
      commit('SET_LOADING', true)
      
      try {
        const tg = window.Telegram.WebApp
        const initData = tg.initData
        
        const response = await axios.post(`${API_URL}/auth/login`, {}, {
          headers: {
            'X-Telegram-Init-Data': initData
          }
        })
        
        commit('SET_USER', tg.initDataUnsafe.user)
        commit('SET_WALLET', response.data.wallet)
        
      } catch (error) {
        console.error('Login error:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
})
