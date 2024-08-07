<script lang="ts" setup>
//@ts-ignore
import { useAxiosRequestWithToken } from '@/utils/service/axios_api'
//@ts-ignore
import { ApiRoutes } from '@/utils/service/endpoint/api'
import { useRouter } from 'vue-router'
//@ts-ignore
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { ref } from 'vue'
//@ts-ignore
import type { IUser, IUserAuth } from '@/utils/interface/user/IUser'
//@ts-ignore
import type { IToken } from '@/utils/interface/token'
//@ts-ignore
import { setUser } from '@/stores/user'
//@ts-ignore
import { setToken } from '@/stores/token'

const name = 'Login'
const spinner = ref<Boolean>(false)
const loading = ref<Boolean>(false)
const showPassword = ref<Boolean>(false)
const router = useRouter()
const $toast = useToast()
const auth = ref<IUserAuth>({
  UserName: '',
  Password: ''
})

async function login() {
  loading.value = true
  const data = JSON.parse(JSON.stringify(auth.value))
  const abortController = new AbortController()
  const abortSignal = abortController.signal

  const networkTimeout = setTimeout(() => {
    abortController.abort()
    loading.value = false
    $toast.open({
      message: 'Network timeout, please try again later.',
      type: 'error',
      position: 'top-right',
      duration: 3000
    })
  }, 30000)

  await useAxiosRequestWithToken()
    .post(`${ApiRoutes.login}`, data, { signal: abortSignal })
    .then(function (response) {
      //success
      clearTimeout(networkTimeout)
      const token = response.data.token
      if (token != null) {
        setToken(token as IToken)
        setUser(response.data as IUser)
        router.push('/otp')
      }
      loading.value = false
    })
    .catch(function (error) {
      //error
      clearTimeout(networkTimeout)
      $toast.open({
        message: error.response.data.message,
        type: 'error',
        position: 'top-right',
        duration: 3000
      })
      loading.value = false
    })
}
</script>

<template>
  <section class="bg-green-600">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
      <a
        href="#"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        Airtel Money
      </a>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Connect in your account
          </h1>
          <form @submit.prevent="login" class="space-y-4 md:space-y-6" action="Post">
            <div>
              <label
                for="username"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your username</label
              >
              <input
                id="username"
                name="username"
                type="text"
                v-model="auth.UserName"
                autocomplete="Nom"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                name="password"
                v-model="auth.Password"
                autocomplete="Mot de passe"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <div class="mt-2">
                <input class="mx-2" v-model="showPassword" type="checkbox" />
                <label>Show Password</label>
              </div>
            </div>
            <div class="loading-overlay" v-if="loading">
              <div class="spinner">
                <h2 class="typing text-xl text-white font-semibold tracking-wide">
                  Airtel Money...
                </h2>
              </div>
            </div>
            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
              >
                Connexion
                <svg class="spinner inline h-6 w-6 mr-3" viewBox="0 0 4 4"></svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
<style>
button {
  position: relative;
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* Animation de typing */
.typing {
  animation: typing 1.2s steps(15) infinite;
  overflow: hidden;
  white-space: nowrap;
  font-size: 25px;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* Spinner centré */
.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
