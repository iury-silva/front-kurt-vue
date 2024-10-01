<template>
    <AppBody>
      <template #header-controls>
        <Button label="Voltar" icon="pi pi-arrow-left" class="p-button-sm" @click="router.push({ name: 'MinhasReunioes' })" />
      </template>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="descricao">Descrição</label>
            <InputText id="descricao" v-model="descricao" required />
          </div>
          <div class="form-group">
            <label for="data_reuniao">Data da Reunião</label>
            <Calendar id="data_reuniao" v-model="dataReuniao" showIcon required />
          </div>
          <div class="form-group">
            <label for="idorientacao">Orientação</label>
            <Dropdown id="idorientacao" v-model="selectedOrientacao" :options="orientacoes" optionLabel="metadata" optionValue="id_orientacao" placeholder="Selecione uma orientação" required />
          </div>
          <div class="button-container">
            <Button label="Salvar" icon="pi pi-check" class="p-button-success" type="submit" />
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
  .form-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .page-title {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  .button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }
  </style>