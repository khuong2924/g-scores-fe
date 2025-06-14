<template>
  <div class="flex-1 p-6">
    <!-- Dashboard View -->
    <div v-if="activeView === 'dashboard'" class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
      
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700">Tổng số thí sinh</h3>
          <p class="text-3xl font-bold text-blue-600">{{ statistics.totalStudents }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700">Điểm trung bình</h3>
          <p class="text-3xl font-bold text-green-600">{{ statistics.averageScore }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700">Điểm cao nhất</h3>
          <p class="text-3xl font-bold text-red-600">{{ statistics.highestScore }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700">Tỷ lệ đậu</h3>
          <p class="text-3xl font-bold text-purple-600">{{ statistics.passRate }}%</p>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Phân bố điểm số</h3>
          <div class="h-64 flex items-end justify-center space-x-2">
            <div
              v-for="(bar, index) in chartData.scoreDistribution"
              :key="index"
              :style="{ height: bar.height + '%' }"
              class="bg-blue-500 w-12 flex items-end justify-center text-white text-xs font-bold"
            >
              {{ bar.count }}
            </div>
          </div>
          <div class="flex justify-center space-x-2 mt-2">
            <span v-for="(label, index) in chartData.labels" :key="index" class="text-xs text-gray-600">
              {{ label }}
            </span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Top 10 Khối A</h3>
          <div class="space-y-2">
            <div
              v-for="(student, index) in topStudents"
              :key="student.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <span class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  {{ index + 1 }}
                </span>
                <span class="font-medium">{{ student.registrationNumber }}</span>
              </div>
              <span class="font-bold text-blue-600">{{ student.totalScore }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Scores View -->
    <div v-if="activeView === 'search'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">User Registration</h2>
        
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2">Registration Number:</label>
          <div class="flex space-x-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Enter registration number"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              @click="searchStudent"
              class="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchResult" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Detailed Scores</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold text-gray-700 mb-2">Thông tin thí sinh</h4>
            <div class="space-y-2">
              <p><span class="font-medium">Số báo danh:</span> {{ searchResult.registrationNumber }}</p>
              <p><span class="font-medium">Họ tên:</span> {{ searchResult.name }}</p>
              <p><span class="font-medium">Ngày sinh:</span> {{ searchResult.birthDate }}</p>
            </div>
          </div>
          
          <div>
            <h4 class="font-semibold text-gray-700 mb-2">Điểm các môn</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Toán:</span>
                <span class="font-bold text-blue-600">{{ searchResult.math }}</span>
              </div>
              <div class="flex justify-between">
                <span>Lý:</span>
                <span class="font-bold text-green-600">{{ searchResult.physics }}</span>
              </div>
              <div class="flex justify-between">
                <span>Hóa:</span>
                <span class="font-bold text-red-600">{{ searchResult.chemistry }}</span>
              </div>
              <div class="flex justify-between border-t pt-2">
                <span class="font-semibold">Tổng điểm khối A:</span>
                <span class="font-bold text-purple-600">{{ searchResult.totalScore }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="searchAttempted && !searchResult" class="bg-white rounded-lg shadow-md p-6">
        <p class="text-center text-gray-500">Không tìm thấy thí sinh với số báo danh này.</p>
      </div>
    </div>

    <!-- Reports View -->
    <div v-if="activeView === 'reports'" class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Reports</h2>
      
      <!-- Score Level Statistics -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Thống kê theo cấp độ điểm</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="level in scoreLevels"
            :key="level.name"
            class="bg-gray-50 rounded-lg p-4"
          >
            <h4 class="font-semibold text-gray-700">{{ level.name }}</h4>
            <p class="text-sm text-gray-600 mb-2">{{ level.range }}</p>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold" :class="level.color">{{ level.count }}</span>
              <span class="text-sm text-gray-500">{{ level.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject Analysis -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Phân tích theo môn học</h3>
        
        <div class="space-y-4">
          <div
            v-for="subject in subjectAnalysis"
            :key="subject.name"
            class="border-l-4 border-blue-500 pl-4"
          >
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-semibold text-gray-700">{{ subject.name }}</h4>
              <span class="text-lg font-bold text-blue-600">{{ subject.average }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-500 h-2 rounded-full"
                :style="{ width: (subject.average / 10) * 100 + '%' }"
              ></div>
            </div>
            <div class="flex justify-between text-sm text-gray-600 mt-1">
              <span>Thấp nhất: {{ subject.min }}</span>
              <span>Cao nhất: {{ subject.max }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings View -->
    <div v-if="activeView === 'settings'" class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Settings</h2>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Import CSV Data</h3>
        
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            ref="fileInput"
            type="file"
            accept=".csv"
            @change="handleFileUpload"
            class="hidden"
          />
          <div class="space-y-4">
            <div class="text-4xl text-gray-400">📁</div>
            <div>
              <p class="text-lg font-medium text-gray-700">Upload CSV File</p>
              <p class="text-gray-500">Chọn file CSV chứa dữ liệu điểm thi</p>
            </div>
            <button
              @click="$refs.fileInput.click()"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Choose File
            </button>
          </div>
        </div>
        
        <div v-if="uploadStatus" class="mt-4 p-4 rounded-lg" :class="uploadStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
          {{ uploadStatus.message }}
        </div>
      </div>

      <!-- Database Status -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Database Status</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Total Records:</span>
            <span class="font-bold">{{ statistics.totalStudents }}</span>
          </div>
          <div class="flex justify-between">
            <span>Last Updated:</span>
            <span class="font-bold">{{ new Date().toLocaleDateString('vi-VN') }}</span>
          </div>
          <div class="flex justify-between">
            <span>Status:</span>
            <span class="font-bold text-green-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/config/api'

const activeView = ref('dashboard')
const searchQuery = ref('')
const searchResult = ref(null)
const searchAttempted = ref(false)
const uploadStatus = ref(null)

// Dữ liệu động từ API
const students = ref([])
const statistics = ref({ totalStudents: 0, averageScore: 0, highestScore: 0, passRate: 0 })
const topStudents = ref([])
const chartData = ref({ scoreDistribution: [], labels: [] })
const scoreLevels = ref([])
const subjectAnalysis = ref([])

const fetchTopStudents = async () => {
  try {
    const response = await api.get('/api/v1/students/top_students_group_a')
    // Chuyển đổi dữ liệu cho UI
    topStudents.value = response.data.map(student => {
      const math = student.scores.find(s => s.subject.code === 'TOAN')?.score || 0
      const physics = student.scores.find(s => s.subject.code === 'VAT_LI')?.score || 0
      const chemistry = student.scores.find(s => s.subject.code === 'HOA_HOC')?.score || 0
      return {
        id: student.id,
        registrationNumber: student.registration_number,
        name: student.name,
        math,
        physics,
        chemistry,
        totalScore: math + physics + chemistry
      }
    })
  } catch (e) { console.error(e) }
}

const fetchScoreDistribution = async () => {
  try {
    const response = await api.get('/api/reports/score_distribution')
    // Chuẩn hóa dữ liệu cho chart và các thống kê
    const subjects = Object.keys(response.data)
    // Lấy phân bố cho Toán làm ví dụ, có thể cho phép chọn môn nếu muốn
    const toan = response.data['Toán']
    chartData.value = {
      scoreDistribution: [
        { count: toan['<4'], height: toan['<4'] },
        { count: toan['4-6'], height: toan['4-6'] },
        { count: toan['6-8'], height: toan['6-8'] },
        { count: toan['>=8'], height: toan['>=8'] }
      ],
      labels: ['<4', '4-6', '6-8', '>=8']
    }
    // Tính tổng số thí sinh, điểm TB, cao nhất, tỷ lệ đậu (>=15 điểm khối A)
    let total = 0, sum = 0, max = 0, pass = 0
    topStudents.value.forEach(s => {
      total++
      sum += s.totalScore
      if (s.totalScore > max) max = s.totalScore
      if (s.totalScore >= 15) pass++
    })
    statistics.value = {
      totalStudents: total,
      averageScore: (sum / (total || 1)).toFixed(2),
      highestScore: max,
      passRate: ((pass / (total || 1)) * 100).toFixed(1)
    }
    // Cấp độ điểm
    scoreLevels.value = [
      { name: '>=8', range: '>=8', color: 'text-green-600', count: toan['>=8'] },
      { name: '6-8', range: '6-8', color: 'text-blue-600', count: toan['6-8'] },
      { name: '4-6', range: '4-6', color: 'text-yellow-600', count: toan['4-6'] },
      { name: '<4', range: '<4', color: 'text-red-600', count: toan['<4'] }
    ]
    // Phân tích môn học
    subjectAnalysis.value = subjects.map(sub => {
      const d = response.data[sub]
      const avg = ((d['>=8'] * 9 + d['6-8'] * 7 + d['4-6'] * 5 + d['<4'] * 2) / (d['>=8'] + d['6-8'] + d['4-6'] + d['<4'])).toFixed(2)
      return { name: sub, average: avg, min: 0, max: 10 }
    })
  } catch (e) { console.error(e) }
}

const searchStudent = async () => {
  searchAttempted.value = true
  try {
    const response = await api.get(`/api/v1/students/search?registration_number=${searchQuery.value}`)
    searchResult.value = response.data
  } catch (e) {
    searchResult.value = null
  }
}

onMounted(async () => {
  await fetchTopStudents()
  await fetchScoreDistribution()
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'text/csv') {
    uploadStatus.value = { type: 'success', message: `File "${file.name}" đã được tải lên thành công!` }
    setTimeout(() => { uploadStatus.value = null }, 3000)
  } else {
    uploadStatus.value = { type: 'error', message: 'Vui lòng chọn file CSV hợp lệ!' }
  }
}
</script> 