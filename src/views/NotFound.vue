<template>
    <div class="not-found">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <router-link to="/" class="home-button">Go to Homepage</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  };
  </script>
  
  <style scoped>
  .not-found {
    height: calc(100vh - 100px);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
  }
  
  .not-found-content {
    background-color: white;
    padding: 3rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 500px;
  }
  
  h1 {
    font-size: 6rem;
    margin: 0;
    color: #f44336;
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
  }
  
  p {
    margin-bottom: 2rem;
    color: #666;
  }
  
  .home-button {
    display: inline-block;
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
  }
  </style>