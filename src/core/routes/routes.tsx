import { createBrowserRouter, Navigate, redirect } from 'react-router';

// Auth pages
import { Login } from '../../features/auth';

// Student pages
import {
  StudentDashboard,
  StudentCourses,
  StudentClasses,
  StudentAssignments,
  StudentGrades,
  StudentHistory,
  StudentSchedule,
  StudentSettings,
  StudentDiscussions,
} from '../../features/student';

// Teacher pages
import {
  TeacherDashboard,
  TeacherCourses,
  TeacherClasses,
  TeacherStudents,
  TeacherAssignments,
  TeacherHistory,
  TeacherSettings,
  TeacherDiscussions,
} from '../../features/teacher';

// Admin pages
import {
  AdminDashboard,
  AdminUsers,
  AdminCreateUser,
  AdminClasses,
  AdminDiscussions,
  AdminCourses,
  AdminAssignments,
  AdminReports,
  AdminSettings,
} from '../../features/admin';

// Course pages
import { CoursePage, CreateCourse } from '../../features/courses';

// Assignment pages
import { AssignmentDetail, AssignmentSubmissions } from '../../features/assignments';

// Exam pages
import { CreateExam, ExamDetail, TakeExam } from '../../features/exams';

// Class pages
import { ClassDetail } from '../../features/classes';

// Profile pages
import { Profile } from '../../features/profile';

// Auth services
import { isAuthenticated, getCurrentUser } from '../../features/auth';

// Auth loader function
function authLoader(requiredRole?: 'student' | 'teacher' | 'admin') {
  return () => {
    if (!isAuthenticated()) {
      throw redirect('/');
    }

    if (requiredRole) {
      const user = getCurrentUser();
      if (user?.role !== requiredRole) {
        const redirectPath = 
          user?.role === 'student' 
            ? '/student/dashboard' 
            : user?.role === 'teacher' 
            ? '/teacher/dashboard' 
            : '/admin/dashboard';
        throw redirect(redirectPath);
      }
    }

    return null;
  };
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/profile',
      element: <Profile />,
      loader: authLoader(),
    },
    {
      path: '/student',
      children: [
        {
          path: 'dashboard',
          element: <StudentDashboard />,
          loader: authLoader('student'),
        },
        {
          path: 'courses',
          element: <StudentCourses />,
          loader: authLoader('student'),
        },
        {
          path: 'courses/:courseId',
          element: <CoursePage />,
          loader: authLoader('student'),
        },
        {
          path: 'classes',
          element: <StudentClasses />,
          loader: authLoader('student'),
        },
        {
          path: 'classes/:classId',
          element: <ClassDetail />,
          loader: authLoader('student'),
        },
        {
          path: 'assignments',
          element: <StudentAssignments />,
          loader: authLoader('student'),
        },
        {
          path: 'assignments/:assignmentId',
          element: <AssignmentDetail />,
          loader: authLoader('student'),
        },
        {
          path: 'exams/:examId',
          element: <ExamDetail />,
          loader: authLoader('student'),
        },
        {
          path: 'exams/:examId/take',
          element: <TakeExam />,
          loader: authLoader('student'),
        },
        {
          path: 'grades',
          element: <StudentGrades />,
          loader: authLoader('student'),
        },
        {
          path: 'history',
          element: <StudentHistory />,
          loader: authLoader('student'),
        },
        {
          path: 'schedule',
          element: <StudentSchedule />,
          loader: authLoader('student'),
        },
        {
          path: 'settings',
          element: <StudentSettings />,
          loader: authLoader('student'),
        },
        {
          path: 'discussions',
          element: <StudentDiscussions />,
          loader: authLoader('student'),
        },
      ],
    },
    {
      path: '/teacher',
      children: [
        {
          path: 'dashboard',
          element: <TeacherDashboard />,
          loader: authLoader('teacher'),
        },
        {
          path: 'courses',
          element: <TeacherCourses />,
          loader: authLoader('teacher'),
        },
        {
          path: 'courses/create',
          element: <CreateCourse />,
          loader: authLoader('teacher'),
        },
        {
          path: 'courses/:courseId',
          element: <CoursePage />,
          loader: authLoader('teacher'),
        },
        {
          path: 'courses/:courseId/create-exam',
          element: <CreateExam />,
          loader: authLoader('teacher'),
        },
        {
          path: 'exams/:examId',
          element: <ExamDetail />,
          loader: authLoader('teacher'),
        },
        {
          path: 'classes',
          element: <TeacherClasses />,
          loader: authLoader('teacher'),
        },
        {
          path: 'classes/:classId',
          element: <ClassDetail />,
          loader: authLoader('teacher'),
        },
        {
          path: 'students',
          element: <TeacherStudents />,
          loader: authLoader('teacher'),
        },
        {
          path: 'assignments',
          element: <TeacherAssignments />,
          loader: authLoader('teacher'),
        },
        {
          path: 'assignments/:assignmentId',
          element: <AssignmentDetail />,
          loader: authLoader('teacher'),
        },
        {
          path: 'assignments/:assignmentId/submissions',
          element: <AssignmentSubmissions />,
          loader: authLoader('teacher'),
        },
        // {
        //   path: 'history',
        //   element: <TeacherHistory />,
        //   loader: authLoader('teacher'),
        // },
        {
          path: 'settings',
          element: <TeacherSettings />,
          loader: authLoader('teacher'),
        },
        {
          path: 'discussions',
          element: <TeacherDiscussions />,
          loader: authLoader('teacher'),
        },
      ],
    },
    {
      path: '/admin',
      children: [
        {
          path: 'dashboard',
          element: <AdminDashboard />,
          loader: authLoader('admin'),
        },
        {
          path: 'users',
          element: <AdminUsers />,
          loader: authLoader('admin'),
        },
        {
          path: 'users/create',
          element: <AdminCreateUser />,
          loader: authLoader('admin'),
        },
        {
          path: 'classes',
          element: <AdminClasses />,
          loader: authLoader('admin'),
        },
        {
          path: 'classes/:classId',
          element: <ClassDetail />,
          loader: authLoader('admin'),
        },
        {
          path: 'discussions',
          element: <AdminDiscussions />,
          loader: authLoader('admin'),
        },
        {
          path: 'courses',
          element: <AdminCourses />,
          loader: authLoader('admin'),
        },
        {
          path: 'assignments',
          element: <AdminAssignments />,
          loader: authLoader('admin'),
        },
        {
          path: 'reports',
          element: <AdminReports />,
          loader: authLoader('admin'),
        },
        {
          path: 'settings',
          element: <AdminSettings />,
          loader: authLoader('admin'),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ],
  {
    future: {
      v7_skipActionErrorRevalidation: true,
    },
  }
);