import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { FileUploadButton } from '@/shared/components/forms/FileUploadButton';
import { Upload, X } from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: number | string;
  points: number;
  order: number;
}

interface Answer {
  questionId: string;
  answer?: number | string;
  essayFile?: File;
  essayFileName?: string;
}

interface QuestionCardProps {
  question: Question;
  index: number;
  answer: Answer | undefined;
  onAnswerChange: (questionId: string, answer: number | string) => void;
  onFileUpload: (questionId: string, file: File) => void;
  onRemoveFile: (questionId: string) => void;
}

export function QuestionCard({
  question,
  index,
  answer,
  onAnswerChange,
  onFileUpload,
  onRemoveFile
}: QuestionCardProps) {
  const getQuestionTypeBadge = () => {
    switch (question.type) {
      case 'multiple-choice':
        return <Badge variant="default">Trắc nghiệm</Badge>;
      case 'true-false':
        return <Badge variant="secondary">Đúng/Sai</Badge>;
      case 'essay':
        return <Badge variant="outline">Tự luận</Badge>;
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg font-bold text-indigo-600">Câu {index + 1}</span>
              {getQuestionTypeBadge()}
              <Badge variant="outline" className="ml-auto">
                {question.points} điểm
              </Badge>
            </div>
            <p className="text-gray-900 text-lg leading-relaxed">{question.question}</p>
          </div>
        </div>

        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-3 mt-6">
            {question.options.map((option, optIndex) => (
              <label
                key={optIndex}
                className={`
                  flex items-center p-4 rounded-lg border-2 cursor-pointer
                  transition-all duration-200
                  ${answer?.answer === optIndex
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={answer?.answer === optIndex}
                  onChange={() => onAnswerChange(question.id, optIndex)}
                  className="w-5 h-5 text-indigo-600"
                />
                <span className="ml-3 text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'true-false' && (
          <div className="space-y-3 mt-6">
            {['true', 'false'].map((option) => (
              <label
                key={option}
                className={`
                  flex items-center p-4 rounded-lg border-2 cursor-pointer
                  transition-all duration-200
                  ${answer?.answer === option
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={answer?.answer === option}
                  onChange={() => onAnswerChange(question.id, option)}
                  className="w-5 h-5 text-indigo-600"
                />
                <span className="ml-3 text-gray-900">
                  {option === 'true' ? 'Đúng' : 'Sai'}
                </span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'essay' && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tải lên file bài làm
              </label>

              {!answer?.essayFileName ? (
                <FileUploadButton
                  onFileSelect={(file) => onFileUpload(question.id, file)}
                  accept=".pdf,.doc,.docx,.txt"
                  label="Chọn file để tải lên"
                  icon={Upload}
                />
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">{answer.essayFileName}</p>
                      <p className="text-sm text-green-700">File đã tải lên thành công</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(question.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hoặc nhập câu trả lời (không bắt buộc)
              </label>
              <Textarea
                value={(answer?.answer as string) || ''}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                placeholder="Nhập câu trả lời của bạn..."
                rows={6}
                className="resize-none"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
