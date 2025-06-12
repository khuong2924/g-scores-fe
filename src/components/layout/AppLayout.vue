<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-blue-700 text-white py-4">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold text-center">G-Scores</h1>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-gradient-to-b from-yellow-400 via-yellow-500 to-green-500 min-h-screen">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-6">Menu</h2>
          <nav class="space-y-2">
            <button
              v-for="item in menuItems"
              :key="item.id"
              @click="activeView = item.id"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg font-medium transition-colors',
                activeView === item.id
                  ? 'bg-white bg-opacity-30 text-gray-900'
                  : 'text-gray-800 hover:bg-white hover:bg-opacity-20'
              ]"
            >
              {{ item.name }}
            </button>
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1">
        <slot :activeView="activeView"></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeView = ref('dashboard')

const menuItems = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'search', name: 'Search Scores' },
  { id: 'reports', name: 'Reports' },
  { id: 'settings', name: 'Settings' }
]
</script> 