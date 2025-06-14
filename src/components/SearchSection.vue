<template>
  <div class="max-w-4xl mx-auto relative">
    <!-- Floating Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="floating-circle absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
      <div class="floating-circle absolute top-32 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20" style="animation-delay: 1s;"></div>
      <div class="floating-circle absolute bottom-20 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-20" style="animation-delay: 2s;"></div>
    </div>

    <!-- Search Form Card -->
    <div class="search-card bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-2">
      <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 px-6 py-6 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
        <h2 class="text-3xl font-bold text-white flex items-center relative z-10">
          <div class="search-icon-container mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span class="typing-text">Tra cứu điểm theo SBD</span>
        </h2>
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      </div>
      
      <div class="p-8 bg-gradient-to-br from-gray-50 to-white">
        <form @submit.prevent="searchStudent" class="space-y-6">
          <div class="form-group">
            <label for="searchQuery" class="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span class="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Nhập số báo danh của thí sinh
            </label>
            <div class="relative group">
              <input
                id="searchQuery"
                type="text"
                v-model="searchQuery"
                placeholder="Ví dụ: 640072826"
                class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 bg-white shadow-inner group-hover:border-blue-300"
                :class="{ 'animate-shake': inputError }"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-4">
                <div class="search-icon-pulse">
                  <svg class="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
          
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span v-if="!isLoading" class="relative z-10 flex items-center justify-center">
              <svg class="h-6 w-6 mr-2 group-hover:animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Tra cứu ngay
            </span>
            <span v-else class="relative z-10 flex items-center justify-center">
              <svg class="animate-spin h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tìm kiếm...
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </form>
      </div>
    </div>

    <!-- Results Card -->
    <div v-if="searchResult" class="result-card bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl animate-slideInUp">
      <div class="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 px-6 py-6 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse"></div>
        <h2 class="text-3xl font-bold text-white flex items-center relative z-10">
          <div class="success-icon-container mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          Kết quả điểm thi
        </h2>
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      </div>
      
      <div class="p-8 space-y-8 bg-gradient-to-br from-gray-50 to-white">
        <!-- Student Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="info-card bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <div class="icon-bounce mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Thông tin thí sinh
            </h3>
            <div class="space-y-4">
              <div class="info-item flex justify-between items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <span class="text-gray-600 font-medium">Số báo danh:</span>
                <span class="font-bold text-gray-900 bg-blue-100 px-4 py-2 rounded-full text-blue-800">{{ searchResult.registration_number }}</span>
              </div>
              <div class="info-item flex justify-between items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <span class="text-gray-600 font-medium">Họ và tên:</span>
                <span class="font-bold text-gray-900 bg-blue-100 px-4 py-2 rounded-full text-blue-800">{{ searchResult.name || 'Chưa cập nhật' }}</span>
              </div>
            </div>
          </div>

          <!-- Scores Summary -->
          <div class="summary-card bg-gradient-to-br from-green-50 via-emerald-100 to-green-50 rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <div class="icon-bounce mr-3" style="animation-delay: 0.2s;">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Tổng quan điểm số
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="score-summary bg-white rounded-xl p-4 shadow-lg text-center transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                <div class="text-sm text-gray-600 mb-2 font-medium">Điểm cao nhất</div>
                <div class="text-3xl font-bold text-blue-600 animate-pulse">{{ highestScore }}</div>
                <div class="w-full bg-blue-100 rounded-full h-2 mt-2">
                  <div class="bg-blue-600 h-2 rounded-full animate-expand" :style="`width: ${(parseFloat(highestScore) / 10) * 100}%`"></div>
                </div>
              </div>
              <div class="score-summary bg-white rounded-xl p-4 shadow-lg text-center transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                <div class="text-sm text-gray-600 mb-2 font-medium">Điểm trung bình</div>
                <div class="text-3xl font-bold text-green-600 animate-pulse" style="animation-delay: 0.5s;">{{ averageScore }}</div>
                <div class="w-full bg-green-100 rounded-full h-2 mt-2">
                  <div class="bg-green-600 h-2 rounded-full animate-expand" :style="`width: ${(parseFloat(averageScore) / 10) * 100}%`" style="animation-delay: 0.5s;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Scores -->
        <div class="scores-detail bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 rounded-2xl p-8 shadow-lg">
          <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <div class="icon-bounce mr-3" style="animation-delay: 0.4s;">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            Chi tiết điểm số
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="(score, subject, index) in subjectScores" :key="subject" 
                 class="score-card bg-white rounded-xl p-4 shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl border-l-4"
                 :class="[getScoreClass(score), getScoreBorderClass(score)]"
                 :style="`animation-delay: ${index * 0.1}s`">
              <div class="text-sm text-gray-600 mb-2 font-semibold">{{ getSubjectName(subject) }}</div>
              <div class="text-2xl font-bold mb-2" :class="getScoreTextClass(score)">
                {{ score || '-' }}
              </div>
              <div v-if="score && !isNaN(parseFloat(score))" class="w-full bg-gray-200 rounded-full h-2">
                <div class="h-2 rounded-full animate-expand" 
                     :class="getScoreBarClass(score)"
                     :style="`width: ${(parseFloat(score) / 10) * 100}%; animation-delay: ${index * 0.1 + 0.5}s`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else-if="searchAttempted" class="error-card bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl animate-slideInUp">
      <div class="bg-gradient-to-r from-red-600 via-pink-600 to-red-700 px-6 py-6 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 animate-pulse"></div>
        <h2 class="text-3xl font-bold text-white flex items-center relative z-10">
          <div class="error-icon-container mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          Không tìm thấy kết quả
        </h2>
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      </div>
      
      <div class="p-8 bg-gradient-to-br from-gray-50 to-white">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6 animate-pulse">
            <svg class="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Không tìm thấy thông tin thí sinh</h3>
          <p class="text-lg text-gray-600 mb-8">
            Không tìm thấy thông tin thí sinh với số báo danh <span class="font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">{{ searchQuery }}</span>
          </p>
          
          <div class="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-6 mb-8 shadow-inner">
            <p class="text-lg font-semibold text-gray-700 mb-4">Vui lòng kiểm tra lại:</p>
            <ul class="text-gray-600 space-y-3">
              <li class="flex items-center justify-center">
                <svg class="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span class="font-medium">Số báo danh đã được nhập chính xác</span>
              </li>
              <li class="flex items-center justify-center">
                <svg class="h-5 w-5 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span class="font-medium">Không có khoảng trắng thừa</span>
              </li>
              <li class="flex items-center justify-center">
                <svg class="h-5 w-5 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span class="font-medium">Định dạng số báo danh đúng</span>
              </li>
            </ul>
          </div>
          
          <button 
            @click="resetSearch"
            class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl font-bold text-lg group"
          >
            <svg class="h-6 w-6 mr-2 group-hover:animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Thử lại
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'EnhancedSearchSection',
  setup() {
    const searchQuery = ref('');
    const searchResult = ref(null);
    const searchAttempted = ref(false);
    const isLoading = ref(false);
    const inputError = ref(false);

    // Mock API function - replace with your actual API
    const mockApi = {
      get: async (url) => {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
        
        // Mock data for demonstration
        if (url.includes('640072826')) {
          return {
            data: {
              registration_number: '640072826',
              name: 'Nguyễn Văn A',
              scores: {
                toan: 8.5,
                ngu_van: 7.2,
                ngoai_ngu: 9.0,
                vat_li: 6.8,
                hoa_hoc: 7.5,
                sinh_hoc: 8.2,
                lich_su: 6.5,
                dia_li: 7.8,
                gdcd: 8.0
              }
            }
          };
        }
        throw new Error('Student not found');
      }
    };

    const subjectScores = computed(() => {
      if (!searchResult.value?.scores) return {};
      return searchResult.value.scores;
    });

    const highestScore = computed(() => {
      if (!searchResult.value?.scores) return '-';
      const scores = Object.values(searchResult.value.scores)
        .filter(score => score !== null && !isNaN(parseFloat(score)));
      return scores.length ? Math.max(...scores).toFixed(1) : '-';
    });

    const averageScore = computed(() => {
      if (!searchResult.value?.scores) return '-';
      const scores = Object.values(searchResult.value.scores)
        .filter(score => score !== null && !isNaN(parseFloat(score)));
      if (!scores.length) return '-';
      const sum = scores.reduce((acc, score) => acc + parseFloat(score), 0);
      return (sum / scores.length).toFixed(1);
    });

    const getSubjectName = (code) => {
      const subjects = {
        toan: 'Toán',
        ngu_van: 'Ngữ Văn',
        ngoai_ngu: 'Ngoại Ngữ',
        ma_ngoai_ngu: 'Mã NN',
        vat_li: 'Vật Lý',
        hoa_hoc: 'Hóa Học',
        sinh_hoc: 'Sinh Học',
        lich_su: 'Lịch Sử',
        dia_li: 'Địa Lý',
        gdcd: 'GDCD'
      };
      return subjects[code] || code;
    };

    const getScoreClass = (score) => {
      if (!score || isNaN(parseFloat(score))) return 'bg-gray-50';
      const numScore = parseFloat(score);
      if (numScore >= 8) return 'bg-gradient-to-br from-green-50 to-emerald-100';
      if (numScore >= 6) return 'bg-gradient-to-br from-blue-50 to-blue-100';
      if (numScore >= 4) return 'bg-gradient-to-br from-yellow-50 to-yellow-100';
      return 'bg-gradient-to-br from-red-50 to-red-100';
    };

    const getScoreBorderClass = (score) => {
      if (!score || isNaN(parseFloat(score))) return 'border-gray-300';
      const numScore = parseFloat(score);
      if (numScore >= 8) return 'border-green-400';
      if (numScore >= 6) return 'border-blue-400';
      if (numScore >= 4) return 'border-yellow-400';
      return 'border-red-400';
    };

    const getScoreTextClass = (score) => {
      if (!score || isNaN(parseFloat(score))) return 'text-gray-400';
      const numScore = parseFloat(score);
      if (numScore >= 8) return 'text-green-600';
      if (numScore >= 6) return 'text-blue-600';
      if (numScore >= 4) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getScoreBarClass = (score) => {
      if (!score || isNaN(parseFloat(score))) return 'bg-gray-300';
      const numScore = parseFloat(score);
      if (numScore >= 8) return 'bg-green-500';
      if (numScore >= 6) return 'bg-blue-500';
      if (numScore >= 4) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    const searchStudent = async () => {
      if (!searchQuery.value.trim()) {
        inputError.value = true;
        setTimeout(() => inputError.value = false, 1000);
        return;
      }
      
      isLoading.value = true;
      searchAttempted.value = true;
      
      try {
        const response = await mockApi.get(`/students/search?registration_number=${searchQuery.value}`);
        searchResult.value = response.data;
      } catch (error) {
        console.error('Error searching student:', error);
        searchResult.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    const resetSearch = () => {
      searchQuery.value = '';
      searchAttempted.value = false;
      searchResult.value = null;
    };

    return {
      searchQuery,
      searchResult,
      searchAttempted,
      isLoading,
      inputError,
      subjectScores,
      highestScore,
      averageScore,
      getSubjectName,
      getScoreClass,
      getScoreBorderClass,
      getScoreTextClass,
      getScoreBarClass,
      searchStudent,
      resetSearch
    };
  }
}
</script>

<style scoped>
/* Enhanced Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes floating {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes expand {
  from {
    width: 0%;
  }
  to {
    width: var(--target-width, 100%);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* Apply animations */
.animate-slideInUp {
  animation: slideInUp 0.6s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-expand {
  animation: expand 1s ease-out forwards;
}

.floating-circle {
  animation: floating 6s ease-in-out infinite;
}

.icon-bounce {
  animation: bounce 2s infinite;
}

.typing-text {
  overflow: hidden;
  white-space: nowrap;
  animation: typing 2s steps(20, end);
}

/* Enhanced hover effects */
.search-card:hover {
  transform: translateY(-8px) scale(1.02);
}

.result-card:hover {
  transform: translateY(-4px);
}

.error-card:hover {
  transform: translateY(-4px);
}

.info-card:hover {
  transform: scale(1.05) rotate(1deg);
}

.summary-card:hover {
  transform: scale(1.05) rotate(-1deg);
}

.score-card:hover {
  transform: scale(1.1) translateY(-5px);
}

/* Custom shadow effects */
.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Enhanced transitions */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Loading spinner enhancement */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive enhancements */
@media (max-width: 768px) {
  .search-card, .result-card, .error-card {
    margin: 0 1rem;
  }
  
  .floating-circle {
    display: none;
  }
}

/* Focus states */
input:focus {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

button:focus {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

/* Custom scrollbar for mobile */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #2563eb, #7c3aed);
}
</style>