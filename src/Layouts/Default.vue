<template>
  <main class="flex">
    <Menu />
    <section class="main w-full h-screen overflow-auto">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </section>
  </main>
</template>

<script setup>
import Menu from '@/components/Menu.vue'
</script>
