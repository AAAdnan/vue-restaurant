import { defineStore } from 'pinia'

export const useRestaurantStore = defineStore('restaurants', {
  state: () => ({
    restaurants: JSON.parse(localStorage.getItem('restaurants')) || []
  }),
  actions: {
    addRestaurant(restaurant, user) {
      // Add timestamp, ID and user info
      const newRestaurant = {
        ...restaurant,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        userId: user ? user.id : null,
        reviewerName: user ? user.given_name : 'Anonymous',
        reviewerImage: user ? user.picture : null
      };
      
      this.restaurants.push(newRestaurant);
      this.saveToLocalStorage();
      return newRestaurant.id;
    },
    deleteRestaurant(id) {
      const index = this.restaurants.findIndex(r => r.id === id);
      if (index !== -1) {
        this.restaurants.splice(index, 1);
        this.saveToLocalStorage();
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('restaurants', JSON.stringify(this.restaurants));
    }
  },
  getters: {
    getRestaurantById: (state) => (id) => {
      return state.restaurants.find(restaurant => restaurant.id === id);
    }
  }
})