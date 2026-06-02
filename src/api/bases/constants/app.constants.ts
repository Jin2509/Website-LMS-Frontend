export const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api',
    TIMEOUT: 10000,
};

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export const APP_ENDPOINTS = {
    AUTH: {
        LOGIN: 'auth/login',
        LOGOUT: 'auth/logout',
        ME: 'auth/me',
        REFRESH: 'auth/refresh',
    },
    USERS: '/users',
    COURSES: '/courses',
    CLASSES: '/classes',
    ASSIGNMENTS: '/assignments',
    EXAMS: '/exams',
    DISCUSSIONS: '/discussions',
    DASHBOARD: '/dashboard',
    REPORTS: '/reports',
    NOTIFICATIONS: '/notifications',
    GRADES: '/grades',
    SCHEDULE: '/schedule',
    ACTIVITIES: '/activities',
};
