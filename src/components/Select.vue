<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-select
      outlined
      v-model="model"
      :options="options"
      label="Социальные сети"
      emit-value
      map-options
    />
  </div>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-select
        filled
        v-model="model1"
        multiple
        :options="options"
        counter
        hint="Выбрано:"
        style="width: 250px"
        emit-value
        map-options
      />

      <q-select
        filled
        v-model="model2"
        multiple
        :options="options"
        counter
        max-values="2"
        hint="Максимально 2 категории"
        style="width: 250px"
        emit-value
        map-options
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'


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
  name: 'Select',
  setup() {
    return {
      model: ref(3),
      model1: ref([3]),
      model2: ref([3, 4]),
      options: ref(defaultOptions),
      loadedOptions: ref([]),
    }
  }
}
</script>

<style scoped>

</style>
