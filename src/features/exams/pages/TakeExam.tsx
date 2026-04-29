import React, { useState, useEffect } from 'react';
import { Layout } from '@/shared/components/layout';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const [exam, setExam] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Load exam data
  useEffect(() => {
    setTimeout(() => {
      setExam(mockExam);
      setLoading(false);
    }, 500);
  }, [examId]);

  // Auto-submit when time is up
  const handleTimeUp = () => {
    stopTimer();
    toast.warning('Hết thời gian! Bài thi đã được nộp tự động.');
    submitExam();
  };

  // Timer hook
  const { timeRemaining, formatTime, getTimeColor, stopTimer } = useExamTimer(
    exam?.duration || 60,
    handleTimeUp,
    !loading && !examFinished && !!exam
  );

  // Answers hook
  const {
    answers,
    handleAnswerChange,
    handleFileUpload,
    handleRemoveFile,
    isQuestionAnswered,
    getAnsweredCount
  } = useExamAnswers(exam?.questions || []);

  const submitExam = () => {
    if (!exam) return;

    setIsSubmitting(true);

    // Calculate score (only for auto-graded questions)
    let totalScore = 0;
    exam.questions.forEach(question => {
      if (question.type === 'essay') return;

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
      stopTimer();
      toast.success('Đã nộp bài thành công!');
    }, 1500);
  };

  const handleSubmitClick = () => {
    setShowSubmitDialog(true);
  };

  const handleConfirmSubmit = () => {
    submitExam();
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Loading state
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

  // Error state
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

  // Result state
  if (examFinished && score !== null) {
    const essayPoints = exam.questions
      .filter(q => q.type === 'essay')
      .reduce((sum, q) => sum + q.points, 0);

    return (
      <Layout>
        <ExamResult
          examId={exam.id}
          examTitle={exam.title}
          score={score}
          totalPoints={exam.totalPoints}
          essayPoints={essayPoints}
          duration={exam.duration}
          timeRemaining={timeRemaining}
        />
      </Layout>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  // Taking exam state
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
              <ExamTimer
                timeRemaining={timeRemaining}
                formatTime={formatTime}
                getTimeColor={getTimeColor}
              />
            </div>

            <ExamProgress
              answeredCount={getAnsweredCount()}
              totalQuestions={exam.questions.length}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question navigation sidebar */}
          <div className="lg:col-span-1">
            <QuestionNavigation
              questions={exam.questions}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={setCurrentQuestionIndex}
              isQuestionAnswered={isQuestionAnswered}
              onSubmitClick={handleSubmitClick}
            />
          </div>

          {/* Current question */}
          <div className="lg:col-span-3 space-y-6">
            <QuestionCard
              question={currentQuestion}
              index={currentQuestionIndex}
              answer={currentAnswer}
              onAnswerChange={handleAnswerChange}
              onFileUpload={handleFileUpload}
              onRemoveFile={handleRemoveFile}
            />

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Câu trước
              </Button>

              <span className="text-sm text-gray-600">
                Câu {currentQuestionIndex + 1} / {exam.questions.length}
              </span>

              <Button
                variant="outline"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === exam.questions.length - 1}
                className="gap-2"
              >
                Câu tiếp
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirmation dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận nộp bài</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn đã trả lời {getAnsweredCount()}/{exam.questions.length} câu hỏi.
              Bạn có chắc chắn muốn nộp bài không? Bạn sẽ không thể chỉnh sửa câu trả lời sau khi nộp.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
