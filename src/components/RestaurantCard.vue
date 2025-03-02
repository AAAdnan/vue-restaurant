<template>
  <div class="restaurant-card">
    <div class="restaurant-photo" v-if="restaurant.photos && restaurant.photos.length">
      <img :src="restaurant.photos[0]" :alt="restaurant.name">
    </div>
    <div class="restaurant-info">
      <h3>{{ restaurant.name }}</h3>
      <div class="restaurant-meta">
        <span class="cuisine">{{ restaurant.cuisine }}</span>
        <span class="rating">{{ '★'.repeat(restaurant.rating) }}</span>
      </div>
      <p class="review-snippet">{{ reviewSnippet }}</p>
      <div class="card-footer">
        <span class="reviewer">Added by {{ restaurant.reviewer }}</span>
        <router-link :to="'/restaurant/' + restaurant.id" class="view-button">View Details</router-link>
      </div>
    </div>
  </div>
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
    reviewSnippet() {
      if (!this.restaurant.review) return '';
      return this.restaurant.review.length > 100 
        ? this.restaurant.review.slice(0, 100) + '...' 
        : this.restaurant.review;
    }
  }
}
</script>

<style scoped>
.restaurant-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.restaurant-card:hover {
  transform: translateY(-5px);
}

.restaurant-photo {
  height: 200px;
  overflow: hidden;
}

.restaurant-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.restaurant-info {
  padding: 1.5rem;
}

.restaurant-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
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

.review-snippet {
  margin-bottom: 1rem;
  line-height: 1.4;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.reviewer {
  font-style: italic;
}

.view-button {
  padding: 5px 10px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
}
</style>