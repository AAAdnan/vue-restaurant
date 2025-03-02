<template>
  <div class="map-container">
    <div id="restaurant-map" ref="mapRef"></div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default {
  name: 'RestaurantMap',
  props: {
    restaurants: {
      type: Array,
      default: () => []
    },
    singleLocation: {
      type: Object,
      default: null
    },
    mapHeight: {
      type: String,
      default: '400px'
    }
  },
  setup(props) {
    const mapRef = ref(null);
    let map = null;
    let markers = [];
    
    // Fix for the marker icon issue in Leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
    
    const initMap = () => {
      if (map) return;
      
      if (!mapRef.value) return;
      
      // Create the map
      map = L.map(mapRef.value).setView([51.505, -0.09], 13);
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
    };
    
    const updateMarkers = () => {
      if (!map) return;
      
      // Clear existing markers
      markers.forEach(marker => {
        map.removeLayer(marker);
      });
      markers = [];
      
      // Handle single location view
      if (props.singleLocation) {
        const { latitude, longitude, name } = props.singleLocation;
        if (latitude && longitude) {
          const marker = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(name);
          markers.push(marker);
          map.setView([latitude, longitude], 15);
        }
        return;
      }
      
      // Handle multiple restaurants
      if (props.restaurants.length === 0) return;
      
      const bounds = L.latLngBounds();
      
      props.restaurants.forEach(restaurant => {
        if (!restaurant.latitude || !restaurant.longitude) return;
        
        const marker = L.marker([restaurant.latitude, restaurant.longitude])
          .addTo(map)
          .bindPopup(`
            <strong>${restaurant.name}</strong><br>
            ${restaurant.cuisine}<br>
            Rating: ${restaurant.rating}/5
          `);
        
        markers.push(marker);
        bounds.extend([restaurant.latitude, restaurant.longitude]);
      });
      
      if (markers.length > 0) {
        map.fitBounds(bounds, {
          padding: [50, 50]
        });
      }
    };
    
    onMounted(() => {
      initMap();
      updateMarkers();
    });
    
    watch(() => props.restaurants, updateMarkers, { deep: true });
    watch(() => props.singleLocation, updateMarkers, { deep: true });
    
    return {
      mapRef
    };
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: v-bind('mapHeight');
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#restaurant-map {
  width: 100%;
  height: 100%;
}
</style>