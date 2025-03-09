// src/store/restaurants.js
import { defineStore } from 'pinia';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  query, 
  orderBy, 
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export const useRestaurantStore = defineStore('restaurants', {
  state: () => ({
    restaurants: [],
    isLoading: false,
    error: null
  }),
  
  actions: {
    // Fetch all restaurants from Firestore
    async fetchRestaurants() {
      this.isLoading = true;
      try {
        const q = query(collection(db, 'restaurants'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        this.restaurants = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Add a new restaurant review to Firestore
    async addRestaurant(restaurant, user) {
      // Ensure user is provided
      if (!user || (!user.id && !user.uid)) {
        throw new Error('User must be logged in to add a restaurant review');
      }
      
      try {
        const newRestaurant = {
          ...restaurant,
          createdAt: new Date().toISOString(),
          userId: user.uid || user.id,
          reviewerName: user.displayName || user.given_name || 'User',
          reviewerImage: user.photoURL || user.picture
        };
        
        const docRef = await addDoc(collection(db, 'restaurants'), newRestaurant);
        
        // Add to local state
        this.restaurants.unshift({
          id: docRef.id,
          ...newRestaurant
        });
        
        return docRef.id;
      } catch (error) {
        console.error('Error adding restaurant:', error);
        throw error;
      }
    },
    
    // Delete a restaurant review
    async deleteRestaurant(id) {
      try {
        await deleteDoc(doc(db, 'restaurants', id));
        
        // Remove from local state
        const index = this.restaurants.findIndex(r => r.id === id);
        if (index !== -1) {
          this.restaurants.splice(index, 1);
        }
      } catch (error) {
        console.error('Error deleting restaurant:', error);
        throw error;
      }
    },
    
    // Update a restaurant review
    async updateRestaurant(id, updates) {
      try {
        await updateDoc(doc(db, 'restaurants', id), updates);
        
        // Update in local state
        const index = this.restaurants.findIndex(r => r.id === id);
        if (index !== -1) {
          this.restaurants[index] = { ...this.restaurants[index], ...updates };
        }
      } catch (error) {
        console.error('Error updating restaurant:', error);
        throw error;
      }
    }
  },
  
  getters: {
    getRestaurantById: (state) => (id) => {
      return state.restaurants.find(restaurant => restaurant.id === id);
    },
    getRestaurantsByUser: (state) => (userId) => {
      return state.restaurants.filter(restaurant => restaurant.userId === userId);
    }
  }
});