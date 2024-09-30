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
    <DataTable
      :value="bancas"
      responsiveLayout="scroll"
      class="w-full"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
    >
      <Column
        field="Orientacao.titulo_trabalho"
        header="Título do Trabalho"
        class="text-left"
      ></Column>

      <Column field="Orientacao.status" header="Status TCC" class="text-left">
        <template #body="slotProps">
          <Tag :severity="getSeverity(slotProps.data.Orientacao.status)" rounded>
            {{ slotProps.data.Orientacao.status }}
          </Tag>
        </template>
      </Column>

      <Column header="Período Cronograma" class="text-left">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.Cronograma.data_inicio) }} -
          {{ formatDate(slotProps.data.Cronograma.data_fim) }}
        </template>
      </Column>

      <Column header="" class="text-left">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-sm p-button-text ! !text-red-500 hover:!bg-red-200 hover:!text-red-700"
            @click="confirmDialog(slotProps.data.id_banca)"
          />
        </template>
      </Column>
    </DataTable>
    <ConfirmDialog :draggable="false" />
  </AppBody>
</template>

<script setup>
import AppBody from '@/Layouts/BasePage/AppBody.vue'
import { useBancaStore } from '@/stores/banca.store'
import { onMounted, computed } from 'vue'
import { useConfirm } from "primevue/useconfirm";
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import router from '@/router'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog';

const confirm = useConfirm();

const confirmDialog = (id_banca) => {
    confirm.require({
        message: 'Tem certeza que deseja excluir esta banca?',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Confirmar',
            class: 'p-button-danger'
        },
        accept: () => {
          bancaStore.deleteBanca(id_banca)
        },
    });
};
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const getSeverity = (status) => {
  switch (status) {
    case 'EmAndamento':
      return 'info'

    case 'Concluido':
      return 'success'
  }
}

const bancaStore = useBancaStore()
const bancas = computed(() => bancaStore.bancas)

onMounted(() => {
  bancaStore.getBancas()
})
</script>
