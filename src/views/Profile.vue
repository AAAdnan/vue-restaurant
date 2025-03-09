<template>
    <div class="profile-view">
      <h1>User Profile</h1>
      
      <div v-if="authStore.user" class="profile-container">
        <div class="profile-header">
          <div class="avatar">
            <img 
              v-if="authStore.user.photoURL" 
              :src="authStore.user.photoURL" 
              alt="Profile Photo"
            >
            <div v-else class="avatar-placeholder">
              {{ getInitials(authStore.user.displayName) }}
            </div>
          </div>
          
          <div class="user-info">
            <h2>{{ authStore.user.displayName }}</h2>
            <p class="email">{{ authStore.user.email }}</p>
          </div>
        </div>
        
        <div class="section">
          <h3>Your Reviews</h3>
          
          <div v-if="userReviews.length > 0" class="reviews-list">
            <div 
              v-for="review in userReviews" 
              :key="review.id" 
              class="review-item"
              @click="viewReviewDetails(review.id)"
            >
              <div class="review-header">
                <h4>{{ review.name }}</h4>
                <div class="rating">
                  <span 
                    v-for="star in 5" 
                    :key="star" 
                    :class="{ active: review.rating >= star }"
                  >★</span>
                </div>
              </div>
              
              <div class="review-meta">
                <span class="cuisine">{{ review.cuisine }}</span>
                <span class="date">{{ formatDate(review.createdAt) }}</span>
              </div>
              
              <p class="review-preview">{{ getReviewPreview(review.review) }}</p>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <p>You haven't written any reviews yet.</p>
            <router-link to="/add-review" class="add-review-button">
              Write Your First Review
            </router-link>
          </div>
        </div>
        
        <div class="section">
          <h3>Account Actions</h3>
          <button @click="logout" class="logout-button">Sign Out</button>
        </div>
      </div>
      
      <div v-else class="not-logged-in">
        <p>Please log in to view your profile.</p>
        <router-link to="/login" class="login-button">
          Log In
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../store/auth';
  import { useRestaurantStore } from '../store/restaurants';
  
  export default {
    name: 'ProfileView',
    setup() {
      const router = useRouter();
      const authStore = useAuthStore();
      const restaurantStore = useRestaurantStore();
      
      // Get all reviews by the current user
      const userReviews = computed(() => {
        if (!authStore.user) return [];
        
        return restaurantStore.restaurants.filter(
          restaurant => restaurant.userId === authStore.user.uid
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
      
      // Methods
      const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ')
          .map(part => part.charAt(0))
          .join('')
          .toUpperCase();
      };
      
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      };
      
      const getReviewPreview = (reviewText) => {
        if (!reviewText) return '';
        return reviewText.length > 100 
          ? reviewText.substring(0, 100) + '...' 
          : reviewText;
      };
      
      const viewReviewDetails = (id) => {
        router.push({ name: 'restaurant-detail', params: { id } });
      };
      
      const logout = async () => {
        await authStore.signOut();
        router.push('/');
      };
      
      return {
        authStore,
        userReviews,
        getInitials,
        formatDate,
        getReviewPreview,
        viewReviewDetails,
        logout
      };
    }
  };
  </script>
  
  <style scoped>
  .profile-view {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .profile-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    padding: 2rem;
    background-color: #f9f9f9;
    border-bottom: 1px solid #eee;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 2rem;
    background-color: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    font-size: 2.5rem;
    font-weight: bold;
    color: #555;
  }
  
  .user-info h2 {
    margin: 0 0 0.5rem 0;
  }
  
  .email {
    color: #666;
    margin: 0;
  }
  
  .section {
    padding: 2rem;
    border-bottom: 1px solid #eee;
  }
  
  .section:last-child {
    border-bottom: none;
  }
  
  .section h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
  }
  
  .reviews-list {
    display: grid;
    gap: 1rem;
  }
  
  .review-item {
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 8px;
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  
  .review-item:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .review-header h4 {
    margin: 0;
  }
  
  .rating {
    font-size: 1rem;
    color: #ddd;
  }
  
  .rating span.active {
    color: gold;
  }
  
  .review-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
  }
  
  .cuisine {
    background-color: #f0f0f0;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
  }
  
  .date {
    color: #888;
  }
  
  .review-preview {
    margin: 0;
    color: #555;
    font-size: 0.9rem;
  }
  
  .empty-state {
    text-align: center;
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  
  .add-review-button, .login-button {
    display: inline-block;
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    margin-top: 1rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
  }
  
  .logout-button {
    background-color: #f44336;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .not-logged-in {
    text-align: center;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 600px) {
    .profile-header {
      flex-direction: column;
      text-align: center;
    }
    
    .avatar {
      margin-right: 0;
      margin-bottom: 1rem;
    }
  }
  </style>