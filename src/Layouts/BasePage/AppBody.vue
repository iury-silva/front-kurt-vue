<template>
  <div class="pt-5 min-h-screen bg-gray-100 flex flex-col">
    <!-- Header Moderno e Simplificado -->
    <header class="px-8 py-4 flex items-center justify-between">
      <!-- Título dinâmico da rota -->
      <h1 class="text-brand-200 text-2xl font-semibold capitalize tracking-wide">
        {{ currentRoute }}
      </h1>

      <!-- Ações no cabeçalho (botões ou menus) -->
      <div class="flex flex-row gap-3">
        <slot name="header-controls"></slot>
      </div>
    </header>
    <!-- Page description -->
    <div class="text-gray-500 text-sm px-8">
      <slot name="page-description">
        <!-- Caso não seja passado conteúdo para o slot -->
        Insira aqui uma descrição da página, caso necessário.
      </slot>
    </div>

    <!-- Main Content -->
    <main class="flex-1 p-8">
      <div class="bg-white shadow-lg rounded-lg p-6">
        <slot>
          <!-- Conteúdo padrão: tabelas, formulários CRUD, etc. -->
          <p class="text-lg text-gray-500">Insira aqui seu conteúdo de tabelas ou CRUD.</p>
        </slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

// Pega o nome da rota atual e formata
const currentRoute = route.name ? route.name.toString().replace('-', ' ') : 'Home'
</script>

<style scoped>
main {
  background-color: var(--light-color);
}
</style>
