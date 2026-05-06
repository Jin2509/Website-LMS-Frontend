import React from 'react';
import { Progress } from '@/shared/components/ui/progress';

interface ExamProgressProps {
  answeredCount: number;
  totalQuestions: number;
}

export function ExamProgress({ answeredCount, totalQuestions }: ExamProgressProps) {
  const percentage = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-700">
          Tiến độ: {answeredCount}/{totalQuestions} câu
        </span>
        <span className="text-gray-700">
          {percentage}%
        </span>
      </div>
      <Progress
        value={(answeredCount / totalQuestions) * 100}
        className="h-2"
      />
    </div>
  );
}
