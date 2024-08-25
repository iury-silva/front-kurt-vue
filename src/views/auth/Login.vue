<template>
  <div class="flex flex-col min-h-screen max-w-full lg:flex-row bg-brand-10">
    <div class="flex items-center justify-center w-full p-5 h-screen rounded-xl">
      <div>
        <h1 class="mb-6 text-3xl font-semibold text-start text-brand-300">Login</h1>
        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-brand-300">Email</label>
            <InputText
              id="email"
              v-model="email"
              type="email"
              class="w-full p-inputtext"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-brand-300">Password</label>
            <Password
              id="password"
              v-model="password"
              type="password"
              class="w-full"
              placeholder="Enter your password"
              required
              toggleMask
            />
          </div>
          <Button
            label="Login"
            type="submit"
            class="w-full p-button"
            style="background-color: theme('colors.brand.50'); border-color: theme('colors.brand.50');"
          />
        </form>
      </div>
    </div>
    <div class="hidden w-full lg:flex bg-cover bg-center bg-no-repeat p-5 relative" :style="{ backgroundImage: `url('path-to-your-image.jpg')` }">
      <div class="w-full h-full bg-gradient-to-r from-brand-50 to-transparent rounded-xl">
        <img src="../../assets/logo/PROJETOMASTERMAX.png" alt="Logo" class="w-40 absolute top-[0.55rem] left-2 rounded-3xl" />
        <div class="mt-60 ml-10">
          <h1 class="text-4xl font-semibold text-start text-brand-10">Welcome Back!</h1>
          <p class="text-xl text-start text-brand-300">Login to your account to continue</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Password from 'primevue/password';

const email = ref('');
const password = ref('');

const login = () => {
  console.log(`Email: ${email.value}, Password: ${password.value}`);
};
</script>

<style scoped lang="scss">
.p-inputtext, .p-password {
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
