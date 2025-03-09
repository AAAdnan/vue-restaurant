<template>
  <div class="restaurant-detail">
    <div v-if="restaurant" class="detail-container">
      <div class="header">
        <button @click="goBack" class="back-button">
          ← Back to Directory
        </button>
        
        <div v-if="isOwner" class="actions">
          <button @click="deleteReview" class="delete-button">
            Delete Review
          </button>
        </div>
      </div>
      
      <div class="restaurant-card">
        <div class="restaurant-header">
          <h1>{{ restaurant.name }}</h1>
          <div class="meta">
            <span class="cuisine">{{ restaurant.cuisine }}</span>
            <div class="rating">
              <span 
                v-for="star in 5" 
                :key="star" 
                :class="{ active: restaurant.rating >= star }"
              >★</span>
            </div>
          </div>
        </div>
        
        <div class="address">
          <strong>Address:</strong> {{ restaurant.address }}
        </div>
        
        <div class="review-content">
          <h2>Review</h2>
          <p>{{ restaurant.review }}</p>
        </div>
        
        <div v-if="restaurant.photos && restaurant.photos.length > 0" class="photos">
          <h2>Photos</h2>
          <div class="photo-gallery">
            <div 
              v-for="(photo, index) in restaurant.photos" 
              :key="index" 
              class="photo-item"
              @click="showPhotoModal(index)"
            >
              <img :src="photo" :alt="`Photo ${index + 1} of ${restaurant.name}`">
            </div>
          </div>
        </div>
        
        <div class="review-meta">
          <div class="reviewer">
            <img 
              v-if="restaurant.reviewerImage" 
              :src="restaurant.reviewerImage" 
              alt="Reviewer" 
              class="reviewer-image"
            >
            <div v-else class="reviewer-placeholder">
              {{ getInitials(restaurant.reviewerName) }}
            </div>
            <span>Reviewed by {{ restaurant.reviewerName }}</span>
          </div>
          <div class="date">
            {{ formatDate(restaurant.createdAt) }}
          </div>
        </div>
      </div>
      
      <div v-if="restaurant.latitude && restaurant.longitude" class="map-container">
        <h2>Location</h2>
        <RestaurantMap 
          :restaurants="[restaurant]" 
          :center="{ lat: restaurant.latitude, lng: restaurant.longitude }"
          :zoom="15"
          mapHeight="300px"
        />
      </div>
    </div>
    
    <div v-else class="not-found">
      <h2>Restaurant Not Found</h2>
      <p>The restaurant you're looking for could not be found.</p>
      <button @click="goBack" class="back-button">
        Back to Directory
      </button>
    </div>
    
    <!-- Photo Modal -->
    <div v-if="showModal" class="photo-modal" @click="closePhotoModal">
      <div class="modal-content" @click.stop>
        <button class="close-modal" @click="closePhotoModal">×</button>
        <img :src="restaurant.photos[currentPhotoIndex]" alt="Full size photo">
        <div class="modal-nav">
          <button 
            v-if="currentPhotoIndex > 0" 
            @click.stop="currentPhotoIndex--" 
            class="nav-button prev"
          >
            ←
          </button>
          <span>{{ currentPhotoIndex + 1 }} / {{ restaurant.photos.length }}</span>
          <button 
            v-if="currentPhotoIndex < restaurant.photos.length - 1" 
            @click.stop="currentPhotoIndex++" 
            class="nav-button next"
          >
            →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRestaurantStore } from '../store/restaurants';
import { useAuthStore } from '../store/auth';
import RestaurantMap from '../components/RestaurantMap.vue';

export default {
  name: 'RestaurantDetail',
  components: {
    RestaurantMap
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const restaurantStore = useRestaurantStore();
    const authStore = useAuthStore();
    
    const showModal = ref(false);
    const currentPhotoIndex = ref(0);
    
    // Get restaurant ID from route params
    const restaurantId = computed(() => route.params.id);
    
    // Get restaurant data
    const restaurant = computed(() => 
      restaurantStore.getRestaurantById(restaurantId.value)
    );
    
    // Check if current user is the owner of this review
    const isOwner = computed(() => {
      if (!authStore.user || !restaurant.value) return false;
      return authStore.user.uid === restaurant.value.userId;
    });
    
    // Methods
    const goBack = () => {
      router.push('/');
    };
    
    const deleteReview = () => {
      if (confirm('Are you sure you want to delete this review?')) {
        restaurantStore.deleteRestaurant(restaurantId.value);
        router.push('/');
      }
    };
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    const getInitials = (name) => {
      if (!name) return '?';
      return name.split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase();
    };
    
    const showPhotoModal = (index) => {
      currentPhotoIndex.value = index;
      showModal.value = true;
    };
    
    const closePhotoModal = () => {
      showModal.value = false;
    };
    
    return {
      restaurant,
      isOwner,
      goBack,
      deleteReview,
      formatDate,
      getInitials,
      showModal,
      currentPhotoIndex,
      showPhotoModal,
      closePhotoModal
    };
  }
};
</script>

<style scoped>
.restaurant-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-button {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
}

.delete-button {
  padding: 0.5rem 1rem;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.restaurant-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.restaurant-header {
  margin-bottom: 1.5rem;
}

.restaurant-header h1 {
  margin-bottom: 0.5rem;
}

.meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cuisine {
  background-color: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.9rem;
}

.rating {
  font-size: 1.25rem;
  color: #ddd;
}

.rating span.active {
  color: gold;
}

.address {
  margin: 1rem 0;
  color: #555;
}

.review-content {
  margin: 1.5rem 0;
}

.review-content h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.photos {
  margin: 1.5rem 0;
}

.photos h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.photo-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.photo-item {
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo-item:hover img {
  transform: scale(1.05);
}

.review-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.reviewer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.reviewer-image, .reviewer-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #555;
}

.reviewer-image {
  object-fit: cover;
}

.date {
  color: #888;
  font-size: 0.9rem;
}

.map-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.map-container h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.not-found {
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.not-found h2 {
  margin-bottom: 1rem;
}

.not-found button {
  margin-top: 1.5rem;
}

/* Photo Modal */
.photo-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 80%;
}

.modal-content img {
  max-width: 100%;
  max-height: 80vh;
  display: block;
  margin: 0 auto;
  border-radius: 4px;
}

.close-modal {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
}

.modal-nav {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.nav-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

@media (max-width: 768px) {
  .restaurant-detail {
    padding: 1rem;
  }
  
  .restaurant-card {
    padding: 1.5rem;
  }
  
  .photo-gallery {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>