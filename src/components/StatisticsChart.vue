<template>
  <div class="statistics-chart card">
    <div class="card-title">Thống kê phân bố điểm số theo môn học</div>
    <div class="mb-4">
      <label for="subject-select" style="font-weight:500;">Chọn môn học:</label>
      <select
        id="subject-select"
        v-model="selectedSubject"
        class="subject-select"
      >
        <option v-for="subject in subjects" :key="subject.code" :value="subject.code">
          {{ subject.name }}
        </option>
      </select>
    </div>
    <div class="chart-container" ref="chartContainer"></div>
    <div v-if="statistics && statisticsTable" class="score-table-wrap">
      <table class="score-table">
        <thead>
          <tr>
            <th>Mức điểm</th>
            <th>Số lượng học sinh</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in statisticsTable" :key="row.label">
            <td>{{ row.label }}</td>
            <td>{{ row.value.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="chart-note">
      * Thống kê số học sinh theo 4 mức điểm:
      <b>&ge;8 điểm</b>,
      <b>8 &gt; điểm &ge; 6</b>,
      <b>6 &gt; điểm &ge; 4</b>,
      <b>&lt;4 điểm</b>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
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

    const levelLabels = [
      '>=8 điểm',
      '8 > điểm ≥ 6',
      '6 > điểm ≥ 4',
      '<4 điểm'
    ]
    const levelKeys = ['>=8', '6-8', '4-6', '<4']
    const levelColors = [
      'rgba(23,62,165,0.8)', // xanh đậm
      'rgba(39,165,242,0.8)', // xanh tươi
      'rgba(234,179,8,0.8)', // vàng
      'rgba(239,68,68,0.8)' // đỏ
    ]
    const borderColors = [
      '#173ea5',
      '#27A5F2',
      '#eab308',
      '#ef4444'
    ]

    const fetchStatistics = async () => {
      try {
        const response = await api.get('http://localhost:3000/api/reports/score_distribution')
        statistics.value = response.data
        updateChart()
      } catch (error) {
        console.error('Error fetching statistics:', error)
      }
    }

    const statisticsTable = computed(() => {
      if (!statistics.value) return null
      const subjectName = subjects.find(s => s.code === selectedSubject.value)?.name
      const data = statistics.value[subjectName]
      if (!data) return null
      return levelKeys.map((key, idx) => ({
        label: levelLabels[idx],
        value: data[key] || 0
      }))
    })

    const updateChart = () => {
      if (!statistics.value || !chartContainer.value) return
      const subjectName = subjects.find(s => s.code === selectedSubject.value)?.name
      const data = statistics.value[subjectName]
      if (!data) return
      const values = levelKeys.map(key => data[key] || 0)
      if (chart.value) {
        chart.value.destroy()
      }
      chart.value = new Chart(chartContainer.value, {
        type: 'bar',
        data: {
          labels: levelLabels,
          datasets: [{
            label: 'Số lượng học sinh',
            data: values,
            backgroundColor: levelColors,
            borderColor: borderColors,
            borderWidth: 2,
            borderRadius: 12,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return ` ${context.dataset.label}: ${context.parsed.y.toLocaleString()}`
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#173ea5', font: { weight: 600, size: 14 } }
            },
            y: {
              beginAtZero: true,
              grid: { color: '#e5e7eb' },
              ticks: { color: '#173ea5', font: { weight: 600, size: 14 }, stepSize: 1 }
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
      subjects,
      statistics,
      statisticsTable
    }
  }
}
</script>

<style scoped>
.statistics-chart {
  padding: 32px 24px;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(23,62,165,0.07);
  background: #fff;
  color: #222;
  margin-bottom: 32px;
}
.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #173ea5;
  margin-bottom: 18px;
  text-align: left;
}
.subject-select {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1.5px solid #173ea5;
  font-size: 1rem;
  margin-left: 12px;
  color: #173ea5;
  background: #fff;
  font-weight: 600;
}
.chart-container {
  height: 400px;
  margin-bottom: 24px;
  background: #f7fafd;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgba(23,62,165,0.04);
  padding: 16px 8px 0 8px;
}
.score-table-wrap {
  margin: 0 auto 16px auto;
  max-width: 400px;
}
.score-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px 0 rgba(23,62,165,0.04);
}
.score-table th {
  background: #173ea5;
  color: #fff;
  font-weight: 700;
  padding: 10px 0;
}
.score-table td {
  color: #222;
  text-align: center;
  padding: 8px 0;
  font-weight: 500;
}
.chart-note {
  color: #888;
  font-size: 0.98rem;
  margin-top: 10px;
  text-align: left;
}
@media (max-width: 700px) {
  .statistics-chart {
    padding: 12px 2px;
  }
  .chart-container {
    height: 260px;
    padding: 4px 2px 0 2px;
  }
  .score-table-wrap {
    max-width: 100%;
  }
}
</style> 