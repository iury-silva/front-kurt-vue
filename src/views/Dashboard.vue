<template>
  <main class="flex">
    <Menu />
    <section class="main w-full">
      main
    </section>
  </main>
</template>

<script setup>
import Menu from '@/components/Menu.vue';

</script>

<style lang="scss" scoped> 
.main {
  background: theme('colors.brand.10');
}
</style>