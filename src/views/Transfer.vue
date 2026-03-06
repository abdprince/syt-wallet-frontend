<template>
  <div class="transfer">
    <div class="header">
      <router-link to="/" class="back">←</router-link>
      <h2>تحويل</h2>
    </div>
    
    <div class="form">
      <div class="input-group">
        <label>عنوان المحفظة</label>
        <input v-model="toAddress" placeholder="SYTxxxxxxxxxxxxxxxx" type="text"/>
      </div>
      
      <div class="input-group">
        <label>المبلغ</label>
        <input v-model.number="amount" placeholder="0.00" type="number" min="0" step="0.01"/>
        <span class="hint">الرصيد: {{ wallet?.balance.toFixed(2) }} SYT</span>
      </div>
      
      <button @click="transfer" :disabled="!canTransfer || sending" class="btn-transfer">
        {{ sending ? 'جاري...' : 'إرسال' }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = 'https://syt-wallet-v2.vercel.app/api'

export default {
  name: 'Transfer',
  
  data() {
    return {
      toAddress: '',
      amount: null,
      sending: false
    }
  },
  
  computed: {
    wallet() {
      return this.$store.state.wallet
    },
    canTransfer() {
      return this.toAddress && this.amount > 0 && this.amount <= this.wallet?.balance
    }
  },
  
  methods: {
    async transfer() {
      if (!this.canTransfer) return
      this.sending = true
      
      try {
        const tg = window.Telegram.WebApp
        
        await axios.post(`${API_URL}/wallet/transfer`, {
          to_address: this.toAddress,
          amount: this.amount
        }, {
          headers: { 'X-Telegram-Init-Data': tg.initData }
        })
        
        window.Telegram.WebApp.showAlert('تم التحويل!')
        await this.$store.dispatch('fetchWallet')
        this.$router.push('/')
        
      } catch (error) {
        window.Telegram.WebApp.showAlert(error.response?.data?.error || 'فشل')
      } finally {
        this.sending = false
      }
    }
  }
}
</script>

<style scoped>
.transfer { min-height: 100vh; background: #f5f5f5; }
.header { background: white; padding: 16px 20px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #e0e0e0; }
.back { font-size: 24px; text-decoration: none; color: #333; }
.header h2 { font-size: 18px; font-weight: 600; }
.form { padding: 20px; }
.input-group { margin-bottom: 20px; }
.input-group label { display: block; margin-bottom: 8px; font-size: 14px; color: #666; font-weight: 500; }
.input-group input { width: 100%; padding: 14px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; }
.hint { display: block; margin-top: 6px; font-size: 12px; color: #999; }
.btn-transfer { width: 100%; padding: 16px; background: #28a745; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
.btn-transfer:disabled { background: #ccc; cursor: not-allowed; }
</style>
