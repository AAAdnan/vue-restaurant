<template>
  <div class="auth-callback">
    <div class="loading-spinner"></div>
    <p>Authenticating...</p>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'AuthCallbackView',
  setup() {
    const router = useRouter();

    onMounted(async () => {
      try {
        // For now, using a simple redirect back to home
        // In a real implementation, you would handle the OAuth callback here
        router.push('/');
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/login');
      }
    });

    return {};
  }
}
</script>

<style scoped>
.auth-callback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>