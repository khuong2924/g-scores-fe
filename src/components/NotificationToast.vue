<template>
  <div
    v-if="show"
    class="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-4 max-w-md transform transition-all duration-300"
    :class="{
      'translate-y-0 opacity-100': show,
      'translate-y-2 opacity-0': !show
    }"
  >
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <div class="rounded-full p-2"
             :class="{
               'bg-green-100': type === 'success',
               'bg-red-100': type === 'error',
               'bg-blue-100': type === 'info',
               'bg-yellow-100': type === 'warning'
             }">
          <svg
            class="h-6 w-6"
            :class="{
              'text-green-600': type === 'success',
              'text-red-600': type === 'error',
              'text-blue-600': type === 'info',
              'text-yellow-600': type === 'warning'
            }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              v-if="type === 'success'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              v-else-if="type === 'error'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
            <path
              v-else-if="type === 'info'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              v-else-if="type === 'warning'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>
      <div class="ml-3 w-0 flex-1">
        <p class="text-sm font-medium text-gray-900">
          {{ title }}
        </p>
        <p class="mt-1 text-sm text-gray-500">
          {{ message }}
        </p>
      </div>
      <div class="ml-4 flex-shrink-0 flex">
        <button
          class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          @click="close"
        >
          <span class="sr-only">Close</span>
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
    <!-- Progress bar -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
      <div
        class="h-full transition-all duration-300 ease-linear"
        :class="{
          'bg-green-500': type === 'success',
          'bg-red-500': type === 'error',
          'bg-blue-500': type === 'info',
          'bg-yellow-500': type === 'warning'
        }"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationToast',
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 5000
    },
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
    }
  },
  data() {
    return {
      show: false,
      timeout: null,
      progress: 100,
      progressInterval: null
    };
  },
  mounted() {
    this.show = true;
    this.startTimeout();
    this.startProgress();
  },
  methods: {
    startTimeout() {
      if (this.duration > 0) {
        this.timeout = setTimeout(() => {
          this.close();
        }, this.duration);
      }
    },
    startProgress() {
      const step = 100 / (this.duration / 10);
      this.progressInterval = setInterval(() => {
        this.progress = Math.max(0, this.progress - step);
      }, 10);
    },
    close() {
      this.show = false;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
/* Add smooth transitions */
.transform {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Add hover effects */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Add animation for the progress bar */
@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style> 