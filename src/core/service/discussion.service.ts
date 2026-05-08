import { privateApi } from '../../api/api';

export interface Discussion {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'STUDENT' | 'TEACHER' | 'ADMIN';
  category: string;
  courseId?: number;
  courseName?: string;
  createdAt: string;
  repliesCount: number;
  likesCount: number;
  viewsCount: number;
  isPinned: boolean;
  status: 'ACTIVE' | 'REPORTED' | 'DELETED';
  reportsCount?: number;
}

export interface DiscussionReply {
  id: number;
  discussionId: number;
  content: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'STUDENT' | 'TEACHER' | 'ADMIN';
  createdAt: string;
  likesCount: number;
}

export interface CreateDiscussionRequest {
  title: string;
  content: string;
  category: string;
  courseId?: number;
  isPinned?: boolean;
}

export interface CreateReplyRequest {
  discussionId: number;
  content: string;
}

class DiscussionService {
  private baseUrl = '/discussions';

  /**
   * Lấy danh sách thảo luận
   */
  async getAllDiscussions(params?: { 
    courseId?: number; 
    category?: string; 
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const response = await privateApi.get<Discussion[]>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching discussions:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết một thảo luận và các phản hồi
   */
  async getDiscussionById(id: number) {
    try {
      const response = await privateApi.get<Discussion>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching discussion ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tạo thảo luận mới
   */
  async createDiscussion(data: CreateDiscussionRequest) {
    try {
      const response = await privateApi.post<Discussion>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating discussion:', error);
      throw error;
    }
  }

  /**
   * Cập nhật thảo luận
   */
  async updateDiscussion(id: number, data: Partial<CreateDiscussionRequest>) {
    try {
      const response = await privateApi.put<Discussion>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating discussion ${id}:`, error);
      throw error;
    }
  }

  /**
   * Xóa thảo luận
   */
  async deleteDiscussion(id: number) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting discussion ${id}:`, error);
      throw error;
    }
  }

  /**
   * Ghim/Bỏ ghim thảo luận
   */
  async togglePin(id: number) {
    try {
      const response = await privateApi.patch(`${this.baseUrl}/${id}/pin`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling pin for discussion ${id}:`, error);
      throw error;
    }
  }

  /**
   * Lấy danh sách phản hồi của một thảo luận
   */
  async getReplies(discussionId: number) {
    try {
      const response = await privateApi.get<DiscussionReply[]>(`${this.baseUrl}/${discussionId}/replies`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching replies for discussion ${discussionId}:`, error);
      throw error;
    }
  }

  /**
   * Gửi phản hồi
   */
  async createReply(data: CreateReplyRequest) {
    try {
      const response = await privateApi.post<DiscussionReply>(`${this.baseUrl}/replies`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating reply:', error);
      throw error;
    }
  }

  /**
   * Like/Unlike thảo luận
   */
  async toggleLike(id: number) {
    try {
      const response = await privateApi.post(`${this.baseUrl}/${id}/like`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling like for discussion ${id}:`, error);
      throw error;
    }
  }

  /**
   * Báo cáo thảo luận vi phạm
   */
  async reportDiscussion(id: number, reason: string) {
    try {
      const response = await privateApi.post(`${this.baseUrl}/${id}/report`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Error reporting discussion ${id}:`, error);
      throw error;
    }
  }
}

export const discussionService = new DiscussionService();
