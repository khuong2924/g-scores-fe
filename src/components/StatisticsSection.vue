<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-lg font-medium text-gray-900 mb-4">Thống kê điểm thi</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Score Distribution Chart -->
      <div class="bg-white p-4 rounded-md">
        <h3 class="text-md font-medium mb-2">Phân bố điểm</h3>
        <canvas ref="scoreDistributionChart"></canvas>
      </div>
      
      <!-- Subject Average Chart -->
      <div class="bg-white p-4 rounded-md">
        <h3 class="text-md font-medium mb-2">Điểm trung bình theo môn</h3>
        <canvas ref="subjectAverageChart"></canvas>
      </div>
    </div>
    
    <!-- Score Ranges -->
    <div class="mt-6">
      <h3 class="text-md font-medium mb-2">Phân loại điểm</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-red-100 p-3 rounded-md">
          <p class="text-sm text-red-800">Yếu (Dưới 5)</p>
          <p class="text-xl font-bold">{{ scoreRanges.poor }}</p>
        </div>
        <div class="bg-yellow-100 p-3 rounded-md">
          <p class="text-sm text-yellow-800">Trung bình (5-6.9)</p>
          <p class="text-xl font-bold">{{ scoreRanges.average }}</p>
        </div>
        <div class="bg-blue-100 p-3 rounded-md">
          <p class="text-sm text-blue-800">Khá (7-7.9)</p>
          <p class="text-xl font-bold">{{ scoreRanges.good }}</p>
        </div>
        <div class="bg-green-100 p-3 rounded-md">
          <p class="text-sm text-green-800">Giỏi (8-10)</p>
          <p class="text-xl font-bold">{{ scoreRanges.excellent }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'AppStatisticsSection',
  props: {
    students: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const scoreDistributionChart = ref(null);
    const subjectAverageChart = ref(null);
    let scoreDistributionChartInstance = null;
    let subjectAverageChartInstance = null;

    const scoreRanges = computed(() => {
      if (!props.students.length) return { poor: 0, average: 0, good: 0, excellent: 0 };
      
      return props.students.reduce((acc, student) => {
        const total = (student.math + student.physics + student.chemistry) / 3;
        
        if (total < 5) acc.poor++;
        else if (total < 7) acc.average++;
        else if (total < 8) acc.good++;
        else acc.excellent++;
        
        return acc;
      }, { poor: 0, average: 0, good: 0, excellent: 0 });
    });

    const updateCharts = () => {
      if (scoreDistributionChartInstance) {
        scoreDistributionChartInstance.destroy();
      }
      
      if (subjectAverageChartInstance) {
        subjectAverageChartInstance.destroy();
      }
      
      // Create score distribution chart
      const scoreDistributionCtx = scoreDistributionChart.value.getContext('2d');
      scoreDistributionChartInstance = new Chart(scoreDistributionCtx, {
        type: 'bar',
        data: {
          labels: ['0-4.9', '5-6.9', '7-7.9', '8-10'],
          datasets: [{
            label: 'Số lượng học sinh',
            data: [
              scoreRanges.value.poor,
              scoreRanges.value.average,
              scoreRanges.value.good,
              scoreRanges.value.excellent
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(255, 205, 86, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(75, 192, 192, 0.5)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 205, 86)',
              'rgb(54, 162, 235)',
              'rgb(75, 192, 192)'
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
                precision: 0
              }
            }
          }
        }
      });
      
      // Calculate average scores for each subject
      const avgMath = props.students.reduce((sum, student) => sum + student.math, 0) / props.students.length || 0;
      const avgPhysics = props.students.reduce((sum, student) => sum + student.physics, 0) / props.students.length || 0;
      const avgChemistry = props.students.reduce((sum, student) => sum + student.chemistry, 0) / props.students.length || 0;
      
      // Create subject average chart
      const subjectAverageCtx = subjectAverageChart.value.getContext('2d');
      subjectAverageChartInstance = new Chart(subjectAverageCtx, {
        type: 'radar',
        data: {
          labels: ['Toán', 'Lý', 'Hóa'],
          datasets: [{
            label: 'Điểm trung bình',
            data: [avgMath, avgPhysics, avgChemistry],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            r: {
              min: 0,
              max: 10,
              ticks: {
                stepSize: 2
              }
            }
          }
        }
      });
    };

    watch(() => props.students, () => {
      updateCharts();
    }, { deep: true });

    onMounted(() => {
      updateCharts();
    });

    return {
      scoreDistributionChart,
      subjectAverageChart,
      scoreRanges
    };
  }
}
</script> 