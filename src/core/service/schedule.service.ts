import { privateApi } from '../../api/api';

export interface ScheduleSession {
  id: string;
  courseName: string;
  instructor: string;
  time: string;
  location: string;
  type: 'Lý thuyết' | 'Thực hành';
  color: string;
}

export interface WeeklySchedule {
  monday: ScheduleSession[];
  tuesday: ScheduleSession[];
  wednesday: ScheduleSession[];
  thursday: ScheduleSession[];
  friday: ScheduleSession[];
  saturday: ScheduleSession[];
  sunday: ScheduleSession[];
}

export interface ScheduleStats {
  totalClasses: number;
  theoryClasses: number;
  practiceClasses: number;
  uniqueCourses: number;
}

/**
 * Service quản lý thời khóa biểu và lịch học
 */
class ScheduleService {
  private baseUrl = '/schedule';

  /**
   * Lấy thời khóa biểu theo tuần
   * @param weekOffset Độ lệch tuần so với tuần hiện tại (0 là tuần này)
   */
  async getWeeklySchedule(weekOffset: number = 0) {
    try {
      const response = await privateApi.get<WeeklySchedule>(this.baseUrl, {
        params: { weekOffset }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly schedule:', error);
      throw error;
    }
  }

  /**
   * Lấy thống kê lịch học
   */
  async getScheduleStats() {
    try {
      const response = await privateApi.get<ScheduleStats>(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule stats:', error);
      throw error;
    }
  }

  /**
   * Xuất thời khóa biểu ra file (Excel/PDF)
   */
  async exportSchedule() {
    try {
      const response = await privateApi.get(`${this.baseUrl}/export`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting schedule:', error);
      throw error;
    }
  }
}

export const scheduleService = new ScheduleService();
