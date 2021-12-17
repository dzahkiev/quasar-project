
<template>
  <q-table @click="handleClick">
  </q-table>
</template>

<script>
/* eslint-disable */

import { QTable } from 'quasar'

export default {
  name: 'QTableDraggable',
  props: ['value', 'options'],
  methods: {
    handleClick () {
      console.log('click');
    }
  },
  components: {
    QTable
  }
}
</script>

