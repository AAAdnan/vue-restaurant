// src/store/auth.js
import { defineStore } from 'pinia';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    initialized: false,
    authError: null
  }),
  
  getters: {
    getUserProfile: (state) => state.user,
  },
  
  actions: {
    async initAuth() {
      try {
        console.log('Initializing Firebase auth state...');
        
        return new Promise((resolve) => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in
              this.user = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL
              };
              this.isAuthenticated = true;
              console.log('User authenticated from Firebase');
            } else {
              // User is signed out
              this.user = null;
              this.isAuthenticated = false;
              console.log('No authenticated user in Firebase');
            }
            
            this.initialized = true;
            console.log('Auth initialization complete. Authenticated:', this.isAuthenticated);
            resolve(this.isAuthenticated);
          });
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        this.authError = error.message;
        this.initialized = true;
        return false;
      }
    },
    
    async loginWithGoogle() {
      console.log('Google login method called');
      try {
        const provider = new GoogleAuthProvider();
        
        // Add scopes if needed
        // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Store user data in state
        this.user = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        };
        
        this.isAuthenticated = true;
        this.authError = null;
        
        console.log('Google login successful', this.user);
        return true;
      } catch (error) {
        console.error('Google login error:', error);
        this.authError = error.message || 'Google login failed';
        return false;
      }
    },
    
    async logout() {
      try {
        await signOut(auth);
        
        this.user = null;
        this.isAuthenticated = false;
        console.log('User logged out');
        return true;
      } catch (error) {
        console.error('Logout error:', error);
        return false;
      }
    }
  }
});