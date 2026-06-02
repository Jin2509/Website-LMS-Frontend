import { privateApi } from '../../api/api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'assignment' | 'grade' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

/**
 * Service quản lý thông báo người dùng
 */
class NotificationService {
  private baseUrl = '/notifications';

  /**
   * Lấy danh sách thông báo của người dùng hiện tại
   */
  async getNotifications(params?: { page?: number; limit?: number; unreadOnly?: boolean }) {
    try {
      const response = await privateApi.get<Notification[]>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Đánh dấu thông báo là đã đọc
   * @param id ID của thông báo
   */
  async markAsRead(id: number) {
    try {
      const response = await privateApi.patch(`${this.baseUrl}/${id}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  }

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   */
  async markAllAsRead() {
    try {
      const response = await privateApi.patch(`${this.baseUrl}/read-all`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Xóa thông báo
   * @param id ID của thông báo
   */
  async deleteNotification(id: number) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      throw error;
    }
  }

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  async getUnreadCount() {
    try {
      const response = await privateApi.get<{ count: number }>(`${this.baseUrl}/unread-count`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
