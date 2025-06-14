<template>
  <div>
    <div class="card">
      <div class="card-title">User Registration</div>
      <form @submit.prevent="searchStudent">
        <div class="form-group">
          <label for="searchQuery" style="font-weight:500;">Registration Number:</label>
          <input
            id="searchQuery"
            type="text"
            v-model="searchQuery"
            placeholder="Enter registration number"
          />
        </div>
        <input type="submit" value="Submit" class="button" />
      </form>
    </div>
    <div class="card">
      <div class="card-title">Detailed Scores</div>
      <div v-if="searchResult">
        <div style="font-weight:500;">Số báo danh: <span style="font-weight:400;">{{ searchResult.id }}</span></div>
        <div style="font-weight:500;">Họ và tên: <span style="font-weight:400;">{{ searchResult.name }}</span></div>
        <div style="margin-top:12px;">
          <div>Toán: <b>{{ searchResult.math }}</b></div>
          <div>Lý: <b>{{ searchResult.physics }}</b></div>
          <div>Hóa: <b>{{ searchResult.chemistry }}</b></div>
          <div style="margin-top:8px;">Tổng điểm: <span style="font-weight:700; color:#173ea5;">{{ calculateTotal(searchResult) }}</span></div>
        </div>
      </div>
      <div v-else-if="searchAttempted" class="text-red-500" style="margin-top:12px;">Không tìm thấy thí sinh với số báo danh này.</div>
      <div v-else style="color:#888;">Detailed view of search scores here!</div>
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