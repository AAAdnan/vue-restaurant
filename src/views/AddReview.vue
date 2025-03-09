<template>
  <div class="add-review">
    <h1>Add New Restaurant Review</h1>
    
    <div v-if="!authStore.user" class="login-required">
      <p>You must be logged in to submit a review.</p>
      <router-link :to="{ name: 'login', query: { redirect: '/add-review' } }" class="login-button">
        Login to Continue
      </router-link>
    </div>
    
    <form v-else @submit.prevent="submitReview" class="review-form">
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
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

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
      photoPreviewUrls: [],
      isSubmitting: false
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
      try {
        // Prevent multiple submissions
        if (this.isSubmitting) return;
        this.isSubmitting = true;
        
        // Check if user is logged in
        if (!this.authStore.user) {
          alert('You must be logged in to save a review.');
          this.router.push({ name: 'login', query: { redirect: '/add-review' } });
          return;
        }
        
        // Ensure rating is set if the user didn't select stars
        if (this.restaurant.rating === 0) {
          this.restaurant.rating = 1; // Default to 1 star if none selected
        }
        
        // Upload photos to Firebase Storage
        const photoUrls = [];
        if (this.photoFiles.length > 0) {
          const storage = getStorage();
          
          for (const file of this.photoFiles) {
            const fileRef = storageRef(storage, `restaurant-photos/${Date.now()}-${file.name}`);
            await uploadBytes(fileRef, file);
            const downloadUrl = await getDownloadURL(fileRef);
            photoUrls.push(downloadUrl);
          }
        }
        
        // Set the permanent photo URLs
        this.restaurant.photos = photoUrls;
        
        // Create a properly formatted user object that matches what the store expects
        const userForStore = {
          id: this.authStore.user.uid,
          given_name: this.authStore.user.displayName,
          picture: this.authStore.user.photoURL
        };
        
        // Add to store with user info
        const id = await this.restaurantStore.addRestaurant(this.restaurant, userForStore);
        
        // Show success message and go to detail page
        alert('Review added successfully!');
        this.router.push({ name: 'restaurant-detail', params: { id } });
      } catch (error) {
        console.error('Error submitting review:', error);
        alert('There was an error saving your review. Please try again.');
      } finally {
        this.isSubmitting = false;
      }
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

.submit-button,
.cancel-button {
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  padding: 10px 20px;
  font-size: 1rem;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
}

.cancel-button {
  background-color: #ccc;
  color: #333;
}

.login-required {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-required p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.login-button {
  display: inline-block;
  background-color: #4285F4;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #3367D6;
}
</style>