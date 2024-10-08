<template>
  <div class="card flex h-screen menu">
    <Menu
      :model="menuItems"
      class="w-64 h-full bg-custom-dark flex flex-col justify-between shadow-menu"
    >
      <template #start>
        <span class="inline-flex items-centerp-2 w-full">
          <img src="@/assets/logo/logo.png" alt="Final Flow" class="w-28 h-28 mx-auto" />
        </span>
      </template>
      <template #item="{ item, props }">
        <a
          class="flex items-center p-4 text-custom-light hover:bg-custom-hover transition-colors duration-200"
          v-bind="props.action"
          @click="goTo(item.link)"
        >
          <i :class="[item.icon, 'mr-3 text-custom-accent']"></i>
          <span>{{ item.label }}</span>
        </a>
      </template>
      <template #end>
        <div class="p-2 bg-custom-darker">
          <div class="flex items-center perfil cursor-pointer" @click="triggerPopover">
            <img v-if="user.avatar" :src="user.avatar" class="mr-3 rounded-full w-10" />
            <img v-else src="@/assets/icons/user.svg" alt="Avatar" class="avatar" />
            <div class="flex flex-col w-full truncate">
              <p class="font-bold text-custom-light truncate hover:text-clip">{{ user.nome }}</p>
              <span class="text-xs text-custom-muted truncate hover:text-clip">{{ user.email }}</span>
            </div>
          </div>
          <!-- <div class="flex flex-col gap-2">
                        <Button v-if="user.nivel_acesso == 'coordenador'" icon="pi pi-user-edit" label="Transferir cargo"
                                class="p-button-text p-button-sm w-full justify-start text-custom-light"
                                @click="openModalTransfer" />
                        <TransferirCargoModal v-model:visible="modalVisible" @update:visible="transferModalVisible = $event" />
                        <Button icon="pi pi-sign-out" label="Sair"
                            class="p-button-text p-button-sm w-full justify-start text-custom-light" @click="logout" />
                    </div> -->
          <Popover appendTo="body" trigger="click"  ref="popoverVisible">
            <div class="flex flex-col gap-2">
              <Button
                v-if="user.nivel_acesso == 'coordenador'"
                icon="pi pi-user-edit"
                label="Transferir cargo"
                class="p-button-text p-button-sm w-full !justify-start !text-brand-300"
                @click="openModalTransfer"
              />
              <Button
                icon="pi pi-user"
                label="Perfil"
                class="p-button-text p-button-sm w-full !justify-start !text-brand-300"
                @click="goTo('Perfil')"
              />
              <Button
                icon="pi pi-sign-out"
                label="Sair"
                class="p-button-text p-button-sm w-full !justify-start !text-brand-300"
                @click="logout"
              />
            </div>
          </Popover>
              <TransferirCargoModal
                v-model:visible="modalVisible"
                @update:visible="transferModalVisible = $event"
              />
        </div>
      </template>
    </Menu>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Menu from 'primevue/menu'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import { useUserStore } from '@/stores/user.store'
import router from '@/router'
import TransferirCargoModal from '@/components/TransferirCargoModal.vue'
import Popover from 'primevue/popover'

const modalVisible = ref(false)
const popoverVisible = ref()

const triggerPopover = (event) => {
  popoverVisible.value.toggle(event)
}

const userStore = useUserStore()

const user = computed(() => userStore.user)

const menuItems = computed(() => {
  const items = []

  if (user.value.nivel_acesso === 'coordenador' || user.value.nivel_acesso === 'professor') {
    items.push({
      label: 'Minhas Atividades',
      items: [
        { label: 'Avaliações', icon: 'pi pi-list-check', link: 'Avaliacoes' },
        { label: 'Minhas bancas', icon: 'pi pi-check-square', link: 'MinhasBancas' },
        { label: 'Minhas Reuniões', icon: 'pi pi-calendar-clock', link: 'MinhasReunioes' }
      ]
    })
  }

  if (user.value.nivel_acesso === 'coordenador') {
    items.push({
      label: 'Gestão',
      items: [
        { label: 'Cronogramas ', icon: 'pi pi-calendar', link: 'Cronogramas' },
        { label: 'Orientações ', icon: 'pi pi-sitemap', link: 'Orientacoes' },
        { label: 'Bancas', icon: 'pi pi-users', link: 'Bancas' },
        { label: 'Cadastro de aluno', icon: 'pi pi-user-plus', link: 'CadastroAluno' },
        { label: 'Cadastro de professor', icon: 'pi pi-user-plus', link: 'CadastroProfessor' }
      ]
    })
  }

    if (user.value.nivel_acesso === 'aluno') {
        items.push(
            { label: 'Minhas entregas', icon: 'pi pi-file-export', link: 'MinhasEntregas' },
            { label: 'Minhas Reuniões', icon: 'pi pi-calendar-clock', link: 'MinhasReunioes' }
        )
    }

  return items
})

const openModalTransfer = () => {
  console.log('Transferir cargo')
  modalVisible.value = true
  popoverVisible.value.hide()
}

const logout = () => {
  userStore.logout()
}

const goTo = (link) => {
  router.push({ name: link })
  popoverVisible.value.hide()
}
</script>

<style>
.p-menu-list {
  overflow-y: auto;
}
.p-menu {
  height: -webkit-fill-available !important;
}
.avatar {
  width: 30px;
  height: 30px;
  margin: 0 10px 0 0;
}

.p-menu-list {
  height: 100% !important;
}

.shadow-menu {
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}

:deep(.p-menu) {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
}

:deep(.p-menu .p-menuitem-link) {
  padding: 1rem 1.5rem;
}

:deep(.p-menu .p-menuitem-link:hover) {
  background-color: theme('colors.brand.100');
}

:deep(.p-menu .p-menuitem-link .p-menuitem-text) {
  color: theme('colors.brand.10');
}

:deep(.p-menu .p-menuitem-link .p-menuitem-icon) {
  color: theme('colors.brand.50');
}

:deep(.p-menu .p-submenu-header) {
  background: transparent;
  color: theme('colors.brand.50');
  font-weight: bold;
  padding: 1rem 1.5rem;
  font-size: 1.1em;
}

.bg-custom-darker {
  border-top: 1px solid theme('colors.brand.10');
}

.text-custom-light {
  color: theme('colors.brand.50');
}

.text-custom-accent {
  color: theme('colors.brand.50');
}

.text-custom-muted {
  color: #a0c4c0;
}

:deep(.p-button.p-button-text) {
  color: theme('colors.brand.10');
}

:deep(.p-button.p-button-text:hover) {
  background: theme('colors.brand.100');
}
.perfil {
  border-radius: var(--p-menu-item-border-radius);
  padding: 5px;
}
.perfil:hover {
  background: var(--p-menu-item-focus-background);
}

:deep(.p-popover) {
  z-index: 999 !important;
}

/* Definir z-index do modal */
:deep(.p-dialog) {
  z-index: 1000 !important; /* Certifique-se de que seja maior que o do popover */
}
</style>
