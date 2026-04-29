export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastActive: string;
  coursesEnrolled?: number;
  coursesTeaching?: number;
}

export const allUsers: UserAccount[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@lms.com',
    role: 'student',
    status: 'active',
    joinDate: '2025-01-15',
    lastActive: '2026-03-25',
    coursesEnrolled: 5,
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'emma.wilson@lms.com',
    role: 'student',
    status: 'active',
    joinDate: '2025-02-20',
    lastActive: '2026-03-24',
    coursesEnrolled: 3,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@lms.com',
    role: 'student',
    status: 'active',
    joinDate: '2025-03-10',
    lastActive: '2026-03-25',
    coursesEnrolled: 4,
  },
  {
    id: '4',
    name: 'Sarah Davis',
    email: 'sarah.davis@lms.com',
    role: 'student',
    status: 'inactive',
    joinDate: '2025-01-05',
    lastActive: '2026-02-15',
    coursesEnrolled: 2,
  },
  {
    id: '5',
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@lms.com',
    role: 'teacher',
    status: 'active',
    joinDate: '2024-09-01',
    lastActive: '2026-03-25',
    coursesTeaching: 8,
  },
  {
    id: '6',
    name: 'Prof. John Anderson',
    email: 'john.anderson@lms.com',
    role: 'teacher',
    status: 'active',
    joinDate: '2024-08-15',
    lastActive: '2026-03-24',
    coursesTeaching: 5,
  },
  {
    id: '7',
    name: 'Dr. Lisa Chen',
    email: 'lisa.chen@lms.com',
    role: 'teacher',
    status: 'active',
    joinDate: '2024-10-01',
    lastActive: '2026-03-25',
    coursesTeaching: 6,
  },
  {
    id: '8',
    name: 'James Wilson',
    email: 'james.wilson@lms.com',
    role: 'student',
    status: 'active',
    joinDate: '2025-02-01',
    lastActive: '2026-03-23',
    coursesEnrolled: 6,
  },
  {
    id: '9',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@lms.com',
    role: 'student',
    status: 'active',
    joinDate: '2025-01-20',
    lastActive: '2026-03-25',
    coursesEnrolled: 4,
  },
  {
    id: '10',
    name: 'Dr. Robert Taylor',
    email: 'robert.taylor@lms.com',
    role: 'teacher',
    status: 'inactive',
    joinDate: '2024-11-01',
    lastActive: '2026-01-15',
    coursesTeaching: 3,
  },
];

export interface SystemStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  activeCourses: number;
  totalAssignments: number;
  pendingAssignments: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export const systemStats: SystemStats = {
  totalUsers: 520,
  totalStudents: 487,
  totalTeachers: 33,
  totalCourses: 125,
  activeCourses: 98,
  totalAssignments: 450,
  pendingAssignments: 178,
  totalRevenue: 125000,
  monthlyGrowth: 12.5,
};

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'user' | 'course' | 'assignment' | 'system';
}

export const recentActivities: ActivityLog[] = [
  {
    id: '1',
    action: 'Tạo khóa học mới "Advanced React Patterns"',
    user: 'Dr. Sarah Smith',
    timestamp: '2026-03-25 10:30',
    type: 'course',
  },
  {
    id: '2',
    action: 'Đăng ký học viên mới',
    user: 'Alex Johnson',
    timestamp: '2026-03-25 09:15',
    type: 'user',
  },
  {
    id: '3',
    action: 'Nộp bài tập "React Hooks Exercise"',
    user: 'Emma Wilson',
    timestamp: '2026-03-25 08:45',
    type: 'assignment',
  },
  {
    id: '4',
    action: 'Chấm điểm bài tập',
    user: 'Prof. John Anderson',
    timestamp: '2026-03-24 16:20',
    type: 'assignment',
  },
  {
    id: '5',
    action: 'Cập nhật nội dung khóa học',
    user: 'Dr. Lisa Chen',
    timestamp: '2026-03-24 14:10',
    type: 'course',
  },
  {
    id: '6',
    action: 'Đăng ký học viên mới',
    user: 'James Wilson',
    timestamp: '2026-03-24 11:30',
    type: 'user',
  },
  {
    id: '7',
    action: 'Tạo bài tập mới',
    user: 'Dr. Sarah Smith',
    timestamp: '2026-03-24 09:00',
    type: 'assignment',
  },
  {
    id: '8',
    action: 'Hoàn thành khóa học "Introduction to JavaScript"',
    user: 'Sophia Martinez',
    timestamp: '2026-03-23 18:45',
    type: 'course',
  },
];
