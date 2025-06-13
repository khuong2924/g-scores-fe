import { createConsumer } from '@rails/actioncable';

class WebSocketService {
  constructor() {
    const wsUrl = process.env.VUE_APP_WS_URL || 'ws://localhost:3000/cable';
    this.consumer = createConsumer(wsUrl);
    this.subscriptions = new Map();
    this.callbacks = new Map();
  }

  // Subscribe to all score updates
  subscribeToScores(callback) {
    const subscription = this.consumer.subscriptions.create("ScoresChannel", {
      received: (data) => {
        if (callback) {
          callback(data);
        }
      },
      connected: () => {
        console.log('Connected to ScoresChannel');
      },
      disconnected: () => {
        console.log('Disconnected from ScoresChannel');
      }
    });

    this.subscriptions.set('scores', subscription);
    this.callbacks.set('scores', callback);
  }

  // Subscribe to specific student's score updates
  subscribeToStudentScores(registrationNumber, callback) {
    const channelName = `student_${registrationNumber}`;
    const subscription = this.consumer.subscriptions.create(
      "ScoresChannel",
      { registration_number: registrationNumber },
      {
        received: (data) => {
          if (callback) {
            callback(data);
          }
        },
        connected: () => {
          console.log(`Connected to student scores channel: ${registrationNumber}`);
        },
        disconnected: () => {
          console.log(`Disconnected from student scores channel: ${registrationNumber}`);
        }
      }
    );

    this.subscriptions.set(channelName, subscription);
    this.callbacks.set(channelName, callback);
  }

  // Unsubscribe from a channel
  unsubscribe(channelName) {
    const subscription = this.subscriptions.get(channelName);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(channelName);
      this.callbacks.delete(channelName);
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
    this.callbacks.clear();
  }
}

export default new WebSocketService(); 