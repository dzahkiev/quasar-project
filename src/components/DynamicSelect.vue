<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-select
        filled
        v-model="model"
        multiple
        :options="options"
        use-chips
        stack-label
        label="Lazy load opts"
        style="width: 350px"
        emit-value
        map-options
        @filter="filterFn"
        use-input
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { ref } from 'vue'
import {api} from 'boot/axios'
import {useQuasar} from 'quasar'

const defaultOptions = [
    {
      label: 'Google',
      value: 1
    },
    {
      label: 'Facebook',
      value: 2
    },
    {
      label: 'Twitter',
      value: 3
    },
    {
      label: 'Apple',
      value: 4
    },
    {
      label: 'Oracle',
      value: 5
    }
  ];

export default {
  name: 'DynamicSelect',
  setup: function () {
    const q = useQuasar()
    const options = ref(null)

    function filterFn(val, update) {
      setTimeout(() => {
        update(() => {
          const needle = val.toLowerCase()
          options.value = needle === ''
            ? defaultOptions
            : defaultOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
          searchRequest(val)
        })
      }, 100)
    }

    async function searchRequest(needle) {
      return await api.get(`/dropdown/search?search=${needle}`)
        .then(response => {
          if (response.statusCode === 200) {
            options.value = response;
          }
        })
        .catch(() => {
          q.notify({
            type: 'negative',
            message: 'Dropdown data did not loaded'
          })
        });
    }

    return {
      model: ref([{
        label: 'Twitter',
        value: 3
      }]),
      options,
      filterFn,
    }
  }
}
</script>
