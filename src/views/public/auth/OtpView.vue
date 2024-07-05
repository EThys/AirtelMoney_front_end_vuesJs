<script setup lang="ts">
import { useToast } from 'vue-toast-notification'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const name = 'Otp'
const $toast = useToast()
const router = useRouter()
const otp = ref('')

const otpValidation = () => {
  if (otp.value == '1234') {
    router.push('/currency/usd')
  } else {
    $toast.open({
      message: 'Error.',
      type: 'error',
      position: 'top-right',
      duration: 3000
    })
  }
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
        <form class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Connect in AirtelMoney
          </h1>
          <div class="space-y-4 md:space-y-6">
            <div>
              <label
                for="otp"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              ></label>
              <input
                name="otp"
                v-model="otp"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <button
                @click="otpValidation"
                class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
              >
                Connexion
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
