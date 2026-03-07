<template>
  <div class="home">
    <!-- ✅ Debug Box -->
    <div class="debug-box" v-if="showDebug">
      <h4>🔧 Debug Info:</h4>
      <p><strong>API_URL:</strong> {{ API_URL }}</p>
      <p><strong>initData:</strong> {{ initDataStatus }}</p>
      <p><strong>Error:</strong> {{ debugError || 'None' }}</p>
      <button @click="showDebug = false">إخفاء</button>
    </div>
    <button v-else @click="showDebug = true" class="btn-debug">🔧 Debug</button>
    
    <div class="header">
      <h1>SYT Wallet</h1>
      <p>محفظتك الرقمية الآمنة</p>
    </div>
    
    <div v-if="loading" class="loading">
      جاري التحميل...
    </div>
    
    <div v-else-if="wallet" class="wallet-card">
      <div class="balance-section">
        <span class="label">الرصيد</span>
        <span class="amount">{{ wallet.balance.toFixed(2) }}</span>
        <span class="currency">SYT</span>
      </div>
      
      <div class="address-section">
        <span class="label">عنوان المحفظة</span>
        <div class="address">
          <code>{{ wallet.address }}</code>
          <button @click="copyAddress">نسخ</button>
        </div>
      </div>
      
      <div class="stats">
        <div class="stat">
          <span class="value">{{ wallet.total_earned.toFixed(2) }}</span>
          <span class="label">إجمالي الأرباح</span>
        </div>
      </div>
    </div>
    
    <div v-else class="login-section">
      <button @click="login" class="btn-primary">
        فتح المحفظة
      </button>
    </div>
    
    <!-- ✅ الأزرار -->
    <nav v-if="wallet" class="main-nav">
      <router-link to="/transfer" class="nav-item">
        <span class="icon">↗️</span>
        <span>تحويل</span>
      </router-link>
      <router-link to="/rewards" class="nav-item">
        <span class="icon">🎁</span>
        <span>المكافآت</span>
      </router-link>
      <router-link to="/tasks" class="nav-item">
        <span class="icon">✅</span>
        <span>المهام</span>
      </router-link>
      <router-link to="/referrals" class="nav-item">
        <span class="icon">👥</span>
        <span>الإحالات</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = 'https://syt-wallet-v2.onrender.com/api'

export default {
  name: 'Home',
  
  data() {
    return {
      showDebug: false,
      debugError: '',
      initDataStatus: 'Checking...'
    }
  },
  
  computed: {
    wallet() {
      return this.$store.state.wallet
    },
    loading() {
      return this.$store.state.loading
    },
    API_URL() {
      return API_URL
    }
  },
  
  mounted() {
    // ✅ Check initData
    const tg = window.Telegram.WebApp
    this.initDataStatus = tg.initData ? '✅ Present' : '❌ Missing'
    
    if (tg.initData) {
      this.login()
    }
  },
  
  methods: {
    async login() {
      this.debugError = ''
      
      try {
        const tg = window.Telegram.WebApp
        
        console.log('🔍 Sending request to:', `${API_URL}/auth/login`)
        console.log('🔍 initData:', tg.initData.substring(0, 50) + '...')
        
        const response = await axios.post(`${API_URL}/auth/login`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'X-Telegram-Init-Data': tg.initData
          },
          timeout: 10000
        })
        
        console.log('✅ Response:', response.data)
        this.$store.commit('SET_USER', tg.initDataUnsafe.user)
        this.$store.commit('SET_WALLET', response.data.wallet)
        
      } catch (error) {
        console.error('❌ Login error:', error)
        this.debugError = error.message
        if (error.response) {
          this.debugError += ` | Status: ${error.response.status}`
          this.debugError += ` | Data: ${JSON.stringify(error.response.data)}`
        }
      }
    },
    
    copyAddress() {
      navigator.clipboard.writeText(this.wallet.address)
      window.Telegram.WebApp.showAlert('تم نسخ العنوان')
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.debug-box {
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 12px;
  font-family: monospace;
}

.debug-box h4 {
  margin: 0 0 8px 0;
  color: #856404;
}

.debug-box p {
  margin: 4px 0;
  word-break: break-all;
}

.btn-debug {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-bottom: 16px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #667eea;
  font-size: 28px;
  margin-bottom: 8px;
}

.header p {
  color: #666;
  font-size: 14px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.wallet-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  margin-bottom: 20px;
}

.balance-section {
  text-align: center;
  margin-bottom: 24px;
}

.balance-section .label {
  display: block;
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.balance-section .amount {
  font-size: 42px;
  font-weight: bold;
  display: block;
}

.balance-section .currency {
  font-size: 16px;
  opacity: 0.9;
}

.address-section {
  background: rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.address-section .label {
  display: block;
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.address {
  display: flex;
  align-items: center;
  gap: 8px;
}

.address code {
  flex: 1;
  font-size: 12px;
  word-break: break-all;
}

.address button {
  background: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  color: #667eea;
}

.stats {
  display: flex;
  justify-content: center;
}

.stat {
  text-align: center;
}

.stat .value {
  display: block;
  font-size: 20px;
  font-weight: bold;
}

.stat .label {
  font-size: 12px;
  opacity: 0.9;
}

.login-section {
  text-align: center;
  padding: 40px;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
}

.main-nav {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 20px;
}

.nav-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  color: #333;
  transition: transform 0.2s;
}

.nav-item:active {
  transform: scale(0.98);
}

.nav-item .icon {
  display: block;
  font-size: 28px;
  margin-bottom: 8px;
}

.nav-item span:last-child {
  font-size: 14px;
  font-weight: 500;
}
</style>
