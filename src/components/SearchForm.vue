<template>
  <div class="search-container relative">
    <!-- Main Search Card -->
    <div class="search-card bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-shadow duration-300 hover:shadow-xl">
      <!-- Header -->
      <div class="card-header bg-[#173ea5] px-8 py-6">
        <div class="text-center">
         
          <p class="text-white/80 mt-2 text-lg">Nhập số báo danh để tra cứu thông tin điểm thi</p>
        </div>
      </div>

      <!-- Form Content -->
      <div class="card-body p-8 bg-white">
        <form @submit.prevent="search" class="space-y-6">
          <div class="form-group">
            <label 
              for="registrationNumber" 
              class="block text-lg font-semibold text-black mb-3"
            >
              Số báo danh
            </label>
            
            <div class="input-wrapper relative">
              <input
                id="registrationNumber"
                v-model="registrationNumber"
                type="text"
                placeholder="Ví dụ: 640072826"
                class="enhanced-input w-full px-6 py-4 text-lg border-2 rounded-xl focus:outline-none transition-all duration-200 bg-white text-black"
                :class="{
                  'border-black focus:border-[#173ea5]': !hasError && !isValid,
                  'border-black focus:border-black': hasError,
                  'border-[#173ea5] focus:border-[#173ea5]': isValid
                }"
                @input="validateInput"
                @focus="onInputFocus"
                @blur="onInputBlur"
              />
              
              <!-- Input icons -->
              <div class="absolute inset-y-0 right-0 flex items-center pr-4">
                <div v-if="isLoading">
                  <svg class="h-6 w-6 text-[#173ea5] animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div v-else-if="isValid" class="text-[#173ea5]">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div v-else-if="hasError" class="text-black">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div v-else class="text-gray-400">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Validation message -->
            <div class="validation-message mt-2 min-h-[1.5rem]">
              <p v-if="errorMessage" class="text-black text-sm flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {{ errorMessage }}
              </p>
              <p v-else-if="isValid" class="text-[#173ea5] text-sm flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Số báo danh hợp lệ
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="button-wrapper">
            <button
              type="submit"
              :disabled="isLoading || hasError || !registrationNumber"
              class="search-button w-full py-4 px-8 bg-[#173ea5] text-white text-lg font-bold rounded-xl hover:bg-[#0f2d7a] focus:outline-none focus:ring-4 focus:ring-[#173ea5]/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isLoading" class="flex items-center justify-center">
                <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Tìm kiếm ngay
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tìm kiếm...
              </span>
            </button>
          </div>
        </form>

        <!-- Quick suggestions -->
        <div class="suggestions mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p class="text-sm text-black font-medium mb-2 flex items-center">
            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Gợi ý:
          </p>
          <ul class="text-xs text-gray-600 space-y-1">
            <li>• Số báo danh thường có 8-10 chữ số</li>
       
            <li>• Không có khoảng trắng hoặc ký tự đặc biệt</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Search Results Section -->
    <div ref="searchResultsRef" class="mt-8">
      <slot name="search-results"></slot>
    </div>

    <!-- Enhanced Error Modal -->
    <teleport to="body">
      <div 
        v-if="showErrorModal" 
        class="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click="closeErrorModal"
      >
        <div 
          class="error-modal bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="modal-header bg-[#173ea5] px-8 py-6">
            <div class="text-center">
              <div class="error-icon-container mx-auto mb-4">
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Không tìm thấy kết quả</h3>
              <p class="text-white/80">Số báo danh không tồn tại trong hệ thống</p>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="modal-body p-8 bg-white">
            <div class="text-center mb-6">
              <p class="text-black mb-4">
                Không tìm thấy thông tin thí sinh với số báo danh 
                <span class="font-bold text-[#173ea5] bg-gray-100 px-2 py-1 rounded-lg">{{ registrationNumber }}</span>
              </p>
              
              <div class="checklist bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                <p class="text-sm font-semibold text-black mb-3">Vui lòng kiểm tra lại:</p>
                <ul class="text-sm text-gray-600 space-y-2">
                  <li class="flex items-center">
                    <svg class="h-4 w-4 mr-2 text-[#173ea5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Số báo danh đã được nhập chính xác
                  </li>
                  <li class="flex items-center">
                    <svg class="h-4 w-4 mr-2 text-[#173ea5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Không có khoảng trắng thừa
                  </li>
                  <li class="flex items-center">
                    <svg class="h-4 w-4 mr-2 text-[#173ea5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Định dạng số báo danh đúng
                  </li>
                </ul>
              </div>
            </div>

            <!-- Modal Actions -->
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="retrySearch"
                class="flex-1 px-6 py-3 bg-[#173ea5] text-white rounded-xl hover:bg-[#0f2d7a] focus:outline-none focus:ring-4 focus:ring-[#173ea5]/30 transition-colors duration-200 font-semibold flex items-center justify-center"
              >
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Thử lại
              </button>
              <button
                @click="closeErrorModal"
                class="flex-1 px-6 py-3 bg-white text-black border-2 border-black rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-500/30 transition-colors duration-200 font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'MinimalistSearchForm',
  emits: ['search-result'],
  setup(props, { emit }) {
    const registrationNumber = ref('')
    const showErrorModal = ref(false)
    const isLoading = ref(false)
    const hasError = ref(false)
    const errorMessage = ref('')
    const isFocused = ref(false)
    const searchResultsRef = ref(null)

    // Mock API function - replace with your actual API
    const mockApi = {
      get: async (url) => {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
        
        // Mock data for demonstration
        if (url.includes('64007286')) {
          return {
            data: {
              registration_number: '64007286',
              name: null,
              scores: {
                toan: '5.8',
                ngu_van: '8.25',
                ngoai_ngu: '2.8',
                ma_ngoai_ngu: 'N1',
                vat_li: null,
                hoa_hoc: null,
                sinh_hoc: null,
                lich_su: '5.0',
                dia_li: '7.25',
                gdcd: '8.25'
              }
            }
          };
        }
        throw new Error('Student not found');
      }
    };

    const isValid = computed(() => {
      return registrationNumber.value.length >= 8 && /^\d+$/.test(registrationNumber.value) && !hasError.value;
    });

    const validateInput = () => {
      const value = registrationNumber.value.trim();
      hasError.value = false;
      errorMessage.value = '';

      if (value && value.length < 8) {
        hasError.value = true;
        errorMessage.value = 'Số báo danh phải có ít nhất 8 chữ số';
      } else if (value && !/^\d+$/.test(value)) {
        hasError.value = true;
        errorMessage.value = 'Số báo danh chỉ được chứa các chữ số';
      } else if (value && value.length > 12) {
        hasError.value = true;
        errorMessage.value = 'Số báo danh không được quá 12 chữ số';
      }
    };

    const onInputFocus = () => {
      isFocused.value = true;
    };

    const onInputBlur = () => {
      isFocused.value = false;
    };

    const scrollToResults = () => {
      if (searchResultsRef.value) {
        searchResultsRef.value.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    const search = async () => {
      if (!registrationNumber.value.trim()) {
        hasError.value = true;
        errorMessage.value = 'Vui lòng nhập số báo danh';
        return;
      }

      if (hasError.value) {
        return;
      }

      isLoading.value = true;

      try {
        const response = await mockApi.get(`/students/search?registration_number=${registrationNumber.value}`);
        // Validate response data
        if (!response.data || !response.data.registration_number) {
          throw new Error('Invalid response format');
        }
        emit('search-result', response.data);
        // Scroll to results after successful search
        setTimeout(scrollToResults, 100); // Small delay to ensure DOM is updated
      } catch (error) {
        if (error.message === 'Student not found') {
          showErrorModal.value = true;
        } else {
          hasError.value = true;
          errorMessage.value = 'Có lỗi xảy ra, vui lòng thử lại';
        }
        emit('search-result', null);
      } finally {
        isLoading.value = false;
      }
    };

    const closeErrorModal = () => {
      showErrorModal.value = false;
    };

    const retrySearch = () => {
      closeErrorModal();
      registrationNumber.value = '';
      hasError.value = false;
      errorMessage.value = '';
    };

    return {
      registrationNumber,
      showErrorModal,
      isLoading,
      hasError,
      errorMessage,
      isValid,
      isFocused,
      searchResultsRef,
      search,
      closeErrorModal,
      retrySearch,
      validateInput,
      onInputFocus,
      onInputBlur
    }
  }
}
</script>

<style scoped>
/* Minimal animations - only essential ones */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Simple transitions */
.transition-colors {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.transition-shadow {
  transition: box-shadow 0.3s ease;
}

.transition-all {
  transition: all 0.2s ease;
}

/* Focus states */
.enhanced-input:focus {
  box-shadow: 0 0 0 3px rgba(23, 62, 165, 0.1);
}

.search-button:focus {
  box-shadow: 0 0 0 4px rgba(23, 62, 165, 0.2);
}

/* Hover effects - minimal */
.search-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.search-button:hover:not(:disabled) {
  background-color: #0f2d7a;
}

/* Responsive design */
@media (max-width: 640px) {
  .search-card {
    margin: 0 1rem;
  }
  
  .card-header {
    padding: 1.5rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
}

/* Accessibility - reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animate-spin {
    animation: none;
  }
  
  .transition-colors,
  .transition-shadow,
  .transition-all {
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .search-card,
  .error-modal {
    border: 2px solid #000;
  }
  
  .enhanced-input {
    border-width: 2px;
  }
}
</style>