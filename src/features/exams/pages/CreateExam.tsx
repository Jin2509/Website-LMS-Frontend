import React, { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save,
  FileText,
  Clock,
  Calendar,
  CheckSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: number | string;
  points: number;
}

export default function CreateExam() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const [examInfo, setExamInfo] = useState({
    title: '',
    description: '',
    duration: 60,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    maxAttempts: 1,
    shuffleQuestions: false,
    showResults: true,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: Date.now().toString(),
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1,
  });

  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast.error('Vui lòng nhập nội dung câu hỏi');
      return;
    }

    if (currentQuestion.type === 'multiple-choice') {
      const validOptions = currentQuestion.options?.filter(opt => opt.trim() !== '');
      if (!validOptions || validOptions.length < 2) {
        toast.error('Câu hỏi trắc nghiệm phải có ít nhất 2 đáp án');
        return;
      }
    }

    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
    });
    toast.success('Đã thêm câu hỏi');
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast.success('Đã xóa câu hỏi');
  };

  const handleSaveExam = () => {
    if (!examInfo.title || !examInfo.description) {
      toast.error('Vui lòng điền đầy đủ thông tin kỳ thi');
      return;
    }

    if (!examInfo.startDate || !examInfo.startTime || !examInfo.endDate || !examInfo.endTime) {
      toast.error('Vui lòng chọn thời gian mở và đóng kỳ thi');
      return;
    }

    if (questions.length === 0) {
      toast.error('Kỳ thi phải có ít nhất 1 câu hỏi');
      return;
    }

    // Save exam logic here
    toast.success('Đã tạo kỳ thi thành công!');
    navigate(`/teacher/courses/${courseId}`);
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Tạo kỳ thi mới
          </h1>
          <p className="text-gray-600 mt-1">Thiết lập thông tin và câu hỏi cho kỳ thi</p>
        </div>

        {/* Exam Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Thông tin kỳ thi
            </CardTitle>
            <CardDescription>Cấu hình chi tiết cho kỳ thi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="title">Tên kỳ thi *</Label>
                <Input
                  id="title"
                  value={examInfo.title}
                  onChange={(e) => setExamInfo({ ...examInfo, title: e.target.value })}
                  placeholder="VD: Kiểm tra giữa kỳ"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Mô tả *</Label>
                <Textarea
                  id="description"
                  value={examInfo.description}
                  onChange={(e) => setExamInfo({ ...examInfo, description: e.target.value })}
                  placeholder="Mô tả nội dung và yêu cầu của kỳ thi..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Thời gian làm bài (phút) *
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={examInfo.duration}
                  onChange={(e) => setExamInfo({ ...examInfo, duration: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Số lần làm bài tối đa *</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  min="1"
                  max="5"
                  value={examInfo.maxAttempts}
                  onChange={(e) => setExamInfo({ ...examInfo, maxAttempts: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Ngày mở *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={examInfo.startDate}
                  onChange={(e) => setExamInfo({ ...examInfo, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Giờ mở *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={examInfo.startTime}
                  onChange={(e) => setExamInfo({ ...examInfo, startTime: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày đóng *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={examInfo.endDate}
                  onChange={(e) => setExamInfo({ ...examInfo, endDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Giờ đóng *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={examInfo.endTime}
                  onChange={(e) => setExamInfo({ ...examInfo, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="shuffleQuestions"
                  checked={examInfo.shuffleQuestions}
                  onChange={(e) => setExamInfo({ ...examInfo, shuffleQuestions: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="shuffleQuestions" className="cursor-pointer">
                  Xáo trộn thứ tự câu hỏi
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showResults"
                  checked={examInfo.showResults}
                  onChange={(e) => setExamInfo({ ...examInfo, showResults: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="showResults" className="cursor-pointer">
                  Hiển thị kết quả ngay sau khi làm xong
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Summary */}
        {questions.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Danh sách câu hỏi ({questions.length})</CardTitle>
                <Badge variant="outline" className="text-lg px-4 py-1">
                  Tổng điểm: {totalPoints}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div key={q.id} className="flex items-start gap-4 p-4 border rounded-lg hover:border-indigo-300 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-indigo-700">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {q.type === 'multiple-choice' ? 'Trắc nghiệm' : 
                           q.type === 'true-false' ? 'Đúng/Sai' : 'Tự luận'}
                        </Badge>
                        <Badge>{q.points} điểm</Badge>
                      </div>
                      <p className="text-gray-900 font-medium">{q.question}</p>
                      {q.type === 'multiple-choice' && q.options && (
                        <div className="mt-2 space-y-1">
                          {q.options.filter(opt => opt.trim()).map((opt, i) => (
                            <div key={i} className="text-sm text-gray-600 flex items-center gap-2">
                              {i === q.correctAnswer && <CheckSquare className="w-4 h-4 text-green-600" />}
                              <span className={i === q.correctAnswer ? 'text-green-700 font-medium' : ''}>
                                {String.fromCharCode(65 + i)}. {opt}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Thêm câu hỏi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="questionType">Loại câu hỏi</Label>
                <select
                  id="questionType"
                  value={currentQuestion.type}
                  onChange={(e) => setCurrentQuestion({ 
                    ...currentQuestion, 
                    type: e.target.value as any,
                    options: e.target.value === 'multiple-choice' ? ['', '', '', ''] : undefined,
                    correctAnswer: e.target.value === 'multiple-choice' ? 0 : '',
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="multiple-choice">Trắc nghiệm</option>
                  <option value="true-false">Đúng/Sai</option>
                  <option value="essay">Tự luận</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="points">Điểm</Label>
                <Input
                  id="points"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={currentQuestion.points}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Nội dung câu hỏi</Label>
              <Textarea
                id="question"
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                placeholder="Nhập nội dung câu hỏi..."
                rows={3}
              />
            </div>

            {currentQuestion.type === 'multiple-choice' && (
              <div className="space-y-3">
                <Label>Các đáp án</Label>
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={currentQuestion.correctAnswer === index}
                      onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                      className="w-4 h-4"
                    />
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(currentQuestion.options || [])];
                        newOptions[index] = e.target.value;
                        setCurrentQuestion({ ...currentQuestion, options: newOptions });
                      }}
                      placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-500">Chọn radio button để đánh dấu đáp án đúng</p>
              </div>
            )}

            {currentQuestion.type === 'true-false' && (
              <div className="space-y-2">
                <Label>Đáp án đúng</Label>
                <div className="flex gap-4">
                  <Button
                    variant={currentQuestion.correctAnswer === 'true' ? 'default' : 'outline'}
                    onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: 'true' })}
                  >
                    Đúng
                  </Button>
                  <Button
                    variant={currentQuestion.correctAnswer === 'false' ? 'default' : 'outline'}
                    onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: 'false' })}
                  >
                    Sai
                  </Button>
                </div>
              </div>
            )}

            <Button onClick={handleAddQuestion} className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Thêm câu hỏi
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3 justify-end mb-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Hủy
          </Button>
          <Button onClick={handleSaveExam} className="gap-2">
            <Save className="w-4 h-4" />
            Lưu kỳ thi
          </Button>
        </div>
      </div>
    </Layout>
  );
}