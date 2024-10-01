<template>
    <AppBody>
        <template #header-controls>
            <Button label="Nova Reunião" icon="pi pi-plus" class="p-button-sm"
                v-if="user.nivel_acesso == 'professor' || user.nivel_acesso == 'coordenador'"
                @click="router.push({ name: 'NovaReuniao' })" />
        </template>
        <DataTable :value="reunioes" responsiveLayout="scroll" class="w-full" paginator :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]">
            <Column field="descricao" header="Descrição" class="text-left"></Column>
            <Column field="data_reuniao" header="Data da Reunião" class="text-left">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.data_reuniao) }}
                </template>
            </Column>
            <Column header="Documentos" class="text-left">
                <template #body="slotProps">
                    <ul v-if="slotProps.data.Documento.length">
                        <li v-for="documento in slotProps.data.Documento" :key="documento.id_documento">
                            {{ documento.nome }}
                            <Button icon="pi pi-download" class="p-button-rounded p-button-sm p-button-text"
                                @click="downloadFile(documento)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-sm p-button-text"
                                @click="deleteFile(documento.id_documento)" v-if="user.nivel_acesso == 'professor' || user.nivel_acesso == 'coordenador'" />
                        </li>
                    </ul>
                    <p v-else>Nenhum documento</p>
                </template>
            </Column>
            <Column header="" class="text-left" v-if="user.nivel_acesso == 'professor' || user.nivel_acesso == 'coordenador'">
                <template #body="slotProps">
                    <Button icon="pi pi-upload" class="p-button-rounded p-button-sm p-button-text"
                        @click="openUploadModal(slotProps.data.id_reuniao)" />
                </template>
            </Column>
        </DataTable>
        <ConfirmDialog />
        <Dialog header="Upload PDF" :visible="uploadModalVisible" :modal="true" :closable="true" :draggable="false"
            :closeOnEscape="true" @hide="closeUploadModal">
            <div class="upload-container" @drop.prevent="handleDrop" @dragover.prevent>
                <input type="file" ref="fileInput" accept="application/pdf" @change="handleFileSelect"
                    style="display: none;" />
                <div class="upload-area" @click="triggerFileInput">
                    <p>Arraste e solte um arquivo PDF aqui ou clique para selecionar</p>
                </div>
            </div>
            <div v-if="selectedFile">
                <p>Arquivo selecionado: {{ selectedFile.name }}</p>
                <Button label="Upload" icon="pi pi-upload" @click="uploadFile" />
            </div>
        </Dialog>
    </AppBody>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import AppBody from '@/Layouts/BasePage/AppBody.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import router from '@/router';
import endpoints from '@/Controllers/Endpoints.controller';
import { useUserStore } from '@/stores/user.store';
import util from '@/Controllers/Util.controller';

const loading = ref(true);
const reunioes = ref([]);
const uploadModalVisible = ref(false);
const selectedFile = ref(null);
const currentReuniaoId = ref(null);

const userStore = useUserStore()

const user = computed(() => userStore.user)

const fetchReunioes = async () => {
    try {
        const response = await endpoints.getMyReunioes();
        if (response) {
            reunioes.value = response;
        } else {
            console.error('Failed to fetch reunioes');
        }
    } catch (error) {
        console.error('Error fetching reunioes:', error);
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateStr) => {
    if(dateStr){
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        return 'Sem data'
    }
};

const downloadFile = async (documento) => {
    try {
        if (documento && documento.arquivo.length > 0) {
            const file = documento.arquivo;
            const byteString = atob(file);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = documento.nome || 'downloaded-file.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } else {
            util.setNotification('error', 'Documento não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao fazer download do arquivo:', error);
    }
};

const deleteFile = async (idFile) => {
    console.log('idFile:', idFile);
  try {
    const response = await endpoints.deleteFile(idFile);
    if (response) {
      console.log('File deleted successfully');
      fetchReunioes(); // Refresh the list of reunioes after deletion
    } else {
      console.error('Failed to delete file');
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

const openUploadModal = (id_reuniao) => {
    currentReuniaoId.value = id_reuniao;
    uploadModalVisible.value = true;
};

const closeUploadModal = () => {
    uploadModalVisible.value = false;
    selectedFile.value = null;
};

const triggerFileInput = () => {
    document.querySelector('input[type="file"]').click();
};

const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        selectedFile.value = file;
    } else {
        util.setNotification('error', 'Por favor, selecione um arquivo PDF.');
    }
};

const handleDrop = (event) => {
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
        selectedFile.value = file;
    } else {
        util.setNotification('error', 'Por favor, arraste um arquivo PDF.');
    }
};

const uploadFile = async () => {
    if (!selectedFile.value) {
        util.setNotification('error', 'Nenhum arquivo selecionado.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64File = e.target.result;
        const dados = {
            idreuniao: currentReuniaoId.value,
            arquivo: base64File,
            nome: selectedFile.value.name
        };

        try {
            const response = await endpoints.sendFile(dados);
            console.log('Response:', response);
            closeUploadModal();
        } catch (error) {
            console.error('Erro ao fazer o upload do arquivo:', error);
        }
    };
    reader.readAsDataURL(selectedFile.value);
};

onMounted(() => {
    fetchReunioes();
});
</script>

<style scoped>
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
</style>
