import { createConsumer } from '@rails/actioncable';

class WebSocketService {
  constructor() {
    // Use environment-specific WebSocket URL
    const wsUrl = '/cable';
    // const wsUrl = '/cable';
    // ? '/cable'  // In production, use relative path
    // : 'ws://localhost:3000/cable';  // In development, use full URL
    
    console.log('WebSocket URL:', wsUrl); // Debug log
    
    // Add connection error handling
    this.consumer = createConsumer(wsUrl);
    
    // Handle connection events
    this.consumer.connection.events.error = (error) => {
      console.error('WebSocket connection error:', error);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        this.consumer.connect();
      }, 5000);
    };

    this.consumer.connection.events.open = () => {
      console.log('WebSocket connection established');
    };

    this.consumer.connection.events.close = () => {
      console.log('WebSocket connection closed');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        this.consumer.connect();
      }, 5000);
    };
    
    this.subscriptions = new Map();
    this.callbacks = new Map();
  }

  // Subscribe to all score updates
  subscribeToScores(callback) {
    try {
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
        },
        rejected: () => {
          console.error('Subscription to ScoresChannel was rejected');
        }
      });

      this.subscriptions.set('scores', subscription);
      this.callbacks.set('scores', callback);
    } catch (error) {
      console.error('Error subscribing to scores:', error);
    }
  }

  // Subscribe to specific student's score updates
  subscribeToStudentScores(registrationNumber, callback) {
    try {
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
          },
          rejected: () => {
            console.error(`Subscription to student scores channel ${registrationNumber} was rejected`);
          }
        }
      );

      this.subscriptions.set(channelName, subscription);
      this.callbacks.set(channelName, callback);
    } catch (error) {
      console.error('Error subscribing to student scores:', error);
    }
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