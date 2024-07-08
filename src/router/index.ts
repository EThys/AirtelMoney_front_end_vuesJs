import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/public/HomeView.vue'
import Login from '@/views/public/auth/LoginView.vue'
import Profile from '@/views/public/ProfileView.vue'
import NotFound from '@/views/public/NotFoundView.vue'
import TransactionView from '@/views/public/transactions/TransactionView.vue'
// import originalView from '@/views/public/transactions/originalView.vue'
import OtpView from '@/views/public/auth/OtpView.vue'
import AuthLoginView from '@/views/public/auth/AuthLoginView.vue'
// import AddTransactionView from '@/views/public/transactions/AddTransactionModalView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: AuthLoginView },
    { path: '/profile', name: 'profile', component: Profile },
    { path: '/currency/:currency', name: 'currency', component: TransactionView },
    { path: '/otp', name: 'otp', component: OtpView },
    { path: '/:pathMatch(.*)*', component: NotFound }
    // { path: '/home', name: 'home', component: Home }, // component: () => import('../views/AboutView.vue')
    // { path: '/currency/currencyCode:', name: 'currency', component: Profile },
  ]
})

export default router
