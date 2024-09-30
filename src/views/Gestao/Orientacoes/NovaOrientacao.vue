<template>
  <CrudBody ref="appLayout">
    <template #page-description> Adicione uma nova orientação de avaliação. </template>

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
                  <i class="pi pi-calendar" />
                </span>
              </button>
              <Divider />
            </div>
          </Step>
          <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="4">
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
              <div class="text-center mt-4 mb-4 text-xl font-semibold">Selecionar Aluno</div>
              <Dropdown
                v-model="selectedAluno"
                :options="alunos"
                optionLabel="usuario.nome"
                placeholder="Selecione um aluno"
                class="w-full"
                emptyMessage="Nenhum aluno disponível"
              >
                <template #option="slotProps">
                  <div class="flex flex-col">
                    <span class="font-medium">{{ slotProps.option.usuario.nome }}</span>
                    <span class="text-xs text-surface-500">{{
                      slotProps.option.usuario.email
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
                :disabled="!selectedAluno"
              />
            </div>
          </StepPanel>
          <StepPanel v-slot="{ activateCallback }" :value="2">
            <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
              <div class="text-center mt-4 mb-4 text-xl font-semibold">Selecionar Professor</div>
              <Dropdown
                v-model="selectedProfessor"
                :options="professores"
                optionLabel="usuario.nome"
                placeholder="Selecione um professor"
                class="w-full"
                emptyMessage="Nenhum professor disponível"
              >
                <template #option="slotProps">
                  <div class="flex flex-col">
                    <span class="font-medium">{{ slotProps.option.usuario.nome }}</span>
                    <span class="text-xs text-surface-500">{{
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
                :disabled="!selectedProfessor"
              />
            </div>
          </StepPanel>
          <StepPanel v-slot="{ activateCallback }" :value="3">
            <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
              <div class="text-center mt-4 mb-4 text-xl font-semibold">Definir Cronograma</div>
              <Dropdown
                v-model="selectedCronograma"
                :options="cronogramas"
                optionLabel="descricao"
                placeholder="Selecione um cronograma"
                class="w-full"
              />
            </div>
            <div class="flex pt-6 justify-between">
              <Button
                label="Voltar"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="activateCallback(2)"
              />
              <Button
                label="Próximo"
                icon="pi pi-arrow-right"
                iconPos="right"
                @click="activateCallback(4)"
                :disabled="!selectedCronograma"
              />
            </div>
          </StepPanel>
          <StepPanel v-slot="{ activateCallback }" :value="4">
            <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
              <div class="text-center mt-4 mb-4 text-xl font-semibold">Informações do Trabalho</div>
              <div class="mt-4">
                <InputText v-model="title" placeholder="Título do trabalho" class="w-full" />
              </div>
              <div class="mt-4 flex gap-4">
                <Calendar v-model="firstDate" placeholder="Data de início" />
                <Calendar v-model="lastDate" placeholder="Data de término" />
              </div>
            </div>
            <div class="flex pt-6 justify-between">
              <Button
                label="Voltar"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="activateCallback(3)"
              />
              <Button
                label="Finalizar"
                icon="pi pi-check"
                @click="confirmDialog"
                :disabled="!title || !firstDate || !lastDate"
              />
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </div>
    <ConfirmDialog group="headless" :draggable="false" class="min-w-[30rem]">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div
            class="rounded-full bg-brand-100 text-white inline-flex justify-center items-center h-24 w-24 -mt-20 border-4 border-white"
          >
            <i class="pi pi-question !text-4xl"></i>
          </div>
          <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
          <p class="mb-0">{{ message.message }}</p>
          <div class="flex flex-col gap-2 mt-6">
            <div class="flex gap-2">
              <span class="font-semibold">Aluno:</span>
              <span>{{ selectedAluno.usuario.nome }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold">Professor:</span>
              <span>{{ selectedProfessor.usuario.nome }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold">Cronograma:</span>
              <span>{{ selectedCronograma.descricao }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold">Título:</span>
              <span>{{ title }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold">Data de início:</span>
              <span>{{ format(new Date(firstDate), 'dd/MM/yyyy') }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold">Data de término:</span>
              <span>{{ format(new Date(lastDate), 'dd/MM/yyyy') }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-6">
            <Button label="Save" @click="acceptCallback" class="w-32">
              {{ message.acceptProps.label }}
            </Button>
            <Button label="Cancel" outlined @click="rejectCallback" class="w-32">
              {{ message.rejectProps.label }}
            </Button>
          </div>
        </div>
      </template>
    </ConfirmDialog>
  </CrudBody>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import CrudBody from '@/Layouts/BasePage/CrudBody.vue'
import { useOrientacaoStore } from '@/stores/orientacoes.store'
import { useConfirm } from 'primevue/useconfirm'
import { format } from 'date-fns'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import Divider from 'primevue/divider'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import InputText from 'primevue/inputtext'
import ConfirmDialog from 'primevue/confirmdialog'

const confirm = useConfirm()

const confirmDialog = () => {
  confirm.require({
    group: 'headless',
    message: 'Revise seus dados antes de finalizar.',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancelar',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Confirmar',
      class: 'p-button-danger'
    },
    accept: () => {
      finish()
    }
  })
}

const orientacaoStore = useOrientacaoStore()

const activeStep = ref(1)
const selectedAluno = ref(null)
const selectedProfessor = ref(null)
const selectedCronograma = ref(null)
const title = ref(null)
const firstDate = ref(null)
const lastDate = ref(null)

const professores = computed(() => orientacaoStore.professores)
const cronogramas = computed(() => orientacaoStore.cronogramas)
const alunos = computed(() => orientacaoStore.alunos)

const appLayout = ref(null)

onMounted(() => {
  appLayout.value.setBreadcrumbs([
    { label: 'Dashboard', route: '/', icon: 'pi pi-home' },
    { label: 'Orientações', route: '/orientacoes', icon: 'pi pi-calendar' }
  ])

  orientacaoStore.getAlunosAction()
  orientacaoStore.getProfessoresAction()
  orientacaoStore.getCronogramasAction()
})

const finish = () => {
  orientacaoStore.createOrientacaoAction({
    idaluno: selectedAluno.value.id_aluno,
    idprofessor: selectedProfessor.value.id_professor,
    idcronograma: selectedCronograma.value.id_cronograma,
    titulo_trabalho: title.value,
    data_inicio: firstDate.value,
    data_fim: lastDate.value
  })
}
</script>
