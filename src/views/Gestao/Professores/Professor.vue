<template>
  <AppBody>
    <template #page-description>
      Preencha as informações necessárias nos campos abaixo para registrar um novo professor no
      sistema. Certifique-se de fornecer todos os dados corretamente para garantir o sucesso do
      cadastro e o bom funcionamento do sistema.
    </template>

    <form @submit.prevent="submitForm">
      <div class="grid grid-cols-2 gap-4">
        <div class="col-12 md:col-6 mb-2">
          <span class="p-float-label">
            <label for="nome">Nome</label>
            <InputText id="nome" v-model="professor.nome" required class="w-full" />
          </span>
        </div>
        <div class="col-12 md:col-6 mb-2">
          <span class="p-float-label">
            <label for="email">Email</label>
            <InputText id="email" v-model="professor.email" required class="w-full" type="email" />
          </span>
        </div>
        <div class="col-12 mb-2">
          <span class="p-float-label">
            <label for="departamento">Departamento</label>
            <InputText id="departamento" v-model="professor.departamento" required class="w-full" />
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
import endpoints from '@/Controllers/Endpoints.controller'

const professor = ref({
  nome: '',
  email: '',
  departamento: ''
})

const submitForm = () => {
  endpoints
    .cadastraProfessor({
      nome: professor.value.nome,
      email: professor.value.email,
      departamento: professor.value.departamento
    })
    .then((res) => {
      if (res) {
        professor.value = {
          nome: '',
          email: '',
          departamento: ''
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
  box-shadow:
    0 0 0 2px #ffffff,
    0 0 0 4px theme('colors.brand.100'),
    0 1px 2px 0 black;
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
