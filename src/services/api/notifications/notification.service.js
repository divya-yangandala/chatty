import axios from '@services/axios';

class NotificationService {
  async getUserNotifications () {
    const response = await axios.get('/notifications');
    // console.log(response);
    return response;
  }

  async markNotificationAsRead (notificationId) {
    const response = await axios.put(`/notification/${notificationId}`);
    return response;
  }

  async deleteNotification (notificationId) {
    const response = await axios.delete(`/notification/${notificationId}`);
    return response;
  }
}

export const notificationService = new NotificationService();
