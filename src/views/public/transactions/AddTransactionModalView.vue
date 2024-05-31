<script setup lang="ts">
//@ts-ignore
import { getToken } from '@/stores/token'
//@ts-ignore
import type { ITransaction, ILineTransaction } from '@/utils/interface/transaction/ITransaction'
import type { IBranche } from '@/utils/interface/branche/Ibranche'
import type { ICurrency } from '@/utils/interface/currency/ICurrency'
import type { IUserType } from '@/utils/interface/userType/IUserType'

//@ts-ignore
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
//@ts-ignore
import { useAxiosRequest, useAxiosRequestWithToken } from '@/utils/service/axios_api'
//@ts-ignore
import { ApiRoutes } from '@/utils/service/endpoint/api'
import { computed, ref, watchEffect } from 'vue'

const transactions = ref<ITransaction>({})
const branches = ref<Array<IBranche>>({})
const $toast = useToast()
const requests = ref<Array<any>>([])
const token = getToken() as string
const get_branches = () => {
  useAxiosRequestWithToken(token)
    .get(`${ApiRoutes.allBranche}`)
    .then(function (response) {
      //success
      branches.value = response.data.branches as Array<IBranche>
      console.log(branches.value)
    })
    .catch(function (error) {
      //error
    })
}

const currencies = ref<Array<ICurrency>>([{}])
const get_currencies = () => {
  useAxiosRequestWithToken(token)
    .get(`${ApiRoutes.currencies}`)
    .then(function (response) {
      //success
      currencies.value = response.data.currencies as Array<ICurrency>
      console.log(currencies.value)
    })
    .catch(function (error) {
      //error
    })
}
const userTypes = ref<Array<IUserType>>([{}])
const get_userTypes = () => {
  useAxiosRequestWithToken(token)
    .get(`${ApiRoutes.userTypes}`)
    .then(function (response) {
      //success
      userTypes.value = response.data.user_type as Array<IUserType>
      console.log('ddededee', userTypes.value)
    })
    .catch(function (error) {
      //error
    })
}
watchEffect(async () => {
  await get_branches()
})

watchEffect(async () => {
  await get_userTypes()
})

watchEffect(async () => {
  await get_currencies()
})

const dataSubmit = async () => {
  const data = JSON.parse(JSON.stringify(transactions.value))
  await useAxiosRequestWithToken(token)
    .post(`${ApiRoutes.addTransaction}`, data)
    .then(function (response) {
      requests.value = response.data.message
      const msg = response.data.message
      $toast.open({
        message: msg,
        type: 'success',
        position: 'top-right',
        duration: 3000
      })
      setTimeout(() => {
        window.location.href = '/currency/cdf'
      }, 4000)
    })
    .catch(function (error) {
      $toast.open({
        message: error.response.data.error,
        type: 'error',
        position: 'top-right',
        duration: 3000
      })
    })
    .finally(function () {})
}

//
</script>
<template>
  <section class="bg-white dark:bg-gray-900 modal">
    <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
      <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Add a new transactions requests
      </h2>
      <form action="#" method="POST" @submit.prevent="dataSubmit">
        <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <!-- <div class="sm:col-span-2">
            <label for="number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Number</label
            >
            <input
              type="text"
              name="number"
              id="number"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Phone Number"
              required="true"
            />
          </div> -->

          <div class="w-full">
            <label for="number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Number</label
            >
            <input
              type="text"
              v-model="transactions.Number"
              name="number"
              id="number"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Phone number"
              required="true"
            />
          </div>

          <div>
            <label
              for="currency"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Currency</label
            >
            <select
              v-model="transactions.CurrencyFId"
              id="currency"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option selected="">Select Currency</option>
              <option
                v-for="(currency, index) in currencies"
                :value="currency.CurrencyId"
                :key="index"
              >
                {{ currency.CurrencyCode }}
              </option>
            </select>
          </div>
          <div class="w-full">
            <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Amount</label
            >
            <input
              type="number"
              v-model="transactions.Amount"
              name="amount"
              id="amount"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Amount"
              required="true"
            />
          </div>
          <div>
            <label
              for="frombranch"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >From branch</label
            >
            <select
              id="frombranch"
              v-model="transactions.FromBranchId"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option selected="">Select Branch</option>
              <option v-for="(branch, index) in branches" :value="branch.BrancheId" :key="index">
                {{ branch.BrancheName }}
              </option>
            </select>
          </div>

          <div>
            <label for="type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Type</label
            >
            <select
              v-model="transactions.UserTypeFId"
              id="type"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option selected="">Select user Type</option>
              <option v-for="(type, index) in userTypes" :value="type.UserTypeId" :key="index">
                {{ type.UserTypeName }}
              </option>
              n>
            </select>
          </div>
          <div>
            <label for="date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Date Movemented</label
            >
            <input
              type="date"
              v-model="transactions.DateMovemented"
              name="date"
              id="date"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="12"
              required="true"
            />
          </div>
          <div class="sm:col-span-2">
            <label for="notes" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Notes</label
            >
            <textarea
              id="notes"
              v-model="transactions.Note"
              rows="8"
              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Your note here"
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          class="bg-red-600 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
        >
          Add request
        </button>
        <!-- <div class="fex flex-wrap -mx-3 gap-14">
          <button class="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300 p-4">
            Add requests
          </button>

          <button class="bg-[#e74646] rounded-xl text-white py-2 hover:scale-105 duration-300 p-4">
            Cancel
          </button>
        </div> -->
      </form>
    </div>
  </section>
</template>
