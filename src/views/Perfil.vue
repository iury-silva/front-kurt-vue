<template>
  <Default>
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-6">Perfil</h1>
      <form @submit.prevent="updateProfile" class="space-y-6">
        <div class="form-group">
          <label for="nome" class="block text-sm font-medium text-gray-700">Nome</label>
          <InputText id="nome" v-model="profile.nome" class="mt-1 block w-full" required />
        </div>
        <div class="form-group">
          <label for="avatar">Avatar</label>
          <input type="file" id="avatar" @change="onFileChange" accept="image/*" />
          <img v-if="profile.avatar" :src="profile.avatar" alt="Avatar Preview" class="avatar-preview" />
          <Button v-if="profile.avatar" label="Atualizar Avatar" icon="pi pi-upload" @click="changeAvatar" />
        </div>
        <Button type="button" label="Alterar senha" class="w-full" @click="showPasswordModal = true" />
        <Button type="submit" label="Atualizar Perfil" class="w-full" />
      </form>
    </div>

    <Dialog header="Alterar senha" v-model:visible="showPasswordModal" :modal="true" :closable="false">
      <form @submit.prevent="changePassword" class="space-y-6">
        <div class="form-group">
          <label for="old-password" class="block text-sm font-medium text-gray-700">Senha Antiga</label>
          <Password id="old-password" v-model="passwordData.senhaold" class="mt-1 block w-full" required />
        </div>
        <div class="form-group">
          <label for="new-password" class="block text-sm font-medium text-gray-700">Nova Senha</label>
          <Password id="new-password" v-model="passwordData.senha" class="mt-1 block w-full" required />
        </div>
        <Button type="submit" label="Change Password" class="w-full" />
        <Button type="button" label="Cancel" class="w-full" @click="showPasswordModal = false" />
      </form>
    </Dialog>
  </Default>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Default from '@/Layouts/Default.vue';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { useUserStore } from '@/stores/user.store';
import endpoints from '@/Controllers/Endpoints.controller';

const userStore = useUserStore();
const profile = ref({
  nome: '',
  avatar: ''
});
const showPasswordModal = ref(false);
const passwordData = ref({
  senhaold: '',
  senha: ''
});

const fetchUserData = async () => {
  const userData = await userStore.getUserData();
  if (userData) {
    profile.value.nome = userData.nome;
    profile.value.avatar = userData.avatar;
  }
};

onMounted(() => {
  fetchUserData();
});

const updateProfile = async () => {
  try {
    console.log(profile.value);
    await endpoints.atualizarPerfil(profile.value);
    console.log('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

const changePassword = async () => {
  try {
    await endpoints.mudarSenha(passwordData.value);
    console.log('Password changed successfully');
    showPasswordModal.value = false;
  } catch (error) {
    console.error('Error changing password:', error);
  }
};

const changeAvatar = async () => {
  try {
    await endpoints.atualizarAvatar(profile.value.avatar);
    console.log('Avatar changed successfully');
  } catch (error) {
    console.error('Error changing avatar:', error);
  }
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profile.value.avatar = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
</script>

<style lang="scss" scoped>

</style>