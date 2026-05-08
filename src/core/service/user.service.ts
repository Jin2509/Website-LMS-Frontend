import { privateApi } from '../../api/api';

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  status?: UserStatus;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  status?: UserStatus;
  role?: UserRole;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

class UserService {
  private baseUrl = '/users';

  /**
   * Lấy danh sách tất cả người dùng (Dành cho Admin)
   * @param params Tham số phân trang, tìm kiếm và lọc
   */
  async getAllUsers(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    role?: UserRole; 
    status?: UserStatus 
  }) {
    try {
      const response = await privateApi.get(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin chi tiết một người dùng theo ID
   * @param id ID của người dùng
   */
  async getUserById(id: number) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tạo người dùng mới (Dành cho Admin)
   * @param data Thông tin người dùng mới
   */
  async createUser(data: CreateUserRequest) {
    try {
      const response = await privateApi.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin người dùng
   * @param id ID của người dùng
   * @param data Thông tin cập nhật
   */
  async updateUser(id: number, data: UpdateUserRequest) {
    try {
      const response = await privateApi.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Xóa người dùng (Dành cho Admin)
   * @param id ID của người dùng
   */
  async deleteUser(id: number) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Lấy thông tin cá nhân của người dùng hiện tại
   */
  async getProfile() {
    try {
      const response = await privateApi.get(`${this.baseUrl}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin cá nhân của người dùng hiện tại
   * @param data Thông tin cập nhật
   */
  async updateProfile(data: UpdateUserRequest) {
    try {
      const response = await privateApi.put(`${this.baseUrl}/profile`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Đổi mật khẩu
   * @param data Thông tin mật khẩu cũ và mới
   */
  async changePassword(data: ChangePasswordRequest) {
    try {
      const response = await privateApi.post(`${this.baseUrl}/change-password`, data);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Cập nhật ảnh đại diện
   * @param file File ảnh
   */
  async uploadAvatar(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await privateApi.post(`${this.baseUrl}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
