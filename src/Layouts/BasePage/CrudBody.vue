<template>
  <div class="pt-5 min-h-screen bg-gray-100 flex flex-col">
    <!-- Header Moderno e Simplificado -->
    <header class="px-8 py-4 flex items-center justify-between">
      <!-- Título dinâmico da rota -->
      <h1 class="text-brand-200 text-2xl font-semibold capitalize tracking-wide">
        {{ currentRoute }}
      </h1>
    </header>

    <!-- Breadcrumbs -->
    <div class="px-4 py-2 bg-gray-100">
      <Breadcrumb :home="home" :model="items">
        <template #item="{ item, props }">
          <router-link v-if="item.route" :to="item.route" v-slot="{ href, navigate }" custom>
            <a :href="href" v-bind="props.action" @click="navigate">
              <span :class="item.icon" class="mr-1"></span>
              <span class="text-primary font-semibold">{{ item.label }}</span>
            </a>
          </router-link>
          <a v-else :href="item.url" :target="item.target" v-bind="props.action">
            <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
          </a>
        </template>
      </Breadcrumb>
    </div>

    <!-- Page description -->
    <div class="text-gray-500 text-sm px-8">
      <slot name="page-description">
        <!-- Caso não seja passado conteúdo para o slot -->
        Insira aqui uma descrição da página, caso necessário.
      </slot>
    </div>

    <!-- Conteúdo principal -->
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
import { ref } from 'vue'
import Breadcrumb from 'primevue/breadcrumb'
import { useRoute } from 'vue-router'

const route = useRoute()

// Pega o nome da rota atual e formata
const currentRoute = route.meta.customName ? route.meta.customName
  : (route.name ? route.name.toString().replace('-', ' ') : 'Home')
const items = ref([])
const home = { icon: 'pi pi-home', label: 'Início' }

const setBreadcrumbs = (crumbs) => {
  items.value = crumbs
}

defineExpose({ setBreadcrumbs })
</script>

<style scoped>
.p-breadcrumb {
  background-color: transparent; /* Ajuste de cor do fundo, se necessário */
}
</style>
