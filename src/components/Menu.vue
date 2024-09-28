<template>
    <div class="card flex h-screen">
        <Menu :model="menuItems" class="w-64 h-full bg-custom-dark flex flex-col justify-between shadow-menu">
            <template #start>
                <span class="inline-flex items-centerp-2 w-full">
                    <img src="@/assets/logo/logo.png" alt="Final Flow" class="w-28 h-28 mx-auto" />
                </span>
            </template>
            <template #item="{ item, props }">
                <a v-ripple
                    class="flex items-center p-4 text-custom-light hover:bg-custom-hover transition-colors duration-200 "
                    v-bind="props.action"
                    @click="goTo(item.link)">
                    <i :class="[item.icon, 'mr-3 text-custom-accent']"></i>
                    <span>{{ item.label }}</span>
                </a>
            </template>
            <template #end>
                <div class="p-6 bg-custom-darker">
                    <div class="flex items-center mb-4">
                        <Avatar v-if="user.avatar" :image="user.avatar" class="mr-3" shape="circle" />
                        <img v-else src="@/assets/icons/user.svg" alt="Avatar" class="avatar">
                        <div class="flex flex-col">
                            <span class="font-bold text-custom-light">{{ user.nome }}</span>
                            <span class="text-sm text-custom-muted">{{ user.email }}</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <Button v-if="user.nivel_acesso == 'coordenador'" icon="pi pi-user-edit" label="Transferir cargo"
                            class="p-button-text p-button-sm w-full justify-start text-custom-light"
                            @click="transferRole" />
                        <Button icon="pi pi-sign-out" label="Sair"
                            class="p-button-text p-button-sm w-full justify-start text-custom-light" @click="logout" />
                    </div>
                </div>
            </template>
        </Menu>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Menu from 'primevue/menu'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar';
import { useUserStore } from '@/stores/user.store'
import router from '@/router'; 

const userStore = useUserStore()

const user = ref({
    nome: 'João Silva',
    email: 'joao.silva@example.com',
    nivel_acesso: 'coordenador' 
})

setTimeout(async () => {
    console.log(await userStore.getUserData())
    user.value = await userStore.getUserData()
}, 100);

const menuItems = computed(() => {
    const items = []

    if (user.value.nivel_acesso === 'coordenador' || user.value.nivel_acesso === 'professor') {
        items.push({
            label: 'Minhas Atividades',
            items: [
                { label: 'Minhas Avaliações', icon: 'pi pi-check-square' },
                { label: 'Minhas Reuniões', icon: 'pi pi-calendar-times' }
            ]
        })
    }

    if (user.value.nivel_acesso === 'coordenador') {
        items.push({
            label: 'Gestão',
            items: [
                { label: 'Cronogramas de entrega', icon: 'pi pi-calendar' },
                { label: 'Bancas', icon: 'pi pi-users' },
                { label: 'Orientadores', icon: 'pi pi-user' },
                { label: 'Cadastro de aluno', icon: 'pi pi-user-plus' },
                { label: 'Cadastro de professor', icon: 'pi pi-user-plus', link: 'CadastroProfessor' }
            ]
        })
    }

    if (user.value.nivel_acesso === 'aluno') {
        items.push(
            { label: 'Meu TCC', icon: 'pi pi-file' },
            { label: 'Prazos e avaliações', icon: 'pi pi-calendar-check' },
            { label: 'Entregas', icon: 'pi pi-send' }
        )
    }

    return items
})

const transferRole = () => {
    console.log('Transferindo cargo...')
}

const logout = () => {
    userStore.logout()
}
const goTo = (link) => {
    router.push({ name: link });
}
</script>

<style> 
.avatar {
    width: 30px; 
    height: 30px;
    margin: 0 10px 0 0 ;
}
.p-menu-list{
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
</style>