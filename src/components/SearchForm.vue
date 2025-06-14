<template>
  <div class="card">
    <div class="card-title">User Registration</div>
    <form @submit.prevent="search">
      <div class="form-group">
        <label for="registrationNumber" style="font-weight:500;">Registration Number:</label>
        <input
          id="registrationNumber"
          v-model="registrationNumber"
          type="text"
          placeholder="Enter registration number"
        />
      </div>
      <input type="submit" value="Submit" class="button" />
    </form>
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
        const response = await api.get(`/students/search?registration_number=${registrationNumber.value}`)
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