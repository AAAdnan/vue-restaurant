<template>
  <div class="directory">
    <h1>Restaurant Directory</h1>
    
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search by name, cuisine, or review content..."
      >
    </div>
    
    <div class="directory-layout">
      <div class="map-section">
        <RestaurantMap 
          :restaurants="filteredRestaurants" 
          mapHeight="calc(100vh - 200px)"
        />
      </div>
      
      <div class="list-section">
        <div v-if="filteredRestaurants.length === 0" class="empty-state">
          <p>No restaurants found.</p>
        </div>
        
        <div class="restaurant-cards">
          <RestaurantCard 
            v-for="restaurant in filteredRestaurants" 
            :key="restaurant.id" 
            :restaurant="restaurant"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
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
    const restaurantStore = useRestaurantStore();
    const searchQuery = ref('');
    
    const filteredRestaurants = computed(() => {
      if (!searchQuery.value) {
        return restaurantStore.restaurants;
      }
      
      const query = searchQuery.value.toLowerCase();
      return restaurantStore.restaurants.filter(restaurant => {
        return (
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.cuisine.toLowerCase().includes(query) ||
          restaurant.review.toLowerCase().includes(query)
        );
      });
    });
    
    return {
      searchQuery,
      filteredRestaurants
    };
  }
}
</script>

<style scoped>
.directory {
  padding: 1rem;
}

.search-bar {
  margin-bottom: 1rem;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
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
}
</style>