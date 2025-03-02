<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Sign in to Our Restaurant Journal</h1>
      <p>Track and share your favorite restaurants with your loved ones</p>
      
      <button @click="handleLogin" class="google-login-btn">
        <img src="../assets/google-logo.svg" alt="Google">
        Sign in with Google
      </button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogin = async () => {
      try {
        // Mock login for testing
        const mockUser = {
          id: 'test123',
          name: 'Test User',
          given_name: 'Test',
          family_name: 'User',
          picture: null,
          email: 'test@example.com'
        };
        
        authStore.setUser(mockUser);
        router.push('/');
      } catch (error) {
        console.error('Error during login:', error);
      }
    };

    return {
      handleLogin
    };
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 2rem;
}

.login-container {
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.google-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  margin-top: 2rem;
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.google-login-btn:hover {
  background-color: #f5f5f5;
}

.google-login-btn img {
  width: 18px;
  height: 18px;
}
</style>