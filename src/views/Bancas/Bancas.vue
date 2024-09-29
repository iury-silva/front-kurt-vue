<template>
  <AppBody>
    <template #header-controls>
      <Button
        label="Nova Banca"
        icon="pi pi-plus"
        class="p-button-sm"
        @click="router.push({ name: 'NovaBanca' })"
      />
    </template>
    <DataTable :value="bancas" responsiveLayout="scroll" class="w-full">
      <Column field="Orientacao.titulo_trabalho" header="Título do Trabalho" class="text-left"></Column>
      
      <Column field="Orientacao.status" header="Status" class="text-left"></Column>
      
      <Column header="Período Cronograma" class="text-left">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.Cronograma.data_inicio) }} - {{ formatDate(slotProps.data.Cronograma.data_fim) }}
        </template>
      </Column>
      
      <Column field="Professor1.departamento" header="Departamento Professor" class="text-left"></Column>
    </DataTable>
  </AppBody>
</template>

<script setup>
import AppBody from '@/Layouts/BasePage/AppBody.vue'
import { useBancaStore } from '@/stores/banca.store';
import { onMounted, computed } from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import router from '@/router';


// Formatador de data utilizando o JavaScript nativo
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const bancaStore = useBancaStore()
const bancas = computed(() => bancaStore.bancas)

onMounted(() => {
  bancaStore.getBancas()
})
</script>
