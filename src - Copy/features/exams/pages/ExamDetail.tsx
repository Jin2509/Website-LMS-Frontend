import React, { useState, useEffect } from 'react';
import { Layout } from '@/shared/components/layout';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Label } from '@/shared/components/ui/label';
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  Calendar,
  CheckCircle,
  Users,
  Edit,
  Trash2,
  Play,
  AlertCircle,
  Trophy,
  BarChart3,
  Download,
  Eye
} from 'lucide-react';
import { getCurrentUser } from '@/features/auth/services/auth';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: number | string;
  points: number;
  order: number;
}

interface StudentResult {
  studentId: string;
  studentName: string;
  studentEmail: string;
  score: number;
  maxScore: number;
  percentage: number;
  submittedAt: string;
  duration: number; // minutes taken
  attempt: number;
}

interface ExamDetail {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  duration: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  totalQuestions: number;
  totalPoints: number;
  status: 'upcoming' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
  questions: Question[];
  results?: StudentResult[];
  studentAttempts?: number;
  studentBestScore?: number;
}

// Mock data
const mockExamDetail: ExamDetail = {
  id: '1',
  title: 'Kiểm tra giữa kỳ - React Fundamentals',
  description: 'Đánh giá kiến thức cơ bản về React, bao gồm components, hooks, và state management',
  courseId: 'react-basics',
  courseName: 'Lập trình React cơ bản',
  duration: 60,
  startDate: '2024-04-01',
  startTime: '08:00',
  endDate: '2024-04-15',
  endTime: '23:59',
  maxAttempts: 2,
  shuffleQuestions: true,
  showResults: true,
  totalQuestions: 20,
  totalPoints: 100,
  status: 'active',
  createdAt: '2024-03-25T10:00:00',
  updatedAt: '2024-03-25T10:00:00',
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'React Hook nào được sử dụng để quản lý state trong functional component?',
      options: ['useEffect', 'useState', 'useContext', 'useReducer'],
      correctAnswer: 1,
      points: 5,
      order: 1,
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question: 'Virtual DOM trong React là gì?',
      options: [
        'Một bản sao của DOM thật được lưu trong bộ nhớ',
        'Một thư viện để tạo DOM',
        'Một phương thức để xóa DOM',
        'Một cách để style DOM'
      ],
      correctAnswer: 0,
      points: 5,
      order: 2,
    },
    {
      id: 'q3',
      type: 'true-false',
      question: 'Props trong React có thể được thay đổi bởi component con.',
      correctAnswer: 'false',
      points: 5,
      order: 3,
    },
    {
      id: 'q4',
      type: 'multiple-choice',
      question: 'useEffect hook được sử dụng để làm gì?',
      options: [
        'Quản lý state',
        'Xử lý side effects',
        'Tạo context',
        'Render component'
      ],
      correctAnswer: 1,
      points: 5,
      order: 4,
    },
    {
      id: 'q5',
      type: 'essay',
      question: 'Giải thích sự khác biệt giữa controlled và uncontrolled components trong React. Cho ví dụ cụ thể.',
      points: 10,
      order: 5,
    },
    {
      id: 'q6',
      type: 'multiple-choice',
      question: 'JSX là gì?',
      options: [
        'Một ngôn ngữ lập trình mới',
        'Một extension syntax cho JavaScript',
        'Một thư viện CSS',
        'Một framework'
      ],
      correctAnswer: 1,
      points: 5,
      order: 6,
    },
    {
      id: 'q7',
      type: 'true-false',
      question: 'React components phải bắt đầu bằng chữ cái viết hoa.',
      correctAnswer: 'true',
      points: 5,
      order: 7,
    },
    {
      id: 'q8',
      type: 'multiple-choice',
      question: 'Làm thế nào để truyền dữ liệu từ component cha sang component con?',
      options: [
        'Sử dụng state',
        'Sử dụng props',
        'Sử dụng context',
        'Sử dụng refs'
      ],
      correctAnswer: 1,
      points: 5,
      order: 8,
    },
  ],
  results: [
    {
      studentId: 's1',
      studentName: 'Nguyễn Văn An',
      studentEmail: 'nguyenvanan@example.com',
      score: 85,
      maxScore: 100,
      percentage: 85,
      submittedAt: '2024-04-05T14:30:00',
      duration: 55,
      attempt: 1,
    },
    {
      studentId: 's2',
      studentName: 'Trần Thị Bình',
      studentEmail: 'tranthibinh@example.com',
      score: 92,
      maxScore: 100,
      percentage: 92,
      submittedAt: '2024-04-06T10:15:00',
      duration: 58,
      attempt: 1,
    },
    {
      studentId: 's3',
      studentName: 'Lê Hoàng Cường',
      studentEmail: 'lehoangcuong@example.com',
      score: 78,
      maxScore: 100,
      percentage: 78,
      submittedAt: '2024-04-07T16:45:00',
      duration: 60,
      attempt: 2,
    },
    {
      studentId: 's4',
      studentName: 'Phạm Thị Dung',
      studentEmail: 'phamthidung@example.com',
      score: 95,
      maxScore: 100,
      percentage: 95,
      submittedAt: '2024-04-08T09:20:00',
      duration: 52,
      attempt: 1,
    },
  ],
  studentAttempts: 1,
  studentBestScore: 85,
};

export default function ExamDetail() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const user = getCurrentUser();
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    // Simulate loading exam data
    setTimeout(() => {
      setExam(mockExamDetail);
      setLoading(false);
    }, 500);
  }, [examId]);

  const handleEdit = () => {
    navigate(`/teacher/exams/${examId}/edit`);
  };

  const handleDelete = () => {
    toast.success('Đã xóa kỳ thi thành công');
    navigate(-1);
  };

  const handleStartExam = () => {
    // Navigate to exam taking page
    navigate(`/student/exams/${examId}/take`);
  };

  const handleViewResult = (studentId: string) => {
    toast.info(`Xem bài làm của sinh viên ${studentId}`);
  };

  const handleExportResults = () => {
    toast.success('Đang xuất kết quả...');
  };

  const formatDateTime = (date: string, time: string) => {
    const d = new Date(date);
    return `${d.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })} ${time}`;
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return 'Trắc nghiệm';
      case 'true-false':
        return 'Đúng/Sai';
      case 'essay':
        return 'Tự luận';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Sắp tới</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Đang mở</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">Đã kết thúc</Badge>;
      default:
        return null;
    }
  };

  const calculateStats = () => {
    if (!exam?.results || exam.results.length === 0) {
      return {
        totalSubmissions: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0,
      };
    }

    const scores = exam.results.map(r => r.score);
    const passThreshold = exam.totalPoints * 0.5; // 50% to pass
    const passed = exam.results.filter(r => r.score >= passThreshold).length;

    return {
      totalSubmissions: exam.results.length,
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      passRate: Math.round((passed / exam.results.length) * 100),
    };
  };

  const stats = exam ? calculateStats() : null;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!exam) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Không tìm thấy kỳ thi</h2>
          <p className="text-gray-600 mb-6">Kỳ thi này không tồn tại hoặc đã bị xóa.</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>

          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {exam.title}
                </h1>
                {getStatusBadge(exam.status)}
              </div>
              <p className="text-gray-600 mt-1">{exam.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="gap-1">
                  <FileText className="w-3 h-3" />
                  {exam.courseName}
                </Badge>
              </div>
            </div>

            {isTeacher && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleEdit} className="gap-2">
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setDeleteDialogOpen(true)}
                  className="gap-2 text-red-600 hover:text-red-700 border-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </Button>
              </div>
            )}

            {isStudent && exam.status === 'active' && (
              <Button onClick={handleStartExam} className="gap-2">
                <Play className="w-4 h-4" />
                {exam.studentAttempts && exam.studentAttempts > 0 ? 'Làm lại' : 'Bắt đầu làm bài'}
              </Button>
            )}
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Thời gian</p>
                    <p className="font-semibold text-gray-900">{exam.duration} phút</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số câu hỏi</p>
                    <p className="font-semibold text-gray-900">{exam.totalQuestions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng điểm</p>
                    <p className="font-semibold text-gray-900">{exam.totalPoints}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số lần làm</p>
                    <p className="font-semibold text-gray-900">Tối đa {exam.maxAttempts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Student Score Card */}
        {isStudent && exam.studentBestScore !== undefined && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 mb-1">Điểm cao nhất của bạn</p>
                    <p className="text-3xl font-bold text-green-900">
                      {exam.studentBestScore}/{exam.totalPoints}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Số lần đã làm: {exam.studentAttempts}/{exam.maxAttempts}
                    </p>
                  </div>
                </div>
                {exam.studentAttempts! < exam.maxAttempts && exam.status === 'active' && (
                  <Button onClick={handleStartExam} className="gap-2">
                    <Play className="w-4 h-4" />
                    Làm lại để cải thiện điểm
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className={`grid w-full ${isTeacher ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="questions">Câu hỏi ({exam.questions.length})</TabsTrigger>
            {isTeacher && <TabsTrigger value="results">Kết quả ({exam.results?.length || 0})</TabsTrigger>}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Thông tin kỳ thi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Thời gian mở</Label>
                    <p className="text-gray-900 mt-1">{formatDateTime(exam.startDate, exam.startTime)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Thời gian đóng</Label>
                    <p className="text-gray-900 mt-1">{formatDateTime(exam.endDate, exam.endTime)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Thời gian làm bài</Label>
                    <p className="text-gray-900 mt-1">{exam.duration} phút</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Số lần làm tối đa</Label>
                    <p className="text-gray-900 mt-1">{exam.maxAttempts} lần</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Xáo trộn câu hỏi</Label>
                    <p className="text-gray-900 mt-1">{exam.shuffleQuestions ? 'Có' : 'Không'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Hiển thị kết quả</Label>
                    <p className="text-gray-900 mt-1">{exam.showResults ? 'Có' : 'Không'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics for Teachers */}
            {isTeacher && stats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Thống kê
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
                      <p className="text-sm text-indigo-700 mb-1">Đã nộp bài</p>
                      <p className="text-2xl font-bold text-indigo-900">{stats.totalSubmissions}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                      <p className="text-sm text-purple-700 mb-1">Điểm TB</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.averageScore}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <p className="text-sm text-green-700 mb-1">Cao nhất</p>
                      <p className="text-2xl font-bold text-green-900">{stats.highestScore}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                      <p className="text-sm text-orange-700 mb-1">Thấp nhất</p>
                      <p className="text-2xl font-bold text-orange-900">{stats.lowestScore}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                      <p className="text-sm text-pink-700 mb-1">Tỷ lệ đậu</p>
                      <p className="text-2xl font-bold text-pink-900">{stats.passRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Danh sách câu hỏi
                </CardTitle>
                <CardDescription>
                  Tổng cộng {exam.questions.length} câu hỏi - {exam.totalPoints} điểm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {exam.questions.sort((a, b) => a.order - b.order).map((question, index) => (
                    <div 
                      key={question.id} 
                      className="p-5 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-indigo-700">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline">
                              {getQuestionTypeLabel(question.type)}
                            </Badge>
                            <Badge className="bg-indigo-600">
                              {question.points} điểm
                            </Badge>
                          </div>
                          
                          <p className="text-gray-900 font-medium mb-3">
                            {question.question}
                          </p>

                          {question.type === 'multiple-choice' && question.options && (
                            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 mb-2">Các đáp án:</p>
                              {question.options.map((option, i) => (
                                <div 
                                  key={i} 
                                  className={`flex items-center gap-2 p-2 rounded ${
                                    i === question.correctAnswer 
                                      ? 'bg-green-50 border border-green-200' 
                                      : 'bg-white border border-gray-200'
                                  }`}
                                >
                                  {i === question.correctAnswer && (
                                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  )}
                                  <span className={`text-sm ${
                                    i === question.correctAnswer 
                                      ? 'text-green-900 font-medium' 
                                      : 'text-gray-700'
                                  }`}>
                                    {String.fromCharCode(65 + i)}. {option}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {question.type === 'true-false' && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 mb-2">Đáp án đúng:</p>
                              <Badge className={`${
                                question.correctAnswer === 'true' 
                                  ? 'bg-green-600' 
                                  : 'bg-red-600'
                              }`}>
                                {question.correctAnswer === 'true' ? 'Đúng' : 'Sai'}
                              </Badge>
                            </div>
                          )}

                          {question.type === 'essay' && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <p className="text-sm text-blue-800">
                                <strong>Câu hỏi tự luận</strong> - Sinh viên sẽ trả lời bằng văn bản tự do. 
                                Giáo viên cần chấm thủ công.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab (Teacher only) */}
          {isTeacher && (
            <TabsContent value="results">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Kết quả sinh viên
                      </CardTitle>
                      <CardDescription>
                        Danh sách bài làm đã nộp
                      </CardDescription>
                    </div>
                    {exam.results && exam.results.length > 0 && (
                      <Button variant="outline" onClick={handleExportResults} className="gap-2">
                        <Download className="w-4 h-4" />
                        Xuất kết quả
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!exam.results || exam.results.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Chưa có sinh viên nào nộp bài</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">STT</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Sinh viên</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Điểm</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">%</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Lần thứ</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Thời gian nộp</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Thời gian làm</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exam.results
                            .sort((a, b) => b.score - a.score)
                            .map((result, index) => (
                            <tr 
                              key={`${result.studentId}-${result.attempt}`} 
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-4 px-4 text-gray-900">{index + 1}</td>
                              <td className="py-4 px-4">
                                <div className="font-medium text-gray-900">{result.studentName}</div>
                              </td>
                              <td className="py-4 px-4 text-gray-600 text-sm">
                                {result.studentEmail}
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className={`font-bold ${
                                  result.percentage >= 80 ? 'text-green-600' :
                                  result.percentage >= 50 ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {result.score}/{result.maxScore}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <Badge 
                                  variant="outline"
                                  className={
                                    result.percentage >= 80 ? 'bg-green-50 text-green-700 border-green-300' :
                                    result.percentage >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-300' :
                                    'bg-red-50 text-red-700 border-red-300'
                                  }
                                >
                                  {result.percentage}%
                                </Badge>
                              </td>
                              <td className="py-4 px-4 text-center text-gray-600">
                                {result.attempt}
                              </td>
                              <td className="py-4 px-4 text-gray-600 text-sm">
                                {new Date(result.submittedAt).toLocaleString('vi-VN')}
                              </td>
                              <td className="py-4 px-4 text-center text-gray-600">
                                {result.duration} phút
                              </td>
                              <td className="py-4 px-4 text-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewResult(result.studentId)}
                                  className="gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  Xem
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa kỳ thi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa kỳ thi "{exam.title}"? 
              Hành động này không thể hoàn tác và sẽ xóa toàn bộ dữ liệu liên quan bao gồm kết quả của sinh viên.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa kỳ thi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}