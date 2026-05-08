import { privateApi } from '../../api/api';

export interface Assignment {
  id: number;
  title: string;
  description: string;
  courseId: number;
  courseName?: string;
  dueDate: string;
  maxScore: number;
  status?: 'ACTIVE' | 'CLOSED';
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  studentId: number;
  studentName?: string;
  studentEmail?: string;
  fileUrl: string;
  fileName?: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  status: 'SUBMITTED' | 'GRADED' | 'LATE';
}

export interface CreateAssignmentRequest {
  title: string;
  description: string;
  courseId: number;
  dueDate: string;
  maxScore: number;
}

export interface SubmitAssignmentRequest {
  assignmentId: number;
  file: File;
}

class AssignmentService {
  private baseUrl = '/assignments';

  /**
   * Lấy danh sách bài tập (có thể lọc theo khóa học)
   */
  async getAllAssignments(params?: { courseId?: number }) {
    try {
      const response = await privateApi.get<Assignment[]>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết bài tập theo ID
   */
  async getAssignmentById(id: number) {
    try {
      const response = await privateApi.get<Assignment>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tạo bài tập mới (Giảng viên)
   */
  async createAssignment(data: CreateAssignmentRequest) {
    try {
      const response = await privateApi.post<Assignment>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  }

  /**
   * Cập nhật bài tập
   */
  async updateAssignment(id: number, data: Partial<CreateAssignmentRequest>) {
    try {
      const response = await privateApi.put<Assignment>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating assignment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Xóa bài tập
   */
  async deleteAssignment(id: number) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting assignment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Nộp bài tập (Sinh viên)
   */
  async submitAssignment(assignmentId: number, file: File) {
    try {
      const formData = new FormData();
      formData.append('assignmentId', assignmentId.toString());
      formData.append('file', file);
      const response = await privateApi.post(`${this.baseUrl}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting assignment:', error);
      throw error;
    }
  }

  /**
   * Chấm điểm bài nộp (Giảng viên)
   */
  async gradeSubmission(submissionId: number, data: { score: number; feedback: string }) {
    try {
      const response = await privateApi.post(`${this.baseUrl}/submissions/${submissionId}/grade`, data);
      return response.data;
    } catch (error) {
      console.error(`Error grading submission ${submissionId}:`, error);
      throw error;
    }
  }

  /**
   * Lấy danh sách các bản nộp của một bài tập (Giảng viên)
   */
  async getSubmissions(assignmentId: number) {
    try {
      const response = await privateApi.get<AssignmentSubmission[]>(`${this.baseUrl}/${assignmentId}/submissions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching submissions for assignment ${assignmentId}:`, error);
      throw error;
    }
  }

  /**
   * Lấy bài nộp của chính sinh viên cho một bài tập cụ thể
   */
  async getMySubmission(assignmentId: number) {
    try {
      const response = await privateApi.get<AssignmentSubmission>(`${this.baseUrl}/${assignmentId}/my-submission`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching my submission for assignment ${assignmentId}:`, error);
      throw error;
    }
  }
}

export const assignmentService = new AssignmentService();
