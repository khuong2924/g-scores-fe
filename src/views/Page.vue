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
      <main class="flex-1 p-6">
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
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Reactive data
const activeView = ref('dashboard')
const searchQuery = ref('')
const searchResult = ref(null)
const searchAttempted = ref(false)
const uploadStatus = ref(null)

// Menu items
const menuItems = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'search', name: 'Search Scores' },
  { id: 'reports', name: 'Reports' },
  { id: 'settings', name: 'Settings' }
]

// Mock data for students
const students = reactive([
  {
    id: 1,
    registrationNumber: '01001001',
    name: 'Nguyễn Văn An',
    birthDate: '2005-03-15',
    math: 9.5,
    physics: 8.75,
    chemistry: 9.25,
    totalScore: 27.5
  },
  {
    id: 2,
    registrationNumber: '01001002',
    name: 'Trần Thị Bình',
    birthDate: '2005-07-22',
    math: 8.5,
    physics: 9.0,
    chemistry: 8.25,
    totalScore: 25.75
  },
  {
    id: 3,
    registrationNumber: '01001003',
    name: 'Lê Văn Cường',
    birthDate: '2005-01-10',
    math: 9.0,
    physics: 8.5,
    chemistry: 9.0,
    totalScore: 26.5
  },
  {
    id: 4,
    registrationNumber: '01001004',
    name: 'Phạm Thị Dung',
    birthDate: '2005-11-05',
    math: 7.5,
    physics: 8.0,
    chemistry: 7.75,
    totalScore: 23.25
  },
  {
    id: 5,
    registrationNumber: '01001005',
    name: 'Hoàng Văn Em',
    birthDate: '2005-09-18',
    math: 8.75,
    physics: 8.25,
    chemistry: 8.5,
    totalScore: 25.5
  },
  {
    id: 6,
    registrationNumber: '01001006',
    name: 'Vũ Thị Phương',
    birthDate: '2005-04-30',
    math: 6.5,
    physics: 7.0,
    chemistry: 6.75,
    totalScore: 20.25
  },
  {
    id: 7,
    registrationNumber: '01001007',
    name: 'Đỗ Văn Giang',
    birthDate: '2005-12-12',
    math: 9.25,
    physics: 9.5,
    chemistry: 9.75,
    totalScore: 28.5
  },
  {
    id: 8,
    registrationNumber: '01001008',
    name: 'Bùi Thị Hoa',
    birthDate: '2005-06-08',
    math: 8.0,
    physics: 7.75,
    chemistry: 8.25,
    totalScore: 24.0
  },
  {
    id: 9,
    registrationNumber: '01001009',
    name: 'Ngô Văn Inh',
    birthDate: '2005-02-25',
    math: 7.25,
    physics: 7.5,
    chemistry: 7.0,
    totalScore: 21.75
  },
  {
    id: 10,
    registrationNumber: '01001010',
    name: 'Đinh Thị Kim',
    birthDate: '2005-08-14',
    math: 8.25,
    physics: 8.75,
    chemistry: 8.0,
    totalScore: 25.0
  }
])

// Computed properties
const statistics = computed(() => {
  const totalStudents = students.length
  const totalScore = students.reduce((sum, student) => sum + student.totalScore, 0)
  const averageScore = (totalScore / totalStudents).toFixed(2)
  const highestScore = Math.max(...students.map(s => s.totalScore))
  const passRate = ((students.filter(s => s.totalScore >= 15).length / totalStudents) * 100).toFixed(1)
  
  return {
    totalStudents,
    averageScore,
    highestScore,
    passRate
  }
})

const topStudents = computed(() => {
  return [...students]
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10)
})

const chartData = computed(() => {
  const ranges = [
    { min: 0, max: 5, label: '0-5' },
    { min: 5, max: 10, label: '5-10' },
    { min: 10, max: 15, label: '10-15' },
    { min: 15, max: 20, label: '15-20' },
    { min: 20, max: 25, label: '20-25' },
    { min: 25, max: 30, label: '25-30' }
  ]
  
  const distribution = ranges.map(range => {
    const count = students.filter(s => s.totalScore >= range.min && s.totalScore < range.max).length
    return {
      count,
      height: (count / students.length) * 100
    }
  })
  
  return {
    scoreDistribution: distribution,
    labels: ranges.map(r => r.label)
  }
})

const scoreLevels = computed(() => {
  const levels = [
    { name: 'Xuất sắc', range: '27-30 điểm', color: 'text-red-600' },
    { name: 'Giỏi', range: '24-27 điểm', color: 'text-orange-600' },
    { name: 'Khá', range: '21-24 điểm', color: 'text-yellow-600' },
    { name: 'Trung bình', range: '18-21 điểm', color: 'text-green-600' },
    { name: 'Yếu', range: '15-18 điểm', color: 'text-blue-600' },
    { name: 'Kém', range: '0-15 điểm', color: 'text-gray-600' }
  ]
  
  return levels.map(level => {
    let count = 0
    const [min, max] = level.range.split('-').map(s => parseFloat(s))
    
    if (level.name === 'Xuất sắc') count = students.filter(s => s.totalScore >= 27).length
    else if (level.name === 'Giỏi') count = students.filter(s => s.totalScore >= 24 && s.totalScore < 27).length
    else if (level.name === 'Khá') count = students.filter(s => s.totalScore >= 21 && s.totalScore < 24).length
    else if (level.name === 'Trung bình') count = students.filter(s => s.totalScore >= 18 && s.totalScore < 21).length
    else if (level.name === 'Yếu') count = students.filter(s => s.totalScore >= 15 && s.totalScore < 18).length
    else count = students.filter(s => s.totalScore < 15).length
    
    return {
      ...level,
      count,
      percentage: ((count / students.length) * 100).toFixed(1)
    }
  })
})

const subjectAnalysis = computed(() => {
  const subjects = ['math', 'physics', 'chemistry']
  const names = ['Toán', 'Vật Lý', 'Hóa Học']
  
  return subjects.map((subject, index) => {
    const scores = students.map(s => s[subject])
    return {
      name: names[index],
      average: (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2),
      min: Math.min(...scores),
      max: Math.max(...scores)
    }
  })
})

// Methods
const searchStudent = () => {
  searchAttempted.value = true
  const student = students.find(s => s.registrationNumber === searchQuery.value)
  searchResult.value = student || null
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'text/csv') {
    // Simulate file processing
    uploadStatus.value = { type: 'success', message: `File "${file.name}" đã được tải lên thành công!` }
    
    // Reset after 3 seconds
    setTimeout(() => {
      uploadStatus.value = null
    }, 3000)
  } else {
    uploadStatus.value = { type: 'error', message: 'Vui lòng chọn file CSV hợp lệ!' }
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>