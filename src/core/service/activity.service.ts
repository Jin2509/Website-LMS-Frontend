import { privateApi } from '../../api/api';
import { LucideIcon } from 'lucide-react';

export interface TimelineItem {
  date: string;
  type: string;
  title: string;
  description: string;
  icon?: string; // Tên icon lucide
  color: string;
  bgColor: string;
}

export interface ActivityStats {
  label: string;
  value: string | number;
  type: string;
}

/**
 * Service quản lý lịch sử hoạt động và hành trình học tập/giảng dạy
 */
class ActivityService {
  private baseUrl = '/activities';

  /**
   * Lấy dòng thời gian hoạt động của sinh viên
   */
  async getStudentTimeline() {
    try {
      const response = await privateApi.get<TimelineItem[]>(`${this.baseUrl}/student/timeline`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student timeline:', error);
      throw error;
    }
  }

  /**
   * Lấy dòng thời gian hoạt động của giảng viên
   */
  async getTeacherTimeline() {
    try {
      const response = await privateApi.get<TimelineItem[]>(`${this.baseUrl}/teacher/timeline`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher timeline:', error);
      throw error;
    }
  }

  /**
   * Lấy thống kê lịch sử học tập của sinh viên
   */
  async getStudentHistoryStats() {
    try {
      const response = await privateApi.get<ActivityStats[]>(`${this.baseUrl}/student/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student history stats:', error);
      throw error;
    }
  }

  /**
   * Lấy thống kê lịch sử giảng dạy của giảng viên
   */
  async getTeacherHistoryStats() {
    try {
      const response = await privateApi.get<ActivityStats[]>(`${this.baseUrl}/teacher/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher history stats:', error);
      throw error;
    }
  }
}

export const activityService = new ActivityService();
