import { privateApi } from '../../api/api';

export interface Class {
  id: number;
  name: string;
  description: string;
  instructorName: string;
  instructorId: number;
  semester: string;
  year: string;
  studentCount: number;
  courseIds: number[];
  assignmentIds: number[];
  schedule?: string;
  room?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface CreateClassRequest {
  name: string;
  description: string;
  instructorId: number;
  semester: string;
  year: string;
  courseIds?: number[];
  schedule?: string;
  room?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateClassRequest {
  name?: string;
  description?: string;
  instructorId?: number;
  semester?: string;
  year?: string;
  courseIds?: number[];
  schedule?: string;
  room?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface ClassStudent {
  id: number;
  classId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  enrolledDate: string;
  attendance?: number;
  averageGrade?: number;
}

class ClassService {
  private baseUrl = '/classes';

  /**
   * Lấy danh sách tất cả các lớp học
   * @param params Tham số phân trang và lọc
   */
  async getAllClasses(params?: { page?: number; limit?: number; instructorId?: number; semester?: string }) {
    try {
      const response = await privateApi.get(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết một lớp học theo ID
   * @param id ID của lớp học
   */
  async getClassById(id: number) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching class ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tạo một lớp học mới
   * @param data Thông tin lớp học mới
   */
  async createClass(data: CreateClassRequest) {
    try {
      const response = await privateApi.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin lớp học
   * @param id ID của lớp học
   * @param data Thông tin cập nhật
   */
  async updateClass(id: number, data: UpdateClassRequest) {
    try {
      const response = await privateApi.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating class ${id}:`, error);
      throw error;
    }
  }

  /**
   * Xóa một lớp học
   * @param id ID của lớp học
   */
  async deleteClass(id: number) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting class ${id}:`, error);
      throw error;
    }
  }

  /**
   * Lấy danh sách lớp học do giảng viên phụ trách
   * @param instructorId ID của giảng viên
   */
  async getClassesByInstructor(instructorId: number) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/instructor/${instructorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching classes for instructor ${instructorId}:`, error);
      throw error;
    }
  }

  /**
   * Lấy danh sách sinh viên trong một lớp học
   * @param classId ID của lớp học
   */
  async getClassStudents(classId: number) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/${classId}/students`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching students for class ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Thêm sinh viên vào lớp học
   * @param classId ID của lớp học
   * @param studentId ID của sinh viên
   */
  async addStudentToClass(classId: number, studentId: number) {
    try {
      const response = await privateApi.post(`${this.baseUrl}/${classId}/students`, { studentId });
      return response.data;
    } catch (error) {
      console.error(`Error adding student ${studentId} to class ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Xóa sinh viên khỏi lớp học
   * @param classId ID của lớp học
   * @param studentId ID của sinh viên
   */
  async removeStudentFromClass(classId: number, studentId: number) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/${classId}/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing student ${studentId} from class ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Lấy các lớp học mà sinh viên đang tham gia
   * @param studentId ID của sinh viên
   */
  async getClassesByStudent(studentId: number) {
    try {
      const response = await privateApi.get(`/students/${studentId}/classes`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching classes for student ${studentId}:`, error);
      throw error;
    }
  }
}

export const classService = new ClassService();
