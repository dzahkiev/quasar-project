<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      :mini="leftDrawerOpen"
      :breakpoint="400"
      @click.capture="drawerClick"
    >
      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        :style="{height: !leftDrawerOpen ? '150px' : '50px', position: 'relative'}"
      >
        <div v-show="!leftDrawerOpen" class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-weight-bold">Admin Admin</div>
          <div>admin@chulakov.ru</div>
        </div>
      </q-img>
        <q-list>
          <q-item-label
            header
          >
            Меню
          </q-item-label>

          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </q-list>

    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
/* eslint-disable */

import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Таблицы',
    caption: 'пример с показом таблицы',
    icon: 'list',
    link: 'table'
  },
  {
    title: 'Загрузка файлов',
    icon: 'list',
    link: 'upload'
  },
  {
    title: 'Выпадающий список',
    icon: 'list',
    link: 'select'
  },
  {
    title: 'Выпадающий список',
    caption: 'список с динамической подгрузкой',
    icon: 'list',
    link: 'lazyselect'
  },
];

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const miniState = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      miniState,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      drawerClick (e) {
        if (miniState.value) {
          miniState.value = false
          e.stopPropagation()
        }
      }
    }
  }
})
</script>
