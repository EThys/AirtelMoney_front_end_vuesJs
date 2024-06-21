<template>
  <td v-if="!dataItem.inEdit" :class="className">{{ dataItem[field] }}</td>
  <td v-else>
    <dropdownlist
      :style="{ width: '155px' }"
      @change="change"
      :data-items="dataitems"
      text-field="name"
      value-field="id"
      :value="dataItem.branchId"
    ></dropdownlist>
  </td>
</template>
<script>
import { DropDownList } from '@progress/kendo-vue-dropdowns'
import { useAxiosRequestWithToken } from '@/utils/service/axios_api'
import { ApiRoutes } from '@/utils/service/endpoint/api'

export default {
  components: {
    dropdownlist: DropDownList
  },
  props: {
    field: String,
    dataItem: Object,
    format: String,
    className: String,
    columnIndex: Number,
    columnsCount: Number,
    rowType: String,
    level: Number,
    expanded: Boolean,
    editor: String
  },
  data() {
    return {
      dataitems: [
        { id: 1, name: 'Branch 1' },
        { id: 2, name: 'Branch 2' }
      ]
    }
  },
  methods: {
    change(e) {
      this.$emit('change', e, e.target.value)
    }
  }
}
</script>
<!-- const reload = async () => {
  const currency = route.params.currency
  const transactionData = getTransactions(currency)
  if (transactionData) {
    transactions.value = transactionData
    dataResult.value = process(transactions.value, dataState)
    isLoaded.value = false
  } else {
    await get_transaction()
    await get_currencies()
    await get_branches()
    await get_phoneTypes()
    await get_userTypes()

    // Stocker les données dans le localStorage
    setTransaction(route.params.currency, transactions.value)
    isLoaded.value = true
  }
} -->
