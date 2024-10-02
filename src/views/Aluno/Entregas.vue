<template>
  <AppBody>
    <template #page-description>
      Nesta seção, você pode visualizar todas as datas de prazos importantes para suas entregas.
      Aqui, é possível realizar suas submissões e acessar as avaliações feitas pelos professores.
      Certifique-se de cumprir os prazos para garantir o progresso do seu trabalho acadêmico.
    </template>
    <div v-if="entregas">
      <h2 class="text-2xl font-bold mb-4">{{ entregas[0].orientacao.titulo_trabalho }}</h2>
      <p class="mb-4">
        <strong>Orientador:</strong> {{ entregas[0].orientacao.Professor.usuario.nome }}
      </p>
      <p class="mb-4">
        <strong>Período:</strong> {{ formatDate(entregas[0].orientacao.data_inicio) }} -
        {{ formatDate(entregas[0].orientacao.data_fim) }}
      </p>

      <DataTable :value="entregas" responsiveLayout="scroll" class="w-full mt-4">
        <Column field="prazo_tipo" header="Tipo de Entrega" class="text-left">
          <template #body="slotProps">
            {{ getPrazoTipoLabel(slotProps.data.prazo_tipo) }}
          </template>
        </Column>
        <Column field="status" header="Status" class="text-left">
          <template #body="slotProps">
            <Tag :severity="getSeverity(slotProps.data.status)" rounded>
              {{ formatedStatus(slotProps.data.status) }}
            </Tag>
          </template>
        </Column>
        <Column field="data_envio" header="Data de Envio" class="text-left">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.data_envio) || 'Pendente' }}
          </template>
        </Column>
        <Column header="Arquivo" class="text-center">
          <template #body="slotProps">
            <Button
              v-if="!slotProps.data.arquivo"
              label="Enviar Arquivo"
              icon="pi pi-upload"
              class="p-button-sm p-button-outlined"
              @click="openUploadModal(slotProps.data)"
            />
            <Button
              v-else
              label="Download"
              icon="pi pi-download"
              class="p-button-sm p-button-outlined"
              @click="downloadFile(slotProps.data)"
            />
          </template>
        </Column>
        <Column header="Avaliação" class="text-left">
          <template #body="slotProps">
            <div
              v-if="slotProps.data.Avaliacao && slotProps.data.Avaliacao.length > 0"
              class="entrega_avaliacao"
            >
              <p><strong>Nota:</strong> {{ slotProps.data.Avaliacao[0].nota }}</p>
              <p><strong>Comentário:</strong> {{ slotProps.data.Avaliacao[0].comentario }}</p>
            </div>
            <p v-else class="entrega_semAvaliacao">Sem avaliação</p>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      header="Enviar Arquivo PDF"
      :visible="uploadModalVisible"
      :modal="true"
      :closable="true"
      @hide="closeUploadModal"
      v-model:visible="uploadModalVisible"
    >
      <div v-if="selectedFile" class="grid gap-3 justify-items-center arquivo_selecionado_content">
        <p>Arquivo selecionado:</p>

        <a @click="downloadFileUpload(selectedFile)">{{ selectedFile.name }}</a>

        <Button label="Enviar" icon="pi pi-upload" @click="submitFile" />
      </div>
      <div v-else class="upload-container" @drop.prevent="handleDrop" @dragover.prevent>
        <input
          type="file"
          ref="fileInput"
          accept="application/pdf"
          @change="handleFileSelect"
          style="display: none"
        />
        <div class="upload-area" @click="triggerFileInput">
          <p>Arraste e solte um arquivo PDF aqui ou clique para selecionar.</p>
        </div>
      </div>
    </Dialog>
  </AppBody>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import AppBody from '@/Layouts/BasePage/AppBody.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useEntregaStore } from '@/stores/entregas.store'
import util from '@/Controllers/Util.controller'
import Tag from 'primevue/tag'

const entregasStore = useEntregaStore()
const entregas = ref(null)
const uploadModalVisible = ref(false)
const selectedFile = ref(null)
const currentEntrega = ref(null)

onMounted(async () => {
  entregas.value = await entregasStore.getentregas()
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

const openUploadModal = (entrega) => {
  currentEntrega.value = entrega
  uploadModalVisible.value = true
}

const closeUploadModal = () => {
  uploadModalVisible.value = false
  selectedFile.value = null
  currentEntrega.value = null
}

const triggerFileInput = () => {
  document.querySelector('input[type="file"]').click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file
  } else {
    util.setNotification('warn', 'Envie um arquivo em PDF')
  }
}
const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file
  } else {
    util.setNotification('warn', 'Envie um arquivo em PDF')
  }
}

const submitFile = async () => {
  if (selectedFile.value && currentEntrega.value) {
    try {
      const base64File = await fileToBase64(selectedFile.value)
      const fileData = {
        prazo_tipo: currentEntrega.value.prazo_tipo,
        idorientacao: currentEntrega.value.idorientacao,
        arquivo: base64File,
        id_entrega: currentEntrega.value.id_entrega
      }

      await entregasStore.uploadFile(fileData)
      closeUploadModal()

      entregas.value = await entregasStore.getentregas()
    } catch (error) {
      util.setNotification('error', 'Erro ao baixar arquivo!')
    }
  }
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = (error) => reject(error)
  })
}

const downloadFile = async (entrega) => {
  try {
    if (entrega.arquivo) {
      const fileName = `${getPrazoTipoLabel(entrega.prazo_tipo)}-${
        entrega.orientacao.titulo_trabalho
      }.pdf`
      await entregasStore.downloadFile(entrega.arquivo, fileName)
    } else {
      util.setNotification('error', 'Sem arquivo disponível para download!')
    }
  } catch (error) {
    util.setNotification('error', 'Erro ao baixar arquivo!')
  }
}

const downloadFileUpload = async (arquivo) => {
  const base64File = await fileToBase64(arquivo)
  try {
    if (base64File) {
      await entregasStore.downloadFile(base64File, arquivo.name)
    } else {
      util.setNotification('error', 'Sem arquivo disponível para download!')
    }
  } catch (error) {
    util.setNotification('error', 'Erro ao baixar arquivo!')
  }
}

const formatedStatus = (status) =>{
  if(status == 'AguardandoAvaliacao'){
    return 'Aguardando Avaliação';
  }
  return status.replace(/([A-Z])/g, ' $1')
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
</script>

<style>
.p-dialog-header {
  gap: 20px;
}
</style>

<style scoped>
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

:deep(.p-dialog .p-dialog-header) {
  background-color: #2a816c;
  color: white;
}

:deep(.p-dialog .p-dialog-content) {
  padding: 2rem;
}

:deep(.p-fileupload-buttonbar) {
  background-color: transparent;
  border: none;
  padding: 0;
}

:deep(.p-fileupload-content) {
  background-color: transparent;
  border: none;
}
.entrega_avaliacao p strong {
  margin: 0.5rem 0;
  color: #2a816c;
}

.entrega_semAvaliacao {
  margin: 0.5rem 0;
  color: #696969;
  background: #e8e8e8;
  border-radius: 30px;
  padding: 8px;
  text-align: center;
}

.upload-container {
  border: 2px dashed #ccc;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
}

.upload-area {
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.upload-area p {
  margin: 0;
  color: #666;
}

.arquivo_selecionado_content a {
  color: #2a816c;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
}
.arquivo_selecionado_content a:hover {
  color: #114658;
}
.arquivo_selecionado_content button {
  border: none;
  margin: 10px 0 0;
  padding: 8px 20px;
}
.arquivo_selecionado_content button:hover {
  border: none;
}
</style>