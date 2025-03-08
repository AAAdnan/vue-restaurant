<template>
    <nav class="navbar">
      <div class="navbar-content">
        <router-link to="/" class="logo">Restaurant Journal</router-link>
        
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link v-if="authStore.isAuthenticated" to="/add" class="nav-link">Add Review</router-link>
        </div>
        
        <div class="auth-section">
          <template v-if="authStore.isAuthenticated">
            <div class="user-info">
              <img v-if="authStore.userPhotoURL" :src="authStore.userPhotoURL" class="user-avatar" alt="User avatar">
              <span class="user-name">{{ authStore.userName }}</span>
            </div>
            <button @click="logout" class="logout-btn">Logout</button>
          </template>
          
          <router-link v-else to="/login" class="login-btn">
            Login
          </router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { useAuthStore } from '../store/auth';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'NavBar',
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
      
      const logout = async () => {
        await authStore.logout();
        router.push('/');
      };
      
      return {
        authStore,
        logout
      };
    }
  }
  </script>
  
  <style scoped>
  .navbar {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 0 20px;
  }
  
  .navbar-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
  }
  
  .logo {
    font-size: 1.25rem;
    font-weight: bold;
    color: #333;
    text-decoration: none;
  }
  
  .nav-links {
    display: flex;
    gap: 20px;
  }
  
  .nav-link {
    color: #555;
    text-decoration: none;
    transition: color 0.3s;
  }
  
  .nav-link:hover,
  .nav-link.router-link-active {
    color: #4285f4;
  }
  
  .auth-section {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .user-name {
    font-weight: 500;
  }
  
  .logout-btn {
    background: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .logout-btn:hover {
    background-color: #f5f5f5;
  }
  
  .login-btn {
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 0.9rem;
    text-decoration: none;
    transition: background-color 0.3s;
  }
  
  .login-btn:hover {
    background-color: #3367d6;
  }
  </style>