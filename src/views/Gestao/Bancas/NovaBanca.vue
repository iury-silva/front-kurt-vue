<template>
  <CrudBody ref="appLayout">
    <template #page-description> Adicione uma nova banca de avaliação. </template>

    <!-- Componente Stepper -->
    <div class="card flex justify-center mt-4">
      <Stepper v-model:value="activeStep" class="basis-[40rem]">
        <StepList>
          <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="1">
            <div class="flex flex-row flex-auto gap-2" v-bind="a11yAttrs.root">
              <button
                class="bg-transparent border-0 inline-flex flex-col gap-2"
                @click="activateCallback"
                v-bind="a11yAttrs.header"
              >
                <span
                  :class="[
                    'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                    {
                      'bg-brand-100 text-white border-primary': value <= activeStep,
                      'border-surface-200 dark:border-surface-700': value > activeStep
                    }
                  ]"
                >
                  <i class="pi pi-book" />
                </span>
              </button>
              <Divider />
            </div>
          </Step>
          <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="2">
            <div class="flex flex-row flex-auto gap-2 pl-2" v-bind="a11yAttrs.root">
              <button
                class="bg-transparent border-0 inline-flex flex-col gap-2"
                @click="activateCallback"
                v-bind="a11yAttrs.header"
              >
                <span
                  :class="[
                    'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                    {
                      'bg-brand-100 text-white border-primary': value <= activeStep,
                      'border-surface-200 dark:border-surface-700': value > activeStep
                    }
                  ]"
                >
                  <i class="pi pi-user" />
                </span>
              </button>
              <Divider />
            </div>
          </Step>
          <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="3">
            <div class="flex flex-row pl-2" v-bind="a11yAttrs.root">
              <button
                class="bg-transparent border-0 inline-flex flex-col gap-2"
                @click="activateCallback"
                v-bind="a11yAttrs.header"
              >
                <span
                  :class="[
                    'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                    {
                      'bg-brand-100 text-white border-primary': value <= activeStep,
                      'border-surface-200 dark:border-surface-700': value > activeStep
                    }
                  ]"
                >
                  <i class="pi pi-check" />
                </span>
              </button>
            </div>
          </Step>
        </StepList>
        <StepPanels>
          <StepPanel v-slot="{ activateCallback }" :value="1">
            <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
              <div class="text-center mt-4 mb-4 text-xl font-semibold">Selecionar Orientação</div>
              <Dropdown
                v-model="selectedOrientacao"
                :options="orientacoes"
                optionLabel="titulo_trabalho"
                placeholder="Selecione uma orientação"
                class="w-full"
                emptyMessage="Nenhuma orientação disponível"
              >
                <template #option="slotProps">
                  <div class="flex flex-col">
                    <span class="text-lg font-bold text-brand-100">{{ slotProps.option.titulo_trabalho }}</span>
                    <span class="text-sm font-medium mt-2">Aluno</span>
                    <span class="text-xs text-surface-500">{{
                      slotProps.option.Aluno.usuario.nome
                    }}</span>
                    <span class="text-xs text-surface-500">{{
                      slotProps.option.Aluno.usuario.email
                    }}</span>
                    <span class="font-sm mt-2">Orientador</span>
                    <span class="text-xs text-surface-500">{{
                      slotProps.option.Professor.usuario.nome
                    }}</span>
                    <span class="text-xs text-surface-500">{{
                      slotProps.option.Professor.usuario.email
                    }}</span>
                  </div>
                </template>
              </Dropdown>
            </div>
            <div class="flex pt-6 justify-end">
              <Button
                label="Próximo"
                icon="pi pi-arrow-right"
                iconPos="right"
                @click="activateCallback(2)"
                :disabled="!selectedOrientacao"
              />
            </div>
          </StepPanel>
          <StepPanel v-slot="{ activateCallback }" :value="2">
            <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
              <div class="text-center mt-4 mb-4 text-xl font-semibold">
                Selecionar Professor para Banca
              </div>
              <Dropdown
                v-model="selectedProfessor1"
                :options="professores"
                optionLabel="usuario.nome"
                optionValue="id_professor"
                placeholder="Selecione um professor"
                class="w-full"
              >
                <template #option="slotProps">
                  <div class="flex flex-col">
                    <span class="font-medium">{{ slotProps.option.usuario.nome }}</span>
                    <span class="text-sm text-surface-500">{{
                      slotProps.option.usuario.email
                    }}</span>
                  </div>
                </template>
              </Dropdown>
            </div>
            <div class="flex pt-6 justify-between">
              <Button
                label="Voltar"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="activateCallback(1)"
              />
              <Button
                label="Próximo"
                icon="pi pi-arrow-right"
                iconPos="right"
                @click="activateCallback(3)"
                :disabled="!selectedProfessor1"
              />
            </div>
          </StepPanel>
          <StepPanel v-slot="{ activateCallback }" :value="3">
            <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
              <div class="text-center mt-4 mb-4 text-xl font-semibold">
                Selecionar Segundo Professor
              </div>
              <Dropdown
                v-model="selectedProfessor2"
                :options="professores"
                optionLabel="usuario.nome"
                optionValue="id_professor"
                placeholder="Selecione um professor"
                class="w-full"
              >
                <template #option="slotProps">
                  <div class="flex flex-col">
                    <span class="font-medium">{{ slotProps.option.usuario.nome }}</span>
                    <span class="text-sm text-surface-500">{{
                      slotProps.option.usuario.email
                    }}</span>
                  </div>
                </template>
              </Dropdown>
            </div>
            <div class="flex pt-6 justify-between">
              <Button
                label="Voltar"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="activateCallback(2)"
              />
              <Button
                label="Finalizar"
                icon="pi pi-check"
                @click="finish"
                :disabled="!selectedProfessor2"
              />
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </div>
  </CrudBody>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import CrudBody from '@/Layouts/BasePage/CrudBody.vue'
import { useBancaStore } from '@/stores/banca.store'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import Divider from 'primevue/divider'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

const bancaStore = useBancaStore()

const activeStep = ref(1)
const selectedOrientacao = ref(null)
const selectedProfessor1 = ref(null)
const selectedProfessor2 = ref(null)

const orientacoes = computed(() => bancaStore.orientacoesWithoutBancas)
const professores = computed(() => bancaStore.professores)

const appLayout = ref(null)

onMounted(() => {
  appLayout.value.setBreadcrumbs([
    { label: 'Dashboard', route: '/', icon: 'pi pi-home' },
    { label: 'Bancas', route: '/bancas', icon: 'pi pi-users' }
  ])

  bancaStore.getOrientacoesAction()
  bancaStore.getProfessoresAction()
})

const finish = () => {
  bancaStore.createBancaAction({
    idorientacao: selectedOrientacao.value.id_orientacao,
    idaluno: selectedOrientacao.value.idaluno,
    idcronograma: selectedOrientacao.value.idcronograma,
    idprofessor1: selectedProfessor1.value,
    idprofessor2: selectedProfessor2.value
  })
}
</script>

<style scoped>
/* Estilos adicionais, se necessário */
</style>
