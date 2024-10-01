<template>
  <AppBody>
    <template #header-controls>
      <Button
        label="Nova Reunião"
        icon="pi pi-plus"
        class="p-button-sm"
        v-if="user.nivel_acesso == 'professor' || user.nivel_acesso == 'coordenador'"
        @click="router.push({ name: 'NovaReuniao' })"
      />
    </template>
    <template #page-description>
      Aqui você pode visualizar todas as suas reuniões agendadas. Esta página oferece um panorama
      completo dos encontros marcados, permitindo o acompanhamento de datas, horários e detalhes
      importantes para garantir o planejamento e a organização de suas atividades.
    </template>
    <DataTable
      :value="reunioes"
      responsiveLayout="scroll"
      class="w-full"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
    >
      <Column field="descricao" header="Descrição" class="text-left max-w-52 break-words"></Column>
      <Column field="data_reuniao" header="Data da Reunião" class="text-left">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.data_reuniao) }}
        </template>
      </Column>
      <Column header="Documentos" class="text-left">
        <template #body="slotProps">
          <ul v-if="slotProps.data.Documento.length" class="list-none p-0">
            <li
              v-for="documento in slotProps.data.Documento"
              :key="documento.id_documento"
              class="mb-2 flex justify-between"
            >
              <span class="mr-2">{{ documento.nome }}</span>
              <div>
                  <Button
                    icon="pi pi-download"
                    v-tooltip.bottom="'Download'"
                    class="p-button-rounded p-button-sm p-button-text !text-[#2A816C] hover:!bg-[#e6f7f5] m-1"
                    @click="downloadFile(documento)"
                  />
                  <Button
                    icon="pi pi-trash"
                    v-tooltip.bottom="'Excluir'"
                    class="p-button-rounded p-button-sm p-button-text !text-red-500 hover:!bg-red-200 hover:!text-red-700 m-1"
                    @click="deleteFile(documento.id_documento)"
                    v-if="user.nivel_acesso == 'professor' || user.nivel_acesso == 'coordenador'"
                  />
              </div>
            </li>
          </ul>
          <p v-else class="text-gray-500">Nenhum documento</p>
        </template>
      </Column>
      <Column
        header=""
        class="text-left"
        v-if="user.nivel_acesso == 'professor' || user.nivel_acesso == 'coordenador'"
      >
        <template #body="slotProps">
          <Button
            icon="pi pi-upload"
            v-tooltip.bottom="'Upload'"
            class="p-button-rounded p-button-sm p-button-text !text-[#2A816C] hover:!bg-[#e6f7f5]"
            @click="openUploadModal(slotProps.data.id_reuniao)"
          />
        </template>
      </Column>
    </DataTable>
    <ConfirmDialog />
    <Dialog
      header="Upload PDF"
      :visible="uploadModalVisible"
      :modal="true"
      :closable="true"
      :draggable="false"
      :closeOnEscape="true"
      @hide="closeUploadModal"
      :style="{ width: '450px' }"
    >
      <div
        class="upload-container border-2 border-dashed border-[#2A816C] p-4 text-center cursor-pointer rounded-lg"
        @drop.prevent="handleDrop"
        @dragover.prevent
      >
        <input
          type="file"
          ref="fileInput"
          accept="application/pdf"
          @change="handleFileSelect"
          class="hidden"
        />
        <div class="upload-area p-8 bg-[#f0f9f8] rounded-lg" @click="triggerFileInput">
          <p class="text-[#1E6462]">
            Arraste e solte um arquivo PDF aqui ou clique para selecionar
          </p>
        </div>
      </div>
      <div v-if="selectedFile" class="mt-4">
        <p class="text-[#114658]">Arquivo selecionado: {{ selectedFile.name }}</p>
        <Button label="Upload" icon="pi pi-upload" @click="uploadFile" class="mt-2" />
      </div>
    </Dialog>
  </AppBody>
</template>
  
  <script setup>
import { ref, onMounted, computed } from 'vue'
import AppBody from '@/Layouts/BasePage/AppBody.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'
import router from '@/router'
import endpoints from '@/Controllers/Endpoints.controller'
import { useUserStore } from '@/stores/user.store'
import util from '@/Controllers/Util.controller'

const loading = ref(true)
const reunioes = ref([])
const uploadModalVisible = ref(false)
const selectedFile = ref(null)
const currentReuniaoId = ref(null)

const userStore = useUserStore()

const user = computed(() => userStore.user)

const fetchReunioes = async () => {
  try {
    const response = await endpoints.getMyReunioes()
    if (response) {
      reunioes.value = response
    } else {
      console.error('Failed to fetch reunioes')
    }
  } catch (error) {
    console.error('Error fetching reunioes:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  if (dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } else {
    return 'Sem data'
  }
}

const downloadFile = async (documento) => {
  try {
    if (documento && documento.arquivo.length > 0) {
      const file = documento.arquivo
      const byteString = atob(file)
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = documento.nome || 'downloaded-file.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } else {
      util.setNotification('error', 'Documento não encontrado.')
    }
  } catch (error) {
    console.error('Erro ao fazer download do arquivo:', error)
  }
}

const deleteFile = async (idFile) => {
  console.log('idFile:', idFile)
  try {
    const response = await endpoints.deleteFile(idFile)
    if (response) {
      console.log('File deleted successfully')
      fetchReunioes() // Refresh the list of reunioes after deletion
    } else {
      console.error('Failed to delete file')
    }
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}

const openUploadModal = (id_reuniao) => {
  currentReuniaoId.value = id_reuniao
  uploadModalVisible.value = true
}

const closeUploadModal = () => {
  uploadModalVisible.value = false
  selectedFile.value = null
}

const triggerFileInput = () => {
  document.querySelector('input[type="file"]').click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file
  } else {
    util.setNotification('error', 'Por favor, selecione um arquivo PDF.')
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file
  } else {
    util.setNotification('error', 'Por favor, arraste um arquivo PDF.')
  }
}

const uploadFile = async () => {
  if (!selectedFile.value) {
    util.setNotification('error', 'Nenhum arquivo selecionado.')
    return
  }

  const reader = new FileReader()
  reader.onload = async (e) => {
    const base64File = e.target.result
    const dados = {
      idreuniao: currentReuniaoId.value,
      arquivo: base64File,
      nome: selectedFile.value.name
    }

    try {
      const response = await endpoints.sendFile(dados)
      console.log('Response:', response)
      closeUploadModal()
      fetchReunioes() // Refresh the list of reunioes after upload
    } catch (error) {
      console.error('Erro ao fazer o upload do arquivo:', error)
    }
  }
  reader.readAsDataURL(selectedFile.value)
}

setTimeout(() => {
  fetchReunioes()
}, 100)
</script>
  
  <style scoped>
:deep(.p-button).p-button-text {
  background-color: #ffffff;
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

:deep(.p-button) {
  background-color: #2a816c;
  border: none;
}

:deep(.p-button:enabled:hover) {
  background-color: #1e6462;
}

:deep(.p-dialog .p-dialog-header) {
  background-color: #2a816c;
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

.upload-container:hover {
  border-color: #1e6462;
}

.upload-area:hover {
  background-color: #e6f7f5;
}
</style>