<template>
  <div class="add-review">
    <h1>Add New Restaurant Review</h1>
    
    <form @submit.prevent="submitReview" class="review-form">
      <div class="form-group">
        <label for="name">Restaurant Name *</label>
        <input 
          type="text" 
          id="name" 
          v-model="restaurant.name" 
          required
        >
      </div>
      
      <div class="form-group">
        <label for="cuisine">Cuisine Type *</label>
        <input 
          type="text" 
          id="cuisine" 
          v-model="restaurant.cuisine" 
          required
        >
      </div>
      
      <div class="form-group">
        <label for="address">Address *</label>
        <input 
          type="text" 
          id="address" 
          v-model="restaurant.address" 
          required
          placeholder="Enter full address for map placement"
        >
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="latitude">Latitude</label>
          <input 
            type="number" 
            id="latitude" 
            v-model="restaurant.latitude" 
            step="any"
            placeholder="Will be geocoded from address"
          >
        </div>
        
        <div class="form-group">
          <label for="longitude">Longitude</label>
          <input 
            type="number" 
            id="longitude" 
            v-model="restaurant.longitude" 
            step="any"
            placeholder="Will be geocoded from address"
          >
        </div>
      </div>
      
      <div class="form-group">
        <label for="rating">Rating *</label>
        <div class="rating-input">
          <span 
            v-for="star in 5" 
            :key="star" 
            @click="restaurant.rating = star"
            :class="{ active: restaurant.rating >= star }"
          >★</span>
        </div>
      </div>
      
      <div class="form-group">
        <label for="review">Your Review *</label>
        <textarea 
          id="review" 
          v-model="restaurant.review" 
          rows="5" 
          required
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="photos">Upload Photos</label>
        <input 
          type="file" 
          id="photos" 
          @change="handlePhotoUpload" 
          multiple
          accept="image/*"
        >
        
        <div class="photo-preview" v-if="photoPreviewUrls.length > 0">
          <div v-for="(url, index) in photoPreviewUrls" :key="index" class="photo-thumbnail">
            <img :src="url" alt="Preview">
            <button type="button" class="remove-photo" @click="removePhoto(index)">✕</button>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="$router.go(-1)" class="cancel-button">Cancel</button>
        <button type="submit" class="submit-button">Save Review</button>
      </div>
    </form>
  </div>
</template>

<script>
import { useRestaurantStore } from '../store/restaurants';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'AddReview',
  data() {
    return {
      restaurant: {
        name: '',
        cuisine: '',
        address: '',
        latitude: null,
        longitude: null,
        rating: 0,
        review: '',
        photos: [],
      },
      photoFiles: [],
      photoPreviewUrls: []
    };
  },
  setup() {
    const restaurantStore = useRestaurantStore();
    const authStore = useAuthStore();
    const router = useRouter();
    
    return { restaurantStore, authStore, router };
  },
  methods: {
    handlePhotoUpload(event) {
      const files = event.target.files;
      if (!files.length) return;
      
      // Add to existing files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.photoFiles.push(file);
        
        // Create local preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
          this.photoPreviewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    removePhoto(index) {
      this.photoFiles.splice(index, 1);
      this.photoPreviewUrls.splice(index, 1);
    },
    async submitReview() {
      // Store photos as data URLs for this simple app
      this.restaurant.photos = [...this.photoPreviewUrls];
      
      // Add to store with user info
      const id = this.restaurantStore.addRestaurant(this.restaurant, this.authStore.user);
      
      // Navigate to the detail view
      this.router.push({ name: 'restaurant-detail', params: { id } });
    }
  }
}
</script>

<style scoped>
.add-review {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.review-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.rating-input {
  display: flex;
  gap: 0.5rem;
  font-size: 2rem;
}

.rating-input span {
  color: #ddd;
  cursor: pointer;
}

.rating-input span.active {
  color: gold;
}

.photo-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.photo-thumbnail {
  position: relative;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 4px;
}

.photo-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-button {
  background-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
}

.cancel-button {
  background-color: #ccc;
  color: #333;
}
</style>