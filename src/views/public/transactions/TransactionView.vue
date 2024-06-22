<!-- eslint-disable vue/valid-attribute-name -->
<script lang="ts" setup>
//@ts-ignore
import type { ITransaction } from '@/utils/interface/transaction/ITransaction'
//@ts-ignore
import {
  Grid,
  filterGroupByField,
  GridToolbar,
  GridNoRecords,
  type GridDataStateChangeEvent
} from '@progress/kendo-vue-grid'
//@ts-ignore
import Nav from '@/components/Nav.vue'
import {
  process,
  filterBy,
  type CompositeFilterDescriptor,
  type SortDescriptor,
  type State,
  type DataResult
} from '@progress/kendo-data-query'
//@ts-ignore
import { getToken } from '@/stores/token'
import { AutoComplete, ComboBox, DropDownList } from '@progress/kendo-vue-dropdowns'
import { computed, ref, watchEffect, watch } from 'vue'
//@ts-ignore
import { Transactioncolumns } from '@/utils/constante/column/transaction_col'
//@ts-ignore
import type { IBranche } from '@/utils/interface/branche/Ibranche'
//@ts-ignore
import type { ICurrency } from '@/utils/interface/currency/ICurrency'
//@ts-ignore
import type { IUserType } from '@/utils/interface/userType/IUserType'
//@ts-ignore
import type { IPhoneType } from '@/utils/interface/phoneType/phoneType'
//@ts-ignore
import { useAxiosRequestWithToken } from '@/utils/service/axios_api'
//@ts-ignore
import { ApiRoutes } from '@/utils/service/endpoint/api'
//@ts-ignore
import { IToken } from '@/utils/interface/token'
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs'
//@ts-ignore
import { getUser } from '@/stores/user'
//@ts-ignore
import DropDownCell from './DropdownCell.vue'
import { useToast } from 'vue-toast-notification'
//@ts-ignore
import { DatePicker } from '@progress/kendo-vue-dateinputs'

//@ts-ignore
import {
  setTransaction,
  setBranche,
  setCurrency,
  setUserType,
  getBranches,
  getCurrencies,
  getTransactions,
  getUserType,
  setPhoneType //@ts-ignore
} from '@/stores/transactions'

//@ts-ignore
import { useRoute } from 'vue-router'
const isConfirmOpen = ref(false)
const $toast = useToast()
const branches = ref<Array<IBranche>>([{} as IBranche])
const userTypes = ref<Array<IUserType>>([{} as IUserType])
const phoneTypes = ref<Array<IPhoneType>>([{} as IPhoneType])
const currencies = ref<Array<ICurrency>>([{} as ICurrency])
const currencyOption = ref<Array<ICurrency>>([{} as ICurrency])
const loader = ref<Boolean>(false)
const user = getUser()
const show = ref<any>(false)
show.value = show.value ? false : 'loader'
const route = useRoute()
const showLoad = ref<Boolean>(false)
const sortable = ref(true)
const transactions = ref<Array<ITransaction>>([{} as ITransaction])
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
  // console.log('newItems', newItems)

  const updatedItems = editedItems.filter((item) => !item.isNew && item.TransactionId)

  try {
    const promises = []

    // Envoyer les nouveaux éléments en POST
    if (newItems.length > 0) {
      const newItemsPromises = newItems.map(async (item) => {
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
          item.TransactionId = response.data.TransactionId
        }
      })
      promises.push(...newItemsPromises)
    }
    // Mettre à jour les éléments existants en PUT
    if (updatedItems.length > 0) {
      const updatedItemsPromises = updatedItems.map(async (item) => {
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
      })
      promises.push(...updatedItemsPromises)
    }

    // Supprimer les éléments
    if (deletedTransactions.value.length > 0) {
      const deleteItemsPromises = deletedTransactions.value.map(async (item) => {
        const response = await useAxiosRequestWithToken(token).delete(
          `${ApiRoutes.deleteTransaction}/${item.TransactionId}`
        )
        const index = transactions.value.findIndex((i) => i.TransactionId === item.TransactionId)
        if (index > -1) {
          transactions.value.splice(index, 1)
        }
        return response
      })

      const deleteResponses = await Promise.all(deleteItemsPromises)
      const deleteErrors = deleteResponses.filter((response) => response.data.error)
      if (deleteErrors.length) {
        const errorMessages = deleteErrors.map((error) => error.data.error).join('\n')
        $toast.open({
          message: errorMessages,
          type: 'error',
          position: 'top-right',
          duration: 1000
        })
        throw new Error(errorMessages)
      } else {
        $toast.open({
          message: 'Delete successful',
          type: 'success'
        })
      }
      deletedTransactions.value = []
    }

    // Attendre que toutes les opérations soient terminées avant de rafraîchir les données
    await Promise.all(promises)
    setTransaction(route.params.currency, transactions.value)
    await get_transaction()
  } catch (error) {
    console.log(error)
  } finally {
    showLoad.value = false
  }
}

const editedItemsLocal = ref<Array<ITransaction>>([])

const addedTransactions = ref<Array<ITransaction>>([])
const updatedTransactions = ref<Array<ITransaction>>([])
const deletedTransactions = ref<Array<ITransaction>>([])

const rowClick = (e: any) => {
  e.transactions.inEdit = true
  editedItemsLocal.value.push(e.dataItem)
  console.log('editedItemsLocal', editedItemsLocal.value)
}

const cellClick = (e: any) => {
  if (e.dataItem.inEdit && e.field === editField.value) {
    return
  }
  //exitEdit(e.dataItem, true);
  editField.value = e.field
  e.dataItem.inEdit = e.field
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

const get_transaction = async () => {
  const currency = route.params.currency
  try {
    const response = await useAxiosRequestWithToken(token).get(
      `${ApiRoutes.transactionList}${currency}`
    )
    transactions.value = response.data.transactions
    setTransaction(currency, transactions.value)
    dataResult.value = process(transactions.value, dataState)
  } catch (error) {
    console.error(error)
  }
}
// }

const isLoaded = ref(false)

const reload = async () => {
  await get_transaction()
  await get_currencies()
  await get_branches()
  await get_phoneTypes()
  await get_userTypes()
  isLoaded.value = true
}

watchEffect(async () => {
  if (isLoaded.value) {
    await get_transaction()
  }
})
watch(
  () => route.params.currency,
  async (newCurrency: any, oldCurrency: any) => {
    if (newCurrency !== oldCurrency) {
      await get_currencies()
    }
  }
)
const insert = () => {
  const generateUniqueId = () => {
    return 'tmp_' + Date.now().toString(16)
  }
  const data = dataResult.value.data.slice()

  const numLines = dataResult.value.data.length
  // console.log('numLines', numLines)

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
    inEdit: true,
    status: 'added',
    isNew: true
  }
  const newtransactions = [...data]
  newtransactions.unshift(dataItem as any)

  dataResult.value.data = newtransactions
}

const editedItems = ref<Array<any>>([])
const updateInEdit = (item: any) => {
  item.inEdit = true
}

const edit = () => {
  // Filtrer les éléments modifiés
  const editedItemsTemp = dataResult.value.data.filter((item) => item.inEdit)

  // Traiter les éléments ajoutés
  editedItemsTemp.forEach((item) => {
    if (item.TransactionId) {
      // Mettre à jour le statut de l'élément et le traiter comme une modification
      item.status = 'edited'

      // Vérifier si l'élément existe déjà dans updatedTransactions
      const existingItem = updatedTransactions.value.find(
        (i) => i.TransactionId === item.TransactionId
      )

      if (!existingItem) {
        // Ajouter l'élément aux tableaux updatedTransactions et editedItems
        updatedTransactions.value.push(item)
        editedItems.value.push(item)
      } else {
        // L'élément existe déjà, donc on le met à jour dans updatedTransactions
        const existingItemIndex = updatedTransactions.value.findIndex(
          (i) => i.TransactionId === item.TransactionId
        )
        updatedTransactions.value.splice(existingItemIndex, 1, item)
        editedItems.value.splice(editedItems.value.indexOf(item), 1)
      }
    }
    if (item.TransactionId.toString().startsWith('tmp_')) {
      // Ajouter l'élément aux tableaux addedTransactions et editedItems
      addedTransactions.value.push(item)
      editedItems.value.push(item)
      item.status = 'new'
    }
  })

  // Afficher les transactions mises à jour
}

const deletedLocal = (props: any) => {
  const dataItem = props.dataItem
  dataItem.status = 'delete'

  // console.log(dataItem)

  deletedTransactions.value.push(dataItem)
  editedItems.value.splice(editedItems.value.indexOf(dataItem), 1)

  const deleteItems = dataResult.value.data.filter((item) => item.status === 'delete')
  isConfirmOpen.value = false
  // console.log('Éléments supprimés:', deleteItems)

  // console.log('Éléments supprimés:', deletedTransactions.value)

  // Boucle sur les éléments supprimés
  deletedTransactions.value.forEach((deletedItem) => {
    // console.log('Élément supprimé:', deletedItem)
  })
}

// Ajouter une fonction pour sauvegarder les modifications
const saveChanges = () => {
  const editedItemss = ref([])
  // Mise à jour de dataResult avec les éléments édités
  dataResult.value.data = [...dataResult.value.data, ...editedItemss.value]
  editedItemss.value = []

  // Séparer les éléments en nouveaux, modifiés et existants
  const newItems = dataResult.value.data.filter((item) => item.status === 'new')
  const editedItems = dataResult.value.data.filter((item) => item.status === 'edited')
  const existingItems = dataResult.value.data.filter((item) => item.status === undefined)

  console.log('Nouveaux éléments:', newItems)
  console.log('Éléments modifiés:', editedItems)
  console.log('Éléments existants:', existingItems)
  console.log('updatedTransactions', updatedTransactions.value)
}

const cancel = async () => {
  // Récupérer les éléments en édition
  let editedItems = dataResult.value.data.filter((item) => item.inEdit)

  // Si des éléments sont en édition
  if (editedItems.length) {
    // Parcourir les éléments
    editedItems.forEach((item) => {
      // Vérifier si TransactionId est null (nouvel ajout)
      if (typeof item.TransactionId === 'string') {
        // Supprimer l'élément du tableau
        const index = dataResult.value.data.findIndex((t) => t === item)
        const indexLocal = addedTransactions.value.findIndex((t) => t === item)
        addedTransactions.value.splice(indexLocal, 1)
        dataResult.value.data.splice(index, 1)
      } else {
        // Sinon mettre fin à l'édition
        item.inEdit = undefined
      }
    })
  }
  // Mettre à jour le state
  dataResult.value.data = [...dataResult.value.data]
  deletedTransactions.value = []
  updatedTransactions.value = []
  await get_transaction()
}
const get_branches = () => {
  useAxiosRequestWithToken(token)
    .get(`${ApiRoutes.allBranche}`)
    .then(function (response) {
      //success
      branches.value = response.data.branches as Array<IBranche>
      setBranche(branches.value as any)
      console.log('branches', branches.value)
    })
    .catch(function (error) {
      //error
    })
}

const get_phoneTypes = () => {
  useAxiosRequestWithToken(token)
    .get(`${ApiRoutes.phoneType}`)
    .then(function (response) {
      //success
      phoneTypes.value = response.data.phoneTypes as Array<IPhoneType>
      setPhoneType(phoneTypes.value as any)
      console.log('phoneTypes', phoneTypes.value)
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
      setUserType(userTypes.value as any)
      console.log('ddededee', userTypes.value)
    })
    .catch(function (error) {
      //error
    })
}
const get_currencies = async () => {
  const currencyFromRoute = route.params.currency.toString()
  const currencyRoute = currencyFromRoute.toUpperCase()
  useAxiosRequestWithToken(token)
    .get(`${ApiRoutes.currencies}`)
    .then(function (response) {
      //success
      currencies.value = response.data.currencies as Array<ICurrency>
      setCurrency(currencies.value as any)
      currencyOption.value = currencies.value.filter(
        (currency) => currency.CurrencyCode === currencyRoute
      )
      // console.log(currencyOption)
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
    // console.log('ngaeeeeeeeeeeeee', transactionId)

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

const cellFunction = (h: any, trElement: any, defaultSlots: any, props: any) => {
  const dataItem = props.dataItem

  let backgroundColor

  if (dataItem.status === 'new') {
    backgroundColor = 'rgb(55, 180, 0, 0.32)' // vert
  } else if (dataItem.status === 'edited') {
    backgroundColor = 'rgb(255, 215, 0, 0.32)' // jaune
  } else if (dataItem.status === 'delete') {
    backgroundColor = 'rgba(255, 100, 100, 0.32)' // Rouge
  }

  const trProps = {
    style: {
      backgroundColor
    }
  }

  return h('tr', trProps, defaultSlots)
}

const updateSentStatus = (dataItem: any) => {
  dataItem.Sent = 1
  dataItem.status = 'edited'
  dataItem.inEdit = true
}
const setUserTypeFromPhone = (event: any, dataItem: any) => {
  const phoneNumber = event.target.value
  const userTypeByPhone = phoneTypes.value.find((type) => {
    return type.PhoneNumber === phoneNumber
  })
  if (userTypeByPhone) {
    dataItem['user_type'] = userTypeByPhone.user_type
    dataItem['UserTypeFId'] = userTypeByPhone.user_type.UserTypeId

    itemChange({
      dataItem: dataItem,
      field: 'user_type.UserTypeName',
      value: userTypeByPhone.user_type
    })
  }
}

const brancheEvent = (event: any, props: any) => {
  props.dataItem['BrancheFId'] = event.value.BrancheId
  props.dataItem['FromBranchId'] = event.value.BrancheId
  updateInEdit(props.dataItem)
  // props.dataItem.inEdit = true;
  props.dataItem.status = 'edited'
  itemChange({
    dataItem: props.dataItem,
    field: 'branche.BrancheName',
    value: props.dataItem.BrancheFId
  })
}
</script>
<template>
  <Nav />

  <grid
    class="gridT"
    @pagechange="pageChangeHandler"
    :data-items="dataResult"
    :total="transactions.length"
    :row-render="cellFunction"
    :columns="Transactioncolumns"
    :edit-field="'inEdit'"
    @change="edit"
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
        @click="updated()"
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
          @click="deletedLocal(props)"
          class="bg-red-500 rounded-xl text-white py-2 hover:scale-105 duration-300 p-2 cursor-pointer"
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
                  @click="deletedLocal(props)"
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
        <span v-if="user?.user.Admin == 1">
          <dropdownlist
            :data-items="[user?.user.branche]"
            :field="props.field"
            :data-item-key="'BrancheId'"
            :text-field="'BrancheName'"
            :style="{ width: '155px' }"
            :value="props.dataItem['branche']"
            @change="
              (event = { value: { BrancheId: 1 } }) => {
                props.dataItem['BrancheFId'] = event?.value.BrancheId
                props.dataItem['FromBranchId'] = event?.value.BrancheId
                updateInEdit(props.dataItem)
                // props.dataItem.inEdit = true
                props.dataItem.status = 'edited'
                itemChange({
                  dataItem: props.dataItem,
                  field: 'branche.BrancheName',
                  value: props.dataItem.BrancheFId
                })
              }
            "
            @reload="reload"
          ></dropdownlist>
        </span>
        <span v-else>
          <dropdownlist
            :data-items="branches"
            :field="props.field"
            :data-item-key="'BrancheId'"
            :text-field="'BrancheName'"
            :style="{ width: '155px' }"
            :value="props.dataItem['branche']"
            @itemchange="itemChange"
            @change="
              (event = { value: { BrancheId: 1 } }) => {
                props.dataItem['branche'] = event?.value
                props.dataItem['BrancheFId'] = event?.value.BrancheId
                props.dataItem['FromBranchId'] = event?.value.BrancheId
                props.dataItem.user['BrancheFId'] = event?.value.BrancheId
                updateInEdit(props.dataItem)
                // props.dataItem.inEdit = true
                props.dataItem.status = 'edited'
                itemChange({
                  dataItem: props.dataItem,
                  field: 'branche.BrancheName',
                  value: props.dataItem.BrancheFId
                })
              }
            "
            @reload="reload"
          ></dropdownlist>
        </span>
      </td>
    </template>
    <template v-slot:NumberCell="{ props }">
      <span>
        <input
          v-model="props.dataItem.Number"
          @change="
            (event) => {
              setUserTypeFromPhone(event, props.dataItem),
                updateInEdit(props.dataItem),
                (props.dataItem.status = 'edited')
            }
          "
          style="
            width: 90%;
            margin-top: 5%;
            margin-left: 5%;
            padding: 4px;
            border-radius: 5px;
            font-size: 16px;
          "
        />
      </span>
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
            (event = { value: { UserTypeId: 1 } }) => {
              props.dataItem['user_type'] = event?.value
              props.dataItem['UserTypeFId'] = event?.value.UserTypeId
              updateInEdit(props.dataItem)
              props.dataItem.status = 'edited'
              itemChange({
                dataItem: props.dataItem,
                field: 'user_type.UserTypeName',
                value: event?.value
              })
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
          :data-items="currencyOption"
          :field="props.field"
          :data-item-key="'CurrencyId'"
          :value="props.dataItem['currency']"
          :text-field="'CurrencyCode'"
          @change="
            (event = { value: { CurrencyId: 1 } }) => {
              props.dataItem['currency'] = event?.value
              props.dataItem['CurrencyFId'] = event.value.CurrencyId
              // props.dataItem.inEdit = true
              // props.dataItem.status = 'edited'
              itemChange({
                dataItem: props.dataItem,
                field: 'currency.CurrencyCode',
                value: props.dataItem.CurrencyFId
              })
            }
          "
          :style="{ width: '155px' }"
          @itemchange="itemChange"
          @reload="reload"
        ></dropdownlist>
      </td>
    </template>
    <template v-slot:SendCell="{ props }">
      <td class="k-command-cell k-table-td cursor-pointer">
        <template v-if="user?.user.Admin == 0">
          <span
            @dblclick="updateSentStatus(props.dataItem)"
            :class="{
              clickable: true,
              'flex items-center space-x-2': true,
              'text-green-600 font-semibold': props.dataItem.Sent == 1,
              'text-red-600 font-semibold': props.dataItem.Sent == 0
            }"
          >
            {{ props.dataItem.Sent == 1 ? 'Yes' : 'No' }}
            <svg
              v-if="props.dataItem.Sent == 1"
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-check"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l5 5l10 -10" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-x"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </span>
        </template>
        <template v-else>
          <span
            :class="{
              clickable: false,
              'flex items-center space-x-2': true,
              'text-green-600 font-semibold': props.dataItem.Sent == 1,
              'text-red-600 font-semibold': props.dataItem.Sent == 0
            }"
          >
            {{ props.dataItem.Sent == 1 ? 'Yes' : 'No' }}
            <svg
              v-if="props.dataItem.Sent == 1"
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-check"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l5 5l10 -10" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-x"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </span>
        </template>
      </td>
    </template>
    <template v-slot:ResponceCell="{ props }">
      <td class="k-command-cell k-table-td">
        <template v-if="user?.user.Admin == 0">
          <input
            type="text"
            v-model="props.dataItem.Response"
            @change="updateInEdit(props.dataItem)"
            style="
              width: 100%;
              padding: 4px;
              text-align: center;
              border-radius: 5px;
              font-size: 16px;
            "
            :required="true"
          />
        </template>
        <template v-else>
          <span>{{ props.dataItem.Response }}</span>
        </template>
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
