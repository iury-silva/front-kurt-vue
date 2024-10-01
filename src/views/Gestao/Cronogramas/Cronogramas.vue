<template>
  <AppBody>
    <template #page-description>
      <p>
        Nesta página você pode visualizar e gerenciar todos os cronogramas cadastrados no sistema.
      </p>
    </template>
    <template #header-controls>
      <Button
        label="Novo Cronograma"
        icon="pi pi-plus"
        class="p-button-sm"
        @click="openNewCronogramaModal"
      />
    </template>
    <DataTable
      :value="cronogramas"
      responsiveLayout="scroll"
      class="w-full"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} cronogramas"
    >
      <Column field="descricao" header="Descrição" sortable></Column>
      <Column field="data_inicio" header="Data e Hora de Início" sortable>
        <template #body="slotProps">
          {{ formatDateTime(slotProps.data.data_inicio) }}
        </template>
      </Column>
      <Column field="data_fim" header="Data e Hora de Fim" sortable>
        <template #body="slotProps">
          {{ formatDateTime(slotProps.data.data_fim) }}
        </template>
      </Column>
      <Column header="Ações">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button
              icon="pi pi-calendar"
              v-tooltip.bottom="'Ver prazos'"
              class="p-button-rounded p-button-sm p-button-text !text-[#1E6462] hover:!bg-[#e6f7f5]"
              @click="openPrazosModal(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              v-tooltip.bottom="'Excluir Cronograma'"
              class="p-button-rounded p-button-sm p-button-text !text-red-500 hover:!bg-red-200 hover:!text-red-700"
              @click="confirmDeleteCronograma(slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Modal para criar novo cronograma -->
    <Dialog
      v-model:visible="novoCronogramaModalVisible"
      header="Criar Novo Cronograma"
      :modal="true"
      :style="{ width: '450px' }"
      :draggable="false"
      class="p-fluid"
    >
      <div class="grid gap-4">
        <div class="col-12">
          <label for="descricao" class="block text-sm font-medium text-[#114658]">Descrição</label>
          <InputText id="descricao" v-model="novoCronograma.descricao" required class="w-full" />
        </div>
        <div class="col-12">
          <label for="data_inicio" class="block text-sm font-medium text-[#114658]">Data e Hora de Início</label>
          <Calendar
            id="data_inicio"
            v-model="novoCronograma.data_inicio"
            dateFormat="dd/mm/yy"
            :showTime="true"
            :showSeconds="true"
            class="w-full"
          />
        </div>
        <div class="col-12">
          <label for="data_fim" class="block text-sm font-medium text-[#114658]">Data e Hora de Fim</label>
          <Calendar
            id="data_fim"
            v-model="novoCronograma.data_fim"
            dateFormat="dd/mm/yy"
            :showTime="true"
            :showSeconds="true"
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" @click="novoCronogramaModalVisible = false" class="p-button-text" />
        <Button label="Salvar" icon="pi pi-check" @click="salvarNovoCronograma" autofocus />
      </template>
    </Dialog>

    <!-- Modal para gerenciar prazos -->
    <Dialog
      v-model:visible="prazosModalVisible"
      header="Gerenciar Prazos"
      :modal="true"
      :style="{ width: '650px' }"
      :draggable="false"
      class="p-fluid"
    >
      <div v-if="cronogramaSelecionado">
        <h2 class="text-xl font-bold text-[#2A816C] mb-4">Prazos para: {{ cronogramaSelecionado.descricao }}</h2>
        <div v-for="(tipo, ind) of tiposPrazos" :key="ind" class="mb-4">
          <h3 class="text-lg font-semibold text-[#1E6462] mb-2">{{ tipo.nome }}</h3>
          <div v-if="tipo.horarios" class="flex justify-between items-center">
            <div>
              <p>Data e Hora de Entrega: {{ formatDateTime(tipo.horarios.data_entrega) }}</p>
              <p>Data e Hora de Retorno: {{ formatDateTime(tipo.horarios.data_retorno) }}</p>
            </div>
            <Button
              icon="pi pi-trash"
              v-tooltip.bottom="'Excluir Prazo'"
              class="p-button-rounded p-button-sm p-button-text !text-red-500 hover:!bg-red-200 hover:!text-red-700"
              @click="confirmDeletePrazo(tipo.horarios)"
            />
          </div>
          <div v-else>
            <Button
              label="Cadastrar Prazo"
              icon="pi pi-plus"
              class="p-button-sm"
              @click="openCadastrarPrazoModal(ind, tipo.nome)"
            />
          </div>
        </div>
      </div>
    </Dialog>

    <!-- Modal para cadastrar novo prazo -->
    <Dialog
      v-model:visible="novoPrazoModalVisible"
      header="Cadastrar Novo Prazo"
      :modal="true"
      :style="{ width: '450px' }"
      :draggable="false"
      class="p-fluid"
    >
      <div class="grid gap-4">
        <div class="col-12">
          <label class="block text-sm font-medium text-[#114658]">Tipo de Prazo</label>
          <p class="font-bold text-[#1E6462]">{{ novoPrazo.tipoDesc }}</p>
        </div>
        <div class="col-12">
          <label for="dataEntrega" class="block text-sm font-medium text-[#114658]">Data e Hora de Entrega</label>
          <Calendar
            id="dataEntrega"
            v-model="novoPrazo.dataEntrega"
            dateFormat="dd/mm/yy"
            :showTime="true"
            :showSeconds="true"
            class="w-full"
          />
        </div>
        <div class="col-12">
          <label for="dataRetorno" class="block text-sm font-medium text-[#114658]">Data e Hora de Retorno</label>
          <Calendar
            id="dataRetorno"
            v-model="novoPrazo.dataRetorno"
            dateFormat="dd/mm/yy"
            :showTime="true"
            :showSeconds="true"
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" @click="novoPrazoModalVisible = false" class="p-button-text" />
        <Button label="Salvar" icon="pi pi-check" @click="salvarNovoPrazo" autofocus />
      </template>
    </Dialog>

    <ConfirmDialog :draggable="false" />
  </AppBody>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useConfirm } from "primevue/useconfirm"
import AppBody from '@/Layouts/BasePage/AppBody.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import ConfirmDialog from 'primevue/confirmdialog'
import endpoints from '@/Controllers/Endpoints.controller'

const confirm = useConfirm()

const cronogramas = ref([])
const novoCronogramaModalVisible = ref(false)
const prazosModalVisible = ref(false)
const novoPrazoModalVisible = ref(false)

const novoCronograma = reactive({
  descricao: '',
  data_inicio: null,
  data_fim: null
})

const cronogramaSelecionado = ref(null)
const prazosAtuais = ref({})

const tiposPrazos = ref({
  EntregaProposta: {
    nome: 'Entrega da Proposta',
    horarios: false
  },
  ReelaboracaoProposta: {
    nome: 'Reelaboração da Proposta',
    horarios: false
  },
  EntregaTC: {
    nome: 'Entrega de TC',
    horarios: false
  },
  ReelaboracaoTC: {
    nome: 'Reelaboração de TC',
    horarios: false
  }
})

const novoPrazo = reactive({
  tipo: '',
  tipoDesc: '',
  dataEntrega: null,
  dataRetorno: null
})

onMounted(async () => {
  cronogramas.value = await endpoints.getCronogramas()
})

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const openNewCronogramaModal = () => {
  novoCronograma.descricao = ''
  novoCronograma.data_inicio = null
  novoCronograma.data_fim = null
  novoCronogramaModalVisible.value = true
}

const salvarNovoCronograma = async () => {
  const res = await endpoints.createCronograma({
    descricao: novoCronograma.descricao,
    dataInicio: novoCronograma.data_inicio
      ? new Date(novoCronograma.data_inicio).toISOString()
      : novoCronograma.data_inicio,
    dataFim: novoCronograma.data_fim
      ? new Date(novoCronograma.data_fim).toISOString()
      : novoCronograma.data_fim
  })

  if (res && res != 'validacao') {
    cronogramas.value = await endpoints.getCronogramas()
    novoCronogramaModalVisible.value = false
  }
}

const openPrazosModal = async (cronograma) => {
  tiposPrazos.value = {
    EntregaProposta: {
      nome: 'Entrega da Proposta',
      horarios: false
    },
    ReelaboracaoProposta: {
      nome: 'Reelaboração da Proposta',
      horarios: false
    },
    EntregaTC: {
      nome: 'Entrega de TC',
      horarios: false
    },
    ReelaboracaoTC: {
      nome: 'Reelaboração de TC',
      horarios: false
    }
  }

  cronogramaSelecionado.value = cronograma

  prazosAtuais.value = await endpoints.getPrazos(cronograma.id_cronograma)

  prazosAtuais.value.forEach((prazo) => {
    tiposPrazos.value[prazo.prazo_tipo].horarios = prazo
  })

  prazosModalVisible.value = true
}

const openCadastrarPrazoModal = (tipo, desc) => {
  novoPrazo.tipoDesc = desc
  novoPrazo.tipo = tipo
  novoPrazo.dataEntrega = null
  novoPrazo.dataRetorno = null
  novoPrazoModalVisible.value = true
}

const salvarNovoPrazo = async () => {
  const res = await endpoints.createPrazo({
    idcronograma: cronogramaSelecionado.value.id_cronograma,
    prazo_tipo: novoPrazo.tipo,
    data_entrega: novoPrazo.dataEntrega
      ? new Date(novoPrazo.dataEntrega).toISOString()
      : novoPrazo.dataEntrega,
    data_retorno: novoPrazo.dataRetorno
      ? new Date(novoPrazo.dataRetorno).toISOString()
      : novoPrazo.dataRetorno
  })

  if (res && res != 'validacao') {
    await atualizarPrazos()
    novoPrazoModalVisible.value = false
  }
}

const confirmDeleteCronograma = (cronograma) => {
  confirm.require({
    message: 'Tem certeza que deseja excluir este cronograma?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteCronograma(cronograma.id_cronograma),
  })
}

const deleteCronograma = async (id_cronograma) => {
  await endpoints.deleteCronograma(id_cronograma)
  cronogramas.value = await endpoints.getCronogramas()
}

const confirmDeletePrazo = (prazo) => {
  confirm.require({
    message: 'Tem certeza que deseja excluir este prazo?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deletePrazo(prazo.id_prazo),
  })
}

const deletePrazo = async (id_prazo) => {
  await endpoints.deletePrazo(id_prazo)
  await atualizarPrazos()
}

const atualizarPrazos = async () => {
  prazosAtuais.value = await endpoints.getPrazos(cronogramaSelecionado.value.id_cronograma)

  Object.keys(tiposPrazos.value).forEach((key) => {
    tiposPrazos.value[key].horarios = false
  })

  prazosAtuais.value.forEach((prazo) => {
    tiposPrazos.value[prazo.prazo_tipo].horarios = prazo
  })

  prazosModalVisible.value = false
  prazosModalVisible.value = true
}
</script>

<style scoped>
:deep(.p-button).p-button-text  {
  background-color: #ffffff;
}
:deep(.p-button):hover {
  border: none;
}
:deep(.p-button) {
  background-color: #2A816C;
  border: none;
}

:deep(.p-button:enabled:hover) {
  background-color: #1E6462;
}

:deep(.p-button.p-button-text) {
  color: #114658;
}

:deep(.p-button.p-button-text:enabled:hover) {
  background: rgba(17, 70, 88, 0.04);
  color: #114658;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f8f9fa;
  color: #114658;
  font-weight: 600;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background-color: #ffffff;
  transition: background-color 0.2s, box-shadow 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #e9ecef;
}

:deep(.p-dialog .p-dialog-header) {
  background-color: #2A816C;
  color: white;
}

:deep(.p-dialog .p-dialog-content) {
  background-color: #ffffff;
  padding: 2rem;
}

:deep(.p-dialog .p-dialog-footer) {
  background-color: #f8f9fa;
  padding: 1rem;
}

:deep(.p-calendar .p-inputtext) {
  width: 100%;
}
</style>