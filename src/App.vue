<script setup>
import { computed } from 'vue'; 
import util from './Controllers/Util.controller';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Loading from './components/Loading.vue';
import { useGlobalStore } from '@/stores/globais.store'
import { useUserStore } from '@/stores/user.store'; // Importe a sua store

util.setInitial(useToast())

const loading = computed(() => useGlobalStore().getLoading);

const userStore = useUserStore();

const token = localStorage.getItem('token');
const session = localStorage.getItem('session');

if (token && session) {
  userStore.setUser(JSON.parse(session));
}
</script>

<template>
  <div>
    <Toast />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Loading :visible="loading" />
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter {
  opacity: 0.2;
}

.fade-enter-active{
  animation: fadeInOut 1s;
}

.fade-leave-to {
  opacity: 0.2;
}
@keyframes fadeInOut {
  0% {
    opacity: 0.2;
  } 
  100% {
    opacity: 1;
  }
}
</style>
