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
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('../views/Dashboard.vue')
        },
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
          component: () => import('../views/Gestao/Professores/Professor.vue')
        },
        {
          path: 'aluno',
          name: 'CadastroAluno',
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
          component: () => import('../views/Gestao/Bancas/NovaBanca.vue')
        },
        {
          path: '',
          name: 'Bancas',
          component: () => import('../views/Gestao/Bancas/Bancas.vue')
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
          component: () => import('../views/Atividades/MinhasReunioes.vue')
        }
      ]
    }
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
