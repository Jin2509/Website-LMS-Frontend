import React, { useState, useEffect } from 'react';
import { Layout } from '@/shared/components/layout';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
import {
  ExamTimer,
  ExamProgress,
  QuestionNavigation,
  QuestionCard,
  ExamResult
} from '../components';
import { useExamTimer, useExamAnswers } from '../hooks';
import { ExamData } from '../types';
import { mockExam } from '../data';

export default function TakeExam() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const user = getCurrentUser();
  
  const [exam, setExam] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load exam data
    setTimeout(() => {
      setExam(mockExam);
      setTimeRemaining(mockExam.duration * 60); // Convert to seconds
      setLoading(false);
      
      // Initialize answers array
      const initialAnswers: Answer[] = mockExam.questions.map(q => ({
        questionId: q.id,
      }));
      setAnswers(initialAnswers);
    }, 500);
  }, [examId]);

  // Timer countdown
  useEffect(() => {
    if (!exam || loading || examFinished) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - auto submit
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [exam, loading, examFinished]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / (exam!.duration * 60)) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAnswerChange = (questionId: string, answer: number | string) => {
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId 
          ? { ...a, answer } 
          : a
      )
    );
  };

  const handleFileUpload = (questionId: string, file: File) => {
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId 
          ? { ...a, essayFile: file, essayFileName: file.name } 
          : a
      )
    );
    toast.success(`Đã tải lên file: ${file.name}`);
  };

  const handleRemoveFile = (questionId: string) => {
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId 
          ? { ...a, essayFile: undefined, essayFileName: undefined } 
          : a
      )
    );
    toast.success('Đã xóa file');
  };

  const handleAutoSubmit = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    toast.warning('Hết thời gian! Bài thi đã được nộp tự động.');
    submitExam();
  };

  const handleSubmitClick = () => {
    setShowSubmitDialog(true);
  };

  const submitExam = () => {
    setIsSubmitting(true);
    
    // Calculate score (only for auto-graded questions)
    let totalScore = 0;
    let maxAutoScore = 0;

    exam!.questions.forEach(question => {
      if (question.type === 'essay') return; // Skip essay questions
      
      maxAutoScore += question.points;
      const answer = answers.find(a => a.questionId === question.id);
      
      if (answer && answer.answer === question.correctAnswer) {
        totalScore += question.points;
      }
    });

    setTimeout(() => {
      setScore(totalScore);
      setExamFinished(true);
      setIsSubmitting(false);
      setShowSubmitDialog(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      toast.success('Đã nộp bài thành công!');
    }, 1500);
  };

  const getAnsweredCount = () => {
    return answers.filter(a => 
      a.answer !== undefined || a.essayFile !== undefined
    ).length;
  };

  const isQuestionAnswered = (questionId: string) => {
    const answer = answers.find(a => a.questionId === questionId);
    return answer && (answer.answer !== undefined || answer.essayFile !== undefined);
  };

  const currentQuestion = exam?.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải đề thi...</p>
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Không tìm thấy đề thi</h2>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </Layout>
    );
  }

  // Exam finished - show results
  if (examFinished && score !== null) {
    const percentage = Math.round((score / exam.totalPoints) * 100);
    const autoGradedPoints = exam.questions
      .filter(q => q.type !== 'essay')
      .reduce((sum, q) => sum + q.points, 0);
    const essayPoints = exam.questions
      .filter(q => q.type === 'essay')
      .reduce((sum, q) => sum + q.points, 0);

    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Đã nộp bài thành công!
              </h1>
              <p className="text-gray-600 mb-8">Cảm ơn bạn đã hoàn thành bài thi</p>

              {exam.showResults && (
                <div className="max-w-md mx-auto space-y-6">
                  <div className="p-8 bg-white rounded-xl shadow-lg border-2 border-green-200">
                    <p className="text-sm text-gray-600 mb-2">Điểm của bạn (phần tự động chấm)</p>
                    <p className="text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                      {score}/{autoGradedPoints}
                    </p>
                    <p className="text-2xl font-semibold text-gray-700">
                      {Math.round((score / autoGradedPoints) * 100)}%
                    </p>
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
                        {Math.floor((exam.duration * 60 - timeRemaining) / 60)} phút
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
      </Layout>
    );
  }

  // Taking exam
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header with timer and progress */}
        <Card className="mb-6 border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{exam.title}</h1>
                <p className="text-gray-600 text-sm">{exam.description}</p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getTimeColor()} mb-1`}>
                  {formatTime(timeRemaining)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Thời gian còn lại</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  Tiến độ: {getAnsweredCount()}/{exam.questions.length} câu
                </span>
                <span className="text-gray-700">
                  {Math.round((getAnsweredCount() / exam.questions.length) * 100)}%
                </span>
              </div>
              <Progress 
                value={(getAnsweredCount() / exam.questions.length) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question navigation sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Danh sách câu hỏi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                  {exam.questions.map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`
                        w-full aspect-square rounded-lg font-semibold text-sm
                        transition-all duration-200
                        ${currentQuestionIndex === index
                          ? 'bg-indigo-600 text-white shadow-lg scale-110'
                          : isQuestionAnswered(question.id)
                          ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
                        }
                      `}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-indigo-600"></div>
                    <span className="text-gray-600">Câu hiện tại</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-300"></div>
                    <span className="text-gray-600">Đã trả lời</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-300"></div>
                    <span className="text-gray-600">Chưa trả lời</span>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmitClick}
                  className="w-full mt-6 gap-2"
                  variant="default"
                >
                  <Send className="w-4 h-4" />
                  Nộp bài
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Current question */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-indigo-700">
                          {currentQuestionIndex + 1}
                        </span>
                      </div>
                      <div>
                        <Badge variant="outline">
                          {currentQuestion?.type === 'multiple-choice' ? 'Trắc nghiệm' :
                           currentQuestion?.type === 'true-false' ? 'Đúng/Sai' : 'Tự luận'}
                        </Badge>
                        <Badge className="ml-2 bg-indigo-600">
                          {currentQuestion?.points} điểm
                        </Badge>
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {currentQuestion?.question}
                    </h2>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Multiple choice */}
                {currentQuestion?.type === 'multiple-choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerChange(currentQuestion.id, index)}
                        className={`
                          w-full p-4 rounded-lg border-2 text-left transition-all
                          ${currentAnswer?.answer === index
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                            ${currentAnswer?.answer === index
                              ? 'border-indigo-500 bg-indigo-500'
                              : 'border-gray-300'
                            }
                          `}>
                            {currentAnswer?.answer === index && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className={`flex-1 ${
                            currentAnswer?.answer === index 
                              ? 'font-semibold text-gray-900' 
                              : 'text-gray-700'
                          }`}>
                            {String.fromCharCode(65 + index)}. {option}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* True/False */}
                {currentQuestion?.type === 'true-false' && (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAnswerChange(currentQuestion.id, 'true')}
                      className={`
                        w-full p-4 rounded-lg border-2 text-left transition-all
                        ${currentAnswer?.answer === 'true'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          ${currentAnswer?.answer === 'true'
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                          }
                        `}>
                          {currentAnswer?.answer === 'true' && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className={`flex-1 text-lg ${
                          currentAnswer?.answer === 'true' 
                            ? 'font-semibold text-gray-900' 
                            : 'text-gray-700'
                        }`}>
                          Đúng
                        </span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleAnswerChange(currentQuestion.id, 'false')}
                      className={`
                        w-full p-4 rounded-lg border-2 text-left transition-all
                        ${currentAnswer?.answer === 'false'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          ${currentAnswer?.answer === 'false'
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                          }
                        `}>
                          {currentAnswer?.answer === 'false' && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className={`flex-1 text-lg ${
                          currentAnswer?.answer === 'false' 
                            ? 'font-semibold text-gray-900' 
                            : 'text-gray-700'
                        }`}>
                          Sai
                        </span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Essay - File upload */}
                {currentQuestion?.type === 'essay' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Câu hỏi tự luận:</strong> Vui lòng upload file trả lời của bạn 
                        (hỗ trợ .pdf, .doc, .docx, .txt). Kích thước tối đa: 10MB
                      </p>
                    </div>

                    {currentAnswer?.essayFileName ? (
                      <div className="p-4 border-2 border-green-300 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {currentAnswer.essayFileName}
                              </p>
                              <p className="text-sm text-green-700">Đã tải lên thành công</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(currentQuestion.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-700 font-medium mb-2">
                          Tải lên file trả lời
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Kéo thả file hoặc click để chọn
                        </p>
                        <FileUploadButton
                          onUpload={(files) => {
                            if (files.length > 0) {
                              handleFileUpload(currentQuestion.id, files[0]);
                            }
                          }}
                          accept=".pdf,.doc,.docx,.txt"
                          maxSize={10}
                          multiple={false}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Câu trước
                  </Button>

                  {currentQuestionIndex === exam.questions.length - 1 ? (
                    <Button
                      onClick={handleSubmitClick}
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Nộp bài
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestionIndex(prev => 
                        Math.min(exam.questions.length - 1, prev + 1)
                      )}
                      className="gap-2"
                    >
                      Câu tiếp theo
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit confirmation dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận nộp bài</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3">
                <p>Bạn có chắc chắn muốn nộp bài không?</p>
                
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tổng số câu:</span>
                    <span className="font-semibold">{exam.questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Đã trả lời:</span>
                    <span className="font-semibold text-green-600">{getAnsweredCount()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Chưa trả lời:</span>
                    <span className="font-semibold text-red-600">
                      {exam.questions.length - getAnsweredCount()}
                    </span>
                  </div>
                </div>

                {getAnsweredCount() < exam.questions.length && (
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      Bạn còn {exam.questions.length - getAnsweredCount()} câu chưa trả lời. 
                      Các câu này sẽ không được tính điểm.
                    </p>
                  </div>
                )}

                <p className="text-sm text-gray-600">
                  Sau khi nộp bài, bn sẽ không thể chỉnh sửa câu trả lời.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Kiểm tra lại</AlertDialogCancel>
            <AlertDialogAction 
              onClick={submitExam}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}