import { privateApi } from '../../api/api';

export interface AssignmentGrade {
  name: string;
  grade: number;
  maxGrade: number;
  submittedDate: string;
  status: 'pending' | 'submitted' | 'graded';
}

export interface CourseGrade {
  id: string;
  courseName: string;
  instructor: string;
  averageGrade: number;
  assignments: AssignmentGrade[];
  attendance: number;
  totalClasses: number;
  attendedClasses: number;
}

export interface GradeStats {
  overallGPA: string;
  completedAssignments: string;
  totalAssignments: number;
  overallAttendance: string;
}

export interface GradeDistribution {
  range: string;
  count: number;
  color: string;
}

export interface ProgressData {
  month: string;
  gpa: number;
  id: string;
}

/**
 * Service quản lý điểm số và kết quả học tập
 */
class GradeService {
  private baseUrl = '/grades';

  /**
   * Lấy danh sách điểm số theo từng khóa học của sinh viên
   */
  async getGradesByCourse() {
    try {
      const response = await privateApi.get<CourseGrade[]>(`${this.baseUrl}/courses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching grades by course:', error);
      throw error;
    }
  }

  /**
   * Lấy thống kê tổng quan về điểm số
   */
  async getOverallStats() {
    try {
      const response = await privateApi.get<GradeStats>(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching overall grade stats:', error);
      throw error;
    }
  }

  /**
   * Lấy dữ liệu phân bổ điểm số
   */
  async getGradeDistribution() {
    try {
      const response = await privateApi.get<GradeDistribution[]>(`${this.baseUrl}/distribution`);
      return response.data;
    } catch (error) {
      console.error('Error fetching grade distribution:', error);
      throw error;
    }
  }

  /**
   * Lấy dữ liệu tiến độ học tập theo thời gian
   */
  async getProgressOverTime() {
    try {
      const response = await privateApi.get<ProgressData[]>(`${this.baseUrl}/progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching progress over time:', error);
      throw error;
    }
  }
}

export const gradeService = new GradeService();
