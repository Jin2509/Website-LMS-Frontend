import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { FileText, Clock, Calendar, Users, CheckCircle } from 'lucide-react';

interface ExamInfoProps {
  exam: {
    title: string;
    description: string;
    courseName: string;
    duration: number;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    maxAttempts: number;
    totalQuestions: number;
    totalPoints: number;
    status: 'upcoming' | 'active' | 'completed';
    showResults: boolean;
    shuffleQuestions: boolean;
  };
}

export function ExamInfo({ exam }: ExamInfoProps) {
  const getStatusBadge = () => {
    switch (exam.status) {
      case 'upcoming':
        return <Badge variant="secondary">Sắp diễn ra</Badge>;
      case 'active':
        return <Badge className="bg-green-600">Đang mở</Badge>;
      case 'completed':
        return <Badge variant="outline">Đã kết thúc</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.title}</h1>
            <p className="text-gray-600 mb-3">{exam.description}</p>
            <p className="text-sm text-indigo-600 font-medium">Môn học: {exam.courseName}</p>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Thời gian</span>
            </div>
            <p className="font-semibold text-gray-900">{exam.duration} phút</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-sm">Số câu hỏi</span>
            </div>
            <p className="font-semibold text-gray-900">{exam.totalQuestions}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Tổng điểm</span>
            </div>
            <p className="font-semibold text-gray-900">{exam.totalPoints}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">Số lần thi</span>
            </div>
            <p className="font-semibold text-gray-900">{exam.maxAttempts}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">Bắt đầu:</span>
              <span className="font-semibold text-gray-900">
                {new Date(`${exam.startDate} ${exam.startTime}`).toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">Kết thúc:</span>
              <span className="font-semibold text-gray-900">
                {new Date(`${exam.endDate} ${exam.endTime}`).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {exam.shuffleQuestions && (
            <Badge variant="outline" className="text-xs">
              🔀 Câu hỏi được xáo trộn
            </Badge>
          )}
          {exam.showResults && (
            <Badge variant="outline" className="text-xs">
              👁️ Hiển thị kết quả ngay
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
