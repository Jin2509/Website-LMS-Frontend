import { privateApi } from '../../api/api';

// --- Admin Dashboard Interfaces ---
export interface AdminDashboardStats {
  totalUsers: number;
  totalCourses: number;
  pendingAssignments: number;
  monthlyGrowth: number;
  totalStudents: number;
  totalTeachers: number;
  activeCourses: number;
  systemHealth: {
    server: 'healthy' | 'warning' | 'error';
    database: 'healthy' | 'warning' | 'error';
    storage: string;
    api: 'healthy' | 'warning' | 'error';
  };
}

export interface Activity {
  id: number;
  type: 'user' | 'course' | 'assignment' | 'system';
  action: string;
  user: string;
  timestamp: string;
}

// --- Student Dashboard Interfaces ---
export interface StudentDashboardData {
  enrolledCourses: number;
  completedCourses: number;
  averageGrade: number;
  upcomingDeadlines: {
    id: number;
    title: string;
    courseName: string;
    dueDate: string;
  }[];
  recentCourses: {
    id: number;
    name: string;
    progress: number;
    lastAccessed: string;
  }[];
}

// --- Teacher Dashboard Interfaces ---
export interface TeacherDashboardData {
  totalStudents: number;
  activeCourses: number;
  pendingGrades: number;
  averageRating: number;
  courseOverview: {
    id: number;
    name: string;
    studentsCount: number;
    averageProgress: number;
  }[];
}

class DashboardService {
  private baseUrl = '/dashboard';

  /**
   * Lấy dữ liệu tổng quan cho Dashboard Admin
   */
  async getAdminStats() {
    try {
      const response = await privateApi.get<AdminDashboardStats>(`${this.baseUrl}/admin/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách hoạt động gần đây (Admin)
   */
  async getRecentActivities() {
    try {
      const response = await privateApi.get<Activity[]>(`${this.baseUrl}/admin/activities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }

  /**
   * Lấy dữ liệu cho Dashboard Sinh viên
   */
  async getStudentData() {
    try {
      const response = await privateApi.get<StudentDashboardData>(`${this.baseUrl}/student`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student dashboard data:', error);
      throw error;
    }
  }

  /**
   * Lấy dữ liệu cho Dashboard Giảng viên
   */
  async getTeacherData() {
    try {
      const response = await privateApi.get<TeacherDashboardData>(`${this.baseUrl}/teacher`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher dashboard data:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
