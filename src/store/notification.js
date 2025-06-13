export default {
  state: {
    notifications: []
  },
  mutations: {
    ADD_NOTIFICATION(state, notification) {
      state.notifications.push({
        id: Date.now(),
        ...notification
      });
    },
    REMOVE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter(n => n.id !== id);
    }
  },
  actions: {
    showNotification({ commit }, { title, message, duration = 5000 }) {
      const notification = { title, message, duration };
      commit('ADD_NOTIFICATION', notification);
      
      if (duration > 0) {
        setTimeout(() => {
          commit('REMOVE_NOTIFICATION', notification.id);
        }, duration);
      }
    },
    removeNotification({ commit }, id) {
      commit('REMOVE_NOTIFICATION', id);
    }
  },
  getters: {
    notifications: state => state.notifications
  }
}; 