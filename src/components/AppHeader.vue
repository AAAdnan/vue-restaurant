<template>
  <header class="header">
    <div class="logo">
      <router-link to="/">Our Restaurant Journal</router-link>
    </div>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/directory">Directory</router-link>
      <router-link v-if="isLoggedIn" to="/add">Add Review</router-link>
    </nav>
    <div class="user-controls">
      <div v-if="isLoggedIn" class="user-profile">
        <div class="avatar" v-if="user.picture">
          <img :src="user.picture" :alt="user.name">
        </div>
        <span class="username">{{ user.given_name }}</span>
        <button @click="handleLogout" class="logout-btn">Logout</button>
        <div class="theme-toggle">
          <button 
            :class="{ active: theme === 'green' }" 
            @click="setTheme('green')" 
            class="theme-btn green"
          ></button>
          <button 
            :class="{ active: theme === 'pink' }" 
            @click="setTheme('pink')" 
            class="theme-btn pink"
          ></button>
        </div>
      </div>
      <button v-else @click="handleLogin" class="login-btn">Login with Google</button>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from '../store/auth';

export default {
  name: 'AppHeader',
  setup() {
    const authStore = useAuthStore();

    const isLoggedIn = computed(() => authStore.isLoggedIn);
    const user = computed(() => authStore.user);
    const theme = computed(() => authStore.theme);

    const handleLogin = async () => {
      try {
        const googleAuth = await this.$gAuth.signIn();
        if (googleAuth) {
          authStore.setUser(googleAuth.currentUser.get().getBasicProfile());
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    };

    const handleLogout = async () => {
      try {
        await this.$gAuth.signOut();
        authStore.logout();
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    const setTheme = (newTheme) => {
      authStore.setTheme(newTheme);
    };

    return {
      isLoggedIn,
      user,
      theme,
      handleLogin,
      handleLogout,
      setTheme
    };
  }
}
</script>

<style scoped>
/* Previous styles plus: */
.user-controls {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  color: white;
  font-weight: bold;
}

.login-btn, .logout-btn {
  background-color: white;
  color: var(--primary-color);
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.theme-toggle {
  display: flex;
  gap: 5px;
  margin-left: 10px;
}

.theme-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
}

.theme-btn.green {
  background-color: #4CAF50;
}

.theme-btn.pink {
  background-color: #E91E63;
}

.theme-btn.active {
  box-shadow: 0 0 0 2px white, 0 0 0 4px var(--primary-color);
}
</style>