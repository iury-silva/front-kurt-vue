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
        <Column field="status" header="Status" class="text-left"></Column>
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
            <div v-if="slotProps.data.Avaliacao && slotProps.data.Avaliacao.length > 0">
              <p><strong>Nota:</strong> {{ slotProps.data.Avaliacao[0].nota }}</p>
              <p><strong>Comentário:</strong> {{ slotProps.data.Avaliacao[0].comentario }}</p>
            </div>
            <p v-else>Sem avaliação</p>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="uploadModalVisible"
      header="Enviar Arquivo"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="file">Arquivo</label>
        <FileUpload
          id="file"
          mode="basic"
          :maxFileSize="1000000"
          accept="application/pdf"
          :auto="true"
          @select="onFileSelect"
          @upload="onFileUpload"
          :customUpload="true"
          chooseLabel="Escolher Arquivo"
        />
      </div>
      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          @click="closeUploadModal"
          class="p-button-text"
        />
        <Button
          label="Enviar"
          icon="pi pi-check"
          @click="submitFile"
          :disabled="!selectedFile"
          autofocus
        />
      </template>
    </Dialog>
  </AppBody>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppBody from '@/Layouts/BasePage/AppBody.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import FileUpload from 'primevue/fileupload'
import { useEntregaStore } from '@/stores/entregas.store'

const route = useRoute()
const router = useRouter()
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

const onFileSelect = (event) => {
  selectedFile.value = event.files[0]
}

const onFileUpload = () => {
  // This function is not used since we're using customUpload="true"
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
      console.error('Erro ao enviar arquivo:', error)
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
      const fileName = `${getPrazoTipoLabel(entrega.prazo_tipo)}-${entrega.orientacao.titulo_trabalho}.pdf`
      await entregasStore.downloadFile(entrega.arquivo, fileName)
    } else {
      console.error('No file available for download')
    }
  } catch (error) {
    console.error('Erro ao baixar arquivo:', error)
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
</style>