<template>
  <div class="q-pa-md">
    <q-uploader
      style="width: 100%; min-height: 200px"
      :url="getUrl"
      label="Max number of files (10)"
      multiple
      max-files="10"
      max-file-size="9999999"
      accept=".jpg, image/*"
      @rejected="onRejected"
      auto-upload
      :files="files"
    >
      <template v-slot:list="scope">
        <div class="q-pa-md row items-start q-gutter-md">
          <q-card v-for="file in files.concat(scope.files)" :key="file.name" class="my-card">
            <q-img class="my-card-preview" :src="file.id ? file.src : file.__img.src">
              <div class="absolute-bottom">
                <div class="text-subtitle1">{{ file.name }}</div>
                <div v-if="!file.id" class="text-subtitle4">Status: {{ file.__status }}</div>
                <div v-if="file.id" class="text-subtitle4">{{ file.size }}</div>
                <div v-else class="text-subtitle4">{{ file.__sizeLabel }} / {{ file.__progressLabel }}</div>
              </div>
            </q-img>
            <q-card-actions align="right">
              <q-btn
                flat
                round
                color="red"
                size="12px"
                icon="delete"
                dense
                @click="file.id ? deleteFile(file) : scope.removeFile(file)"
              >Удалить</q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-uploader>
  </div>
</template>

<script>
/* eslint-disable */
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const filesDefault = [
  {
    "src": "http://placeimg.com/640/480",
    "name": "Internal Applications Agent",
    "size": 21,
    "id": "1"
  },
  {
    "src": "http://placeimg.com/640/480",
    "name": "Central Directives Analyst",
    "size": 77,
    "id": "2"
  },
  {
    "src": "http://placeimg.com/640/480",
    "name": "Customer Solutions Liaison",
    "size": 96,
    "id": "3"
  },
  {
    "src": "http://placeimg.com/640/480",
    "name": "Future Quality Technician",
    "size": 63,
    "id": "4"
  }
];

export default {
name: "FileUploader",
  methods: {
    getUrl () {
      return `http://localhost:4444/upload`
    },
    async deleteFile (removed) {
      return await api.post('/delete', {id: removed.id})
        .then(response => {
          if (response.statusCode === 200) {
            this.files = this.files.filter((item) => item.id !== removed.id);
          }
        })
        .catch(() => {
          this.q.notify({
            type: 'negative',
            message: 'File did not deleted'
          })
        });
    }
  },
  props: ['initialFiles'],
  data: function () {
    return {
      // files: this.initialFiles
      files: filesDefault,
      q: useQuasar()
    }
  },
  setup () {
    const $q = useQuasar()

    function onRejected (rejectedEntries) {
      console.log(rejectedEntries)
      $q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    }

    return { onRejected }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  max-width: 250px
  max-height: 220px
  min-width: 230px
  min-height: 220px
  .my-card-preview
    min-height: 180px
</style>
