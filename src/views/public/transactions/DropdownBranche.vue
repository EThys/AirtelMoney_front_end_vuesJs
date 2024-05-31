<template>
  <td v-if="!dataItem?.inEdit" :class="className">{{ dataItem?.data }}</td>
  <td v-else>
    <dropdownlist
      :style="{ width: '155px' }"
      @change="change"
      :data-items="dataitems"
      :text-field="textField"
      :value-field="valueField"
      :value="dataItem.branchId"
    ></dropdownlist>
  </td>
</template>

<script setup lang="ts">
import { DropDownList } from '@progress/kendo-vue-dropdowns'
import { defineProps, computed } from 'vue'

const props = defineProps({
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
})

const dataitems = [
  { FromBranchId: 1, name: 'Branch 1' },
  { FromBranchId: 2, name: 'Branch 2' }
]

const textField = computed(() => 'name')
const valueField = computed(() => 'FromBranchId')

const emit = defineEmits(['change'])

const change = (e: any) => {
  emit('change', e, e.target.value)
}
</script>
