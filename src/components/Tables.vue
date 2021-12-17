<template>
  <div class="q-pa-md">
    <q-table
      title="BMSTU News"
      :rows="rows"
      :columns="columns"
      row-key="index"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
      id="table-draggable"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" :data-id="props.row.index + 1000">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
/* eslint-disable */
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import draggable from 'vuedraggable'
import Sortable from "sortablejs";

// const columns = [
//   {
//     name: 'desc',
//     required: true,
//     label: 'Dessert (100g serving)',
//     align: 'left',
//     field: 'name',
//     format: val => `${val}`,
//     sortable: true
//   },
//   { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
//   { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
//   { name: 'carbs', label: 'Carbs (g)', field: 'carbs', sortable: true },
//   { name: 'protein', label: 'Protein (g)', field: 'protein', sortable: true },
//   { name: 'sodium', label: 'Sodium (mg)', field: 'sodium', sortable: true },
//   { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
//   { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
// ]

const columns = [
  {
    name: 'index',
    label: '#',
    align: 'left',
    field: 'index',
  },
  { name: 'title', align: 'left', label: 'Title', field: 'title', sortable: true },
  { name: 'preview_text', align: 'left',  label: 'Short text', field: 'preview_text', sortable: true },
]

export default {
  components: {draggable},
  setup () {
    const columns = ref([])
    const rows = ref([])
    const filter = ref('')
    const loading = ref(false)
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 20,
      rowsNumber: null
    })

    async function fetchFromServer (startRow, count, filter, sortBy, descending) {
      sortBy = descending ? '-' + sortBy : sortBy;
      const response = await api.get(`/news?limit=${count}&offset=${startRow}&sort=${sortBy}&filter=${filter}`)
        .then((response) => {
          return response.data;
        })
        .catch(() => {
          console.log('Ошибка загрузки данных таблицы');
        });

      setRowsNumberCount(response.total);
      console.log(startRow, count, filter, sortBy, descending);
      return response.items.map((item, i) => {
        item.index = startRow + i + 1;
        return item;
      });
    }


    function setRowsNumberCount ($count) {
      pagination.value.rowsNumber = $count;
    }

    function onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter

      loading.value = true
      const fetchCount = rowsPerPage === 0 ? 100 : rowsPerPage;
      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage

      fetchFromServer(startRow, fetchCount, filter, sortBy, descending).then((returnedData)=>{
        columns.value = [
          {
            name: 'index',
            label: '#',
            align: 'left',
            field: 'index'
          },
          { name: 'title', align: 'left', label: 'Title', field: 'title', sortable: true },
          { name: 'preview_text', align: 'left',  label: 'Short text', field: 'preview_text', sortable: true },
        ];
        rows.value = returnedData
        // don't forget to update local pagination object
        pagination.value.page = page
        pagination.value.rowsPerPage = rowsPerPage
        pagination.value.sortBy = sortBy
        pagination.value.descending = descending
        loading.value = false
      })
    }

    function onKeyDown (e) {
      console.log(e)
    }

    onMounted(() => {
      // get initial data from server (1st page)
      onRequest({
        pagination: pagination.value,
        filter: undefined
      })
      const element = document.querySelector("#table-draggable tbody");
      const sortable = Sortable.create(element, {
        onEnd(event) {
          const id = event.item.getAttribute('data-id')
          const prevElementId = event.item.previousElementSibling.getAttribute('data-id')
          const nextElementId = event.item.nextElementSibling.getAttribute('data-id');
          console.log(id, prevElementId, nextElementId);
        }
      });
    })

    return {
      filter,
      loading,
      pagination,
      columns,
      rows,
      onRequest,
      onKeyDown
    }
  }
}
</script>
