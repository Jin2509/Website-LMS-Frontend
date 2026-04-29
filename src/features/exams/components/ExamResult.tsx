import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Award, CheckCircle, AlertCircle, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

interface ExamResultProps {
  examId: string;
  examTitle: string;
  score: number;
  totalPoints: number;
  essayPoints: number;
  duration: number;
  timeRemaining: number;
}

export function ExamResult({
  examId,
  examTitle,
  score,
  totalPoints,
  essayPoints,
  duration,
  timeRemaining
}: ExamResultProps) {
  const navigate = useNavigate();
  const percentage = Math.round((score / totalPoints) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return 'Xuất sắc!';
    if (percentage >= 50) return 'Khá tốt!';
    return 'Cần cố gắng hơn!';
  };

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="pt-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <Award className="w-10 h-10 text-green-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Đã nộp bài thành công!
              </h1>
              <p className="text-lg text-gray-600">{examTitle}</p>
            </div>

            <div className="py-8">
              <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>
                {score}/{totalPoints}
              </div>
              <p className="text-2xl font-semibold text-gray-700">{getScoreMessage()}</p>
              <p className="text-gray-600 mt-2">Điểm số: {percentage}%</p>
            </div>

            {essayPoints > 0 && (
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="font-semibold text-blue-900 mb-1">
                      Phần tự luận đang chờ chấm
                    </p>
                    <p className="text-sm text-blue-700">
                      Bài thi của bạn có {essayPoints} điểm từ câu hỏi tự luận cần được giáo viên chấm thủ công.
                      Điểm cuối cùng sẽ được cập nhật sau.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Hoàn thành lúc</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {new Date().toLocaleString('vi-VN')}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Thời gian làm bài</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {Math.floor((duration * 60 - timeRemaining) / 60)} phút
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => navigate(`/student/exams/${examId}`)}
              className="gap-2"
            >
              Xem chi tiết đề thi
            </Button>
            <Button
              onClick={() => navigate('/student/grades')}
              className="gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Xem điểm số
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
