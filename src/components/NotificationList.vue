<template>
  <div class="fixed bottom-4 right-4 space-y-4">
    <notification-toast
      v-for="notification in notifications"
      :key="notification.id"
      :title="notification.title"
      :message="notification.message"
      :duration="notification.duration"
      @close="removeNotification(notification.id)"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import NotificationToast from './NotificationToast.vue';

export default {
  name: 'NotificationList',
  components: {
    NotificationToast
  },
  computed: {
    ...mapGetters('notification', ['notifications'])
  },
  methods: {
    ...mapActions('notification', ['removeNotification'])
  }
};
</script> 