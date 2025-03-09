<template>
  <router-link 
    :to="{ name: 'restaurant-detail', params: { id: restaurant.id } }" 
    class="restaurant-card"
  >
    <div class="card-content">
      <div class="image-section">
        <div v-if="restaurant.photos && restaurant.photos.length" class="restaurant-image">
          <img :src="restaurant.photos[0]" :alt="restaurant.name">
        </div>
        <div v-else class="no-image">
          <span>No Image</span>
        </div>
      </div>
      
      <div class="info-section">
        <h2 class="restaurant-name">{{ restaurant.name }}</h2>
        
        <div class="restaurant-meta">
          <span class="cuisine">{{ restaurant.cuisine }}</span>
          <div class="rating">
            <span 
              v-for="star in 5" 
              :key="star" 
              :class="{ active: restaurant.rating >= star }"
            >★</span>
          </div>
        </div>
        
        <p class="review-preview">
          {{ previewText }}
        </p>
        
        <div class="card-footer">
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
            <span>{{ restaurant.reviewerName }}</span>
          </div>
          
          <div class="date">
            {{ formatDate(restaurant.createdAt) }}
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'RestaurantCard',
  props: {
    restaurant: {
      type: Object,
      required: true
    }
  },
  computed: {
    previewText() {
      if (!this.restaurant.review) return '';
      return this.restaurant.review.length > 100 
        ? this.restaurant.review.substring(0, 100) + '...' 
        : this.restaurant.review;
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    getInitials(name) {
      if (!name) return '?';
      return name.split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase();
    }
  }
};
</script>

<style scoped>
.restaurant-card {
  display: block;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
}

.restaurant-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.card-content {
  display: flex;
}

.image-section {
  flex: 0 0 30%;
}

.restaurant-image, .no-image {
  width: 100%;
  height: 100%;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  overflow: hidden;
}

.restaurant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  color: #999;
  font-size: 0.9rem;
}

.info-section {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.restaurant-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.restaurant-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.cuisine {
  background-color: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.rating {
  font-size: 1rem;
  color: #ddd;
}

.rating span.active {
  color: gold;
}

.review-preview {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #555;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.8rem;
}

.reviewer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reviewer-image, .reviewer-placeholder {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  color: #555;
}

.reviewer-image {
  object-fit: cover;
}

.date {
  color: #888;
}

@media (max-width: 600px) {
  .card-content {
    flex-direction: column;
  }
  
  .image-section {
    flex: 0 0 150px;
  }
}
</style>