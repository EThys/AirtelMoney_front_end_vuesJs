<script lang="ts" setup>
//@ts-ignore
import type { ITransaction } from '@/utils/interface/transaction/ITransaction'
//@ts-ignor
import {
  Grid,
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
//@ts-ignore
import DropDownCell from './DropdownCell.vue'
import { useToast } from 'vue-toast-notification'

//@ts-ignore
import AddTransactionModalView from './AddTransactionModalView.vue'
import { useRoute } from 'vue-router'
const ddcell = DropDownCell
const isModalOpen = ref(false)
const $toast = useToast()
const openModal = () => {
  isModalOpen.value = true
}

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
  console.log('deeeeeeeeeeeeeeeeeee', e.dataItem.TransactionId)
  data[index] = { ...data[index], [e.field]: e.value }
  dataResult.value.data = data
  console.log('dataChange', data[index])
  console.log('data', transactions.value.length)
}

const updated = async () => {
  showLoad.value = true
  const editedItems = dataResult.value.data.filter((item) => item.inEdit)
  const newItems = editedItems.filter((item) => item.TransactionId === null)
  const updatedItems = editedItems.filter((item) => item.TransactionId !== null)

  try {
    // Envoyer les nouveaux éléments en POST
    if (newItems.length > 0) {
      // Mapper les objets dans un tableau
      const itemsArray = newItems.map((item) => {
        return item
      })

      const filteredData = newItems.map((item) => {
        return {
          CurrencyFId: item.CurrencyFId,
          BrancheFId: item.BrancheFId,
          Number: item.Number,
          UserTypeFId: item.UserTypeFId,
          FromBranchId: item.FromBranchId,
          Amount: item.Amount,
          DateMovemented: item.DateMovemented,
          Note: item.Note
        }
      })

      const body = JSON.stringify(filteredData).slice(1, -1)
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
      console.log(response.data)
      console.log(newItems.length)
      console.log('newItemsYasika', body)
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
    }

    // // Rafraîchir les données après les mises à jour
    await get_transaction()
  } catch (error) {
    console.log(error)
  } finally {
    showLoad.value = false
  }
}

const rowClick = (e: any) => {
  //   this.editID = e.dataItem.ProductID;
  e.dataItem.inEdit = true
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
  const data = dataResult.value.data.slice()

  const dataItem = {
    TransactionId: null,
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
      if (item.TransactionId === null) {
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

const remove = async (item: any) => {
  // Call API to delete item
  console.log(item.TransactionId)
  await useAxiosRequestWithToken(token)
    .delete(`${ApiRoutes.deleteTransaction}/${item.TransactionId}`)
    .then((response) => {
      // Filter item out of transactions array
      transactions.value = transactions.value.filter((i) => i.TransactionId !== item.TransactionId)
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>
<template>
  <Nav />

  <grid
    @pagechange="pageChangeHandler"
    :data-items="dataResult"
    :total="transactions.length"
    :columns="Transactioncolumns"
    :edit-field="'inEdit'"
    @cellclick="cellClick"
    @itemchange="itemChange"
    :filter="filter"
    @filterchange="filterChange"
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
        class="bg-red-500 rounded-xl text-white py-2 hover:scale-105 duration-300 p-4 cursor-pointer mx-2"
        title="Add new"
        :theme-color="'primary'"
        @click="insert"
      >
        Add new
      </kbutton>
      <kbutton
        class="bg-red-500 rounded-xl text-white py-2 hover:scale-105 duration-300 p-4 cursor-pointer mx-2"
        title="Cancel"
        :theme-color="'primary'"
        @click="cancel"
      >
        Cancel
      </kbutton>
      <kbutton
        class="bg-red-500 rounded-xl text-white py-2 hover:scale-105 duration-300 p-4 cursor-pointer mx-2"
        title="Save"
        :theme-color="'primary'"
        @click="updated"
      >
        Save
      </kbutton>
      <kbutton
        class="bg-red-500 rounded-xl text-white py-2 hover:scale-105 duration-300 p-4 cursor-pointer mx-2"
        title="Reload"
        :theme-color="'primary'"
        @click="reload"
      >
        Reload
      </kbutton>
    </grid-toolbar>
    <grid-norecords> There is no data available custom </grid-norecords>

    <template v-slot:RemoveCell="{ props }">
      <td lass="k-command-cell k-table-td">
        <kbutton
          @click="remove(item)"
          class="bg-red-500 rounded-xl text-white py-2 hover:scale-105 duration-300 p-4 cursor-pointer"
        >
          Remove
        </kbutton>
      </td>
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
            (event) => {
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
            (event) => {
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
            (event) => {
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

    <!-- <template v-slot:myDropDownCell="{ props }">
      <ddcell :data-item="props.dataItem" :field="props.field" />
    </template> -->
  </grid>
</template>
