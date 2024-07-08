<script setup lang="ts">
import { ref } from 'vue'
//@ts-ignore
import { useAxiosRequestWithToken } from '@/utils/service/axios_api'
//@ts-ignore
import { ApiRoutes } from '@/utils/service/endpoint/api'
import { useRouter } from 'vue-router'
//@ts-ignore
import type { IUser, IUserAuth } from '@/utils/interface/user/IUser'
//@ts-ignore
import type { IToken } from '@/utils/interface/token'
//@ts-ignore
import { useToast } from 'vue-toast-notification'
//@ts-ignore
import { setUser } from '@/stores/user'
//@ts-ignore
import { setToken } from '@/stores/token'

const showHelp = ref<Boolean>(false)
const loading = ref<Boolean>(false)
const router = useRouter()
const $toast = useToast()
const auth = ref<IUserAuth>({
  UserName: '',
  Password: ''
})
const optConnexion = ref<Boolean>(false)
const otp = ref('')

const otpValidation = () => {
  if (otp.value == '1234') {
    router.push('/currency/usd')
  } else {
    $toast.open({
      message: 'Oops...Code invalide',
      type: 'error',
      position: 'bottom',
      duration: 3000
    })
  }
}
const loginValidate = async () => {
  if (
    !auth.value.Password ||
    !auth.value.UserName ||
    auth.value.Password.trim() === '' ||
    auth.value.UserName.trim() === ''
  ) {
    $toast.open({
      message: 'Oops...Veuillez remplir vos informations!',
      type: 'error',
      position: 'bottom',
      duration: 5000
    })
    return
  } else {
    await login()
  }
}

const login = async () => {
  loading.value = true
  const data = JSON.parse(JSON.stringify(auth.value))
  const abortController = new AbortController()
  const abortSignal = abortController.signal

  const networkTimeout = setTimeout(() => {
    abortController.abort()
    loading.value = false
    $toast.open({
      message: 'Network Error, please check your internet.',
      type: 'error',
      position: 'bottom',
      duration: 5000
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
      }
      loading.value = false
      optConnexion.value = true
    })
    .catch(function (error) {
      //error
      clearTimeout(networkTimeout)
      $toast.open({
        message: error.response.data.message,
        type: 'error',
        position: 'bottom',
        duration: 5000
      })
      loading.value = false
    })
}
</script>
<template>
  <div class="min-w-screen min-h-screen bg-green-600 flex items-center justify-center px-5 py-5">
    <div class="bg-gray-100 text-gray-500 w-full overflow-hidden" style="max-width: 1300px">
      <div class="flex w-full">
        <div class="hidden md:block w-1/2 bg-gray-700 py-10 px-10">
          <img class="mx-auto mt-16" src="../../../assets/money.png" width="192" height="185" />
          <h1 class="text-white text-center text-4xl mt-2">Soficom</h1>
        </div>
        <div class="w-full md:w-1/2 px-5 md:px-10 bg-white">
          <div class="text-center mt-2 py-4">
            <h1 style="font-size: 40px" class="text-gray-900 font-semibold">Connexion</h1>
          </div>
          <div>
            <form v-if="!optConnexion" @submit.prevent="loginValidate" class="px-16" method="post">
              <div class="flex -mx-3">
                <div class="w-full px-3 mb-3">
                  <div class="mb-3">
                    <label for="" class="text-lg text-black px-1">Identifiant</label>
                  </div>
                  <div class="flex">
                    <div
                      class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"
                    ></div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      v-model="auth.UserName"
                      class="w-full text-black -ml-10 pl-3 pr-3 py-1 border-2 border-gray-200 outline-none focus:border-gray-500"
                    />
                  </div>
                </div>
              </div>
              <div class="flex -mx-3">
                <div class="w-full px-3 mb-4">
                  <div class="mb-3">
                    <label for="" class="text-lg text-black px-1">Password</label>
                  </div>
                  <div class="flex">
                    <div
                      class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"
                    ></div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      v-model="auth.Password"
                      class="w-full text-black -ml-10 pl-3 pr-3 py-1 border-2 border-gray-200 outline-none focus:border-gray-500"
                    />
                  </div>
                </div>
              </div>
              <div class="licence">
                <div class="mb-4">
                  <p class="text-black text-sm">
                    En cliquant sur Connexion, vous acceptez notre
                    <a href="#">accord de licence.</a>
                  </p>
                </div>
                <div class="mb-4">
                  <p class="text-black text-sm">
                    <a @click.prevent="showHelp = true" href="#"
                      >J'ai oublié mon identifiant ou mon mot de passe.</a
                    >
                  </p>
                </div>
              </div>
              <div class="flex -mx-3 mb-8">
                <div class="w-full px-3 mb-5">
                  <button
                    v-if="!loading"
                    class="max-w-xs mx-auto bg-gray-700 hover:bg-black focus:border-gray-500 rounded-md text-white text-lg px-3 py-1"
                    type="submit"
                  >
                    <i class="fa fa-sign-in-alt"></i>
                    Connexion
                  </button>
                  <p v-else style="color: green">
                    <span class="k-icon k-i-reload"></span> Verification
                  </p>
                </div>
              </div>
            </form>
            <form v-else @submit.prevent="otpValidation" class="px-16" method="post">
              <div class="flex -mx-3">
                <div class="w-full px-3 mb-3">
                  <div class="mb-3">
                    <label for="" class="text-lg text-black px-1">Identifiant</label>
                  </div>
                  <div class="flex">
                    <div
                      class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"
                    ></div>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      v-model="otp"
                      class="w-full text-black -ml-10 pl-3 pr-3 py-1 border-2 border-gray-200 outline-none focus:border-gray-500"
                    />
                  </div>
                </div>
              </div>
              <div class="flex -mx-3 mb-8">
                <div class="w-full px-3 mb-5">
                  <button
                    v-if="!loading"
                    class="max-w-xs mx-auto bg-gray-700 hover:bg-black focus:border-gray-500 rounded-md text-white text-lg px-3 py-1"
                    type="submit"
                  >
                    <i class="fa fa-sign-in-alt"></i>
                    Connexion
                  </button>
                  <p v-else style="color: green">
                    <span class="k-icon k-i-reload"></span> Verification
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="help" v-if="showHelp">
          <div class="bg-red-600 text-white mb-3 w-full max-w-xs p-4 rounded-lg shadow-lg">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold"><i class="fa fa-question-circle mr-2"></i>Aide</h3>
              <button @click="showHelp = false" class="text-white hover:text-gray-200">
                <i class="fa fa-times"></i>
              </button>
            </div>
            <div class="mb-4">
              <p class="mb-2">Pour des mesures de securiter veuillez contacter ces numeros:</p>
              <table class="w-full text-left text-sm">
                <tbody>
                  <tr class="border-b border-gray-200">
                    <td class="py-1 px-2">Tel 1</td>
                    <td class="py-1 px-2">0817300081</td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="py-1 px-2">Tel 2</td>
                    <td class="py-1 px-2">0818303419</td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="py-1 px-2">Tel 3</td>
                    <td class="py-1 px-2">0818303447</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="text-right">
              <button
                @click="showHelp = false"
                class="bg-gray-500 text-white text-sm px-3 py-1 rounded hover:bg-gray-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.help {
  width: 300px;
  height: 350px;
  left: 50%;
  top: 50%;
  margin-left: -150px;
  margin-top: -150px;
  position: absolute;
  z-index: 2;
}
.k-icon.k-i-reload {
  -webkit-animation: spin 2s infinite linear;
  animation: spin 0.6s infinite linear;
}
</style>
