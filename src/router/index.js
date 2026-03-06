import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Transfer from '../views/Transfer.vue'
import Rewards from '../views/Rewards.vue'
import Tasks from '../views/Tasks.vue'
import Referrals from '../views/Referrals.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/transfer', name: 'Transfer', component: Transfer },
  { path: '/rewards', name: 'Rewards', component: Rewards },
  { path: '/tasks', name: 'Tasks', component: Tasks },
  { path: '/referrals', name: 'Referrals', component: Referrals }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
