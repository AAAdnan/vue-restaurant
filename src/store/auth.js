import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    theme: localStorage.getItem('theme') || 'green'
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    userInitial: (state) => state.user ? state.user.given_name.charAt(0) : '',
  },
  actions: {
    setUser(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setTheme(theme) {
      this.theme = theme;
      localStorage.setItem('theme', theme);
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
    }
  }
})