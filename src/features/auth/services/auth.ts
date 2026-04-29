// Mock authentication utilities
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export const mockUsers: Record<string, User> = {
  'student@lms.com': {
    id: '1',
    name: 'Alex Johnson',
    email: 'student@lms.com',
    role: 'student',
  },
  'teacher@lms.com': {
    id: '2',
    name: 'Dr. Sarah Smith',
    email: 'teacher@lms.com',
    role: 'teacher',
  },
  'admin@lms.com': {
    id: '3',
    name: 'Admin User',
    email: 'admin@lms.com',
    role: 'admin',
  },
};

export const login = (email: string, password: string): User | null => {
  // Mock authentication - in real app, this would call an API
  const user = mockUsers[email];
  if (user && password === 'password') {
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const register = (
  name: string,
  email: string,
  password: string,
  role: UserRole
): { success: boolean; message: string; user?: User } => {
  // Check if user already exists
  if (mockUsers[email]) {
    return {
      success: false,
      message: 'Email đã được sử dụng'
    };
  }

  // Create new user
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    role
  };

  // In a real app, this would call an API
  // For now, we just add to mock users
  mockUsers[email] = newUser;

  return {
    success: true,
    message: 'Đăng ký thành công',
    user: newUser
  };
};

export const resetPassword = (
  email: string
): { success: boolean; message: string } => {
  // Check if user exists
  if (!mockUsers[email]) {
    return {
      success: false,
      message: 'Email không tồn tại trong hệ thống'
    };
  }

  // In a real app, this would send an email with reset link
  // For now, we just simulate success
  console.log(`Password reset email sent to: ${email}`);

  return {
    success: true,
    message: 'Đã gửi email hướng dẫn đặt lại mật khẩu'
  };
};