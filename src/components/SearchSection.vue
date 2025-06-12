<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-lg font-medium text-gray-900 mb-4">Tra cứu điểm thi</h2>
    <div class="flex">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Nhập số báo danh..."
        class="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
      />
      <button
        @click="searchStudent"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Tìm kiếm
      </button>
    </div>

    <!-- Search Results -->
    <div v-if="searchResult" class="mt-4">
      <div class="bg-gray-50 p-4 rounded-md">
        <h3 class="text-md font-medium">Kết quả tìm kiếm:</h3>
        <div class="mt-2 grid grid-cols-2 gap-4">
          <div>
            <p><span class="font-medium">Số báo danh:</span> {{ searchResult.id }}</p>
            <p><span class="font-medium">Họ và tên:</span> {{ searchResult.name }}</p>
          </div>
          <div>
            <p><span class="font-medium">Toán:</span> {{ searchResult.math }}</p>
            <p><span class="font-medium">Lý:</span> {{ searchResult.physics }}</p>
            <p><span class="font-medium">Hóa:</span> {{ searchResult.chemistry }}</p>
            <p class="font-medium">
              Tổng điểm: {{ calculateTotal(searchResult) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="searchAttempted" class="mt-4 text-red-500">
      Không tìm thấy thí sinh với số báo danh này.
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'AppSearchSection',
  props: {
    students: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const searchQuery = ref('');
    const searchResult = ref(null);
    const searchAttempted = ref(false);

    const searchStudent = () => {
      if (!searchQuery.value.trim()) return;
      
      searchAttempted.value = true;
      searchResult.value = props.students.find(student => 
        student.id.toLowerCase() === searchQuery.value.toLowerCase()
      );
    };

    const calculateTotal = (student) => {
      return student.math + student.physics + student.chemistry;
    };

    return {
      searchQuery,
      searchResult,
      searchAttempted,
      searchStudent,
      calculateTotal
    };
  }
}
</script> 