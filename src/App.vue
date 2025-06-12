<template>
  <AppLayout v-slot="{ activeView }">
    <Home :activeView="activeView" />
  </AppLayout>
</template>

<script setup>
import AppLayout from './components/layout/AppLayout.vue'
import Home from './views/Home.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
