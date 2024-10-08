<template>
  <AppBody>
    <template #page-description>
      <p>Nesta página você pode visualizar todas as bancas cadastradas no sistema.</p>
    </template>
    <template #header-controls>
      <Button
        label="Nova Banca"
        icon="pi pi-plus"
        class="p-button-sm"
        @click="router.push({ name: 'NovaBanca' })"
      />
    </template>
    <div v-if="bancas.length == 0" class="noBancas">
      <span>O sistema não possui nenhuma banca!</span>
    </div>
    <DataTable
      v-else
      :value="filteredBancas"
      responsiveLayout="scroll"
      class="w-full"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
    >

    <template #header>
      <div class="flex justify-end">
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="globalFilter" placeholder="Pesquisar" class="w-full" />
        </IconField>
      </div>
    </template>

    <template #empty>
      <div class="text-center">
        <span>Nenhuma banca encontrada.</span>
      </div>
    </template>

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
          {{ format(new Date(slotProps.data.Cronograma.data_inicio), 'dd/MM/yyyy') }} -
          {{ format(new Date(slotProps.data.Cronograma.data_fim), 'dd/MM/yyyy') }}
        </template>
      </Column>

      <Column header="" class="text-left">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            v-tooltip.bottom="'Excluir Banca'"
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
import { format } from 'date-fns'
import { onMounted, computed, ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import router from '@/router'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const confirm = useConfirm()

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
    }
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

const globalFilter = ref('')

const bancaStore = useBancaStore()
const bancas = computed(() => bancaStore.bancas)

const filteredBancas = computed(() => {
  return bancas.value.filter((banca) => {
    return (
      banca.Orientacao.titulo_trabalho.toLowerCase().includes(globalFilter.value.toLowerCase()) ||
      banca.Orientacao.status.toLowerCase().includes(globalFilter.value.toLowerCase())
    )
  })
})


onMounted(() => {
  bancaStore.getBancas()
})
</script>
<style>
.noBancas {
    font-weight: bold;
    text-align: center;
    color: #1E6462;
    font-size: 20px;
}
</style>
