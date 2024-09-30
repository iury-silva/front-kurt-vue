<template>
  <AppBody>
    <template #header-controls>
      <Button label="Voltar" icon="pi pi-arrow-left" class="p-button-sm" @click="router.back()" />
    </template>
    <template #page-description>
      Aqui você encontra os prazos e avaliações da orientação atual. Acompanhe o progresso e avalie
      a proposta para garantir o cumprimento dos requisitos acadêmicos.
    </template>
    <div v-if="orientacao">
      <h2 class="text-2xl font-bold mb-4">{{ orientacao.orientacao.titulo_trabalho }}</h2>
      <p class="mb-4"><strong>Aluno:</strong> {{ orientacao.orientacao.Aluno.usuario.nome }}</p>
      <p class="mb-4">
        <strong>Período:</strong> {{ formatDate(orientacao.orientacao.data_inicio) }} -
        {{ formatDate(orientacao.orientacao.data_fim) }}
      </p>

      <DataTable :value="prazos" responsiveLayout="scroll" class="w-full mt-4">
        <Column field="prazo_tipo" header="Tipo de Prazo" class="text-left">
          <template #body="slotProps">
            {{ getPrazoTipoLabel(slotProps.data.prazo_tipo) }}
          </template>
        </Column>
        <Column field="data_envio" header="Data de Envio" class="text-left">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.data_envio) || 'Pendente' }}
          </template>
        </Column>
        <Column field="status" header="Status" class="text-left"></Column>
        <Column header="Avaliação" class="text-center">
          <template #body="slotProps">
            <Button
              v-if="canCreateEvaluation(slotProps.data)"
              :label="'Avaliar ' + getPrazoTipoShortLabel(slotProps.data.prazo_tipo)"
              icon="pi pi-file-edit"
              class="p-button-sm p-button-outlined"
              @click="openAvaliacaoModal(slotProps.data)"
            />
            <div v-else-if="slotProps.data.Avaliacao.length > 0" class="avaliacao-section">
              <p><strong>Comentário:</strong> {{ slotProps.data.Avaliacao[0].comentario }}</p>
              <p><strong>Nota:</strong> {{ slotProps.data.Avaliacao[0].nota }}</p>
            </div>
            <div v-else-if="slotProps.data.prazo_tipo === 'EntregaTC' || slotProps.data.prazo_tipo === 'ReelaboracaoTC'" class="noAvaliacao-section">
                <p><strong>Sem avaliação</strong></p>
            </div>
            <div v-else-if="slotProps.data.prazo_tipo === 'EntregaProposta' || slotProps.data.prazo_tipo === 'ReelaboracaoProposta'" class="noAvaliacao-section">
              <p><strong>Sem entregas para avaliação</strong></p>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="avaliacaoModalVisible"
      header="Criar Avaliação"
      :modal="true"
      class="p-fluid"
      style="width: 400px"
    >
      <div class="field grid gap-2 mb-3">
        <label for="comentario">Comentário</label>
        <Textarea id="comentario" v-model="avaliacao.comentario" rows="3" />
      </div>
      <div class="field grid gap-2">
        <label for="nota">Nota</label>
        <InputNumber id="nota" v-model="avaliacao.nota" :min="0" :max="10" :step="0.1" />
      </div>
      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          @click="closeAvaliacaoModal"
          class="p-button-text"
        />
        <Button label="Salvar" icon="pi pi-check" @click="submitAvaliacao" autofocus />
      </template>
    </Dialog>
  </AppBody>
</template>
  
  <script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppBody from '@/Layouts/BasePage/AppBody.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import { useOrientacaoStore } from '@/stores/orientacao.store'

const route = useRoute()
const router = useRouter()
const orientacaoStore = useOrientacaoStore()
const orientacao = ref(null)
const prazos = ref([])
const avaliacaoModalVisible = ref(false)
const avaliacao = ref({
  comentario: '',
  nota: null,
  avaliacao_tipo: '',
  identrega: '',
  idorientacao: ''
})

onMounted(async () => {
  const idOrientacao = route.query.id
  orientacao.value = await orientacaoStore.getOrientacao(idOrientacao)
  prazos.value = orientacao.value.entregas
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

const getPrazoTipoLabel = (prazoTipo) => {
  const labels = {
    EntregaProposta: 'Entrega da Proposta',
    ReelaboracaoProposta: 'Reelaboração da Proposta',
    EntregaTC: 'Entrega do TC',
    ReelaboracaoTC: 'Reelaboração do TC'
  }
  return labels[prazoTipo] || prazoTipo
}

const getPrazoTipoShortLabel = (prazoTipo) => {
  const labels = {
    EntregaProposta: 'Proposta',
    ReelaboracaoProposta: 'Reelaboração Proposta',
    EntregaTC: 'TC',
    ReelaboracaoTC: 'Reelaboração TC'
  }
  return labels[prazoTipo] || prazoTipo
}

const canCreateEvaluation = (prazo) => {
  return (
    (prazo.prazo_tipo === 'EntregaProposta' || prazo.prazo_tipo === 'ReelaboracaoProposta') &&
    prazo.data_envio &&
    prazo.Avaliacao.length == 0
  )
}

const getTipoAvaliacao = (prazo) => {
  switch (prazo) {
    case 'EntregaProposta':
      return 'Proposta'
    case 'ReelaboracaoProposta':
      return 'ReelaboracaoProposta'
    case 'EntregaTC':
      return 'TC'
    case 'ReelaboracaoTC':
      return 'ReelaboracaoTC'
  }
}

const openAvaliacaoModal = (prazo) => {
  avaliacao.value = {
    comentario: '',
    nota: null,
    avaliacao_tipo: getTipoAvaliacao(prazo.prazo_tipo),
    identrega: prazo.id_entrega,
    idorientacao: orientacao.value.orientacao.id_orientacao
  }
  avaliacaoModalVisible.value = true
}

const closeAvaliacaoModal = () => {
  avaliacaoModalVisible.value = false
  avaliacao.value = {
    comentario: '',
    nota: null,
    avaliacao_tipo: '',
    identrega: '',
    idorientacao: ''
  }
}

const submitAvaliacao = async () => {
  try {
    await orientacaoStore.postAvaliacao(avaliacao.value)
    closeAvaliacaoModal()

    const idOrientacao = route.query.id
    orientacaoStore.clearOrientacoes()
    orientacao.value = await orientacaoStore.getOrientacao(idOrientacao)
    prazos.value = orientacao.value.entregas
  } catch (error) {
    console.error('Erro ao enviar avaliação:', error)
  }
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

.p-button-outlined {
  color: #2a816c;
  border-color: #2a816c;
  background-color: transparent;
}

.p-button-outlined:hover {
  background-color: #e6f7f5;
  color: #1e6462;
  border-color: #1e6462;
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

.avaliacao-section p strong {
  margin: 0.5rem 0; 
  color: #2a816c;
}
.noAvaliacao-section p strong {
  margin: 0.5rem 0;
  color: #696969;
  background: #e8e8e8;
  border-radius: 30px;
  padding: 8px 12px;
}
</style>