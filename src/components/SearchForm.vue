<template>
  <div class="search-form">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Tra cứu điểm thi</h2>
      <div class="flex gap-2">
        <input
          v-model="registrationNumber"
          type="text"
          placeholder="Nhập số báo danh"
          class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="search"
        />
        <button
          @click="search"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Tìm kiếm
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import api from '@/config/api'

export default {
  name: 'SearchForm',
  emits: ['search-result'],
  setup(props, { emit }) {
    const registrationNumber = ref('')

    const search = async () => {
      if (!registrationNumber.value) {
        alert('Vui lòng nhập số báo danh')
        return
      }

      try {
        const response = await api.get(`/api/v1/students/search?registration_number=${registrationNumber.value}`)
        emit('search-result', response.data)
      } catch (error) {
        if (error.response?.status === 404) {
          alert('Không tìm thấy kết quả')
        } else {
          alert('Có lỗi xảy ra, vui lòng thử lại')
        }
        emit('search-result', null)
      }
    }

    return {
      registrationNumber,
      search
    }
  }
}
</script> 