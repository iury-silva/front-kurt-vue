<script setup>
import util from './Controllers/Util.controller';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import storageController from '@/Controllers/Storage.controller';
import Loading from './components/Loading.vue';
import { useGlobalStore } from '@/stores/globais.store'

util.setInitial(useToast())

</script>

<template>
  <div>
    <Toast />
    <RouterView />
    <Loading :visible="useGlobalStore().getLoading"/>
  </div>
</template>

<style scoped></style>
