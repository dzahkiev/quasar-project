<template>
  <div class="q-pa-md">
    <q-uploader
      style="width: 100%; min-height: 330px"
      :url="getUrl()"
      label="Max number of files (10)"
      multiple
      :max-files="maxfiles"
      max-file-size="9999999"
      @rejected="onRejected"
      auto-upload
      hide-upload-btn
      :files="files"
      draggable="false"
      v-on:dragstart="dragStart"
    >
      <template v-slot:list="scope">
        <div
          class="q-pa-md row items-start q-gutter-md"
          id="sortable"
        >
          <q-card
            v-for="file in files.concat(scope.files)"
            :key="file.name" :data-id="file.id"
            class="my-card"
          >
            <q-img class="my-card-preview"
                   :src="file.id ? file.src : (file.__img ? file.__img.src : ''  )">
              <div class="absolute-bottom">
                <q-icon
                  v-if="!file.id"
                  :class="{'status': true, 'text-negative': file.__status === 'failed', 'text-positive': file.__status === 'success'}"
                  :name="file.__status === 'success' ? 'success' : 'warning'"></q-icon>
                <div class="text-subtitle4 break-all">{{ file.name }}</div>
                <div v-if="file.id" class="text-subtitle6 break-all">{{ file.size }}KB</div>
                <div v-else class="text-subtitle6 break-all">{{ file.__sizeLabel }} /
                  {{ file.__progressLabel }}
                </div>
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
              >Удалить
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-uploader>
  </div>
</template>

<script>
/* eslint-disable */
import {useQuasar} from 'quasar'
import {api} from 'boot/axios'
import Sortable from "sortablejs";


const filesDefault = [
  {
    "src": "http://placeimg.com/640/480",
    "name": "Internal Applications Agent",
    "size": 21,
    "id": "121"
  },
  {
    "src": "http://placeimg.com/640/480",
    "name": "Central Directives Analyst",
    "size": 77,
    "id": "222"
  },
  {
    "src": "http://placeimg.com/640/480",
    "name": "Customer Solutions Liaison",
    "size": 96,
    "id": "312"
  },
  {
    "src": "http://placeimg.com/640/480",
    "name": "Future Quality Technician",
    "size": 63,
    "id": "421"
  }
];

export default {
  name: "FileUploader",
  methods: {
    getUrl() {
      return `http://localhost:4444/upload`
    },
    async deleteFile(removed) {
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
    },
    reorder: function(event) {
      var oldIndex = event.oldIndex,
        newIndex = event.newIndex;
      console.log(oldIndex, newIndex);
    },
    log(log) {

      console.log(log);
    },
    dragStart(e) {
      console.log(e)
    //  e.preventDefault()
    }
  },
  mounted: function() {
    console.log('init sort');
    this.$nextTick(function () {
      Sortable.create(document.getElementById('sortable'), {
        draggable: ".q-card",
        swapThreshold: 10,
        direction: 'horizontal',
        animation: 200,
        onUpdate: this.reorder.bind(this),
      });
    })
  },
  props: ['initialFiles'],
  data: function () {
    return {
      // files: this.initialFiles
      files: filesDefault,
      q: useQuasar(),
      maxfiles: 10
    }
  },
  setup() {
    const $q = useQuasar()

    function onRejected(rejectedEntries) {
      $q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    }


    return {onRejected}
  }
}
</script>

<style lang="sass" scoped>
.my-card
  max-width: 250px
  min-width: 230px
  min-height: 220px
  z-index: 1

  .my-card-preview
    min-height: 180px

  .status
    float: left
    padding: 0 10px 10px 0
    height: 40px
    font-size: 2em

  .break-all
    word-break: break-all

.q-uploader
  .dnd
    margin-top: 55px

</style>
