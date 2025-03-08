<!-- src/views/LoginView.vue -->
<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Sign in to Restaurant Journal</h1>
      <p>Track and share your favorite restaurants with your loved ones</p>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <button @click="handleGoogleLogin" class="google-login-btn" :disabled="loading">
        <div class="google-btn-content">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google logo" class="google-logo" />
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign in with Google</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const loading = ref(false);
    const error = ref('');
    
    const handleGoogleLogin = async () => {
      console.log('Attempting Google login');
      loading.value = true;
      error.value = '';
      
      try {
        const success = await authStore.loginWithGoogle();
        console.log('Login success:', success);
        
        if (success) {
          // Check for redirect path
          const redirectPath = localStorage.getItem('redirect_after_login');
          if (redirectPath) {
            localStorage.removeItem('redirect_after_login');
            router.push(redirectPath);
          } else {
            router.push('/');
          }
        } else {
          error.value = 'Login failed. Please try again.';
        }
      } catch (e) {
        console.error('Login error:', e);
        error.value = e.message || 'An error occurred during login';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      loading,
      error,
      handleGoogleLogin
    };
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
  padding: 2rem;
  background-color: #f8f8f8;
}

.login-container {
  max-width: 400px;
  width: 100%;
  padding: 2.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.login-container h1 {
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 0.75rem;
}

.login-container p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.4;
}

.error-message {
  margin: 1.5rem 0;
  padding: 12px;
  background-color: #ffebee;
  color: #b71c1c;
  border-radius: 6px;
  font-size: 0.9rem;
}

.google-login-btn {
  width: 100%;
  padding: 0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.google-btn-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 500;
  color: #3c4043;
}

.google-logo {
  width: 18px;
  height: 18px;
  margin-right: 12px;
}

.google-login-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.google-login-btn:active:not(:disabled) {
  background-color: #f0f0f0;
}

.google-login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .login-container {
    padding: 2rem 1.5rem;
  }
  
  .login-container h1 {
    font-size: 1.5rem;
  }
}
</style>