<template>
  <div class="directory">
    <h1>Restaurant Directory</h1>
    
    <div class="actions">
      <router-link to="/add-review" class="add-button">+ Add New Review</router-link>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search by name, cuisine, or review content..."
        >
      </div>
    </div>
    
    <div v-if="isLoading" class="loading-state">
      <p>Loading restaurants...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>Error: {{ error }}</p>
    </div>
    
    <div v-else class="directory-layout">
      <div class="map-section">
        <RestaurantMap 
          :restaurants="filteredRestaurants" 
          mapHeight="calc(100vh - 200px)"
        />
      </div>
      
      <div class="list-section">
        <div v-if="filteredRestaurants.length === 0" class="empty-state">
          <p v-if="restaurantStore.restaurants.length === 0">No restaurants found. Be the first to add a review!</p>
          <p v-else>No restaurants match your search criteria.</p>
        </div>
        
        <div class="restaurant-cards">
          <RestaurantCard 
            v-for="restaurant in filteredRestaurants" 
            :key="restaurant.id" 
            :restaurant="restaurant"
            @click="viewRestaurantDetails(restaurant.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRestaurantStore } from '../store/restaurants';
import RestaurantMap from '../components/RestaurantMap.vue';
import RestaurantCard from '../components/RestaurantCard.vue';

export default {
  name: 'DirectoryView',
  components: {
    RestaurantMap,
    RestaurantCard
  },
  setup() {
    const router = useRouter();
    const restaurantStore = useRestaurantStore();
    const searchQuery = ref('');
    
    // Extract store properties to component state
    const isLoading = computed(() => restaurantStore.isLoading);
    const error = computed(() => restaurantStore.error);
    
    // Fetch data when component mounts
    onMounted(async () => {
      if (restaurantStore.restaurants.length === 0) {
        try {
          await restaurantStore.fetchRestaurants();
        } catch (err) {
          console.error('Error loading restaurants:', err);
        }
      }
    });
    
    const filteredRestaurants = computed(() => {
      if (!searchQuery.value) {
        return restaurantStore.restaurants;
      }
      
      const query = searchQuery.value.toLowerCase();
      return restaurantStore.restaurants.filter(restaurant => {
        return (
          (restaurant.name && restaurant.name.toLowerCase().includes(query)) ||
          (restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(query)) ||
          (restaurant.review && restaurant.review.toLowerCase().includes(query))
        );
      });
    });
    
    const viewRestaurantDetails = (id) => {
      router.push({ name: 'restaurant-detail', params: { id } });
    };
    
    return {
      searchQuery,
      filteredRestaurants,
      restaurantStore,
      viewRestaurantDetails,
      isLoading,
      error
    };
  }
}
</script>

<style scoped>
.directory {
  padding: 1rem;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.add-button {
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

.search-bar {
  flex-grow: 1;
  margin-left: 1rem;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.loading-state, .error-state {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 2rem 0;
}

.loading-state p {
  color: #4CAF50;
}

.error-state p {
  color: #f44336;
}

.directory-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .directory-layout {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar {
    margin-left: 0;
    margin-top: 1rem;
  }
}

.map-section {
  position: sticky;
  top: 1rem;
}

.restaurant-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>