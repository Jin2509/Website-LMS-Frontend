import { privateApi } from '../../api/api';

// --- Student Interfaces ---
export interface StudentDashboardStats {
  enrolledCourses: number;
  ongoingCourses: number;
  averageGrade: number;
  learningHours: number;
}

export interface ActivityLog {
  date: string;
  count: number;
}

export interface WeeklyLearningStats {
  day: string;
  hours: number;
}

export interface CourseGrade {
  courseId: number;
  courseName: string;
  instructorName: string;
  averageGrade: number;
  attendancePercentage: number;
  assignments: {
    name: string;
    grade: number;
    maxGrade: number;
    submittedDate: string;
    status: string;
  }[];
}

export interface StudentGradesReport {
  overallGPA: number;
  overallAttendance: number;
  totalAssignments: number;
  completedAssignments: number;
  gradeDistribution: { range: string; count: number }[];
  progressOverTime: { month: string; gpa: number }[];
  gradesByCourse: CourseGrade[];
}

// --- Teacher Interfaces ---
export interface TeacherDashboardStats {
  totalStudents: number;
  teachingCourses: number;
  pendingAssignments: number;
  averageClassGrade: number;
}

export interface MonthlyProgress {
  month: string;
  students: number;
  assignments: number;
  exams: number;
}

export interface TeacherCourseStat {
  courseId: number;
  title: string;
  totalStudents: number;
  completedStudents: number;
  assignmentsStatus: {
    onTime: number;
    late: number;
    notSubmitted: number;
  };
  examsParticipation: {
    participated: number;
    total: number;
  };
}

export interface AdminSemesterComparison {
  label: string;
  current: number;
  previous: number;
}

export interface TopCourse {
  name: string;
  studentsCount: number;
  completionRate: number;
}

export interface TopTeacher {
  name: string;
  coursesCount: number;
  studentsCount: number;
  rating: number;
}

class ReportService {
  private baseUrl = '/reports';

  // --- Student Methods ---
  

  async getStudentDashboardStats() {
    try {
      const response = await privateApi.get<StudentDashboardStats>(`${this.baseUrl}/student/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student dashboard stats:', error);
      throw error;
    }
  }


  async getStudentActivityLog() {
    try {
      const response = await privateApi.get<ActivityLog[]>(`${this.baseUrl}/student/activity-log`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student activity log:', error);
      throw error;
    }
  }


  async getStudentGradesReport() {
    try {
      const response = await privateApi.get<StudentGradesReport>(`${this.baseUrl}/student/grades`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student grades report:', error);
      throw error;
    }
  }

  // --- Teacher Methods ---

  /**
   * Lấy thống kê tổng quan cho Dashboard của Giảng viên
   */
  async getTeacherDashboardStats() {
    try {
      const response = await privateApi.get<TeacherDashboardStats>(`${this.baseUrl}/teacher/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Lấy dữ liệu tiến độ hàng tháng (Sinh viên, Bài tập, Kỳ thi) cho Giảng viên
   */
  async getTeacherMonthlyProgress() {
    try {
      const response = await privateApi.get<MonthlyProgress[]>(`${this.baseUrl}/teacher/monthly-progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher monthly progress:', error);
      throw error;
    }
  }

  /**
   * Lấy thống kê chi tiết theo từng khóa học của Giảng viên
   */
  async getTeacherCourseStats() {
    try {
      const response = await privateApi.get<TeacherCourseStat[]>(`${this.baseUrl}/teacher/course-stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher course stats:', error);
      throw error;
    }
  }

  // --- Admin Methods ---

  /**
   * Lấy dữ liệu so sánh giữa các học kỳ (Dành cho Admin)
   * @param semesterId ID của học kỳ cần so sánh
   */
  async getAdminSemesterComparison(semesterId: number) {
    try {
      const response = await privateApi.get<AdminSemesterComparison[]>(`${this.baseUrl}/admin/semester-comparison`, {
        params: { semesterId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching semester comparison:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách các khóa học hàng đầu (Dựa trên số lượng SV và tỷ lệ hoàn thành)
   */
  async getAdminTopCourses() {
    try {
      const response = await privateApi.get<TopCourse[]>(`${this.baseUrl}/admin/top-courses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top courses:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách các giảng viên xuất sắc (Dựa trên số lượng SV và đánh giá)
   */
  async getAdminTopTeachers() {
    try {
      const response = await privateApi.get<TopTeacher[]>(`${this.baseUrl}/admin/top-teachers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top teachers:', error);
      throw error;
    }
  }
}

export const reportService = new ReportService();
