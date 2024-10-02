<template>
  <AppBody>
    <template #page-description>
      <p>
        Nesta página você pode visualizar todas as orientações de TCC cadastradas no sistema.
      </p>
    </template>
    <template #header-controls>
      <Button
        label="Nova Orientação"
        icon="pi pi-plus"
        class="p-button-sm"
        @click="router.push({ name: 'NovaOrientacao' })"
      />
    </template>
    <DataTable
      :value="filteredOrientacoes"
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
        <span>Nenhuma orientação encontrada.</span>
      </div>
    </template>
      <Column field="titulo_trabalho" header="Título do Trabalho" class="text-left"></Column>

      <Column field="status" header="Status TCC" class="text-left">
        <template #body="slotProps">
          <Tag :severity="getSeverity(slotProps.data.status)" rounded>
            {{ formatedStatus(slotProps.data.status) }}
          </Tag>
        </template>
      </Column>

      <Column header="Aluno" field="Aluno.usuario.nome" class="text-left"></Column>
      <Column header="Orientador" field="Professor.usuario.nome" class="text-left"></Column>

      <Column header="" class="text-left">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            v-tooltip.bottom="'Excluir Orientação'"
            class="p-button-rounded p-button-sm p-button-text ! !text-red-500 hover:!bg-red-200 hover:!text-red-700"
            @click="confirmDialog(slotProps.data.id_orientacao)"
          />
        </template>
      </Column>
    </DataTable>
    <ConfirmDialog :draggable="false" />
  </AppBody>
</template>

<script setup>
import AppBody from '@/Layouts/BasePage/AppBody.vue'
import { useOrientacaoStore } from '@/stores/orientacoes.store'
import { onMounted, computed, ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import router from '@/router'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'


const confirm = useConfirm()
const globalFilter = ref('')

const filteredOrientacoes = computed(() => {
  return orientacoes.value.filter((orientacao) => {
    return (
      orientacao.titulo_trabalho.toLowerCase().includes(globalFilter.value.toLowerCase()) ||
      orientacao.status.toLowerCase().includes(globalFilter.value.toLowerCase()) ||
      orientacao.Aluno.usuario.nome.toLowerCase().includes(globalFilter.value.toLowerCase()) ||
      orientacao.Professor.usuario.nome.toLowerCase().includes(globalFilter.value.toLowerCase())
    )
  })
})

const confirmDialog = (id_orientacao) => {
  confirm.require({
    message: 'Tem certeza que deseja excluir esta orientação?',
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
      orientacaoStore.deleteOrientacao(id_orientacao)
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

const orientacaoStore = useOrientacaoStore()
const orientacoes = computed(() => orientacaoStore.orientacoes)

const formatedStatus = (status) =>{
  if(status == 'Concluido'){
    return 'Concluído';
  }
  return status.replace(/([A-Z])/g, ' $1')
}

onMounted(() => {
  orientacaoStore.getOrientacoesAction()
})
</script>
