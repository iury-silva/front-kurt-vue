import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import Default from '@/Layouts/Default.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/auth/Login.vue')
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
        // {
        //   path: '/bancas',
        //   name: 'Bancas',
        //   component: () => import('../views/Bancas/Bancas.vue')
        // },
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
          component: () => import('../views/Cadastro/Professor.vue')
        },
        {
          path: 'aluno',
          name: 'CadastroAluno',
          component: () => import('../views/Cadastro/Aluno.vue')
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
          component: () => import('../views/Bancas/NovaBanca.vue')
        },
        {
          path: '',
          name: 'Bancas',
          component: () => import('../views/Bancas/Bancas.vue')
        }
      ]
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
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
