<template>
  <div v-if="student" class="score-card">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Kết quả điểm thi</h2>
      <div class="mb-4">
        <p class="text-gray-600">Số báo danh: <span class="font-semibold">{{ student.registration_number }}</span></p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="score in student.scores" :key="score.id" class="score-item">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700">{{ score.subject.name }}</h3>
            <p class="text-2xl font-bold" :class="getScoreClass(score.score)">
              {{ score.score.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="groupAScore" class="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 class="text-lg font-semibold text-gray-700">Điểm khối A</h3>
        <p class="text-2xl font-bold text-blue-600">{{ groupAScore.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ScoreCard',
  props: {
    student: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const groupAScore = computed(() => {
      if (!props.student) return null

      const math = props.student.scores.find(s => s.subject.code === 'TOAN')?.score
      const physics = props.student.scores.find(s => s.subject.code === 'VAT_LI')?.score
      const chemistry = props.student.scores.find(s => s.subject.code === 'HOA_HOC')?.score

      if (!math || !physics || !chemistry) return null
      return (math + physics + chemistry) / 3
    })

    const getScoreClass = (score) => {
      if (score >= 8) return 'text-green-600'
      if (score >= 6) return 'text-blue-600'
      if (score >= 4) return 'text-yellow-600'
      return 'text-red-600'
    }

    return {
      groupAScore,
      getScoreClass
    }
  }
}
</script> 