<template>
  <div class="home">
    <v-sheet class="mb-10 py-8 px-6 text-center" rounded color="primary" elevation="3">
      <h1 class="text-h3 mb-4 arabic-font">Welcome, {{ currentUserName }}!</h1>
      <p class="text-h6 mb-6">Journey through our collection of culinary treasures</p>
      <v-btn 
        to="/add" 
        size="large" 
        color="accent" 
        class="px-6 py-3 text-uppercase"
        elevation="2"
      >
        <v-icon left>mdi-plus-circle</v-icon>
        Add New Restaurant Review
      </v-btn>
    </v-sheet>
    
    <div v-if="recentRestaurants.length > 0">
      <h2 class="text-h4 mb-6 text-center arabic-font">Recent Discoveries</h2>
      
      <v-row>
        <v-col 
          v-for="restaurant in recentRestaurants" 
          :key="restaurant.id"
          cols="12" md="4" sm="6"
        >
          <v-card
            class="mx-auto restaurant-card"
            elevation="3"
            height="100%"
          >
            <v-img
              :src="restaurant.photos && restaurant.photos.length ? restaurant.photos[0] : 'https://via.placeholder.com/400x200?text=No+Image'"
              height="200"
              cover
            ></v-img>
            
            <v-card-title class="text-h5">{{ restaurant.name }}</v-card-title>
            
            <v-card-subtitle>
              <v-chip class="mr-2" color="primary" size="small">{{ restaurant.cuisine }}</v-chip>
              <span class="gold-text">{{ '★'.repeat(restaurant.rating) }}</span>
            </v-card-subtitle>
            
            <v-card-text class="text-body-1">
              {{ reviewSnippet(restaurant) }}
            </v-card-text>
            
            <v-card-actions>
              <span class="text-caption">Added by {{ restaurant.reviewerName || restaurant.reviewer }}</span>
              <v-spacer></v-spacer>
              <v-btn
                :to="`/restaurant/${restaurant.id}`"
                color="accent"
                variant="text"
              >
                View Details
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    
    <v-sheet
      v-else
      class="mx-auto mt-10 py-10 px-6 text-center"
      max-width="600"
      rounded
      elevation="3"
    >
      <v-icon size="x-large" color="primary" class="mb-4">mdi-map-search</v-icon>
      <h2 class="text-h4 mb-4 arabic-font">Begin Your Culinary Journey</h2>
      <p class="text-h6 mb-6">Start by adding your first restaurant review</p>
      <v-btn 
        to="/add" 
        size="large" 
        color="accent" 
        class="px-6"
      >
        Add Your First Review
      </v-btn>
    </v-sheet>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from '../store/auth.js';
import { useRestaurantStore } from '../store/restaurants.js';

export default {
  name: 'HomeView',
  setup() {
    const authStore = useAuthStore();
    const restaurantStore = useRestaurantStore();

    const currentUserName = computed(() => {
      if (!authStore.user) return 'Explorer';
      return authStore.user.given_name;
    });
    
    const recentRestaurants = computed(() => {
      return [...restaurantStore.restaurants]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
    });
    
    const reviewSnippet = (restaurant) => {
      if (!restaurant.review) return '';
      return restaurant.review.length > 100 
        ? restaurant.review.slice(0, 100) + '...' 
        : restaurant.review;
    };
    
    return {
      currentUserName,
      recentRestaurants,
      reviewSnippet
    };
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.arabic-font {
  font-family: 'Scheherazade New', serif;
}

.gold-text {
  color: #D4AF37;
  font-size: 1.2rem;
}

.restaurant-card {
  border: 1px solid rgba(139, 69, 19, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
}

/* Add decorative elements for the souk theme */
.home h2::after {
  content: '';
  display: block;
  width: 150px;
  height: 3px;
  background: #D4AF37;
  margin: 15px auto;
  position: relative;
}

.home h2::after {
  background: linear-gradient(to right, transparent, #D4AF37, transparent);
}
</style>