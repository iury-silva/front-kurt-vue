<template>
  <div class="card h-full flex flex-col gap-3">
    <h1 class="page-title">Gerenciamento de Cronogramas</h1>

    <Button label="Criar Cronograma" class="create-btn" @click="openNewCronogramaModal" />

    <DataTable
      :value="cronogramas"
      :paginator="true"
      :rows="10"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} cronogramas"
      responsiveLayout="scroll"
      class="p-datatable-sm"
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
              label="Ver prazos"
              class="view-deadlines-btn"
              @click="openPrazosModal(slotProps.data)"
            />
            <Button class="delete-btn" @click="confirmDeleteCronograma(slotProps.data)">
              <img src="@/assets/icons/trash.svg" alt="Excluir" class="w-5 h-5" />
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Modal para criar novo cronograma -->
    <Dialog
      v-model:visible="novoCronogramaModalVisible"
      header="Criar Novo Cronograma"
      :modal="true"
      class="dialog-box"
    >
      <div class="p-fluid grid gap-2">
        <div class="field grid gap-2">
          <label for="descricao">Descrição</label>
          <InputText id="descricao" v-model="novoCronograma.descricao" required />
        </div>
        <div class="field grid gap-2">
          <label for="data_inicio">Data e Hora de Início</label>
          <Calendar
            id="data_inicio"
            v-model="novoCronograma.data_inicio"
            dateFormat="dd/mm/yy"
            :showTime="true"
            :showSeconds="true"
          />
        </div>
        <div class="field grid gap-2">
          <label for="data_fim">Data e Hora de Fim</label>
          <Calendar
            id="data_fim"
            v-model="novoCronograma.data_fim"
            dateFormat="dd/mm/yy"
            :showTime="true"
            :showSeconds="true"
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" class="cancel-btn" @click="novoCronogramaModalVisible = false" />
        <Button label="Salvar" class="save-btn" @click="salvarNovoCronograma" autofocus />
      </template>
    </Dialog>

    <!-- Modal para gerenciar prazos -->
    <Dialog
      v-model:visible="prazosModalVisible"
      header="Gerenciar Prazos"
      :modal="true"
      class="dialog-box"
    >
      <div v-if="cronogramaSelecionado">
        <h2 class="section-title">Prazos para: {{ cronogramaSelecionado.descricao }}</h2>
        <div v-for="(tipo, ind) of tiposPrazos" :key="ind" class="mb-4">
          <h3 class="subsection-title">{{ tipo.nome }}</h3>
          <div v-if="tipo.horarios" class="flex justify-between items-center">
            <div>
              <p>Data e Hora de Entrega: {{ formatDateTime(tipo.horarios.data_entrega) }}</p>
              <p>Data e Hora de Retorno: {{ formatDateTime(tipo.horarios.data_retorno) }}</p>
            </div>
            <Button class="delete-btn" @click="confirmDeletePrazo(tipo.horarios)">
              <img src="@/assets/icons/trash.svg" alt="Excluir" class="w-5 h-5" />
            </Button>
          </div>
          <div v-else>
            <Button
              label="Cadastrar Prazo"
              class="add-deadline-btn"
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
      class="dialog-box"
    >
      <div class="p-fluid grid gap-2">
        <div class="field grid gap-2">
          <label for="tipoPrazo">Tipo de Prazo</label>
          <p style="font-weight: bold; color: #1e6462">{{ novoPrazo.tipoDesc }}</p>
        </div>
        <div class="field grid gap-2">
          <label for="dataEntrega">Data e Hora de Entrega</label>
          <Calendar
            id="dataEntrega"
            v-model="novoPrazo.dataEntrega"
            dateFormat="dd/mm/yy"
            :showTime="true"
            :showSeconds="true"
          />
        </div>
        <div class="field grid gap-2">
          <label for="dataRetorno">Data e Hora de Retorno</label>
          <Calendar
            id="dataRetorno"
            v-model="novoPrazo.dataRetorno"
            dateFormat="dd/mm/yy"
            :showTime="true"
            :showSeconds="true"
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" class="cancel-btn" @click="novoPrazoModalVisible = false" />
        <Button label="Salvar" class="save-btn" @click="salvarNovoPrazo" autofocus />
      </template>
    </Dialog>

    <!-- Modal de confirmação para excluir cronograma -->
    <Dialog
      v-model:visible="confirmDeleteModalVisible"
      header="Confirmar Exclusão"
      :modal="true"
      class="dialog-box"
    >
      <p>Tem certeza que deseja excluir este cronograma?</p>
      <template #footer>
        <Button label="Cancelar" class="cancel-btn" @click="confirmDeleteModalVisible = false" />
        <Button label="Excluir" class="delete-btn" @click="deleteCronograma" autofocus />
      </template>
    </Dialog>

    <!-- Modal de confirmação para excluir prazo -->
    <Dialog
      v-model:visible="confirmDeletePrazoModalVisible"
      header="Confirmar Exclusão de Prazo"
      :modal="true"
      class="dialog-box"
    >
      <p>Tem certeza que deseja excluir este prazo?</p>
      <template #footer>
        <Button
          label="Cancelar"
          class="cancel-btn"
          @click="confirmDeletePrazoModalVisible = false"
        />
        <Button label="Excluir" class="delete-btn" @click="deletePrazo" autofocus />
      </template>
    </Dialog>
  </div>
</template>
  
  <script setup>
import { ref, reactive } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import endpoints from '@/Controllers/Endpoints.controller'

const cronogramas = ref([])
setTimeout(async () => {
  cronogramas.value = await endpoints.getCronogramas()
}, 100)

const novoCronogramaModalVisible = ref(false)
const prazosModalVisible = ref(false)
const novoPrazoModalVisible = ref(false)
const confirmDeleteModalVisible = ref(false)
const confirmDeletePrazoModalVisible = ref(false)

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
    nome: 'Reelaboracao da Proposta',
    horarios: false
  },
  EntregaTC: {
    nome: 'Entrega de TC',
    horarios: false
  },
  ReelaboracaoTC: {
    nome: 'Reelaboracao deTC',
    horarios: false
  }
})

const novoPrazo = reactive({
  tipo: '',
  tipoDesc: '',
  dataEntrega: null,
  dataRetorno: null
})

const prazoParaExcluir = ref(null)

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
      nome: 'Reelaboracao da Proposta',
      horarios: false
    },
    EntregaTC: {
      nome: 'Entrega de TC',
      horarios: false
    },
    ReelaboracaoTC: {
      nome: 'Reelaboracao deTC',
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
  cronogramaSelecionado.value = cronograma
  confirmDeleteModalVisible.value = true
}

const deleteCronograma = async () => {
  await endpoints.deleteCronograma(cronogramaSelecionado.value.id_cronograma)
  cronogramas.value = await endpoints.getCronogramas()

  confirmDeleteModalVisible.value = false
  cronogramaSelecionado.value = null
}

const confirmDeletePrazo = async (prazo) => {
  prazoParaExcluir.value = prazo

  confirmDeletePrazoModalVisible.value = true
}

const deletePrazo = async () => {
  if (prazoParaExcluir.value) {
    await endpoints.deletePrazo(prazoParaExcluir.value.id_prazo)
    await atualizarPrazos()
    confirmDeletePrazoModalVisible.value = false
    prazoParaExcluir.value = null
  }
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
  
  <style>
.p-button,
.p-button:not(:disabled):hover {
  border: none !important;
}
div.dialog-box {
  width: 400px;
}
</style>
  
  <style scoped>
.page-title {
  color: #114658;
  font-size: 2rem;
  font-weight: bold;
}

.create-btn {
  background-color: #2a816c;
  border: none;
  color: white;
  width: 33%;
  min-width: 11rem;
}

.view-deadlines-btn {
  background-color: #1e6462;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}

.dialog-box {
  background-color: #cbe4de;
  border-radius: 10px;
}

.section-title {
  color: #2a816c;
  font-size: 1.5rem;
  font-weight: bold;
}

.subsection-title {
  color: #1e6462;
  font-size: 1.25rem;
  font-weight: bold;
}

.add-deadline-btn {
  background-color: #2a816c;
  color: white;
}

.cancel-btn {
  background-color: transparent;
  color: #114658;
}

.save-btn {
  background-color: #2a816c;
  color: white;
}
</style>