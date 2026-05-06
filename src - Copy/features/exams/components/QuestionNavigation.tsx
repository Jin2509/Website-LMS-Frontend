import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: number | string;
  points: number;
  order: number;
}

interface QuestionNavigationProps {
  questions: Question[];
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  isQuestionAnswered: (questionId: string) => boolean;
  onSubmitClick: () => void;
}

export function QuestionNavigation({
  questions,
  currentQuestionIndex,
  onQuestionSelect,
  isQuestionAnswered,
  onSubmitClick
}: QuestionNavigationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Danh sách câu hỏi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
          {questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => onQuestionSelect(index)}
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
          onClick={onSubmitClick}
          className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          Nộp bài
        </Button>
      </CardContent>
    </Card>
  );
}
