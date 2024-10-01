<template>
  <AppBody>
    <template #page-description>
      <p>Nesta página você pode visualizar todas as bancas cadastradas no sistema.</p>
    </template>
    <div v-if="bancas.length == 0" class="noBancas">
      <span>Você não participa de nenhuma banca!</span>
    </div>
    <DataTable
      v-else
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

      <Column header="Avaliadores" class="text-left">
        <template #body="slotProps">
          {{ slotProps.data.Professor1.usuario.nome }} /
          {{ slotProps.data.Professor2.usuario.nome }}
        </template>
      </Column>

      <Column header="" class="text-left">
        <template #body="slotProps">
          <Button
            icon="pi pi-file-edit"
            v-tooltip.bottom="'Avaliar Entrega'"
            class="p-button-rounded p-button-sm p-button-text"
            @click="
              router.push({ name: 'AvaliarEntregas', params: { id: slotProps.data.id_banca } })
            "
          />
        </template>
      </Column>
    </DataTable>
  </AppBody>
</template>

<script setup>
import AppBody from '@/Layouts/BasePage/AppBody.vue'
import { useMinhasBancasStore } from '@/stores/minhasBancas.store'
import { onMounted, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import router from '@/router'
import Tag from 'primevue/tag'

const getSeverity = (status) => {
  switch (status) {
    case 'EmAndamento':
      return 'info'

    case 'Concluido':
      return 'success'
  }
}

const minhasBancasStore = useMinhasBancasStore()
const bancas = computed(() => minhasBancasStore.minhasBancas)

onMounted(() => {
  minhasBancasStore.getMinhasBancasAction()
})
</script>
