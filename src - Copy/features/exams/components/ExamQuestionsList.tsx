import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { CheckCircle, Circle, Eye } from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: number | string;
  points: number;
  order: number;
}

interface ExamQuestionsListProps {
  questions: Question[];
  showAnswers?: boolean;
}

export function ExamQuestionsList({ questions, showAnswers = false }: ExamQuestionsListProps) {
  const getQuestionTypeBadge = (type: Question['type']) => {
    switch (type) {
      case 'multiple-choice':
        return <Badge variant="default">Trắc nghiệm</Badge>;
      case 'true-false':
        return <Badge variant="secondary">Đúng/Sai</Badge>;
      case 'essay':
        return <Badge variant="outline">Tự luận</Badge>;
    }
  };

  const renderAnswer = (question: Question) => {
    if (!showAnswers || !question.correctAnswer) return null;

    return (
      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-1">
          <CheckCircle className="w-4 h-4" />
          <span>Đáp án đúng:</span>
        </div>
        {question.type === 'multiple-choice' && question.options && (
          <p className="text-green-900 ml-6">
            {question.options[question.correctAnswer as number]}
          </p>
        )}
        {question.type === 'true-false' && (
          <p className="text-green-900 ml-6">
            {question.correctAnswer === 'true' ? 'Đúng' : 'Sai'}
          </p>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Danh sách câu hỏi ({questions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-indigo-600">Câu {index + 1}</span>
                {getQuestionTypeBadge(question.type)}
              </div>
              <Badge variant="outline">{question.points} điểm</Badge>
            </div>

            <p className="text-gray-900 leading-relaxed mb-3">{question.question}</p>

            {question.type === 'multiple-choice' && question.options && (
              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`flex items-center gap-2 p-2 rounded ${
                      showAnswers && question.correctAnswer === optIndex
                        ? 'bg-green-50 border border-green-300'
                        : 'bg-gray-50'
                    }`}
                  >
                    {showAnswers && question.correctAnswer === optIndex ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={showAnswers && question.correctAnswer === optIndex ? 'font-medium text-green-900' : 'text-gray-700'}>
                      {option}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'true-false' && (
              <div className="space-y-2">
                {['true', 'false'].map((option) => (
                  <div
                    key={option}
                    className={`flex items-center gap-2 p-2 rounded ${
                      showAnswers && question.correctAnswer === option
                        ? 'bg-green-50 border border-green-300'
                        : 'bg-gray-50'
                    }`}
                  >
                    {showAnswers && question.correctAnswer === option ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={showAnswers && question.correctAnswer === option ? 'font-medium text-green-900' : 'text-gray-700'}>
                      {option === 'true' ? 'Đúng' : 'Sai'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'essay' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                Câu hỏi tự luận - Yêu cầu chấm thủ công
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
