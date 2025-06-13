<template>
  <div class="statistics-chart">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Thống kê điểm thi</h2>
      <div class="mb-4">
        <select
          v-model="selectedSubject"
          class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="subject in subjects" :key="subject.code" :value="subject.code">
            {{ subject.name }}
          </option>
        </select>
      </div>
      <div class="chart-container" ref="chartContainer"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import api from '@/config/api'
import Chart from 'chart.js/auto'

export default {
  name: 'StatisticsChart',
  setup() {
    const chartContainer = ref(null)
    const chart = ref(null)
    const selectedSubject = ref('TOAN')
    const statistics = ref(null)

    const subjects = [
      { code: 'TOAN', name: 'Toán' },
      { code: 'NGU_VAN', name: 'Ngữ văn' },
      { code: 'VAT_LI', name: 'Vật lý' },
      { code: 'HOA_HOC', name: 'Hóa học' },
      { code: 'SINH_HOC', name: 'Sinh học' },
      { code: 'LICH_SU', name: 'Lịch sử' },
      { code: 'DIA_LI', name: 'Địa lý' },
      { code: 'GDCD', name: 'GDCD' },
      { code: 'NGOAI_NGU', name: 'Ngoại ngữ' }
    ]

    const fetchStatistics = async () => {
      try {
        const response = await api.get('/api/v1/students/statistics')
        statistics.value = response.data
        updateChart()
      } catch (error) {
        console.error('Error fetching statistics:', error)
      }
    }

    const updateChart = () => {
      if (!statistics.value || !chartContainer.value) return

      const data = statistics.value[selectedSubject.value]
      const labels = ['Xuất sắc (>=8)', 'Giỏi (>=6)', 'Trung bình (>=4)', 'Yếu (<4)']
      const values = [
        data.excellent,
        data.good,
        data.average,
        data.poor
      ]

      if (chart.value) {
        chart.value.destroy()
      }

      chart.value = new Chart(chartContainer.value, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Số lượng học sinh',
            data: values,
            backgroundColor: [
              'rgba(34, 197, 94, 0.5)',  // green
              'rgba(59, 130, 246, 0.5)', // blue
              'rgba(234, 179, 8, 0.5)',  // yellow
              'rgba(239, 68, 68, 0.5)'   // red
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(59, 130, 246)',
              'rgb(234, 179, 8)',
              'rgb(239, 68, 68)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      })
    }

    onMounted(() => {
      fetchStatistics()
    })

    watch(selectedSubject, () => {
      updateChart()
    })

    return {
      chartContainer,
      selectedSubject,
      subjects
    }
  }
}
</script>

<style scoped>
.chart-container {
  height: 400px;
}
</style> 