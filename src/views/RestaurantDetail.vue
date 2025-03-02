<template>
  <div class="restaurant-detail" v-if="restaurant">
    <div class="detail-header">
      <button class="back-button" @click="$router.go(-1)">← Back</button>
      <h1>{{ restaurant.name }}</h1>
      <div class="restaurant-meta">
        <span class="cuisine">{{ restaurant.cuisine }}</span>
        <span class="rating">{{ '★'.repeat(restaurant.rating) }}</span>
      </div>
    </div>
    
    <div class="detail-content">
      <div class="detail-main">
        <div class="photo-gallery" v-if="restaurant.photos && restaurant.photos.length">
          <div 
            v-for="(photo, index) in restaurant.photos" 
            :key="index" 
            class="gallery-item"
            @click="activePhotoIndex = index"
          >
            <img :src="photo" :alt="`Photo ${index + 1} of ${restaurant.name}`">
          </div>
        </div>
        
        <div class="review-section">
          <h2>Review</h2>
          <div class="review-content">
            <p>{{ restaurant.review }}</p>
            <div class="review-meta">
              <span>Review by {{ restaurant.reviewerName || restaurant.reviewer }}</span>
              <span>{{ formattedDate }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="detail-sidebar">
        <div class="map-container">
          <h2>Location</h2>
          <RestaurantMap 
            :singleLocation="restaurant" 
            mapHeight="300px"
          />
          <div class="address">
            <p>{{ restaurant.address }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="not-found" v-else>
    <h2>Restaurant not found</h2>
    <p>The restaurant you're looking for doesn't exist or has been removed.</p>
    <router-link to="/directory" class="back-link">Back to Directory</router-link>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRestaurantStore } from '../store/restaurants';
import RestaurantMap from '../components/RestaurantMap.vue';

export default {
  name: 'RestaurantDetailView',
  components: {
    RestaurantMap
  },
  setup() {
    const route = useRoute();
    const restaurantStore = useRestaurantStore();
    const activePhotoIndex = ref(null);
    
    const restaurant = computed(() => {
      return restaurantStore.getRestaurantById(route.params.id);
    });
    
    const formattedDate = computed(() => {
      if (!restaurant.value || !restaurant.value.createdAt) return '';
      
      const date = new Date(restaurant.value.createdAt);
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    });
    
    return {
      restaurant,
      activePhotoIndex,
      formattedDate
    };
  }
}
</script>

<style scoped>
.restaurant-detail {
  padding: 2rem;
}

.detail-header {
  margin-bottom: 2rem;
}

.back-button {
  margin-bottom: 1rem;
  background-color: transparent;
  color: var(--primary-color);
  padding: 5px 10px;
}

.restaurant-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.cuisine {
  background-color: var(--accent-color);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.rating {
  color: gold;
  font-size: 1.2rem;
}

.detail-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .detail-content {
    grid-template-columns: 1fr;
  }
}

.photo-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.gallery-item {
  height: 150px;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.review-section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-content {
  line-height: 1.6;
}

.review-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.detail-sidebar .map-container {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.address {
  margin-top: 1rem;
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
}
</style>