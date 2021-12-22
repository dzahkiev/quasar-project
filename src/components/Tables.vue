<template>
  <div class="q-pa-md">
    <q-table
      :title="settings.title"
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
          <q-th v-if="settings.sortable" auto-width />
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
          <q-td v-if="settings.sortable" auto-width style="cursor: move">
            <q-icon name="dehaze" />
          </q-td>
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

export default {
  components: {draggable},
  setup () {
    const columns = ref([])
    const rows = ref([])
    const filter = ref('')
    const loading = ref(false)
    const settings = ref({
      sortable: false,
      title: "Список"
    });
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

    async function onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter

      loading.value = true
      const fetchCount = rowsPerPage === 0 ? 100 : rowsPerPage;
      const startRow = (page - 1) * rowsPerPage

      return fetchFromServer(startRow, fetchCount, filter, sortBy, descending).then((returnedData) => {
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
        pagination.value.page = page
        pagination.value.rowsPerPage = rowsPerPage
        pagination.value.sortBy = sortBy
        pagination.value.descending = descending
        settings.value = Object.assign(settings.value, {
          sortable: true,
          title: "Новости"
        });
        loading.value = false
        console.log(settings.value)
      })
    }

    function initSortable()
    {
      console.log(settings.value)
      if (settings.value.sortable === false) return;
      const element = document.querySelector("#table-draggable tbody");
      Sortable.create(element, {
        animation: 200,
        onEnd(event) {
          const id = event.item.getAttribute('data-id')
          const prevElementId = event.item.previousElementSibling
            ? event.item.previousElementSibling.getAttribute('data-id')
            : null;
          const nextElementId = event.item.nextElementSibling
            ? event.item.nextElementSibling.getAttribute('data-id')
            : null;

          if (prevElementId || nextElementId) {
            dropdownRequest({
              id: id,
              prevId: prevElementId,
              nextId: nextElementId
            });
            onRequest({
              pagination: pagination.value,
              filter: filter.value
            });
          }
          console.log(id, prevElementId, nextElementId);
        }
      });
    }

    /**
     * Сортировка таблицы
     *
     * @param params
     * @returns {Promise<*>}
     */
    async function dropdownRequest(params) {
      return await api.post('/dropdown', params)
        .then((response) => {
          return response.data;
        })
        .catch(() => {
          console.log('Dropdown data error');
        });
    }

    onMounted(() => {
      // get initial data from server (1st page)
      onRequest({
        pagination: pagination.value,
        filter: undefined
      })
      .then(() => initSortable())
    })

    return {
      settings,
      filter,
      loading,
      pagination,
      columns,
      rows,
      onRequest,
    }
  }
}
</script>
