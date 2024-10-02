<template>
  <div class="flex flex-col min-h-screen max-w-full lg:flex-row">
    <div class="flex items-center justify-center w-full p-5 h-screen rounded-xl">
      <div>
        <h1 class="mb-6 text-3xl font-semibold text-start text-brand-300">Login</h1>
        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-brand-300">E-mail</label>
            <InputText
              id="email"
              v-model="email"
              type="email"
              class="w-full p-inputtext"
              placeholder="Digite seu e-mail"
              required
            />
          </div>
          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-brand-300"
              >Senha</label
            >
            <Password
              id="password"
              v-model="password"
              type="password"
              class="w-full"
              placeholder="********"
              required
              toggleMask
              :feedback="false"
            />
          </div>
          <Button label="Login" type="submit" class="w-full" :loading="loading" />
        </form>
        <div class="mt-4 text-center">
          <a href="#" @click.prevent="showForgotPasswordModal = true" class="text-sm text-brand-300"
            >Esqueceu a senha?</a
          >
        </div>
      </div>
    </div>
    <Dialog
      v-model:visible="showForgotPasswordModal"
      header="Recupere sua senha"
      modal
      :draggable="false"
    >
      <form @submit.prevent="recoverPassword" class="flex flex-col gap-3">
        <div class="form-group">
          <label for="recover-email" class="block mb-2 text-sm font-medium text-brand-300"
            >E-mail</label
          >
          <InputText
            id="recover-email"
            v-model="recoverEmail"
            type="email"
            placeholder="Digite seu e-mail"
            class="w-full p-inputtext"
            place
            required
          />
        </div>
        <Button label="Recuperar senha" type="submit" class="w-full" />
        <Button
          label="Cancelar"
          type="button"
          class="w-full"
          outlined
          @click="showForgotPasswordModal = false"
        />
      </form>
    </Dialog>
    <div class="hidden w-full lg:flex bg-cover bg-center bg-no-repeat relative">
      <img
        src="../../assets/img/logo_horizontal.webp"
        alt=""
        class="absolute top-8 left-8 w-1/5 z-10"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-white to-transparent w-1/5"></div>
      <div>
        <div>
          <img
            src="../../assets/img/login_page_new.webp"
            alt=""
            class="object-cover h-screen max-w-none rounded-xl overflow-hidden bg-contain"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import endpoints from '@/Controllers/Endpoints.controller'

const email = ref('')
const password = ref('')
const showForgotPasswordModal = ref(false)
const recoverEmail = ref('')
const loading = ref(false)

const login = async () => {
  loading.value = true
  try {
    await endpoints.fazerLogin({ email: email.value, senha: password.value })
    console.log('Logged in successfully')
  } catch (error) {
    console.error('Error logging in:', error)
  }
  loading.value = false
}

const recoverPassword = async () => {
  try {
    await endpoints.recuperarSenha({ email: recoverEmail.value })
    console.log('Password recovery email sent successfully')
    showForgotPasswordModal.value = false
  } catch (error) {
    console.error('Error recovering password:', error)
  }
}
</script>

<style scoped lang="scss">
.p-inputtext,
.p-password {
  border-color: theme('colors.brand.300');
  &:focus {
    box-shadow: 0 0 0 3px theme('colors.brand.10');
    border-color: theme('colors.brand.200');
  }
}
.p-button {
  &:hover {
    background-color: theme('colors.brand.100');
    border-color: theme('colors.brand.100');
  }
}
</style>
