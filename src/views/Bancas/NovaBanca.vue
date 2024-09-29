<template>
  <CrudBody ref="appLayout">
    <template #page-description>
      Adicione uma nova banca de avaliação.
    </template>

  </CrudBody>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CrudBody from '@/Layouts/BasePage/CrudBody.vue'

const appLayout = ref(null)

onMounted(() => {
  // Define os breadcrumbs ao montar o componente
  appLayout.value.setBreadcrumbs([
    { label: 'Dashboard', route: '/', icon: 'pi pi-home' },
    { label: 'Bancas', route: '/bancas', icon: 'pi pi-users' }
  ])

})
</script>
