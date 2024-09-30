<template>
  <AppBody>
    <template #page-description>
      Bem-vindo à área de acompanhamento das suas orientações. Aqui você pode visualizar e avaliar
      todas as orientações de TCC que estão sob sua responsabilidade como professor orientador,
      acompanhando o progresso de cada aluno e facilitando o direcionamento de suas atividades
      acadêmicas.
    </template>
    <DataTable :value="orientacoes" responsiveLayout="scroll" class="w-full">
      <Column
        field="orientacao.titulo_trabalho"
        header="Título do Trabalho"
        class="text-left"
      ></Column>
      <Column field="orientacao.status" header="Status" class="text-left"></Column>
      <Column field="orientacao.Aluno.usuario.nome" header="Aluno" class="text-left"></Column>
      <Column header="Período" class="text-left">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.orientacao.data_inicio) }} -
          {{ formatDate(slotProps.data.orientacao.data_fim) }}
        </template>
      </Column>
      <Column header="Ações" class="text-center">
        <template #body="slotProps">
          <Button
            label="Prazos e Avaliações"
            icon="pi pi-calendar"
            class="p-button-sm"
            @click="irParaPrazosEAvaliacoes(slotProps.data.orientacao.id_orientacao)"
          />
        </template>
      </Column>
    </DataTable>
  </AppBody>
</template>
  
  <script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppBody from '@/Layouts/BasePage/AppBody.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { useOrientacaoStore } from '@/stores/orientacao.store'

const router = useRouter()
const orientacaoStore = useOrientacaoStore()
const orientacoes = computed(() => orientacaoStore.orientacoes)

onMounted(() => {
  orientacaoStore.getOrientacoes()
})

const formatDate = (dateStr) => {
  if (!dateStr) return 'Não definido'
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const irParaPrazosEAvaliacoes = (idOrientacao) => {
  router.push({ name: 'PrazosEAvaliacoes', query: { id: idOrientacao } })
}
</script>
  
  <style scoped>
.p-button {
  background-color: #2a816c;
  border: none;
  color: white;
}

.p-button:hover {
  background-color: #1e6462;
}

:deep(.p-datatable) {
  font-family: Arial, sans-serif;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background-color: #ffffff;
  transition: background-color 0.2s, box-shadow 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #e9ecef;
}
</style>