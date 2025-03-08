// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';
import Home from '../views/Home.vue';
import LoginView from '../views/LoginView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    // Modified beforeEnter to properly handle the auth store
    beforeEnter: (to, from, next) => {
      // Create a new instance of the store inside the navigation guard
      const authStore = useAuthStore();
      
      console.log('Login beforeEnter - isAuthenticated:', authStore.isAuthenticated);
      
      if (authStore.isAuthenticated) {
        console.log('Already authenticated, redirecting to home');
        next('/');
      } else {
        console.log('Not authenticated, proceeding to login');
        next();
      }
    }
  },
  {
    path: '/add',
    name: 'add',
    component: () => import('../views/AddReview.vue'),
    meta: { requiresAuth: true }
  },
  // Add a catch-all route to handle undefined routes
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Modified navigation guard
router.beforeEach(async (to, from, next) => {
  // Add debugging
  console.log('Navigating to:', to.path);
  
  const authStore = useAuthStore();
  
  // Make sure auth is initialized before proceeding
  if (!authStore.initialized) {
    console.log('Waiting for auth initialization...');
    try {
      await authStore.initAuth();
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    }
  }
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  console.log('Auth required:', requiresAuth);
  console.log('Is authenticated:', authStore.isAuthenticated);

  if (requiresAuth && !authStore.isAuthenticated) {
    // Store the intended destination to redirect after login
    console.log('Redirecting to login, setting redirect to:', to.fullPath);
    localStorage.setItem('redirect_after_login', to.fullPath);
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;