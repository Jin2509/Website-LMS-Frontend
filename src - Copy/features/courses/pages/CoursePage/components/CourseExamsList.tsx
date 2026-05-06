import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { 
  FileText, 
  Clock, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  Play
} from 'lucide-react';
import { getCurrentUser } from '@/features/auth/services/auth';
import { useNavigate } from 'react-router';

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  totalQuestions: number;
  totalPoints: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  studentStatus?: 'not-started' | 'in-progress' | 'completed';
  studentScore?: number;
  attempts?: number;
  maxAttempts: number;
}

interface CourseExamsListProps {
  exams: Exam[];
  userRole: string;
  onStartExam: (examId: string) => void;
  onEditExam?: (examId: string) => void;
  onDeleteExam?: (examId: string) => void;
  onCreateExam?: () => void;
}

export function CourseExamsList({ 
  exams,
  userRole,
  onStartExam,
  onEditExam,
  onDeleteExam,
  onCreateExam
}: CourseExamsListProps) {
  const isTeacher = userRole === 'teacher';
  const navigate = useNavigate();

  const handleStartExam = (examId: string) => {
    navigate(`/student/exams/${examId}/take`);
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

  const getStudentStatusBadge = (studentStatus?: string) => {
    switch (studentStatus) {
      case 'not-started':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">Chưa làm</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Đang làm</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Đã hoàn thành</Badge>;
      default:
        return null;
    }
  };

  const canStartExam = (exam: Exam) => {
    if (isTeacher) return false;
    if (exam.status !== 'active') return false;
    if (exam.studentStatus === 'completed' && exam.attempts! >= exam.maxAttempts) return false;
    return true;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (exams.length === 0 && !isTeacher) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Kỳ thi
          </CardTitle>
          {isTeacher && onCreateExam && (
            <Button onClick={onCreateExam} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Tạo kỳ thi mới
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {exams.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Chưa có kỳ thi nào</p>
            {isTeacher && (
              <Button onClick={onCreateExam} variant="outline" className="mt-4 gap-2">
                <Plus className="w-4 h-4" />
                Tạo kỳ thi đầu tiên
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => (
              <div 
                key={exam.id}
                className="p-5 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 hover:text-indigo-600 cursor-pointer"
                        onClick={() => navigate(`/${userRole}/exams/${exam.id}`)}>
                        {exam.title}
                      </h3>
                      {getStatusBadge(exam.status)}
                      {!isTeacher && getStudentStatusBadge(exam.studentStatus)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{exam.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{exam.duration} phút</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span>{exam.totalQuestions} câu hỏi</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>{exam.totalPoints} điểm</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>Tối đa {exam.maxAttempts} lần</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Mở: {formatDate(exam.startDate)}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Đóng: {formatDate(exam.endDate)}</span>
                      </div>
                    </div>

                    {!isTeacher && exam.studentStatus === 'completed' && exam.studentScore !== undefined && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-800">
                            Điểm của bạn: <span className="text-lg font-bold">{exam.studentScore}/{exam.totalPoints}</span>
                          </span>
                          {exam.attempts && (
                            <span className="text-xs text-green-700">
                              Số lần làm: {exam.attempts}/{exam.maxAttempts}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/${userRole}/exams/${exam.id}`)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Chi tiết
                    </Button>
                    {isTeacher ? (
                      <>
                        {onEditExam && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditExam(exam.id)}
                            className="gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Sửa
                          </Button>
                        )}
                        {onDeleteExam && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteExam(exam.id)}
                            className="gap-2 text-red-600 hover:text-red-700 border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        {canStartExam(exam) && (
                          <Button
                            size="sm"
                            onClick={() => handleStartExam(exam.id)}
                            className="gap-2"
                          >
                            <Play className="w-4 h-4" />
                            {exam.studentStatus === 'in-progress' ? 'Tiếp tục' : 'Bắt đầu'}
                          </Button>
                        )}
                        {exam.status === 'active' && exam.studentStatus === 'completed' && exam.attempts! < exam.maxAttempts && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onStartExam(exam.id)}
                            className="gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Làm lại
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}