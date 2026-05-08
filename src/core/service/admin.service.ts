import { privateApi } from '../../api/api';

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalCourses: number;
  activeUsersToday: number;
  newEnrollmentsThisMonth: number;
  revenue?: number;
}

export interface SystemLog {
  id: number;
  action: string;
  userId: number;
  userName: string;
  details: string;
  createdAt: string;
  ipAddress?: string;
}

class AdminService {
  private baseUrl = '/admin';

  /**
   * Lấy số liệu thống kê tổng quan cho Dashboard Admin
   */
  async getDashboardStats() {
    try {
      const response = await privateApi.get<DashboardStats>(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Lấy lịch sử hoạt động hệ thống
   */
  async getSystemLogs(params?: { page?: number; limit?: number; userId?: number }) {
    try {
      const response = await privateApi.get<SystemLog[]>(`${this.baseUrl}/logs`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching system logs:', error);
      throw error;
    }
  }

  /**
   * Cấu hình hệ thống (Ví dụ: bật/tắt đăng ký, bảo trì)
   */
  async updateSystemSettings(settings: Record<string, any>) {
    try {
      const response = await privateApi.put(`${this.baseUrl}/settings`, settings);
      return response.data;
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  }

  /**
   * Sao lưu dữ liệu hệ thống
   */
  async backupSystem() {
    try {
      const response = await privateApi.post(`${this.baseUrl}/backup`);
      return response.data;
    } catch (error) {
      console.error('Error backing up system:', error);
      throw error;
    }
  }

  /**
   * Phê duyệt hàng loạt thảo luận bị báo cáo
   */
  async approveReportedDiscussions(ids: number[]) {
    try {
      const response = await privateApi.post(`${this.baseUrl}/discussions/approve`, { ids });
      return response.data;
    } catch (error) {
      console.error('Error approving discussions:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
