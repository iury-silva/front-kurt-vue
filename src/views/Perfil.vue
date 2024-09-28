<template>
  <div class="h-screen w-full flex items-center">
    <div class="w-[30rem] mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Perfil</h1>
      <form @submit.prevent="updateProfile" class="space-y-6">
        <div class="space-y-2">
          <label for="nome" class="block text-sm font-semibold text-gray-700">Nome</label>
          <InputText
            id="nome"
            v-model="profile.nome"
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <!-- Avatar Upload com drag-and-drop e clique -->
        <div class="space-y-2">
          <label for="avatar" class="block text-sm font-semibold text-gray-700">Avatar</label>
          <div
            class="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 transition duration-300 relative"
            @drop.prevent="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            @click="triggerFileInput"
          >
            <input
              type="file"
              id="avatar"
              @change="onFileChange"
              accept="image/*"
              class="absolute inset-0 opacity-0 cursor-pointer"
              ref="fileInput"
            />
            <p v-if="!profile.avatar" class="text-center">
              Arraste e solte a imagem aqui ou clique para carregar
            </p>
            <img
              v-if="profile.avatar"
              :src="profile.avatar"
              alt="Avatar Preview"
              class="w-28 h-28 rounded-full object-cover shadow-lg"
            />
          </div>
          <Button
            v-if="profile.avatar"
            label="Atualizar Avatar"
            icon="pi pi-upload"
            class="mt-2 w-full"
            @click="changeAvatar"
          />
        </div>

        <!-- Botões de ação -->
        <div class="flex space-x-4">
          <Button
            type="button"
            label="Alterar senha"
            class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-md transition duration-300"
            @click="showPasswordModal = true"
          />
          <Button
            type="submit"
            label="Atualizar Perfil"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition duration-300"
          />
        </div>
      </form>
    </div>

    <!-- Dialog para Alterar Senha -->
    <Dialog
      header="Alterar senha"
      v-model:visible="showPasswordModal"
      modal
      :draggable="false"
      class="w-full max-w-md mx-auto"
    >
      <form @submit.prevent="changePassword" class="space-y-6">
        <div class="space-y-2">
          <label for="old-password" class="block text-sm font-semibold text-gray-700"
            >Senha Antiga</label
          >
          <Password
            id="old-password"
            v-model="passwordData.senhaold"
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
            toggleMask
            :feedback="false"
          />
        </div>

        <div class="space-y-2">
          <label for="new-password" class="block text-sm font-semibold text-gray-700"
            >Nova Senha</label
          >
          <Password
            id="new-password"
            v-model="passwordData.senha"
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
            toggleMask
          />
        </div>

        <!-- Botões no diálogo -->
        <div class="flex space-x-4">
          <Button
            type="submit"
            label="Alterar Senha"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-300"
          />
          <Button
            type="button"
            label="Cancelar"
            class="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 rounded-md transition duration-300"
            @click="showPasswordModal = false"
            outlined
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
.avatar-preview {
  width: 8rem;
  height: 8rem;
  border-radius: 9999px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

input[type='file'] {
  display: none;
}

.hover\:bg-gray-100:hover {
  background-color: #f5f5f5;
}
</style>
