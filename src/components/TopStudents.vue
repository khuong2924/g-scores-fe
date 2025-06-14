<template>
  <div class="top-students">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-4xl">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </h2>
      </div>

      <!-- Table Section -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-gradient-to-r from-blue-600 to-blue-700">
              <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider border-b-2 border-blue-400">
                <div class="flex items-center space-x-2">
                  <span class="text-sm">SBD</span>
                </div>
              </th>
              <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider border-b-2 border-blue-400">
                <div class="flex items-center space-x-2">
                  <span class="text-sm">Toán</span>
                </div>
              </th>
              <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider border-b-2 border-blue-400">
                <div class="flex items-center space-x-2">
                  <span class="text-sm">Vật lý</span>
                </div>
              </th>
              <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider border-b-2 border-blue-400">
                <div class="flex items-center space-x-2">
                  <span class="text-sm">Hóa học</span>
                </div>
              </th>
              <th class="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider border-b-2 border-blue-400">
                <div class="flex items-center space-x-2">
                  <span class="text-sm">Điểm TB</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(student, index) in topStudents" :key="student.registration_number" 
                :class="{'bg-blue-50': index < 3}"
                class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full"
                       :class="{
                         'bg-yellow-400': index === 0,
                         'bg-gray-300': index === 1,
                         'bg-orange-400': index === 2,
                         'bg-gray-100': index > 2
                       }">
                    <span class="text-sm font-bold"
                          :class="{
                            'text-yellow-800': index === 0,
                            'text-gray-700': index === 1,
                            'text-orange-800': index === 2,
                            'text-gray-600': index > 2
                          }">
                      {{ index + 1 }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ student.registration_number }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 font-medium">{{ getScore(student, 'TOAN') }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 font-medium">{{ getScore(student, 'VAT_LI') }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 font-medium">{{ getScore(student, 'HOA_HOC') }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-blue-600">{{ calculateAverage(student) }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Section -->
      <div class="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div class="text-sm text-gray-500">
          Cập nhật lần cuối: {{ new Date().toLocaleDateString('vi-VN') }}
        </div>
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
        const response = await api.get('/students/top_students_group_a')
        topStudents.value = response.data
      } catch (error) {
        console.error('Error fetching top students:', error)
      }
    }

    const getScore = (student, subjectCode) => {
      switch (subjectCode) {
        case 'TOAN':
          return student.scores?.toan?.toFixed(2) || '-'
        case 'VAT_LI':
          return student.scores?.vat_li?.toFixed(2) || '-'
        case 'HOA_HOC':
          return student.scores?.hoa_hoc?.toFixed(2) || '-'
        default:
          return '-'
      }
    }

    const calculateAverage = (student) => {
      return student.average_score?.toFixed(2) || '-'
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

<style scoped>
.top-students {
  @apply p-4;
}

/* Custom scrollbar for the table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 