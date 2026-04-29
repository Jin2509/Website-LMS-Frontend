import { useState, useRef, ChangeEvent } from 'react';
import { Layout } from '@/shared/components/layout';
import { useParams, useNavigate } from 'react-router';
import { assignments as allAssignments } from '@/shared/data/data';
import {
  CourseHeader,
  LessonSidebar,
  LessonContent,
  LessonNavigation,
  CourseAssignmentsList,
  CourseExamsList,
} from './components';
import { courseMockData, lessonsMockData } from './data';
import { getCurrentUser } from '@/features/auth/services/auth';
import { toast } from 'sonner';

// Course detail page with lessons, assignments, and exams
export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<string>('lesson-1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user from auth
  const user = getCurrentUser();
  const userRole = user?.role || 'student';

  // Mock data
  const course = courseMockData(courseId);
  const lessons = lessonsMockData;

  const currentLesson = lessons.find(l => l.id === selectedLesson);
  
  // Filter assignments for this course
  const courseAssignments = allAssignments.filter(a => a.courseId === courseId);

  // Mock exams data
  const courseExams = [
    {
      id: 'exam-1',
      title: 'Kiểm tra giữa kỳ',
      description: 'Kiểm tra kiến thức về HTML, CSS và JavaScript cơ bản',
      duration: 90,
      totalQuestions: 30,
      totalPoints: 100,
      startDate: '2026-04-10T08:00:00',
      endDate: '2026-04-15T23:59:00',
      status: 'active' as const,
      studentStatus: 'not-started' as const,
      attempts: 0,
      maxAttempts: 2,
    },
    {
      id: 'exam-2',
      title: 'Kiểm tra cuối kỳ',
      description: 'Tổng hợp kiến thức toàn bộ khóa học',
      duration: 120,
      totalQuestions: 50,
      totalPoints: 100,
      startDate: '2026-05-01T08:00:00',
      endDate: '2026-05-05T23:59:00',
      status: 'upcoming' as const,
      studentStatus: 'not-started' as const,
      attempts: 0,
      maxAttempts: 1,
    },
  ];

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Uploaded files:', files);
      alert(`Đã tải lên ${files.length} tệp thành công!`);
    }
  };

  const handleEditCourse = () => {
    navigate(`/teacher/courses/edit/${courseId}`);
  };

  const handleGoToAssignment = (assignmentId: string) => {
    if (userRole === 'student') {
      navigate(`/student/assignments/${assignmentId}`);
    } else {
      navigate(`/teacher/assignments/${assignmentId}`);
    }
  };

  const handlePreviousLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson);
    if (currentIndex > 0) {
      setSelectedLesson(lessons[currentIndex - 1].id);
    }
  };

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson);
    if (currentIndex < lessons.length - 1) {
      setSelectedLesson(lessons[currentIndex + 1].id);
    }
  };

  const handleStartExam = (examId: string) => {
    if (userRole === 'student') {
      navigate(`/student/exams/${examId}`);
    } else {
      toast.info('Giáo viên không thể làm bài thi');
    }
  };

  const handleCreateExam = () => {
    navigate(`/teacher/courses/${courseId}/create-exam`);
  };

  const handleEditExam = (examId: string) => {
    navigate(`/teacher/courses/${courseId}/exams/${examId}/edit`);
  };

  const handleDeleteExam = (examId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa kỳ thi này?')) {
      toast.success('Đã xóa kỳ thi');
    }
  };

  if (!currentLesson) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-full">
        {/* Course Header */}
        <CourseHeader
          course={course}
          userRole={userRole}
          onEditCourse={handleEditCourse}
          onUploadFile={() => fileInputRef.current?.click()}
        />
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.zip,.txt"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lessons Sidebar */}
          <div className={`lg:col-span-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:w-16' : ''}`}>
            <LessonSidebar
              lessons={lessons}
              selectedLesson={selectedLesson}
              totalLessons={course.totalLessons}
              isCollapsed={isSidebarCollapsed}
              onSelectLesson={setSelectedLesson}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </div>

          {/* Lesson Content */}
          <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:col-span-4' : 'lg:col-span-3'}`}>
            <LessonContent
              lesson={currentLesson}
              onGoToAssignment={handleGoToAssignment}
            />

            {/* Lesson Navigation */}
            <LessonNavigation
              currentIndex={lessons.findIndex(l => l.id === selectedLesson)}
              totalLessons={lessons.length}
              onPrevious={handlePreviousLesson}
              onNext={handleNextLesson}
            />

            {/* Course Assignments Section */}
            <CourseAssignmentsList
              assignments={courseAssignments}
              onViewAssignment={handleGoToAssignment}
            />

            {/* Course Exams Section */}
            <CourseExamsList
              exams={courseExams}
              userRole={userRole}
              onStartExam={handleStartExam}
              onCreateExam={handleCreateExam}
              onEditExam={handleEditExam}
              onDeleteExam={handleDeleteExam}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}