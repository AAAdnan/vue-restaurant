import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'
import Home from '../views/Home.vue'
import Directory from '../views/Directory.vue'
import AddReview from '../views/AddReview.vue'
import RestaurantDetail from '../views/RestaurantDetail.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/directory',
      name: 'directory',
      component: Directory
    },
    {
      path: '/add',
      name: 'add-review',
      component: AddReview,
      meta: { requiresAuth: true }
    },
    {
      path: '/restaurant/:id',
      name: 'restaurant-detail',
      component: RestaurantDetail,
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('../views/AuthCallback.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isLoggedIn) {
    next('/login');
  } else {
    next();
  }
})

export default router