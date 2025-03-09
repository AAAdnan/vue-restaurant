import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

// Import components
import Directory from '../views/Directory.vue';
import AddReview from '../views/AddReview.vue';
import RestaurantDetail from '../views/RestaurantDetail.vue';
import LoginView  from '../views/LoginView.vue';
import Profile from '../views/Profile.vue';
import NotFound from '../views/NotFound.vue';

// Define routes
const routes = [
  {
    path: '/',
    name: 'directory',
    component: Directory,
    meta: { requiresAuth: false }
  },
  {
    path: '/add-review',
    name: 'add-review',
    component: AddReview,
    meta: { requiresAuth: true }
  },
  {
    path: '/restaurant/:id',
    name: 'restaurant-detail',
    component: RestaurantDetail,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  // 404 route
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { requiresAuth: false }
  }
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to.path);
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  
  console.log('Auth required:', requiresAuth);
  console.log('Is authenticated:', authStore.isAuthenticated);
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;