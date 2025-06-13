<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-lg font-medium text-gray-900 mb-4">Nhập dữ liệu điểm thi</h2>
    <div class="flex items-center justify-center w-full">
      <label
        class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
      >
        <div class="flex flex-col items-center justify-center pt-7">
          <svg
            class="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p class="pt-1 text-sm text-gray-600">
            {{ fileName || 'Kéo thả file CSV hoặc nhấn để chọn file' }}
          </p>
        </div>
        <input
          type="file"
          class="opacity-0"
          accept=".csv"
          @change="handleFileUpload"
        />
      </label>
    </div>
    <div class="mt-4 flex justify-end">
      <button
        @click="processCSV"
        :disabled="!csvFile"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        Xử lý dữ liệu
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import api from '@/config/api';

const emit = defineEmits(['data-processed']);

const csvFile = ref(null);
const fileName = ref('');

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    csvFile.value = file;
    fileName.value = file.name;
  }
};

const processCSV = async () => {
  if (!csvFile.value) return;

  const formData = new FormData();
  formData.append('file', csvFile.value);

  try {
    const response = await api.post('/api/v1/students/import_csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    const result = response.data;
    if (response.status === 200) {
      alert(result.message || 'Import thành công!');
      emit('data-processed', result);
    } else {
      alert(result.error || 'Import thất bại!');
    }
  } catch (error) {
    console.error('Error uploading CSV:', error);
    alert('Có lỗi xảy ra khi upload file CSV');
  }
};
</script> 