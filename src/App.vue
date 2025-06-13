<template>
  <div id="app">
    <router-view></router-view>
    <notification-list />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import NotificationList from './components/NotificationList.vue';
import WebSocketService from './services/websocket';

export default {
  name: 'App',
  components: {
    NotificationList
  },
  created() {
    // Subscribe to all score updates
    WebSocketService.subscribeToScores(this.handleScoreUpdate);
  },
  beforeUnmount() {
    // Cleanup WebSocket subscriptions
    WebSocketService.unsubscribeAll();
  },
  methods: {
    ...mapActions('notification', ['showNotification']),
    handleScoreUpdate(data) {
      switch (data.type) {
        case 'score_update':
          this.showNotification({
            title: 'Cập nhật điểm số',
            message: `Điểm số đã được cập nhật cho học sinh ${data.data.student_id}`,
            duration: 5000
          });
          break;
        case 'batch_score_update':
          this.showNotification({
            title: 'Cập nhật hàng loạt',
            message: `Đã cập nhật ${data.data.scores.length} điểm số cho học sinh ${data.data.student_id}`,
            duration: 5000
          });
          break;
        case 'statistics_update':
          this.showNotification({
            title: 'Cập nhật thống kê',
            message: `Tổng số học sinh: ${data.data.statistics.total_students}, Điểm trung bình: ${data.data.statistics.average_score}`,
            duration: 5000
          });
          break;
      }
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Rubik', sans-serif;
  background-color: #f3f4f6;
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
}
</style>
