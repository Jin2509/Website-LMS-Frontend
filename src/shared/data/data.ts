// Mock data for the LMS
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  image: string;
  category: string;
}

export interface Assignment {
  id: string;
  title: string;
  course: string;
  courseId: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentName: string;
  studentEmail: string;
  submittedDate: string;
  fileName: string;
  fileSize: string;
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'graded';
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked?: boolean;
  type: 'video' | 'reading' | 'quiz';
  content?: string;
  files?: LessonFile[];
  videoUrl?: string;
  assignmentId?: string;
}

export interface LessonFile {
  name: string;
  size: string;
  url: string;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  instructor: string;
  instructorId: string;
  semester: string;
  year: string;
  studentCount: number;
  courseIds: string[];
  assignmentIds: string[];
  schedule?: string;
  room?: string;
  image: string;
}

export interface ClassStudent {
  id: string;
  classId: string;
  studentName: string;
  studentEmail: string;
  enrolledDate: string;
  attendance: number;
  averageGrade?: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  enrolledYear: string;
}

export const courses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of programming and computer science',
    instructor: 'Dr. Sarah Smith',
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
    category: 'Computer Science',
  },
  {
    id: '2',
    title: 'Advanced Mathematics',
    description: 'Calculus, linear algebra, and differential equations',
    instructor: 'Prof. John Davis',
    progress: 45,
    totalLessons: 30,
    completedLessons: 14,
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
    category: 'Mathematics',
  },
  {
    id: '3',
    title: 'Web Development Fundamentals',
    description: 'HTML, CSS, JavaScript, and modern web frameworks',
    instructor: 'Dr. Sarah Smith',
    progress: 80,
    totalLessons: 20,
    completedLessons: 16,
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400',
    category: 'Web Development',
  },
  {
    id: '4',
    title: 'Data Structures & Algorithms',
    description: 'Master essential algorithms and data structures',
    instructor: 'Prof. Michael Chen',
    progress: 30,
    totalLessons: 28,
    completedLessons: 8,
    image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400',
    category: 'Computer Science',
  },
];

export const assignments: Assignment[] = [
  {
    id: '1',
    title: 'Final Project: Build a Web Application',
    course: 'Web Development Fundamentals',
    courseId: '3',
    dueDate: '2026-03-28',
    status: 'pending',
  },
  {
    id: '2',
    title: 'Quiz: Variables and Functions',
    course: 'Introduction to Computer Science',
    courseId: '1',
    dueDate: '2026-03-25',
    status: 'submitted',
    grade: 92,
  },
  {
    id: '3',
    title: 'Problem Set: Linear Transformations',
    course: 'Advanced Mathematics',
    courseId: '2',
    dueDate: '2026-03-30',
    status: 'pending',
  },
  {
    id: '4',
    title: 'Implementation: Binary Search Tree',
    course: 'Data Structures & Algorithms',
    courseId: '4',
    dueDate: '2026-04-02',
    status: 'graded',
    grade: 88,
  },
];

export const studentSubmissions: StudentSubmission[] = [
  {
    id: '1',
    assignmentId: '1',
    studentName: 'Alice Johnson',
    studentEmail: 'alice.johnson@example.com',
    submittedDate: '2026-03-27',
    fileName: 'web_app_project.zip',
    fileSize: '5.2 MB',
    grade: 95,
    feedback: 'Excellent work! Your application is well-structured and functional. Great use of modern web technologies.',
    status: 'graded',
  },
  {
    id: '2',
    assignmentId: '1',
    studentName: 'Bob Smith',
    studentEmail: 'bob.smith@example.com',
    submittedDate: '2026-03-28',
    fileName: 'final_project.zip',
    fileSize: '4.8 MB',
    status: 'submitted',
  },
  {
    id: '3',
    assignmentId: '1',
    studentName: 'Emma Wilson',
    studentEmail: 'emma.wilson@example.com',
    submittedDate: '2026-03-27',
    fileName: 'webapp_final.zip',
    fileSize: '6.1 MB',
    grade: 88,
    feedback: 'Good work! Consider improving the responsive design for mobile devices.',
    status: 'graded',
  },
  {
    id: '4',
    assignmentId: '2',
    studentName: 'Charlie Brown',
    studentEmail: 'charlie.brown@example.com',
    submittedDate: '2026-03-24',
    fileName: 'quiz_answers.pdf',
    fileSize: '1.2 MB',
    grade: 92,
    feedback: 'Great understanding of variables and functions. Minor error in question 5.',
    status: 'graded',
  },
  {
    id: '5',
    assignmentId: '2',
    studentName: 'David Wilson',
    studentEmail: 'david.wilson@example.com',
    submittedDate: '2026-03-25',
    fileName: 'quiz_submission.pdf',
    fileSize: '950 KB',
    grade: 85,
    feedback: 'Good effort! Review the scope concept for better understanding.',
    status: 'graded',
  },
  {
    id: '6',
    assignmentId: '3',
    studentName: 'Eva Martinez',
    studentEmail: 'eva.martinez@example.com',
    submittedDate: '2026-03-29',
    fileName: 'linear_transformations.pdf',
    fileSize: '2.5 MB',
    status: 'submitted',
  },
  {
    id: '7',
    assignmentId: '3',
    studentName: 'Frank Lee',
    studentEmail: 'frank.lee@example.com',
    submittedDate: '2026-03-30',
    fileName: 'math_problemset.pdf',
    fileSize: '3.2 MB',
    grade: 90,
    feedback: 'Excellent work on linear transformations! All proofs are correct.',
    status: 'graded',
  },
  {
    id: '8',
    assignmentId: '4',
    studentName: 'Grace Taylor',
    studentEmail: 'grace.taylor@example.com',
    submittedDate: '2026-04-01',
    fileName: 'binary_search_tree.py',
    fileSize: '3.1 MB',
    grade: 88,
    feedback: 'Good implementation! Consider adding more test cases for edge scenarios.',
    status: 'graded',
  },
  {
    id: '9',
    assignmentId: '4',
    studentName: 'Henry Anderson',
    studentEmail: 'henry.anderson@example.com',
    submittedDate: '2026-04-02',
    fileName: 'bst_implementation.py',
    fileSize: '2.8 MB',
    status: 'submitted',
  },
  {
    id: '10',
    assignmentId: '4',
    studentName: 'Ivy Chen',
    studentEmail: 'ivy.chen@example.com',
    submittedDate: '2026-04-01',
    fileName: 'data_structures_assignment.py',
    fileSize: '3.5 MB',
    grade: 94,
    feedback: 'Outstanding! Your code is clean, well-documented, and efficient.',
    status: 'graded',
  },
];

export const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to Programming Concepts',
    duration: '45 min',
    completed: true,
    type: 'video',
  },
  {
    id: '2',
    title: 'Variables and Data Types',
    duration: '35 min',
    completed: true,
    type: 'video',
  },
  {
    id: '3',
    title: 'Control Flow and Conditionals',
    duration: '40 min',
    completed: true,
    type: 'video',
  },
  {
    id: '4',
    title: 'Functions and Scope',
    duration: '50 min',
    completed: false,
    type: 'video',
  },
  {
    id: '5',
    title: 'Arrays and Objects',
    duration: '30 min',
    completed: false,
    type: 'reading',
  },
  {
    id: '6',
    title: 'Quiz: Fundamentals Review',
    duration: '20 min',
    completed: false,
    type: 'quiz',
  },
];

export const classes: Class[] = [
  {
    id: '1',
    name: 'CS101',
    description: 'Introduction to Computer Science',
    instructor: 'Dr. Sarah Smith',
    instructorId: '1',
    semester: 'Fall',
    year: '2026',
    studentCount: 30,
    courseIds: ['1'],
    assignmentIds: ['2'],
    schedule: 'MWF 10:00 AM - 11:15 AM',
    room: 'A101',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
  },
  {
    id: '2',
    name: 'MATH201',
    description: 'Advanced Mathematics',
    instructor: 'Prof. John Davis',
    instructorId: '2',
    semester: 'Fall',
    year: '2026',
    studentCount: 25,
    courseIds: ['2'],
    assignmentIds: ['3'],
    schedule: 'TTh 11:00 AM - 12:15 PM',
    room: 'B201',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
  },
  {
    id: '3',
    name: 'WEB101',
    description: 'Web Development Fundamentals',
    instructor: 'Dr. Sarah Smith',
    instructorId: '1',
    semester: 'Fall',
    year: '2026',
    studentCount: 20,
    courseIds: ['3'],
    assignmentIds: ['1'],
    schedule: 'MWF 11:30 AM - 12:45 PM',
    room: 'A102',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400',
  },
  {
    id: '4',
    name: 'CS201',
    description: 'Data Structures & Algorithms',
    instructor: 'Prof. Michael Chen',
    instructorId: '3',
    semester: 'Fall',
    year: '2026',
    studentCount: 28,
    courseIds: ['4'],
    assignmentIds: ['4'],
    schedule: 'TTh 1:00 PM - 2:15 PM',
    room: 'B202',
    image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400',
  },
];

export const classStudents: ClassStudent[] = [
  {
    id: '1',
    classId: '1',
    studentName: 'Alice Johnson',
    studentEmail: 'alice.johnson@example.com',
    enrolledDate: '2026-08-15',
    attendance: 20,
    averageGrade: 95,
  },
  {
    id: '2',
    classId: '1',
    studentName: 'Bob Smith',
    studentEmail: 'bob.smith@example.com',
    enrolledDate: '2026-08-15',
    attendance: 18,
    averageGrade: 85,
  },
  {
    id: '3',
    classId: '1',
    studentName: 'Emma Wilson',
    studentEmail: 'emma.wilson@example.com',
    enrolledDate: '2026-08-15',
    attendance: 19,
    averageGrade: 88,
  },
  {
    id: '4',
    classId: '2',
    studentName: 'Charlie Brown',
    studentEmail: 'charlie.brown@example.com',
    enrolledDate: '2026-08-15',
    attendance: 22,
    averageGrade: 92,
  },
  {
    id: '5',
    classId: '2',
    studentName: 'David Wilson',
    studentEmail: 'david.wilson@example.com',
    enrolledDate: '2026-08-15',
    attendance: 21,
    averageGrade: 85,
  },
  {
    id: '6',
    classId: '2',
    studentName: 'Eva Martinez',
    studentEmail: 'eva.martinez@example.com',
    enrolledDate: '2026-08-15',
    attendance: 23,
    averageGrade: 90,
  },
  {
    id: '7',
    classId: '3',
    studentName: 'Frank Lee',
    studentEmail: 'frank.lee@example.com',
    enrolledDate: '2026-08-15',
    attendance: 17,
    averageGrade: 95,
  },
  {
    id: '8',
    classId: '3',
    studentName: 'Grace Taylor',
    studentEmail: 'grace.taylor@example.com',
    enrolledDate: '2026-08-15',
    attendance: 16,
    averageGrade: 88,
  },
  {
    id: '9',
    classId: '4',
    studentName: 'Henry Anderson',
    studentEmail: 'henry.anderson@example.com',
    enrolledDate: '2026-08-15',
    attendance: 24,
    averageGrade: 85,
  },
  {
    id: '10',
    classId: '4',
    studentName: 'Ivy Chen',
    studentEmail: 'ivy.chen@example.com',
    enrolledDate: '2026-08-15',
    attendance: 25,
    averageGrade: 94,
  },
];

export const students: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    studentId: 'S12345',
    department: 'Computer Science',
    enrolledYear: '2026',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    studentId: 'S12346',
    department: 'Computer Science',
    enrolledYear: '2026',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    studentId: 'S12347',
    department: 'Computer Science',
    enrolledYear: '2026',
  },
  {
    id: '4',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    studentId: 'S12348',
    department: 'Mathematics',
    enrolledYear: '2026',
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    studentId: 'S12349',
    department: 'Mathematics',
    enrolledYear: '2026',
  },
  {
    id: '6',
    name: 'Eva Martinez',
    email: 'eva.martinez@example.com',
    studentId: 'S12350',
    department: 'Mathematics',
    enrolledYear: '2026',
  },
  {
    id: '7',
    name: 'Frank Lee',
    email: 'frank.lee@example.com',
    studentId: 'S12351',
    department: 'Web Development',
    enrolledYear: '2026',
  },
  {
    id: '8',
    name: 'Grace Taylor',
    email: 'grace.taylor@example.com',
    studentId: 'S12352',
    department: 'Web Development',
    enrolledYear: '2026',
  },
  {
    id: '9',
    name: 'Henry Anderson',
    email: 'henry.anderson@example.com',
    studentId: 'S12353',
    department: 'Computer Science',
    enrolledYear: '2026',
  },
  {
    id: '10',
    name: 'Ivy Chen',
    email: 'ivy.chen@example.com',
    studentId: 'S12354',
    department: 'Computer Science',
    enrolledYear: '2026',
  },
];