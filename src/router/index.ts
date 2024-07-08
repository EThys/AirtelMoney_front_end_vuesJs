import { createRouter, createWebHistory } from 'vue-router'
import Profile from '@/views/public/ProfileView.vue'
import NotFound from '@/views/public/NotFoundView.vue'
import TransactionView from '@/views/public/transactions/TransactionView.vue'
import OtpView from '@/views/public/auth/OtpView.vue'
import AuthLoginView from '@/views/public/auth/AuthLoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'AuthLoginView', component: AuthLoginView },
    { path: '/profile', name: 'profile', component: Profile },
    { path: '/currency/:currency', name: 'currency', component: TransactionView },
    { path: '/otp', name: 'otp', component: OtpView },
    // { path: '/currency/eth', name: 'AuthLoginView', component: AuthLoginView },
    { path: '/:pathMatch(.*)*', component: NotFound }
    // { path: '/home', name: 'home', component: Home }, // component: () => import('../views/AboutView.vue')
  ]
})

export default router
