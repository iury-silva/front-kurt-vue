import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import Default from '@/Layouts/Default.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Auth/Login.vue')
    },
    {
      path: '/',
      component: Default,
      children: [
        {
          path: '/perfil',
          name: 'Perfil',
          component: () => import('../views/Perfil.vue')
        },
        {
          path: '/cronogramas',
          name: 'Cronogramas',
          component: () => import('../views/Gestao/Cronogramas/Cronogramas.vue')
        }
      ]
    },
    {
      path: '/cadastro',
      name: 'Cadastro',
      component: Default,
      children: [
        {
          path: 'professor',
          name: 'CadastroProfessor',
          meta: { customName: "Cadastro de Professor" },
          component: () => import('../views/Gestao/Professores/Professor.vue')
        },
        {
          path: 'aluno',
          name: 'CadastroAluno',
          meta: { customName: "Cadastro de Aluno" },
          component: () => import('../views/Gestao/Alunos/Aluno.vue')
        }
      ]
    },
    {
      path: '/bancas',
      name: '',
      component: Default,
      children: [
        {
          path: 'novaBanca',
          name: 'NovaBanca',
          meta: { customName: "Nova Banca" },
          component: () => import('../views/Gestao/Bancas/NovaBanca.vue')
        },
        {
          path: '',
          name: 'Bancas',
          meta: { customName: "Minhas Bancas" },
          component: () => import('../views/Gestao/Bancas/Bancas.vue')
        },
        {
          path: 'minhasBancas',
          name: 'MinhasBancas',
          meta: { customName: "Minhas Bancas" },
          component: () => import('../views/Atividades/MinhasBancas/MinhasBancas.vue'),
        },
        {
          path: 'avaliar/:id',
          name: 'AvaliarEntregas',
          props: true,
          params: true,
          meta: { customName: "Avaliar Entregas" },
          component: () => import('../views/Atividades/MinhasBancas/AvaliarEntregas.vue')
        }
      ]
    },
    {
      path: "/reunioes",
      name: 'MinhasReunioes',
      component: Default,
      children: [
        {
          path: '',
          name: 'MinhasReunioes',
          meta: { customName: "Minhas Reuniões" },
          component: () => import('../views/Atividades/MinhasReunioes.vue')
        },
        {
          path: 'novaReuniao',
          name: 'NovaReuniao',
          meta: { customName: "Nova Reunião" },
          component: () => import('../views/Atividades/NovaReuniao.vue')
        },
      ]
    },
    {
      path: '/avaliacoes',
      name: '',
      props: true,
      params: true,
      component: Default,
      children: [
        {
          path: '',
          name: 'Avaliacoes',
          props: true,
          params: true,
          meta: { customName: "Minhas Avaliações" },
          component: () => import('../views/Atividades/Avalicoes.vue')
        },
        {
          path: 'prazos',
          name: 'PrazosEAvaliacoes',
          props: true,
          params: true,
          meta: { customName: "Prazos" },
          component: () => import('../views/Atividades/PrazosEAvaliacoes.vue')
        }
      ]
    },
    {
      path: '/entregas',
      name: '',
      props: true,
      params: true,
      component: Default,
      children: [
        {
          path: '',
          name: 'MinhasEntregas',
          props: true,
          params: true,
          meta: { customName: "Minhas Entregas" },
          component: () => import('../views/Aluno/Entregas.vue')
        },
      ]
    },
    {
      path: '/orientacoes',
      name: '',
      component: Default,
      children: [
        {
          path: 'novaOrientacao',
          name: 'NovaOrientacao',
          meta: { customName: "Nova Orientação" },
          component: () => import('../views/Gestao/Orientacoes/NovaOrientacao.vue')
        },
        {
          path: '',
          name: 'Orientacoes',
          meta: { customName: "Orientações" },
          component: () => import('../views/Gestao/Orientacoes/Orientacoes.vue')
        }
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.name !== 'Home' && !token) {
    next({ name: 'Home' })
  } else if (to.name === 'Home' && token) {
    next({ name: 'Dashboard' })
  } else {
    const userStore = useUserStore()
    const session = localStorage.getItem('session')
    if (session) {
      userStore.setUser(JSON.parse(session))
    }
    next()
  }
})

export default router
