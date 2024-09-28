<template>
  <Dialog :visible="visible" @update:visible="updateVisible" modal header="Transferir Cargo"
    :style="{ width: '30rem' }">
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
        <span class="text-xl font-bold">Transferir Cargo</span>
      </div>
    </template>
    <p class="text-surface-600 mb-4">Selecione o novo coordenador.</p>
    <div class="flex flex-col gap-2 mb-4">
      <label for="professor" class="font-semibold">Professor</label>
      <Dropdown id="professor" v-model="selectedProfessor" :options="professores" optionLabel="usuario.nome"
        optionValue="id_professor" placeholder="Selecione um professor" class="w-full">
        <template #option="slotProps">
          <div class="flex flex-col">
            <span class="font-medium">{{ slotProps.option.usuario.nome }}</span>
            <span class="text-sm text-surface-500">{{ slotProps.option.usuario.email }}</span>
          </div>
        </template>
      </Dropdown>
    </div>
    <template #footer>
      <Button label="Cancelar" text @click="closeModal" />
      <Button label="Transferir" outlined :disabled="!selectedProfessor" @click="transferCoordenador" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import endpoints from '@/Controllers/Endpoints.controller';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible']);

const professores = ref([]);
const selectedProfessor = ref(null);

const closeModal = () => {
  emit('update:visible', false);
  selectedProfessor.value = null;
};

watch(() => props.visible, (newVal) => {
  if (newVal) {
    endpoints.getProfessores().then((response) => {
      professores.value = response;
    });
  } else {
    selectedProfessor.value = null;
  }
});

const updateVisible = (value) => {
  emit('update:visible', value);
};

const transferCoordenador = async () => {
  if (selectedProfessor.value) {
    let response = await endpoints.transferirCoordenador(selectedProfessor.value);

    if (response) {
      console.log('Cargo transferido com sucesso');
      closeModal();
    } else {
      console.error('Erro ao transferir cargo:', response);
    }
  }
};
</script>