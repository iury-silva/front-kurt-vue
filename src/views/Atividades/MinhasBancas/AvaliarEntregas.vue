<template>
  <CrudBody ref="appLayout">
    <template #page-description>
      <p>Nesta página você pode visualizar todas as bancas cadastradas no sistema.</p>
    </template>
    <div v-if="avaliar">
      <h2 class="text-2xl font-bold mb-4">{{ avaliar.tituloTrabalho }}</h2>
      <p class="mb-4">
        <strong>Aluno:</strong> {{ avaliar.nomeAluno }} - {{ avaliar.matriculaAluno }}
      </p>
      <p class="mb-4"><strong>Período:</strong> {{ avaliar.periodo }}</p>
      <p class="mb-4"><strong>Orientador:</strong> {{ avaliar.nomeProfessor }}</p>
      <DataTable :value="avaliar.entregas" responsiveLayout="scroll" class="w-full">
        <Column field="prazo_tipo" header="Tipo de Prazo" class="text-left">
          <template #body="slotProps">
            {{ getPrazoTipoLabel(slotProps.data.prazo_tipo) }}
          </template>
        </Column>
        <Column field="data_envio" header="Data de Envio" class="text-left">
          <template #body="slotProps">
            {{
              slotProps.data.data_envio
                ? format(new Date(slotProps.data.data_envio), 'dd/MM/yyyy')
                : 'Não Enviado'
            }}
          </template>
        </Column>
        <Column field="status" header="Status" class="text-left">
          <template #body="slotProps">
            <Tag :severity="getSeverity(slotProps.data.status)" rounded>
              {{ formatedStatus(slotProps.data.status) }}
            </Tag>
          </template>
        </Column>
        <Column header="Arquivo" class="!text-start">
          <template #body="slotProps">
            <Button
              v-if="slotProps.data.arquivo"
              icon="pi pi-eye"
              v-tooltip.bottom="'Visualizar arquivo'"
              class="p-button-sm p-button-text p-button-rounded"
              @click="viewFile(slotProps.data)"
            />

            <Button
              v-else
              icon="pi pi-times"
              v-tooltip.bottom="'Sem arquivo'"
              class="p-button-sm p-button-text p-button-rounded"
              disabled
            />
          </template>
        </Column>
        <Column header="Avaliação" class="!text-start">
          <template #body="slotProps">
            <Button
              v-if="canCreateEvaluation(slotProps.data)"
              v-tooltip.bottom="'Avaliar ' + getPrazoTipoShortLabel(slotProps.data.prazo_tipo)"
              icon="pi pi-file-edit"
              class="p-button-sm p-button-text p-button-rounded"
              @click="openAvaliacaoModal(slotProps.data)"
            />
            <div v-else-if="slotProps.data.Avaliacao.length > 0" class="avaliacao-section">
              <p><strong>Comentário:</strong> {{ slotProps.data.Avaliacao[0].comentario }}</p>
              <p><strong>Nota:</strong> {{ slotProps.data.Avaliacao[0].nota }}</p>
            </div>
            <Tag
              v-else-if="
                slotProps.data.prazo_tipo === 'EntregaTC' ||
                slotProps.data.prazo_tipo === 'ReelaboracaoTC'
              "
              severity="secondary"
            >
              <p><strong>Sem avaliação</strong></p>
            </Tag>
            <Tag
              v-else-if="
                slotProps.data.prazo_tipo === 'EntregaProposta' ||
                slotProps.data.prazo_tipo === 'ReelaboracaoProposta'
              "
              severity="secondary"
            >
              <p><strong>Sem entregas para avaliação</strong></p>
            </Tag>
          </template>
        </Column>
      </DataTable>
      
      <!-- Modal para visualizar o arquivo PDF -->
      <Dialog
        v-model:visible="fileModalVisible"
        header="Visualizar Arquivo"
        :modal="true"
        style="width: 80vw"
        class="p-fluid"
      >
        <iframe
          v-if="pdfBase64"
          :src="`data:application/pdf;base64,${pdfBase64}`"
          width="100%"
          height="600px"
        ></iframe>
        <p v-else>Nenhum arquivo disponível para visualização.</p>
      </Dialog>

      <Dialog
        v-model:visible="avaliacaoModalVisible"
        header="Criar Avaliação"
        :modal="true"
        class="p-fluid"
        style="width: 400px"
      >
        <div class="field grid gap-2 mb-3">
          <label for="comentario">Comentário</label>
          <Textarea
            v-model="avaliacao.comentario"
            id="comentario"
            rows="3"
            autoResize
            :autoComplete="false"
          />
        </div>
        <div class="field grid gap-2 mb-3">
          <label for="nota">Nota</label>
          <InputNumber
            v-model="avaliacao.nota"
            id="nota"
            mode="decimal"
            :min="0"
            :max="10"
            :showButtons="true"
            :buttonLayout="horizontal"
          />
        </div>
        <div class="flex justify-end gap-2 mt-3">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            class="p-button-sm p-button-text"
            @click="closeAvaliacaoModal"
          />
          <Button
            label="Salvar"
            icon="pi pi-save"
            class="p-button-sm p-button-primary"
            @click="submitAvaliacao(avaliacao)"
          />
        </div>
      </Dialog>
    </div>
  </CrudBody>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useMinhasBancasStore } from '@/stores/minhasBancas.store'
import { onMounted, computed, ref } from 'vue'
import { format } from 'date-fns'
import Tag from 'primevue/tag'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import CrudBody from '@/Layouts/BasePage/CrudBody.vue'

const route = useRoute()
const minhasBancasStore = useMinhasBancasStore()
const avaliar = computed(() => minhasBancasStore.avaliar)
const appLayout = ref(null)
const avaliacao = ref({
  comentario: '',
  nota: null,
  avaliacao_tipo: '',
  identrega: null,
  idorientacao: null
})
const avaliacaoModalVisible = ref(false)
const fileModalVisible = ref(false)
const pdfBase64 = ref(null)

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
    idorientacao: prazo.idorientacao
  }
  avaliacaoModalVisible.value = true
}

const closeAvaliacaoModal = () => {
  avaliacaoModalVisible.value = false
  avaliacao.value = {
    comentario: '',
    nota: null,
    avaliacao_tipo: '',
    identrega: null,
    idorientacao: null
  }
}

const submitAvaliacao = (avaliacao) => {
  minhasBancasStore.createAvaliacaoAction(avaliacao, route.params.id)
  closeAvaliacaoModal()

  avaliacao.value = {
    comentario: '',
    nota: null,
    avaliacao_tipo: '',
    identrega: null,
    idorientacao: null
  }
}

const viewFile = (entrega) => {
  pdfBase64.value = entrega.arquivo // Assumindo que arquivo já está em base64
  fileModalVisible.value = true
}

const getSeverity = (status) => {
  switch (status) {
    case 'Pendente':
      return 'warn'
    case 'AguardandoAvaliacao':
      return 'info'
    case 'Avaliado':
      return 'success'
  }
}
const formatedStatus = (status) => {
  if (status == 'AguardandoAvaliacao') {
    return 'Aguardando Avaliação'
  }
  return status.replace(/([A-Z])/g, ' $1')
}

onMounted(() => {
  appLayout.value.setBreadcrumbs([
    { label: 'Dashboard', route: '/', icon: 'pi pi-home' },
    { label: 'Minhas Bancas', route: '/bancas/minhasBancas', icon: 'pi pi-file' }
  ])
  minhasBancasStore.getMinhasBancasByIdAction(route.params.id)
})
</script>
