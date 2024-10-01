<template>
  <AppBody>
    <template #page-description>
      Preencha as informações necessárias nos campos abaixo para registrar um novo professor no
      sistema. Certifique-se de fornecer todos os dados corretamente para garantir o sucesso do
      cadastro e o bom funcionamento do sistema.
    </template>
    <form @submit.prevent="submitForm">
      <div class="grid grid-cols-2 gap-4">
        <div class="col-12 md:col-6 mb-4">
          <span class="p-float-label">
            <label for="nome">Nome</label>
            <InputText id="nome" v-model="aluno.nome" required class="w-full" />
          </span>
        </div>
        <div class="col-12 md:col-6 mb-4">
          <span class="p-float-label">
            <label for="email">Email</label>
            <InputText id="email" v-model="aluno.email" required class="w-full" type="email" />
          </span>
        </div>
        <div class="col-12 md:col-6 mb-4">
          <span class="p-float-label">
            <label for="matricula">Matrícula</label>
            <InputText
              id="matricula"
              v-model="aluno.matricula"
              required
              class="w-full"
              type="number"
              min="0"
            />
          </span>
        </div>
        <div class="col-12 md:col-6 mb-4">
          <span class="p-float-label">
            <label for="curso">Curso</label>

            <Dropdown
              id="curso"
              v-model="aluno.curso"
              :options="cursos"
              optionLabel="nome"
              placeholder="Selecione um curso"
              class="w-full"
            />
          </span>
        </div>
      </div>
      <div class="button-container">
        <Button type="submit" label="Cadastrar" class="submit-button" />
      </div>
    </form>
  </AppBody>
</template>
  
<script setup>
import AppBody from '@/Layouts/BasePage/AppBody.vue'
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'

import endpoints from '@/Controllers/Endpoints.controller'

const aluno = ref({
  nome: '',
  email: '',
  matricula: '',
  curso: null
})

let cursos = ref([])

setTimeout(async () => {
  cursos.value = await endpoints.getCursos()
}, 100)

const submitForm = () => {
  endpoints
    .cadastraAluno({
      nome: aluno.value.nome,
      email: aluno.value.email,
      matricula: Number(aluno.value.matricula),
      idcurso: aluno.value.curso.id_curso
    })
    .then((res) => {
      if (res) {
        aluno.value = {
          nome: '',
          email: '',
          matricula: '',
          curso: null
        }
      }
    })
}
</script>
  
  <style scoped>
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  color: theme('colors.brand.200');
}

.description {
  margin-bottom: 2.5rem;
  color: theme('colors.brand.200');
}

.p-float-label label {
  color: theme('colors.brand.50');
  font-weight: 500;
}

:deep(.p-inputtext:enabled:focus) {
  border-color: theme('colors.brand.50');
  box-shadow: 0 0 0 1px theme('colors.brand.50');
}

:deep(.p-button:focus) {
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px theme('colors.brand.100'), 0 1px 2px 0 black;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.submit-button {
  width: 33%;
  min-width: 11rem;
  background-color: theme('colors.brand.100');
  border-color: theme('colors.brand.100');
}

@media (max-width: 768px) {
  .surface-card {
    padding: 1.5rem;
  }
}
</style>
  