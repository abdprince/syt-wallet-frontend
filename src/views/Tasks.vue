<template>
  <div class="tasks">
    <div class="header">
      <router-link to="/" class="back">←</router-link>
      <h2>المهام</h2>
    </div>
    
    <div v-if="loading" class="loading">جاري التحميل...</div>
    
    <div v-else class="task-list">
      <div v-for="task in tasks" :key="task.id" class="task-card" :class="task.user_tasks[0]?.status">
        <div class="task-info">
          <h3>{{ task.title }}</h3>
          <p>{{ task.description }}</p>
          <span class="reward">+{{ task.reward_amount }} SYT</span>
        </div>
        
        <div class="task-actions">
          <button v-if="task.user_tasks[0]?.status === 'pending'" @click="completeTask(task.id)" class="btn-do">إنجاز</button>
          <button v-else-if="task.user_tasks[0]?.status === 'completed'" @click="claimTask(task.id)" class="btn-claim">المطالبة</button>
          <span v-else class="done">✓ تم</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = 'https://syt-wallet-v2.vercel.app/api'

export default {
  name: 'Tasks',
  
  data() {
    return {
      tasks: [],
      loading: true
    }
  },
  
  computed: {
    wallet() {
      return this.$store.state.wallet
    }
  },
  
  mounted() {
    this.fetchTasks()
  },
  
  methods: {
    async fetchTasks() {
      try {
        const tg = window.Telegram.WebApp
        const response = await axios.get(`${API_URL}/tasks/list/${this.wallet.address}`, {
          headers: { 'X-Telegram-Init-Data': tg.initData }
        })
        this.tasks = response.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    
    async completeTask(taskId) {
      try {
        const tg = window.Telegram.WebApp
        await axios.post(`${API_URL}/tasks/complete`, {
          address: this.wallet.address,
          task_id: taskId
        }, {
          headers: { 'X-Telegram-Init-Data': tg.initData }
        })
        await this.fetchTasks()
      } catch (error) {
        window.Telegram.WebApp.showAlert('فشل')
      }
    },
    
    async claimTask(taskId) {
      try {
        const tg = window.Telegram.WebApp
        await axios.post(`${API_URL}/tasks/claim`, {
          address: this.wallet.address,
          task_id: taskId
        }, {
          headers: { 'X-Telegram-Init-Data': tg.initData }
        })
        window.Telegram.WebApp.showAlert('تم!')
        await this.fetchTasks()
        await this.$store.dispatch('fetchWallet')
      } catch (error) {
        window.Telegram.WebApp.showAlert('فشل')
      }
    }
  }
}
</script>

<style scoped>
.tasks { min-height: 100vh; background: #f5f5f5; }
.header { background: white; padding: 16px 20px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #e0e0e0; }
.back { font-size: 24px; text-decoration: none; color: #333; }
.header h2 { font-size: 18px; font-weight: 600; }
.loading { text-align: center; padding: 40px; color: #666; }
.task-list { padding: 16px; }
.task-card { background: white; border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; border-right: 4px solid #ddd; }
.task-card.pending { border-right-color: #ffc107; }
.task-card.completed { border-right-color: #17a2b8; }
.task-card.claimed { border-right-color: #28a745; opacity: 0.7; }
.task-info h3 { font-size: 16px; margin-bottom: 4px; color: #333; }
.task-info p { font-size: 13px; color: #666; margin-bottom: 8px; }
.reward { background: #d4edda; color: #155724; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
.btn-do, .btn-claim { padding: 10px 20px; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; }
.btn-do { background: #ffc107; color: #333; }
.btn-claim { background: #17a2b8; color: white; }
.done { color: #28a745; font-size: 14px; font-weight: 600; }
</style>
