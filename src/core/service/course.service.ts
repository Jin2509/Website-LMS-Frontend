import { privateApi } from '../../api/api';

export interface Course {
  id: number;
  name: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  price: number;
  rating: number;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  name: string;
  description: string;
  category: string;
  level: string;
  price: number;
}

export interface UpdateCourseRequest {
  name?: string;
  description?: string;
  category?: string;
  level?: string;
  price?: number;
}

class CourseService {
  private baseUrl = '/courses';

  // Lấy danh sách tất cả khóa học
  async getAllCourses(params?: { page?: number; limit?: number; category?: string }) {
    try {
      const response = await privateApi.get<Course[]>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Lấy chi tiết một khóa học theo ID
  async getCourseById(id: number) {
    try {
      const response = await privateApi.get<Course>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Tạo khóa học mới
  async createCourse(data: CreateCourseRequest) {
    try {
      const response = await privateApi.post<Course>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật khóa học
  async updateCourse(id: number, data: UpdateCourseRequest) {
    try {
      const response = await privateApi.put<Course>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Xóa khóa học
  async deleteCourse(id: number) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Lấy khóa học của người dùng hiện tại
  async getMyCourses() {
    try {
      const response = await privateApi.get<Course[]>(`${this.baseUrl}/my-courses`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Tìm kiếm khóa học
  async searchCourses(keyword: string) {
    try {
      const response = await privateApi.get<Course[]>(`${this.baseUrl}/search`, {
        params: { keyword },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Đăng ký khóa học
  async enrollCourse(id: number) {
    try {
      const response = await privateApi.post(`${this.baseUrl}/${id}/enroll`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Hủy đăng ký khóa học
  async unenrollCourse(id: number) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/${id}/enroll`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const courseService = new CourseService();
