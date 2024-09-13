<script setup>
import util from './Controllers/Util.controller';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

util.setInitial(useToast())
</script>

<template>
  <div>
    <Toast />
    <RouterView />
  </div>
</template>

<style scoped></style>
