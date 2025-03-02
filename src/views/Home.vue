<template>
  <div class="home">
    <div class="welcome">
      <h1>Welcome, {{ currentUserName }}!</h1>
      <p>Track and share your restaurant experiences with each other.</p>
      <router-link to="/add" class="add-button">Add New Restaurant Review</router-link>
    </div>
    
    <div class="recent-restaurants" v-if="recentRestaurants.length > 0">
      <h2>Recent Reviews</h2>
      <div class="restaurant-grid">
        <RestaurantCard 
          v-for="restaurant in recentRestaurants" 
          :key="restaurant.id"
          :restaurant="restaurant"
        />
      </div>
    </div>
    
    <div class="empty-state" v-else>
      <h2>No reviews yet!</h2>
      <p>Start by adding your first restaurant review.</p>
      <router-link to="/add" class="add-button">Add Your First Review</router-link>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRestaurantStore } from '../store/restaurants';
import RestaurantCard from '../components/RestaurantCard.vue';

export default {
  name: 'HomeView',
  components: {
    RestaurantCard
  },
  setup() {
    const authStore = useAuthStore();
    const restaurantStore = useRestaurantStore();

    const currentUserName = computed(() => {
      if (!authStore.user) return 'Guest';
      return authStore.user.given_name;
    });
    
    const recentRestaurants = computed(() => {
      return [...restaurantStore.restaurants]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
    });
    
    return {
      currentUserName,
      recentRestaurants
    };
  }
}
</script>

<style scoped>
.home {
  padding: 2rem;
}

.welcome {
  text-align: center;
  margin-bottom: 3rem;
}

.add-button {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: bold;
  margin-top: 1rem;
}

.recent-restaurants {
  margin-top: 2rem;
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.empty-state {
  text-align: center;
  margin: 4rem 0;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}
</style>