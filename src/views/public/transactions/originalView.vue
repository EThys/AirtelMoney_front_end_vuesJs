<template>
  <div id="app">
    <h1>Hello Kendo UI for Vue!</h1>
    <p></p>

    <grid
      :data-items="dataResult"
      :pageable="pageable"
      :sortable="sortable"
      :sort="sort"
      :take="take"
      :skip="skip"
      :columns="columns"
      @datastatechange="dataStateChange"
      :style="{ height: '400px' }"
    >
      <template v-slot:discontinuedTemplate="{ props }">
        <td :colspan="1">
          <input type="checkbox" :checked="props.dataItem.Discontinued" disabled />
        </td>
      </template>
    </grid>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import {
  process,
  type DataResult,
  type State,
  type CompositeFilterDescriptor,
  type SortDescriptor
} from '@progress/kendo-data-query'
import {
  Grid,
  type GridDataStateChangeEvent,
  type GridRowClickEvent,
  type GridColumnProps
} from '@progress/kendo-vue-grid'
import { DropDownList, type DropDownListChangeEvent } from '@progress/kendo-vue-dropdowns'
const products = [
  {
    ProductID: 1,
    ProductName: 'Chai',
    SupplierID: 1,
    CategoryID: 1,
    QuantityPerUnit: '10 boxes x 20 bags',
    UnitPrice: 18.0,
    UnitsInStock: 39,
    UnitsOnOrder: 0,
    ReorderLevel: 10,
    Discontinued: false,
    Category: {
      CategoryID: 1,
      CategoryName: 'Beverages',
      Description: 'Soft drinks, coffees, teas, beers, and ales'
    }
  },
  {
    ProductID: 2,
    ProductName: 'Chang',
    SupplierID: 1,
    CategoryID: 1,
    QuantityPerUnit: '24 - 12 oz bottles',
    UnitPrice: 19.0,
    UnitsInStock: 17,
    UnitsOnOrder: 40,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
      CategoryID: 1,
      CategoryName: 'Beverages',
      Description: 'Soft drinks, coffees, teas, beers, and ales'
    }
  },
  {
    ProductID: 3,
    ProductName: 'Aniseed Syrup',
    SupplierID: 1,
    CategoryID: 2,
    QuantityPerUnit: '12 - 550 ml bottles',
    UnitPrice: 10.0,
    UnitsInStock: 13,
    UnitsOnOrder: 70,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: 'Condiments',
      Description: 'Sweet and savory sauces, relishes, spreads, and seasonings'
    }
  },
  {
    ProductID: 4,
    ProductName: "Chef Anton's Cajun Seasoning",
    SupplierID: 2,
    CategoryID: 2,
    QuantityPerUnit: '48 - 6 oz jars',
    UnitPrice: 22.0,
    UnitsInStock: 53,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: 'Condiments',
      Description: 'Sweet and savory sauces, relishes, spreads, and seasonings'
    }
  },
  {
    ProductID: 5,
    ProductName: "Chef Anton's Gumbo Mix",
    SupplierID: 2,
    CategoryID: 2,
    QuantityPerUnit: '36 boxes',
    UnitPrice: 21.35,
    UnitsInStock: 0,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: true,
    Category: {
      CategoryID: 2,
      CategoryName: 'Condiments',
      Description: 'Sweet and savory sauces, relishes, spreads, and seasonings'
    }
  },
  {
    ProductID: 6,
    ProductName: "Grandma's Boysenberry Spread",
    SupplierID: 3,
    CategoryID: 2,
    QuantityPerUnit: '12 - 8 oz jars',
    UnitPrice: 25.0,
    UnitsInStock: 120,
    UnitsOnOrder: 0,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: 'Condiments',
      Description: 'Sweet and savory sauces, relishes, spreads, and seasonings'
    }
  },
  {
    ProductID: 7,
    ProductName: "Uncle Bob's Organic Dried Pears",
    SupplierID: 3,
    CategoryID: 7,
    QuantityPerUnit: '12 - 1 lb pkgs.',
    UnitPrice: 30.0,
    UnitsInStock: 15,
    UnitsOnOrder: 0,
    ReorderLevel: 10,
    Discontinued: false,
    Category: {
      CategoryID: 7,
      CategoryName: 'Produce',
      Description: 'Dried fruit and bean curd'
    }
  },
  {
    ProductID: 8,
    ProductName: 'Northwoods Cranberry Sauce',
    SupplierID: 3,
    CategoryID: 2,
    QuantityPerUnit: '12 - 12 oz jars',
    UnitPrice: 40.0,
    UnitsInStock: 6,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: 'Condiments',
      Description: 'Sweet and savory sauces, relishes, spreads, and seasonings'
    }
  }
]

export default defineComponent({
  components: {
    dropdownlist: DropDownList,
    grid: Grid
  },
  setup() {
    onMounted(() => {
      const dataState: State = {
        skip: skip.value,
        take: take.value,
        sort: sort.value
      }
      dataResult.value = process(products, dataState)
    })

    const defaultItems = { CategoryID: null, CategoryName: 'Product categories' }
    const dropdownlistCategory = ref(null)
    const pageable = ref(true)
    const sortable = ref(true)
    const skip = ref<number | undefined>(0)
    const take = ref<number | undefined>(10)
    const sort = ref<SortDescriptor[] | undefined>([{ field: 'ProductName', dir: 'asc' }])

    const filter = ref<CompositeFilterDescriptor>({ logic: 'and', filters: [] })

    const columns = [
      { field: 'ProductName', title: 'Product Name' },
      { field: 'UnitPrice', title: 'Price' },
      { field: 'UnitsInStock', title: 'Units in Stock' },
      { field: 'Discontinued', cell: 'discontinuedTemplate' }
    ] as GridColumnProps[]

    const dataResult = ref<DataResult>({ data: [] as any, total: 0 })

    const handleDropDownChange = (e: DropDownListChangeEvent) => {
      dropdownlistCategory.value = e.target.value.CategoryID
      if (e.target.value.CategoryID !== null) {
        filter.value = {
          logic: 'and',
          filters: [{ field: 'CategoryID', operator: 'eq', value: e.target.value.CategoryID }]
        }
        skip.value = 0
      } else {
        filter.value = {} as CompositeFilterDescriptor
        skip.value = 0
      }

      const event: GridDataStateChangeEvent = {
        data: {
          skip: skip.value,
          take: take.value,
          sort: sort.value,
          filter: filter.value
        }
      }
      dataStateChange(event)
    }

    const createAppState = (dataState: State) => {
      take.value = dataState.take
      skip.value = dataState.skip
      sort.value = dataState.sort
    }

    const dataStateChange = (event: GridDataStateChangeEvent) => {
      createAppState(event.data)
      if (event.data.filter !== undefined && event.data.filter.logic) {
        dataResult.value = process(products, {
          skip: event.data.skip,
          take: event.data.take,
          sort: event.data.sort,
          filter: event.data.filter
        })
      } else {
        dataResult.value = process(products, {
          skip: event.data.skip,
          take: event.data.take,
          sort: event.data.sort
        })
      }
    }

    return {
      dropdownlistCategory,
      defaultItems,
      pageable,
      sortable,
      dataResult,
      columns,
      sort,
      take,
      skip,
      dataStateChange,
      handleDropDownChange
    }
  }
})
</script>
