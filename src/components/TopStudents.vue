<template>
  <div class="top-students">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Top 10 học sinh khối A</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SBD</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toán</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vật lý</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hóa học</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm TB</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="student in topStudents" :key="student.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ student.registration_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getScore(student, 'TOAN') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getScore(student, 'VAT_LI') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getScore(student, 'HOA_HOC') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                {{ calculateAverage(student) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '@/config/api'

export default {
  name: 'TopStudents',
  setup() {
    const topStudents = ref([])

    const fetchTopStudents = async () => {
      try {
        const response = await api.get('/api/v1/students/top_students_group_a')
        topStudents.value = response.data
      } catch (error) {
        console.error('Error fetching top students:', error)
      }
    }

    const getScore = (student, subjectCode) => {
      const score = student.scores.find(s => s.subject.code === subjectCode)
      return score ? score.score.toFixed(2) : '-'
    }

    const calculateAverage = (student) => {
      const math = student.scores.find(s => s.subject.code === 'TOAN')?.score
      const physics = student.scores.find(s => s.subject.code === 'VAT_LI')?.score
      const chemistry = student.scores.find(s => s.subject.code === 'HOA_HOC')?.score

      if (!math || !physics || !chemistry) return '-'
      return ((math + physics + chemistry) / 3).toFixed(2)
    }

    onMounted(() => {
      fetchTopStudents()
    })

    return {
      topStudents,
      getScore,
      calculateAverage
    }
  }
}
</script> 