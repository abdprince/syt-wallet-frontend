<template>
  <div class="home">
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
    </div>
    
    <div v-else class="login-section">
      <button @click="login" class="btn-primary">
        فتح المحفظة
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  
  computed: {
    wallet() {
      return this.$store.state.wallet
    },
    loading() {
      return this.$store.state.loading
    }
  },
  
  mounted() {
    if (window.Telegram.WebApp.initData) {
      this.login()
    }
  },
  
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login')
      } catch (error) {
        alert('فشل تسجيل الدخول')
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
</style>
