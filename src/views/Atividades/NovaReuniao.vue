<template>
  <AppBody>
    <template #header-controls>
      <Button
        label="Voltar"
        icon="pi pi-arrow-left"
        class="p-button-sm"
        @click="router.push({ name: 'MinhasReunioes' })"
      />
    </template>
    <template #page-description>
      Preencha os campos abaixo para agendar uma nova reunião. Certifique-se de fornecer todas as informações necessárias para garantir o sucesso do agendamento.
    </template>
    <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="col-span-1 md:col-span-2">
        <span class="">
          <label for="descricao">Descrição</label>
          <InputText id="descricao" v-model="descricao" required class="w-full" />
        </span>
      </div>
      <div class="col-span-1">
        <span class="">
          <label for="data_reuniao">Data da Reunião</label>
          <Calendar id="data_reuniao" v-model="dataReuniao" showIcon required class="w-full" />
        </span>
      </div>
      <div class="col-span-1">
        <span class="">
          <label for="idorientacao">Orientação</label>
          <Dropdown
            id="idorientacao"
            v-model="selectedOrientacao"
            :options="orientacoes"
            optionLabel="metadata"
            optionValue="id_orientacao"
            placeholder="Selecione uma orientação"
            required
            class="w-full"
          />
        </span>
      </div>
      <div class="col-span-1 md:col-span-2 flex justify-end mt-4">
        <Button label="Salvar" icon="pi pi-check" type="submit" class="w-full md:w-auto" />
      </div>
    </form>
  </AppBody>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppBody from '@/Layouts/BasePage/AppBody.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import endpoints from '@/Controllers/Endpoints.controller';

const router = useRouter();
const descricao = ref('');
const dataReuniao = ref(null);
const orientacoes = ref([]);
const selectedOrientacao = ref(null);

const fetchOrientacoes = async () => {
  try {
    const response = await endpoints.getMyOrientacoes();
    if (response) {
      orientacoes.value = response.map(orientacao => ({
        ...orientacao,
        metadata: `${orientacao.Aluno.usuario.nome} - ${orientacao.titulo_trabalho} (${orientacao.status})`
      }));
    }
  } catch (error) {
    console.error('Error fetching orientacoes:', error);
  }
};

const submitForm = async () => {
  const novaReuniao = {
    descricao: descricao.value,
    data_reuniao: new Date(dataReuniao.value).toISOString(),
    idorientacao: selectedOrientacao.value,
  };

  try {
    const response = await endpoints.createReuniao(novaReuniao);
    if (response) {
      fetchOrientacoes();
      router.push({ name: 'MinhasReunioes' });
    }
  } catch (error) {
    console.error('Error creating reuniao:', error);
  }
};

onMounted(() => {
  fetchOrientacoes();
});
</script>

<style scoped>
.p-float-label {
  display: block;
  position: relative;
}

.p-float-label label {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  transition: all 0.2s ease;
  color: #1E6462;
  font-weight: 500;
}

.p-float-label input:focus ~ label,
.p-float-label input.p-filled ~ label,
.p-float-label .p-inputwrapper-focus ~ label,
.p-float-label .p-inputwrapper-filled ~ label {
  top: 0;
  font-size: 12px;
  background-color: white;
  padding: 0 4px;
}

:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-calendar) {
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

:deep(.p-inputtext:enabled:focus),
:deep(.p-dropdown:focus),
:deep(.p-calendar:focus) {
  border-color: #2A816C;
  box-shadow: 0 0 0 1px #2A816C;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight) {
  background-color: #e6f7f5;
  color: #2A816C;
}

:deep(.p-button) {
  background-color: #2A816C;
  border-color: #2A816C;
  color: white;
  transition: background-color 0.2s;
}

:deep(.p-button:hover) {
  background-color: #1E6462;
  border-color: #1E6462;
}

:deep(.p-button:focus) {
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #2A816C, 0 1px 2px 0 black;
}

@media (max-width: 768px) {
  :deep(.p-button) {
    width: 100%;
  }
}
</style>