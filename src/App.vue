<template>
  <div id="app" class="app-layout">
    <!-- Backdrop for mobile -->
    <div 
      v-if="showMobileMenu && isMobile" 
      class="mobile-backdrop"
      @click="showMobileMenu = false"
    ></div>

    <aside :class="['sidebar', { 'sidebar-mobile-open': showMobileMenu }]">
      <!-- Liquid Glass Background -->
      <div class="liquid-glass-bg">
        <div class="glass-layer"></div>
        <div class="gradient-overlay"></div>
        <div class="liquid-bubbles">
          <div class="bubble bubble-1"></div>
          <div class="bubble bubble-2"></div>
          <div class="bubble bubble-3"></div>
          <div class="bubble bubble-4"></div>
          <div class="bubble bubble-5"></div>
        </div>
      </div>

      <!-- Logo Section -->
      <div class="logo-section">
        <div class="logo">
          
          <span class="logo-text" :class="{ 'hide-on-mobile': isMobile }">G-Scores</span>
        </div>
      
      </div>

      <!-- Mobile Menu Toggle -->
      <button 
        class="menu-toggle" 
        @click="toggleMobileMenu"
        :class="{ 'menu-toggle-active': showMobileMenu }"
      >
        <div class="hamburger-lines">
          <span class="line line-1"></span>
          <span class="line line-2"></span>
          <span class="line line-3"></span>
        </div>
        <span class="menu-label">Menu</span>
      </button>

      <!-- Navigation Menu -->
      <nav class="navigation" :class="{ 'navigation-mobile-open': showMobileMenu }">
        <div class="menu-header" v-if="isMobile">
          <h3>Navigation</h3>
          <button class="close-menu" @click="showMobileMenu = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="menu-items">
          <a href="#dashboard" class="menu-item" @click.prevent="scrollToSection('dashboard')">
            <div class="menu-item-content">
              <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span class="menu-text">Dashboard</span>
              <div class="menu-item-glow"></div>
            </div>
          </a>

          <a href="#search" class="menu-item" @click.prevent="scrollToSection('search')">
            <div class="menu-item-content">
              <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <span class="menu-text">Search Scores</span>
              <div class="menu-item-glow"></div>
            </div>
          </a>

          <a href="#reports" class="menu-item" @click.prevent="scrollToSection('reports')">
            <div class="menu-item-content">
              <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <span class="menu-text">Reports</span>
              <div class="menu-item-glow"></div>
            </div>
          </a>

          
        </div>

       
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'EnhancedSidebarApp',
  components: {
    NotificationList
  },
  setup() {
    const router = useRouter();
    const showMobileMenu = ref(false);
    const isMobile = ref(false);

    const handleResize = () => {
      isMobile.value = window.innerWidth <= 900;
      if (!isMobile.value) showMobileMenu.value = false;
    };

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value;
    };

    const closeMobileMenu = () => {
      if (isMobile.value) {
        showMobileMenu.value = false;
      }
    };

    const scrollToSection = async (sectionId) => {
      closeMobileMenu();
      
      // If not on home page, navigate to home first
      if (router.currentRoute.value.path !== '/') {
        await router.push('/');
      }

      // Wait for the next tick to ensure the router view is updated
      nextTick(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80; // Adjust this value based on your header height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    };

    onMounted(() => {
      handleResize();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    return { 
      showMobileMenu, 
      isMobile, 
      toggleMobileMenu, 
      closeMobileMenu,
      scrollToSection
    };
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.app-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

/* Mobile Backdrop */
.mobile-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 998;
  opacity: 0;
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

/* Sidebar */
.sidebar {
  width: 280px;
  min-width: 280px;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 999;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Liquid Glass Background */
.liquid-glass-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.glass-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, 
    rgba(255, 226, 89, 0.8) 0%, 
    rgba(255, 167, 81, 0.7) 30%, 
    rgba(67, 206, 162, 0.6) 70%, 
    rgba(24, 119, 242, 0.5) 100%
  );
}

/* Liquid Bubbles Animation */
.liquid-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, 
    rgba(255, 255, 255, 0.3), 
    rgba(255, 255, 255, 0.1)
  );
  animation: float 6s ease-in-out infinite;
}

.bubble-1 {
  width: 60px;
  height: 60px;
  top: 10%;
  left: 15%;
  animation-delay: 0s;
}

.bubble-2 {
  width: 40px;
  height: 40px;
  top: 30%;
  right: 20%;
  animation-delay: 1s;
}

.bubble-3 {
  width: 80px;
  height: 80px;
  top: 60%;
  left: 10%;
  animation-delay: 2s;
}

.bubble-4 {
  width: 30px;
  height: 30px;
  top: 80%;
  right: 15%;
  animation-delay: 3s;
}

.bubble-5 {
  width: 50px;
  height: 50px;
  top: 45%;
  left: 60%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(90deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
  75% { transform: translateY(-10px) rotate(270deg); }
}

/* Logo Section */
.logo-section {
  position: relative;
  z-index: 10;
  padding: 2rem 1.5rem 1rem;
  text-align: center;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #173ea5;
  filter: drop-shadow(0 2px 8px rgba(255, 255, 255, 0.3));
}

.logo-text {
  font-size: 2rem;
  font-weight: 800;
  color: #173ea5;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
  letter-spacing: -0.5px;
}

.logo-subtitle {
  font-size: 0.875rem;
  color: rgba(23, 62, 165, 0.8);
  font-weight: 500;
  text-shadow: 0 1px 4px rgba(255, 255, 255, 0.2);
}

/* Mobile Menu Toggle */
.menu-toggle {
  display: none;
  position: relative;
  z-index: 10;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  align-items: center;
  gap: 0.5rem;
}

.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.hamburger-lines {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.line {
  width: 24px;
  height: 3px;
  background: #173ea5;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-toggle-active .line-1 {
  transform: rotate(45deg) translate(6px, 6px);
}

.menu-toggle-active .line-2 {
  opacity: 0;
}

.menu-toggle-active .line-3 {
  transform: rotate(-45deg) translate(6px, -6px);
}

.menu-label {
  font-size: 0.875rem;
  color: #173ea5;
  font-weight: 600;
}

/* Navigation */
.navigation {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
}

.menu-header {
  display: none;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  position: relative;
  text-decoration: none;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.menu-item-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  color: rgba(23, 62, 165, 0.9);
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.menu-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke-width: 2.5;
  transition: all 0.3s ease;
}

.menu-text {
  font-weight: 600;
}

.menu-item-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2) 0%, 
    rgba(255, 255, 255, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.menu-item:hover .menu-item-glow {
  opacity: 1;
}

.menu-item:hover .menu-item-content {
  color: #173ea5;
  transform: translateX(4px);
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.menu-item.active .menu-item-content {
  color: #173ea5;
  font-weight: 700;
}

.menu-item.active .menu-icon {
  transform: scale(1.1);
}

/* User Profile */
.user-profile {
  position: relative;
  z-index: 10;
  margin-top: auto;
  padding: 1.5rem 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin-left: 1rem;
  margin-right: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(23, 62, 165, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #173ea5;
}

.user-avatar svg {
  width: 1.25rem;
  height: 1.25rem;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #173ea5;
  margin-bottom: 0.125rem;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(23, 62, 165, 0.7);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  position: relative;
}

/* Mobile Styles */
@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    z-index: 999;
    transform: translateY(0);
  }

  .sidebar.sidebar-mobile-open {
    height: 100vh;
  }

  .liquid-glass-bg {
    border-radius: 0 0 24px 24px;
  }

  .glass-layer {
    border-radius: 0 0 24px 24px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .gradient-overlay {
    background: linear-gradient(90deg, 
      rgba(255, 226, 89, 0.9) 0%, 
      rgba(255, 167, 81, 0.8) 50%, 
      rgba(67, 206, 162, 0.7) 100%
    );
    border-radius: 0 0 24px 24px;
  }

  .logo-section {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
  }

  .logo {
    margin-bottom: 0;
  }

  .logo-text {
    font-size: 1.5rem;
  }

  .logo-subtitle {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .navigation {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border-radius: 0 0 24px 24px;
    opacity: 0;
    transform: translateY(-20px);
    pointer-events: none;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 1.5rem 1rem;
  }

  .navigation-mobile-open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .menu-header h3 {
    color: #173ea5;
    font-size: 1.125rem;
    font-weight: 700;
    margin: 0;
  }

  .close-menu {
    background: none;
    border: none;
    color: #173ea5;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background 0.2s ease;
  }

  .close-menu:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .close-menu svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .menu-items {
    gap: 0.75rem;
  }

  .menu-item-content {
    padding: 1.25rem 1.5rem;
    font-size: 1rem;
  }

  .menu-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .user-profile {
    display: none;
  }

  .main-content {
    margin-top: 70px;
    padding: 1.5rem 1rem;
  }

  .hide-on-mobile {
    display: none;
  }
}

@media (max-width: 600px) {
  .sidebar {
    height: 60px;
  }

  .sidebar.sidebar-mobile-open {
    height: 100vh;
  }

  .logo-section {
    height: 60px;
    padding: 0 0.75rem;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  .navigation {
    top: 60px;
    padding: 1rem 0.75rem;
  }

  .menu-item-content {
    padding: 1rem 1.25rem;
    font-size: 0.95rem;
  }

  .main-content {
    margin-top: 60px;
    padding: 1rem 0.75rem;
  }
}

/* Smooth Animations */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.content-section {
  min-height: 100vh;
  padding: 2rem;
  margin-bottom: 2rem;
}

.content-section h2 {
  color: #173ea5;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
}
</style>