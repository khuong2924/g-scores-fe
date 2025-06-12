<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
      <span class="text-sm text-gray-500">{{ date }}</span>
    </div>
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <span class="text-gray-600">Điểm số:</span>
        <span class="text-xl font-bold" :class="scoreColor">{{ score }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-600">Xếp hạng:</span>
        <span class="text-lg font-semibold">{{ rank }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScoreCard',
  props: {
    title: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    rank: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  computed: {
    scoreColor() {
      if (this.score >= 8) return 'text-green-600'
      if (this.score >= 6) return 'text-yellow-600'
      return 'text-red-600'
    }
  }
}
</script> 