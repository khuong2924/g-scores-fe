<template>
  <div id="app" class="app-layout">
    <aside :class="['sidebar', { 'sidebar-mobile-open': showMobileMenu }]">
      <div class="logo">G-Scores</div>
      <!-- Hamburger menu for mobile -->
      <div class="menu-hamburger" @click="toggleMobileMenu" @mouseenter="showMobileMenu = true" @mouseleave="showMobileMenu = false">
        <span></span><span></span><span></span>
        <span class="menu-label">Menu</span>
      </div>
      <nav class="menu" :class="{ 'menu-mobile': isMobile, 'menu-mobile-open': showMobileMenu }" @mouseenter="showMobileMenu = true" @mouseleave="showMobileMenu = false">
        <router-link to="/" class="menu-item" active-class="active" exact>Dashboard</router-link>
        <router-link to="/search" class="menu-item" active-class="active">Search Scores</router-link>
        <router-link to="/reports" class="menu-item" active-class="active">Reports</router-link>
        <router-link to="/settings" class="menu-item" active-class="active">Settings</router-link>
      </nav>
    </aside>
    <main class="main-content">
      <router-view></router-view>
      <notification-list />
    </main>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import NotificationList from './components/NotificationList.vue';
import WebSocketService from './services/websocket';
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'App',
  components: {
    NotificationList
  },
  setup() {
    const showMobileMenu = ref(false);
    const isMobile = ref(false);

    const handleResize = () => {
      isMobile.value = window.innerWidth <= 900;
      if (!isMobile.value) showMobileMenu.value = false;
    };
    onMounted(() => {
      handleResize();
      window.addEventListener('resize', handleResize);
    });
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });
    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value;
    };
    return { showMobileMenu, isMobile, toggleMobileMenu };
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

.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  min-width: 220px;
  background: linear-gradient(180deg, #ffe259 0%, #ffa751 50%, #43cea2 100%);
  box-shadow: 2px 0 16px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 32px 0 0 0;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 10;
  border-right: none;
  transition: all 0.3s;
}
.logo {
  font-size: 2rem;
  font-weight: 700;
  color: #173ea5;
  text-align: center;
  width: 100%;
  margin-bottom: 40px;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px rgba(255,255,255,0.3);
}
.menu {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.3s;
}
.menu-item {
  padding: 14px 32px;
  font-size: 1.1rem;
  color: #222;
  text-decoration: none;
  font-weight: 500;
  border-left: 4px solid transparent;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  border-radius: 8px;
  margin: 0 8px;
}
.menu-item.active, .menu-item.router-link-exact-active {
  font-weight: 700;
  color: #173ea5;
  background: rgba(255,255,255,0.5);
  border-left: 4px solid #173ea5;
  box-shadow: 0 2px 8px 0 rgba(34,34,34,0.04);
}
.menu-item:hover {
  background: rgba(255,255,255,0.2);
  color: #173ea5;
}

.menu-hamburger {
  display: none;
  cursor: pointer;
  margin: 0 0 24px 24px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
.menu-hamburger span {
  display: block;
  width: 24px;
  height: 3px;
  background: #173ea5;
  margin: 4px 0;
  border-radius: 2px;
  transition: all 0.3s;
}
.menu-hamburger .menu-label {
  font-size: 1.1rem;
  color: #173ea5;
  font-weight: 600;
  margin-left: 8px;
}

@media (max-width: 900px) {
  .sidebar {
    width: 100%;
    min-width: unset;
    flex-direction: row;
    padding: 0;
    height: 60px;
    align-items: center;
    justify-content: flex-start;
    box-shadow: 0 2px 8px 0 rgba(34,34,34,0.04);
    border-radius: 0 0 18px 18px;
    background: linear-gradient(90deg, #ffe259 0%, #ffa751 50%, #43cea2 100%);
  }
  .logo {
    margin: 0 24px 0 12px;
    font-size: 1.3rem;
    width: auto;
  }
  .menu {
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 220px;
    background: linear-gradient(180deg, #ffe259 0%, #ffa751 50%, #43cea2 100%);
    box-shadow: 0 8px 32px 0 rgba(31,38,135,0.10);
    border-radius: 0 0 18px 18px;
    z-index: 100;
    opacity: 0;
    pointer-events: none;
    transform: translateY(-10px);
  }
  .menu.menu-mobile-open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
    transition: all 0.3s;
  }
  .menu-hamburger {
    display: flex;
  }
  .sidebar:not(.sidebar-mobile-open) .menu {
    opacity: 0;
    pointer-events: none;
    transform: translateY(-10px);
  }
  .sidebar.sidebar-mobile-open .menu {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .sidebar {
    height: 50px;
    min-width: unset;
    padding: 0 4px;
    border-radius: 0 0 12px 12px;
    background: linear-gradient(90deg, #ffe259 0%, #ffa751 50%, #43cea2 100%);
  }
  .logo {
    font-size: 1rem;
    margin: 0 8px 0 0;
  }
  .menu {
    width: 170px;
    top: 50px;
    border-radius: 0 0 12px 12px;
    background: linear-gradient(180deg, #ffe259 0%, #ffa751 50%, #43cea2 100%);
  }
  .menu-item {
    padding: 10px 12px;
    font-size: 0.95rem;
    margin: 0 4px;
  }
}

.main-content {
  flex: 1;
  padding: 40px 32px;
  background: #f3f4f6;
  min-height: 100vh;
}
</style>
