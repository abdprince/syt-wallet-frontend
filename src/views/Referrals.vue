<template>
  <div class="referrals">
    <div class="header">
      <router-link to="/" class="back">←</router-link>
      <h2>الإحالات</h2>
    </div>
    
    <div v-if="loading" class="loading">جاري التحميل...</div>
    
    <div v-else class="content">
      <div class="invite-card">
        <h3>ادعو أصدقاءك واربح</h3>
        <p>احصل على 50 SYT لكل صديق ينضم</p>
        
        <div class="referral-link">
          <input :value="referralData?.referral_link" readonly />
          <button @click="copyLink">نسخ</button>
        </div>
        
        <div class="stats-grid">
          <div class="stat-box">
            <span class="number">{{ referralData?.total_referrals || 0 }}</span>
            <span class="label">الإحالات</span>
          </div>
          <div class="stat-box">
            <span class="number">{{ referralData?.total_rewards || 0 }}</span>
            <span class="label">الأرباح</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = 'https://syt-wallet-v2.vercel.app/api'

export default {
  name: 'Referrals',
  
  data() {
    return {
      referralData: null,
      loading: true
    }
  },
  
  computed: {
    wallet() {
      return this.$store.state.wallet
    }
  },
  
  mounted() {
    this.fetchReferrals()
  },
  
  methods: {
    async fetchReferrals() {
      try {
        const tg = window.Telegram.WebApp
        const response = await axios.get(`${API_URL}/referrals/stats/${this.wallet.address}`, {
          headers: { 'X-Telegram-Init-Data': tg.initData }
        })
        this.referralData = response.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    
    copyLink() {
      navigator.clipboard.writeText(this.referralData?.referral_link)
      window.Telegram.WebApp.showAlert('تم نسخ الرابط')
    }
  }
}
</script>

<style scoped>
.referrals { min-height: 100vh; background: #f5f5f5; }
.header { background: white; padding: 16px 20px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #e0e0e0; }
.back { font-size: 24px; text-decoration: none; color: #333; }
.header h2 { font-size: 18px; font-weight: 600; }
.loading { text-align: center; padding: 40px; color: #666; }
.content { padding: 16px; }
.invite-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 24px; color: white; margin-bottom: 20px; }
.invite-card h3 { font-size: 20px; margin-bottom: 8px; }
.invite-card p { opacity: 0.9; margin-bottom: 20px; font-size: 14px; }
.referral-link { display: flex; gap: 8px; margin-bottom: 20px; }
.referral-link input { flex: 1; padding: 12px; border: none; border-radius: 8px; font-size: 13px; background: rgba(255,255,255,0.2); color: white; }
.referral-link button { padding: 12px 20px; background: white; border: none; border-radius: 8px; color: #667eea; font-weight: 600; cursor: pointer; }
.stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.stat-box { background: rgba(255,255,255,0.15); border-radius: 12px; padding: 16px; text-align: center; }
.stat-box .number { display: block; font-size: 28px; font-weight: bold; margin-bottom: 4px; }
.stat-box .label { font-size: 12px; opacity: 0.9; }
</style>
