import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/public/HomeView.vue'
import Login from '@/views/public/auth/LoginView.vue'
import Profile from '@/views/public/ProfileView.vue'
import NotFound from '@/views/public/NotFoundView.vue'
import TransactionView from '@/views/public/transactions/TransactionView.vue'
import originalView from '@/views/public/transactions/originalView.vue'
// import AddTransactionView from '@/views/public/transactions/AddTransactionModalView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: Login },
    { path: '/profile', name: 'profile', component: Profile },
    { path: '/currency/:currency', name: 'currency', component: TransactionView },
    { path: '/currency/eth', name: 'eth', component: originalView },
    { path: '/:pathMatch(.*)*', component: NotFound }
    // { path: '/home', name: 'home', component: Home }, // component: () => import('../views/AboutView.vue')
    // { path: '/currency/currencyCode:', name: 'currency', component: Profile },
  ]
})

export default router
