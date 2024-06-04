<script lang="ts" setup>
//@ts-ignore
import type { ITransaction } from '@/utils/interface/transaction/ITransaction'
//@ts-ignor
import {
  Grid,
  filterGroupByField,
  GridToolbar,
  GridNoRecords,
  GridDataStateChangeEvent
} from '@progress/kendo-vue-grid'
//@ts-ignore
import Nav from '@/components/Nav.vue'
import {
  process,
  filterBy,
  type CompositeFilterDescriptor,
  type SortDescriptor,
  State,
  DataResult
} from '@progress/kendo-data-query'
//@ts-ignore
import { getToken } from '@/stores/token'
import { AutoComplete, ComboBox, DropDownList } from '@progress/kendo-vue-dropdowns'
import { computed, ref, watchEffect } from 'vue'
//@ts-ignore
import { Transactioncolumns } from '@/utils/constante/column/transaction_col'
//@ts-ignore
import type { IBranche } from '@/utils/interface/branche/Ibranche'
//@ts-ignore
import type { ICurrency } from '@/utils/interface/currency/ICurrency'
//@ts-ignore
import type { IUserType } from '@/utils/interface/userType/IUserType'
//@ts-ignore
import { useAxiosRequestWithToken } from '@/utils/service/axios_api'
//@ts-ignore
import { ApiRoutes } from '@/utils/service/endpoint/api'
//@ts-ignore
import { IToken } from '@/utils/interface/token'
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs'
//@ts-ignore
import DropDownCell from './DropdownCell.vue'
import { useToast } from 'vue-toast-notification'
//@ts-ignore
import ColumnMenu from './ColumnMenuView.vue'
import { DatePicker } from '@progress/kendo-vue-dateinputs'

//@ts-ignore
import AddTransactionModalView from './AddTransactionModalView.vue'
import { useRoute } from 'vue-router'
const ddcell = DropDownCell
const isConfirmOpen = ref(false)
const isModalOpen = ref(false)
const $toast = useToast()
const openModal = () => {
  isModalOpen.value = true
}
const datepicker = DatePicker
const branches = ref<Array<IBranche>>({})
const userTypes = ref<Array<IUserType>>([{}])
const currencies = ref<Array<ICurrency>>([{}])
const closeModal = () => {
  isModalOpen.value = false
}

const loader = ref<Boolean>(false)
const show = ref<any>(false)
show.value = show.value ? false : 'loader'
const route = useRoute()
const showLoad = ref<Boolean>(false)
const sortable = ref(true)
const transactions = ref<Array<ITransaction>>([{}])
const dataResult = ref<DataResult>({ data: [] as any, total: 0 })
const skip = ref<number | undefined>(0)
const token = getToken() as string
const take = ref<number | undefined>(10)
const sort = ref<SortDescriptor[] | undefined>([
  { field: 'Number', dir: 'desc' },
  { field: 'Amount', dir: 'desc' }
])
const gridPageable = {
  buttonCount: 10,
  info: true,
  type: 'numeric',
  pageSizes: true,
  previousNext: true
}
const openConfirm = () => {
  isConfirmOpen.value = true
}
const pageChangeHandler = (event: any) => {
  loader.value = true
  setTimeout(() => {
    loader.value = false
    skip.value = event.page.skip
    take.value = event.page.take
  }, 300)
}

const filter = ref<CompositeFilterDescriptor>({ logic: 'and', filters: [] })
console.log('ethberg', filter)
//filter row KENDO ui

const getAllTransaction = async () => {
  await useAxiosRequestWithToken(token)
    .get(`${ApiRoutes.allTransaction}`)
    .then(function (response) {
      transactions.value = response.data
    })
    .catch(function (error) {
      console.log(error)
    })
    .finally(function () {})
}

const editField = ref<any>()
const dropdownlist = DropDownList

const itemChange = (e: any) => {
  const data = dataResult.value.data.slice()
  const index = data.findIndex((d) => d.TransactionId === e.dataItem.TransactionId)
  const originalValue = data[index][e.field]
  data[index] = { ...data[index], [e.field]: e.value }
  dataResult.value.data = data
  console.log('dataChange', data[index])
}

const updated = async () => {
  showLoad.value = true

  const editedItems = dataResult.value.data.filter((item) => item.inEdit)
  const newItems = editedItems.filter(
    (item) => typeof item.TransactionId === 'string' && item.TransactionId.startsWith('tmp_')
  )
  console.log('newItems', newItems)

  const updatedItems = editedItems.filter((item) => item.TransactionId)

  try {
    // Envoyer les nouveaux éléments en POST
    if (newItems.length > 0) {
      // Mapper les objets dans un tableau
      const itemsArray = newItems.map((item) => {
        return item
      })

      for (const item of newItems) {
        const filteredData = {
          CurrencyFId: item.CurrencyFId,
          BrancheFId: item.BrancheFId,
          Number: item.Number,
          UserTypeFId: item.UserTypeFId,
          FromBranchId: item.FromBranchId,
          Amount: item.Amount,
          DateMovemented: item.DateMovemented,
          Note: item.Note
        }

        const body = JSON.stringify(filteredData)
        const response = await useAxiosRequestWithToken(token).post(
          `${ApiRoutes.addTransaction}`,
          body
        )

        if (response.data.error) {
          const errorMsg = response.data.error
          $toast.open({
            message: errorMsg,
            type: 'error',
            position: 'top-right',
            duration: 1000
          })
          throw new Error(response.data.error)
        } else {
          const successMsg = response.data.message
          $toast.open({
            message: successMsg,
            type: 'success',
            position: 'top-right',
            duration: 1000
          })
        }

        console.log('newItemsYasika', body)
        await get_transaction()
      }
    }

    // Mettre à jour les éléments existants en PUT
    if (updatedItems.length > 0) {
      console.log('updatedItems', updatedItems)
      for (const item of updatedItems) {
        const response = await useAxiosRequestWithToken(token).put(
          `${ApiRoutes.updateTransaction}/${item.TransactionId}`,
          item
        )
        const msg = response.data.message

        if (response.data.error) {
          const errorMsg = response.data.error
          $toast.open({
            message: errorMsg,
            type: 'error',
            position: 'top-right',
            duration: 1000
          })
          throw new Error(response.data.error)
        } else {
          const successMsg = response.data.message
          $toast.open({
            message: successMsg,
            type: 'success',
            position: 'top-right',
            duration: 1000
          })
        }
      }
      await get_transaction()
    }

    // // Rafraîchir les données après les mises à jour
  } catch (error) {
    console.log(error)
  } finally {
    showLoad.value = false
  }
}

const editedItemsLocal = ref<Array<ITransaction>>([{}])

const rowClick = (e: any) => {
  e.transactions.inEdit = true
  editedItemsLocal.value.push(e.dataItem)
  console.log('editedItemsLocal', editedItemsLocal)
}

const cellClick = (e: any) => {
  if (e.dataItem.inEdit && e.field === editField.value) {
    return
  }
  //exitEdit(e.dataItem, true);
  editField.value = e.field
  e.dataItem.inEdit = e.field
  console.log('transaeditedItemsLocalctions (after cell click):', editedItemsLocal.value)
}

const filterChange = (ev: any) => {
  loader.value = true
  filter.value = ev.filter
  console.log('change filter', ev)
  setTimeout(() => {
    filter.value = ev.filter
    console.log('filterrrrrzzz', filter.value)
    loader.value = false
  }, 300)
}

// Get currency from route
const dataState: State = {
  skip: skip.value,
  take: take.value,
  sort: sort.value
}

const get_transaction = () => {
  const currency = route.params.currency
  useAxiosRequestWithToken(token)
    .get(`${ApiRoutes.transactionList}${currency}`)
    .then(function (response) {
      //success
      transactions.value = response.data.transactions as Array<ITransaction>
      dataResult.value = process(transactions.value, dataState)
    })
    .catch(function (error) {
      //error
    })
}

const isLoaded = ref(false)

const reload = async () => {
  await get_transaction()
  await get_currencies()
  await get_branches()
  await get_userTypes()
  isLoaded.value = true
}

watchEffect(async () => {
  if (isLoaded.value) {
    await get_transaction()
  }
})

const insert = () => {
  const generateUniqueId = () => {
    return 'tmp_' + Date.now().toString(16)
  }
  const data = dataResult.value.data.slice()

  const numLines = dataResult.value.data.length
  console.log('numLines', numLines)

  const dataItem = {
    TransactionId: generateUniqueId(),
    Amount: '',
    Number: '',
    CurrencyFId: '',
    BrancheFId: '',
    Note: '',
    DateMovemented: '',
    UserTypeFId: '',
    FromBranchId: '',
    inEdit: true
  }
  const newtransactions = [...data]
  newtransactions.unshift(dataItem as any)

  dataResult.value.data = newtransactions
}

const cancel = () => {
  // Récupérer les éléments en édition
  let editedItems = dataResult.value.data.filter((item) => item.inEdit)

  // Si des éléments sont en édition
  if (editedItems.length) {
    // Parcourir les éléments
    editedItems.forEach((item) => {
      // Vérifier si TransactionId est null (nouvel ajout)
      if (item.TransactionId.startsWith('tmp_')) {
        // Supprimer l'élément du tableau
        const index = dataResult.value.data.findIndex((t) => t === item)
        dataResult.value.data.splice(index, 1)
      } else {
        // Sinon mettre fin à l'édition
        item.inEdit = undefined
      }
    })
  }
  // Mettre à jour le state
  dataResult.value.data = [...dataResult.value.data]
}
const get_branches = () => {
  useAxiosRequestWithToken(token)
    .get(`${ApiRoutes.allBranche}`)
    .then(function (response) {
      //success
      branches.value = response.data.branches as Array<IBranche>
      console.log('branches', branches.value)
    })
    .catch(function (error) {
      //error
    })
}

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

const createAppState = (dataState: State) => {
  take.value = dataState.take
  skip.value = dataState.skip
  sort.value = dataState.sort
}

const filteringChange = (e: any) => {
  if (e.event) {
    let isColumnActive = filterGroupByField(e.event.field, e.DataResult.filter)

    // @ts-ignore
    let changedColumn = this.Transactioncolumns.find((column) => column.field === e.event.field)

    if (changedColumn) {
      changedColumn.headerClassName = isColumnActive ? 'customMenu active' : ''
    }
  }
}

const dataStateChange = (event: GridDataStateChangeEvent) => {
  createAppState(event.data)
  if (event.data.filter !== undefined && event.data.filter.logic) {
    dataResult.value = process(transactions.value, {
      skip: event.data.skip,
      take: event.data.take,
      sort: event.data.sort,
      filter: event.data.filter
    })
  } else {
    dataResult.value = process(transactions.value, {
      skip: event.data.skip,
      take: event.data.take,
      sort: event.data.sort
    })
  }
}

const remove = async (props: any) => {
  try {
    loader.value = true
    const transactionId = props.dataItem['TransactionId']
    console.log('ngaeeeeeeeeeeeee', transactionId)

    if (isConfirmOpen.value) {
      const Response = await useAxiosRequestWithToken(token).delete(
        `${ApiRoutes.deleteTransaction}/${transactionId}`
      )

      const index = dataResult.value.data.findIndex((i) => i.TransactionId === transactionId)
      dataResult.value.data.splice(index, 1)

      isConfirmOpen.value = false
    }

    $toast.open({
      message: 'Item supprimé avec succès',
      type: 'success'
    })
  } catch (error) {
    console.log(error)
    $toast.open({
      message: 'Erreur de suppression',
      type: 'error'
    })
    console.error(error)
  } finally {
    loader.value = false
  }
}
</script>
<template>
  <Nav />

  <grid
    class="gridT"
    @pagechange="pageChangeHandler"
    :data-items="dataResult"
    :total="transactions.length"
    :columns="Transactioncolumns"
    :edit-field="'inEdit'"
    @cellclick="cellClick"
    @rowClick="rowClick"
    @itemchange="itemChange"
    :filter="filter"
    @filteringChange="filteringChange"
    :loader="loader"
    @datastatechange="dataStateChange"
    :pageable="gridPageable"
    :sortable="sortable"
    :sort="sort"
    :take="take"
    :skip="skip"
    :editable="{ createAt: 'bottom' }"
  >
    <grid-toolbar class="flex mb-2 pt-2">
      <kbutton
        class="bg-gray-400 rounded-xl text-white py-2 hover:scale-105 duration-300 p-4 cursor-pointer mx-2"
        title="Add new"
        :theme-color="'primary'"
        @click="insert"
      >
        Add new
      </kbutton>
      <kbutton
        class="bg-gray-400 rounded-xl text-white py-2 hover:scale-105 duration-300 p-4 cursor-pointer mx-2"
        title="Cancel"
        :theme-color="'primary'"
        @click="cancel"
      >
        Cancel
      </kbutton>
      <kbutton
        class="bg-gray-400 rounded-xl text-white py-2 hover:scale-105 duration-300 p-4 cursor-pointer mx-2"
        title="Save"
        :theme-color="'primary'"
        @click="updated"
      >
        Save
      </kbutton>
      <kbutton
        class="bg-gray-400 rounded-xl text-white py-2 hover:scale-105 duration-300 p-4 cursor-pointer mx-2"
        title="Reload"
        :theme-color="'primary'"
        @click="reload"
      >
        Reload
      </kbutton>
    </grid-toolbar>
    <grid-norecords class="k-grid-no-records"> There is no data available custom </grid-norecords>

    <template v-slot:RemoveCell="{ props }">
      <td class="k-command-cell k-table-td">
        <button
          @click="openConfirm"
          class="bg-red-500 rounded-xl text-white py-2 hover:scale-105 duration-300 p-4 cursor-pointer"
        >
          <svg
            class="h-6 w-6"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>
        </button>

        <div
          v-if="isConfirmOpen"
          class="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-5 transition-opacity"
          ></div>

          <div
            style="margin-left: 30%"
            class="fixed top-10 left-10 w-full h-screen z-50 overflow-hidden transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div
              class="relative transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all"
            >
              <div class="flex justify-between items-center">
                <h3 class="text-xl font-semibold text-gray-900" id="modal-title">
                  Confirm Delete?
                </h3>
                <button
                  type="button"
                  @click="isConfirmOpen = false"
                  class="text-gray-400 focus:outline-none hover:text-gray-500"
                >
                  <svg
                    class="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </button>
              </div>
              <div class="mt-4 text-base text-gray-500">
                Are you sure you want to delete this item? This action is irreversible.
              </div>
              <div class="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  @click="isConfirmOpen = false"
                  class="bg-gray-200 text-gray-500 rounded-md py-2 px-4 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="remove(props)"
                  class="bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </template>

    <template v-slot:myTemplate="{ props }">
      <custom
        :column="props.column"
        :filterable="props.filterable"
        :filter="props.filter"
        :sortable="props.sortable"
        :sort="props.sort"
        :columns="Transactioncolumns"
        @sortchange="(e: any) => props.onSortchange(e)"
        @filterchange="(e: any) => props.onFilterchange(e)"
        @closemenu="(e: any) => props.onClosemenu(e)"
        @contentfocus="(e: any) => props.onContentfocus(e)"
      />
    </template>

    <template v-slot:BrancheCell="{ props }" v-if="branches.length > 0">
      <td>
        <dropdownlist
          :data-items="branches"
          :field="props.field"
          :data-item-key="'BrancheId'"
          :text-field="'BrancheName'"
          :style="{ width: '155px' }"
          :value="props.dataItem['branche']"
          @itemchange="itemChange"
          @change="
            (event: { value: { BrancheId: any } }) => {
              props.dataItem['branche'] = event.value
              props.dataItem['BrancheFId'] = event.value.BrancheId
              props.dataItem['FromBranchId'] = event.value.BrancheId
            }
          "
          @reload="reload"
        ></dropdownlist>
      </td>
    </template>
    <template v-slot:TypeCell="{ props }" v-if="branches.length > 0">
      <td>
        <dropdownlist
          :data-items="userTypes"
          :field="props.field"
          :data-item-key="'UserTypeId'"
          :value="props.dataItem['user_type']"
          :text-field="'UserTypeName'"
          @change="
            (event: { value: { UserTypeId: any } }) => {
              props.dataItem['user_type'] = event.value
              props.dataItem['UserTypeFId'] = event.value.UserTypeId
            }
          "
          :style="{ width: '155px' }"
          @reload="reload"
        ></dropdownlist>
      </td>
    </template>
    <template v-slot:CurrencyCell="{ props }" v-if="branches.length > 0">
      <td>
        <dropdownlist
          :data-items="currencies"
          :field="props.field"
          :data-item-key="'CurrencyId'"
          :value="props.dataItem['currency']"
          :text-field="'CurrencyCode'"
          @change="
            (event: { value: { CurrencyId: any } }) => {
              props.dataItem['currency'] = event.value
              props.dataItem['CurrencyFId'] = event.value.CurrencyId
            }
          "
          :style="{ width: '155px' }"
          @itemchange="itemChange"
          @reload="reload"
        ></dropdownlist>
      </td>
    </template>
    <template v-slot:SendCell="{ props }">
      <td class="k-command-cell k-table-td">
        {{ props.dataItem['Send'] == 0 ? 'No' : 'Yes' }}
      </td>
    </template>

    <!-- <template v-slot:myDropDownCell="{ props }">
      <ddcell :data-item="props.dataItem" :field="props.field" />
    </template> -->
  </grid>
</template>
<style>
th.k-header.customMenu > div > div > span.k-i-more-vertical::before,
th.k-header.customMenu.active > div > div > span.k-i-more-vertical::before {
  content: '\e129';
}
.gridT {
  height: 99vh;
}
.fullscreen {
  height: 55vh;
  width: 100vw;
}
.k-columnmenu-item {
  display: none;
}

th.k-header.active > div > a {
  color: #fff;
  background-color: #ff6358;
}
</style>
