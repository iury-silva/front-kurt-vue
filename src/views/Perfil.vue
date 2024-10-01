<template>
  <div class="min-h-screen bg-[#f3f4f6] flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div>
        <h1 class="text-3xl font-extrabold text-[#114658] text-center">Perfil</h1>
      </div>
      <form @submit.prevent="updateProfile" class="mt-8 space-y-6">
        <div>
          <label for="nome" class="block text-sm font-medium text-[#114658]">Nome</label>
          <div class="mt-1">
            <InputText
              id="nome"
              v-model="profile.nome"
              class="appearance-none block w-full px-3 py-2 border border-[#2A816C] rounded-md shadow-sm placeholder-[#1E6462] focus:outline-none focus:ring-[#2A816C] focus:border-[#2A816C] sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-[#114658]">Avatar</label>
          <div v-if="profile.avatar" class="mt-4 flex justify-center relative">
            <div class="avatar-container" @click="triggerFileInput">
              <img
                :src="profile.avatar"
                alt="Avatar Preview"
                class="w-32 h-32 rounded-full object-cover shadow-lg cursor-pointer avatar_preview"
              />
              <input
                id="avatar"
                name="avatar"
                type="file"
                class="sr-only"
                @change="onFileChange"
                accept="image/*"
                ref="fileInput"
              />
              <div class="overlay">
                <span class="overlay-text">Alterar Avatar</span>
              </div>
            </div>
          </div>

          <div
            v-else
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#2A816C] border-dashed rounded-md cursor-pointer hover:border-[#1E6462] transition-colors duration-300"
            @drop.prevent="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            @click="triggerFileInput"
          >
            <div class="space-y-1 text-center">
              <svg
                class="mx-auto h-12 w-12 text-[#2A816C]"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="flex text-sm text-[#114658]">
                <label
                  for="avatar"
                  class="relative cursor-pointer rounded-md font-medium text-[#2A816C] hover:text-[#1E6462] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#2A816C]"
                >
                  <span>Carregar um arquivo</span>
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    class="sr-only"
                    @change="onFileChange"
                    accept="image/*"
                    ref="fileInput"
                  />
                </label>
                <p class="pl-1">ou arraste e solte</p>
              </div>
              <p class="text-xs text-[#1E6462]">PNG, JPG, GIF até 10MB</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between space-x-4">
          <Button
            type="button"
            label="Alterar senha"
            class="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1E6462] hover:bg-[#114658] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A816C]"
            @click="showPasswordModal = true"
          />
          <Button
            type="submit"
            label="Atualizar Perfil"
            class="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2A816C] hover:bg-[#1E6462] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#114658]"
          />
        </div>
      </form>
    </div>

    <Dialog
      v-model:visible="showPasswordModal"
      :modal="true"
      :closable="false"
      :style="{ width: '450px' }"
      header="Alterar senha"
      :draggable="false"
      class="p-fluid"
    >
      <form @submit.prevent="changePassword" class="space-y-6">
        <div>
          <label for="old-password" class="block text-sm font-medium text-[#114658]"
            >Senha Antiga</label
          >
          <Password
            id="old-password"
            v-model="passwordData.senhaold"
            :feedback="false"
            toggleMask
            class="w-full mt-1"
            inputClass="w-full p-inputtext-sm"
          />
        </div>

        <div>
          <label for="new-password" class="block text-sm font-medium text-[#114658]"
            >Nova Senha</label
          >
          <Password
            id="new-password"
            v-model="passwordData.senha"
            toggleMask
            class="w-full mt-1"
            inputClass="w-full p-inputtext-sm"
          />
        </div>

        <div class="flex items-center justify-end space-x-3 pt-4">
          <Button
            type="button"
            label="Cancelar"
            class="px-4 py-2 border border-[#2A816C] rounded-md shadow-sm text-sm font-medium text-[#114658] bg-white hover:bg-[#f0f9f8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A816C]"
            @click="showPasswordModal = false"
          />
          <Button
            type="submit"
            label="Alterar Senha"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2A816C] hover:bg-[#1E6462] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#114658]"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useUserStore } from '@/stores/user.store'
import endpoints from '@/Controllers/Endpoints.controller'

const userStore = useUserStore()
const profile = ref({
  nome: '',
  avatar: ''
})
const showPasswordModal = ref(false)
const passwordData = ref({
  senhaold: '',
  senha: ''
})

const fetchUserData = async () => {
  const userData = await userStore.getUserData()
  if (userData) {
    profile.value.nome = userData.nome
    profile.value.avatar = userData.avatar
  }
}

onMounted(() => {
  fetchUserData()
})

const updateProfile = async () => {
  try {
    await endpoints.atualizarPerfil(profile.value)
    console.log('Profile updated successfully')
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}

const changePassword = async () => {
  try {
    await endpoints.mudarSenha(passwordData.value)
    console.log('Password changed successfully')
    showPasswordModal.value = false
  } catch (error) {
    console.error('Error changing password:', error)
  }
}

const changeAvatar = async () => {
  try {
    await endpoints.atualizarAvatar(profile.value.avatar)
    console.log('Avatar changed successfully')
  } catch (error) {
    console.error('Error changing avatar:', error)
  }
}

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profile.value.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profile.value.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const triggerFileInput = () => {
  document.getElementById('avatar').click()
}
</script>

<style lang="scss" scoped>
.p-button {
  background: #2A816C;
  border: 1px solid #2A816C;
}
:deep(.p-password input) {
  width: 100%;
}

:deep(.p-dialog-content) {
  @apply bg-white;
}

:deep(.p-dialog-header) {
  @apply bg-[#f0f9f8] border-b border-[#2A816C];
}

:deep(.p-dialog-footer) {
  @apply bg-[#f0f9f8] border-t border-[#2A816C];
}

:deep(.p-button) {
  @apply transition-colors duration-200;
}

:deep(.p-inputtext:enabled:focus) {
  @apply border-[#2A816C] shadow-[0_0_0_1px_#2A816C];
}

:deep(.p-password .p-password-input:enabled:focus) {
  @apply border-[#2A816C] shadow-[0_0_0_1px_#2A816C];
}

.avatar_preview {
  transition: all 0.3s;
}

.avatar_preview:hover {
  filter: brightness(0.5);
}
.avatar-container {
  cursor: pointer;
  position: relative;
  width: 8rem; /* Ajuste conforme necessário */
  height: 8rem; /* Ajuste conforme necessário */
}

.avatar-container img {
  transition: opacity 0.3s ease-in-out;
}

.avatar-container:hover img {
  opacity: 0.5;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0000009c;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.avatar-container:hover .overlay {
  opacity: 1;
}

.overlay-text {
  color: white;
}
</style>