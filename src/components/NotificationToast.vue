<template>
  <div
    v-if="show"
    class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md transform transition-all duration-300"
    :class="{
      'translate-y-0 opacity-100': show,
      'translate-y-2 opacity-0': !show
    }"
  >
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg
          class="h-6 w-6 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
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
          class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
    }
  },
  data() {
    return {
      show: false,
      timeout: null
    };
  },
  mounted() {
    this.show = true;
    this.startTimeout();
  },
  methods: {
    startTimeout() {
      if (this.duration > 0) {
        this.timeout = setTimeout(() => {
          this.close();
        }, this.duration);
      }
    },
    close() {
      this.show = false;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.$emit('close');
    }
  }
};
</script> 