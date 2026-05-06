import React from 'react';
import { Clock } from 'lucide-react';

interface ExamTimerProps {
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  getTimeColor: () => string;
}

export function ExamTimer({ timeRemaining, formatTime, getTimeColor }: ExamTimerProps) {
  return (
    <div className="text-right">
      <div className={`text-3xl font-bold ${getTimeColor()} mb-1`}>
        {formatTime(timeRemaining)}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="w-4 h-4" />
        <span>Thời gian còn lại</span>
      </div>
    </div>
  );
}
