<template>
  <div class="statistics-container">
    <!-- Main Statistics Card -->
    <div class="statistics-card bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <!-- Header -->
      <div class="card-header bg-[#173ea5] px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Thống kê phân bố điểm số
            </h2>
            <p class="text-white/80 mt-1 text-sm">Phân tích kết quả thi theo từng môn học</p>
          </div>
          
          <!-- Total Students Counter -->
          <div v-if="totalStudents" class="text-right">
            <div class="text-white/80 text-sm">Tổng số thí sinh</div>
            <div class="text-2xl font-bold text-white">{{ totalStudents.toLocaleString() }}</div>
          </div>
        </div>
      </div>

      <!-- Controls Section -->
      <div class="controls-section p-6 bg-gray-50 border-b border-gray-200">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <!-- Subject Selector -->
          <div class="subject-selector">
            <label for="subject-select" class="block text-sm font-semibold text-black mb-2">
              Chọn môn học:
            </label>
            <div class="relative">
              <select
                id="subject-select"
                v-model="selectedSubject"
                class="subject-select w-full sm:w-auto px-4 py-3 text-sm border-2 border-[#173ea5] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#173ea5]/30 bg-white text-[#173ea5] font-semibold appearance-none cursor-pointer transition-colors duration-200 hover:bg-gray-50"
              >
                <option v-for="subject in subjects" :key="subject.code" :value="subject.code">
                  {{ subject.name }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="h-5 w-5 text-[#173ea5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Chart Type Toggle -->
          <div class="chart-type-toggle">
            <label class="block text-sm font-semibold text-black mb-2">
              Loại biểu đồ:
            </label>
            <div class="flex bg-white border-2 border-[#173ea5] rounded-xl overflow-hidden">
              <button
                @click="chartType = 'bar'"
                :class="[
                  'px-4 py-2 font-semibold transition-colors duration-200',
                  chartType === 'bar' 
                    ? 'bg-[#173ea5] text-white' 
                    : 'bg-white text-[#173ea5] hover:bg-gray-50'
                ]"
              >
                <svg class="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Cột
              </button>
              <button
                @click="chartType = 'doughnut'"
                :class="[
                  'px-4 py-2 font-semibold transition-colors duration-200',
                  chartType === 'doughnut' 
                    ? 'bg-[#173ea5] text-white' 
                    : 'bg-white text-[#173ea5] hover:bg-gray-50'
                ]"
              >
                <svg class="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Tròn
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="chart-section p-8 bg-white">
        <div class="chart-wrapper relative">
          <!-- Loading State -->
          <div v-if="isLoading" class="loading-overlay absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
            <div class="text-center">
              <svg class="animate-spin h-12 w-12 text-[#173ea5] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-[#173ea5] font-semibold">Đang tải dữ liệu...</p>
            </div>
          </div>

          <!-- Chart Container -->
          <div class="chart-container bg-gray-50 rounded-xl p-4" :class="{ 'opacity-50': isLoading }">
            <canvas ref="chartCanvas" :height="chartType === 'doughnut' ? '300' : '400'"></canvas>
          </div>
        </div>

        <!-- Statistics Summary Cards -->
        <div v-if="statisticsTable && !isLoading" class="stats-summary mt-8">
          <h3 class="text-xl font-bold text-black mb-4 flex items-center">
            <svg class="h-6 w-6 mr-2 text-[#173ea5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Chi tiết thống kê - {{ currentSubjectName }}
          </h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
            <div 
              v-for="(stat, index) in statisticsTable" 
              :key="stat.label"
              class="stat-card bg-white border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md"
              :class="getStatCardClass(index)"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm font-medium text-gray-600 mb-1">{{ stat.label }}</div>
                  <div class="text-2xl font-bold" :class="getStatTextClass(index)">
                    {{ stat.value.toLocaleString() }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    {{ getPercentage(stat.value) }}%
                  </div>
                </div>
                <div class="stat-icon" :class="getStatIconClass(index)">
                  <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path v-if="index === 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    <path v-else-if="index === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    <path v-else-if="index === 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Detailed Table -->
          <div class="table-container bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table class="score-table w-full">
              <thead>
                <tr class="bg-[#173ea5]">
                  <th class="px-6 py-4 text-left text-white font-bold">Mức điểm</th>
                  <th class="px-6 py-4 text-center text-white font-bold">Số lượng</th>
                  <th class="px-6 py-4 text-center text-white font-bold">Tỷ lệ</th>
                  <th class="px-6 py-4 text-center text-white font-bold">Biểu đồ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(stat, index) in statisticsTable" :key="stat.label" class="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                  <td class="px-6 py-4 font-semibold text-black">{{ stat.label }}</td>
                  <td class="px-6 py-4 text-center font-bold" :class="getStatTextClass(index)">
                    {{ stat.value.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 text-center font-semibold text-gray-600">
                    {{ getPercentage(stat.value) }}%
                  </td>
                  <td class="px-6 py-4">
                    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        class="h-3 rounded-full transition-all duration-500"
                        :class="getStatBarClass(index)"
                        :style="{ width: `${getPercentage(stat.value)}%` }"
                      ></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Chart Note -->
        <div class="chart-note mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p class="text-sm text-gray-600">
            <svg class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <strong>Ghi chú:</strong> Thống kê số học sinh theo 4 mức điểm: 
            <span class="font-semibold text-[#173ea5]">≥8 điểm</span>, 
            <span class="font-semibold text-black">6-8 điểm</span>, 
            <span class="font-semibold text-gray-600">4-6 điểm</span>, 
            <span class="font-semibold text-gray-800">&lt;4 điểm</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'FixedStatisticsChart',
  setup() {
    const chartCanvas = ref(null)
    const chart = ref(null)
    const selectedSubject = ref('TOAN')
    const chartType = ref('bar')
    const statistics = ref(null)
    const isLoading = ref(true)

    // Mock API function - replace with your actual API
    const mockApi = {
      get: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
        
        // Mock data based on your API response format
        return {
          data: {
            "TOAN": {
              ">=8": 198392,
              "6-8": 505836,
              "4-6": 258654,
              "<4": 82731
            },
            "NGU_VAN": {
              ">=8": 377879,
              "6-8": 513116,
              "4-6": 141056,
              "<4": 18050
            },
            "NGOAI_NGU": {
              ">=8": 133483,
              "6-8": 219652,
              "4-6": 363532,
              "<4": 196038
            },
            "VAT_LI": {
              ">=8": 94146,
              "6-8": 148641,
              "4-6": 79272,
              "<4": 23556
            },
            "HOA_HOC": {
              ">=8": 93333,
              "6-8": 144959,
              "4-6": 88447,
              "<4": 19779
            },
            "SINH_HOC": {
              ">=8": 34438,
              "6-8": 182049,
              "4-6": 116263,
              "<4": 9628
            },
            "LICH_SU": {
              ">=8": 138533,
              "6-8": 342577,
              "4-6": 200392,
              "<4": 24712
            },
            "DIA_LI": {
              ">=8": 218515,
              "6-8": 382087,
              "4-6": 96226,
              "<4": 7854
            },
            "GDCD": {
              ">=8": 384222,
              "6-8": 181440,
              "4-6": 16886,
              "<4": 1061
            }
          }
        };
      }
    };

    const subjects = [
      { code: 'TOAN', name: 'Toán' },
      { code: 'NGU_VAN', name: 'Ngữ văn' },
      { code: 'NGOAI_NGU', name: 'Ngoại ngữ' },
      { code: 'VAT_LI', name: 'Vật lý' },
      { code: 'HOA_HOC', name: 'Hóa học' },
      { code: 'SINH_HOC', name: 'Sinh học' },
      { code: 'LICH_SU', name: 'Lịch sử' },
      { code: 'DIA_LI', name: 'Địa lý' },
      { code: 'GDCD', name: 'GDCD' }
    ]

    const levelLabels = [
      '≥8 điểm',
      '6-8 điểm', 
      '4-6 điểm',
      '<4 điểm'
    ]
    
    const levelKeys = ['>=8', '6-8', '4-6', '<4']
    
    const levelColors = [
      '#173ea5',    // Blue for >=8
      '#000000',    // Black for 6-8
      '#666666',    // Gray for 4-6
      '#999999'     // Light gray for <4
    ]

    const currentSubjectName = computed(() => {
      return subjects.find(s => s.code === selectedSubject.value)?.name || ''
    })

    const totalStudents = computed(() => {
      if (!statistics.value || !statistics.value[selectedSubject.value]) return 0
      const data = statistics.value[selectedSubject.value]
      return Object.values(data).reduce((sum, count) => sum + count, 0)
    })

    const statisticsTable = computed(() => {
      if (!statistics.value || !statistics.value[selectedSubject.value]) return null
      const data = statistics.value[selectedSubject.value]
      return levelKeys.map((key, idx) => ({
        label: levelLabels[idx],
        value: data[key] || 0
      }))
    })

    const fetchStatistics = async () => {
      try {
        isLoading.value = true
        const response = await mockApi.get()
        statistics.value = response.data
        updateChart()
      } catch (error) {
        console.error('Error fetching statistics:', error)
      } finally {
        isLoading.value = false
      }
    }

    const updateChart = () => {
      if (!statistics.value || !chartCanvas.value || !statistics.value[selectedSubject.value]) return
      
      const data = statistics.value[selectedSubject.value]
      const values = levelKeys.map(key => data[key] || 0)
      
      if (chart.value) {
        chart.value.destroy()
      }

      const ctx = chartCanvas.value.getContext('2d')
      
      const chartConfig = {
        type: chartType.value,
        data: {
          labels: levelLabels,
          datasets: [{
            label: 'Số lượng học sinh',
            data: values,
            backgroundColor: levelColors,
            borderColor: levelColors,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              display: chartType.value === 'doughnut',
              position: 'bottom',
              labels: {
                color: '#000000',
                font: { size: 14, weight: 'bold' }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((context.parsed * 100) / total).toFixed(1)
                  return ` ${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`
                }
              }
            }
          }
        }
      }

      if (chartType.value === 'bar') {
        chartConfig.options.scales = {
          x: {
            grid: { display: false },
            ticks: { 
              color: '#173ea5', 
              font: { weight: 'bold', size: 12 } 
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: '#e5e7eb' },
            ticks: { 
              color: '#173ea5', 
              font: { weight: 'bold', size: 12 },
              callback: function(value) {
                return value.toLocaleString()
              }
            }
          }
        }
        chartConfig.data.datasets[0].borderRadius = 8
        chartConfig.data.datasets[0].barPercentage = 0.7
      }

      chart.value = new Chart(ctx, chartConfig)
    }

    const getPercentage = (value) => {
      if (!totalStudents.value) return 0
      return ((value / totalStudents.value) * 100).toFixed(1)
    }

    const getStatCardClass = (index) => {
      const classes = [
        'border-[#173ea5] hover:border-[#173ea5]',
        'border-black hover:border-black', 
        'border-gray-400 hover:border-gray-600',
        'border-gray-300 hover:border-gray-500'
      ]
      return classes[index] || classes[0]
    }

    const getStatTextClass = (index) => {
      const classes = [
        'text-[#173ea5]',
        'text-black',
        'text-gray-600', 
        'text-gray-500'
      ]
      return classes[index] || classes[0]
    }

    const getStatIconClass = (index) => {
      const classes = [
        'text-[#173ea5]',
        'text-black',
        'text-gray-600',
        'text-gray-500'
      ]
      return classes[index] || classes[0]
    }

    const getStatBarClass = (index) => {
      const classes = [
        'bg-[#173ea5]',
        'bg-black',
        'bg-gray-600',
        'bg-gray-400'
      ]
      return classes[index] || classes[0]
    }

    onMounted(() => {
      fetchStatistics()
    })

    watch([selectedSubject, chartType], () => {
      updateChart()
    })

    return {
      chartCanvas,
      selectedSubject,
      chartType,
      subjects,
      statistics,
      statisticsTable,
      isLoading,
      currentSubjectName,
      totalStudents,
      getPercentage,
      getStatCardClass,
      getStatTextClass,
      getStatIconClass,
      getStatBarClass
    }
  }
}
</script>

<style scoped>
/* Minimal animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Transitions */
.transition-colors {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.transition-all {
  transition: all 0.2s ease;
}

.transition-shadow {
  transition: box-shadow 0.2s ease;
}

/* Chart container */
.chart-container {
  position: relative;
  height: 400px;
}

.chart-container canvas {
  max-height: 100%;
}

/* Custom select styling */
.subject-select {
  background-image: none;
}

.subject-select::-ms-expand {
  display: none;
}

/* Table styling */
.score-table {
  border-collapse: collapse;
}

.score-table th,
.score-table td {
  border: none;
}

/* Responsive design */
@media (max-width: 640px) {
  .statistics-card {
    margin: 0 1rem;
  }
  
  .card-header {
    padding: 1.5rem;
  }
  
  .controls-section {
    padding: 1.5rem;
  }
  
  .chart-section {
    padding: 1.5rem;
  }
  
  .chart-container {
    height: 300px;
  }
  
  .stats-summary {
    margin-top: 1.5rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .animate-spin {
    animation: none;
  }
  
  .transition-colors,
  .transition-all,
  .transition-shadow {
    transition: none;
  }
}

/* Focus states */
.subject-select:focus {
  box-shadow: 0 0 0 4px rgba(23, 62, 165, 0.1);
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .statistics-card {
    border: 2px solid #000;
  }
  
  .subject-select {
    border-width: 2px;
  }
}
</style>