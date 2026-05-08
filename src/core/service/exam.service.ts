import { privateApi } from '../../api/api';

export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY';
export type ExamStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED';

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: number | string;
  points: number;
  order: number;
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  courseId: number;
  courseName?: string;
  duration: number; // minutes
  startDate: string;
  endDate: string;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  totalQuestions: number;
  totalPoints: number;
  status: ExamStatus;
  questions?: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentResult {
  id: number;
  examId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  score: number;
  maxScore: number;
  percentage: number;
  submittedAt: string;
  duration: number; // minutes taken
  attempt: number;
}

export interface CreateExamRequest {
  title: string;
  description: string;
  courseId: number;
  duration: number;
  startDate: string;
  endDate: string;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  questions: Omit<Question, 'id'>[];
}

export interface SubmitExamRequest {
  examId: number;
  answers: {
    questionId: number;
    answer: string | number;
  }[];
  duration: number; // how long it took in minutes
}

class ExamService {
  private baseUrl = '/exams';

  /**
   * Lấy danh sách tất cả các bài kiểm tra
   */
  async getAllExams(params?: { courseId?: number; status?: ExamStatus }) {
    try {
      const response = await privateApi.get<Exam[]>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin chi tiết một bài kiểm tra theo ID (bao gồm câu hỏi nếu là giảng viên)
   */
  async getExamById(id: number) {
    try {
      const response = await privateApi.get<Exam>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exam ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tạo bài kiểm tra mới (Giảng viên/Admin)
   */
  async createExam(data: CreateExamRequest) {
    try {
      const response = await privateApi.post<Exam>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
  }

  /**
   * Cập nhật bài kiểm tra
   */
  async updateExam(id: number, data: Partial<CreateExamRequest>) {
    try {
      const response = await privateApi.put<Exam>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating exam ${id}:`, error);
      throw error;
    }
  }

  /**
   * Xóa bài kiểm tra
   */
  async deleteExam(id: number) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting exam ${id}:`, error);
      throw error;
    }
  }

  /**
   * Sinh viên bắt đầu làm bài kiểm tra (Lấy danh sách câu hỏi không kèm đáp án)
   */
  async startExam(id: number) {
    try {
      const response = await privateApi.get<Exam>(`${this.baseUrl}/${id}/start`);
      return response.data;
    } catch (error) {
      console.error(`Error starting exam ${id}:`, error);
      throw error;
    }
  }

  /**
   * Nộp bài kiểm tra
   */
  async submitExam(data: SubmitExamRequest) {
    try {
      const response = await privateApi.post<StudentResult>(`${this.baseUrl}/submit`, data);
      return response.data;
    } catch (error) {
      console.error('Error submitting exam:', error);
      throw error;
    }
  }

  /**
   * Lấy kết quả bài kiểm tra của sinh viên hiện tại
   */
  async getMyResults(examId?: number) {
    try {
      const response = await privateApi.get<StudentResult[]>(`${this.baseUrl}/my-results`, {
        params: { examId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my results:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách kết quả của tất cả sinh viên (Dành cho Giảng viên)
   */
  async getAllResults(examId: number) {
    try {
      const response = await privateApi.get<StudentResult[]>(`${this.baseUrl}/${examId}/results`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching results for exam ${examId}:`, error);
      throw error;
    }
  }
}

export const examService = new ExamService();
