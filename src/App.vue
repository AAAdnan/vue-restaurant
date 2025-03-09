<!-- src/App.vue -->
<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Restaurant Reviews</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!isAuthenticated" to="/login" text>Login</v-btn>
      <v-btn v-if="isAuthenticated" to="/add-review" text>Add Review</v-btn>
      <v-btn v-if="isAuthenticated" @click="logout" text>Logout</v-btn>
    </v-app-bar>

    <v-main>
      <!-- This is crucial - make sure this router-view is present and working -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import { onMounted } from 'vue';
import { useRestaurantStore } from './store/restaurants';


export default {
  setup() {
    const restaurantStore = useRestaurantStore();
    
    onMounted(async () => {
      await restaurantStore.fetchRestaurants();
    });
    
    return { restaurantStore };
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>