<template>
  <div class="rewards">
    <div class="header">
      <router-link to="/" class="back">←</router-link>
      <h2>مكافأة تسجيل الدخول</h2>
    </div>
    
    <div v-if="loading" class="loading">جاري التحميل...</div>
    
    <div v-else class="content">
      <div class="reward-card" :class="{ 'can-claim': rewardData?.can_claim }">
        <div class="streak">
        </div>
        
        <div class="reward-amount">
          <span class="amount">{{ rewardData?.reward_amount || 10 }}</span>
          <span class="unit">SYT</span>
        </div>
        
        <button @click="claim" :disabled="!rewardData?.can_claim || claiming" class="btn-claim">
          {{ claiming ? 'جاري...' : 'المطالبة الآن' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = 'https://syt-wallet-v2.vercel.app/api'

export default {
  name: 'Rewards',
  
  data() {
    return {
      rewardData: null,
      loading: true,
      claiming: false
    }
  },
  
  computed: {
    wallet() {
      return this.$store.state.wallet
    }
  },
  
  mounted() {
    this.fetchReward()
  },
  
  methods: {
    async fetchReward() {
      try {
        const tg = window.Telegram.WebApp
        const response = await axios.get(`${API_URL}/rewards/daily/${this.wallet.address}`, {
          headers: { 'X-Telegram-Init-Data': tg.initData }
        })
        this.rewardData = response.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    
    async claim() {
      this.claiming = true
      try {
        const tg = window.Telegram.WebApp
        await axios.post(`${API_URL}/rewards/daily/claim`, {
          address: this.wallet.address
        }, {
          headers: { 'X-Telegram-Init-Data': tg.initData }
        })
        window.Telegram.WebApp.showAlert('تم الحصول على المكافأة!')
        await this.fetchReward()
        await this.$store.dispatch('fetchWallet')
      } catch (error) {
        window.Telegram.WebApp.showAlert('فشلت المطالبة')
      } finally {
        this.claiming = false
      }
    }
  }
}
</script>

<style scoped>
.rewards { min-height: 100vh; background: #f5f5f5; }
.header { background: white; padding: 16px 20px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #e0e0e0; }
.back { font-size: 24px; text-decoration: none; color: #333; }
.header h2 { font-size: 18px; font-weight: 600; }
.loading { text-align: center; padding: 40px; color: #666; }
.content { padding: 20px; }
.reward-card { background: white; border-radius: 16px; padding: 24px; text-align: center; border: 2px solid #e0e0e0; }
.reward-card.can-claim { border-color: #28a745; }
.streak { margin-bottom: 16px; }
.reward-amount { margin-bottom: 16px; }
.reward-amount .amount { font-size: 48px; font-weight: bold; color: #667eea; display: block; }
.reward-amount .unit { font-size: 18px; color: #666; }
.btn-claim { width: 100%; padding: 16px; background: #28a745; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
.btn-claim:disabled { background: #ccc; cursor: not-allowed; }
</style>
