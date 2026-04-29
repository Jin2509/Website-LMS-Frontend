export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: number | string;
  points: number;
  order: number;
}

export interface Answer {
  questionId: string;
  answer?: number | string;
  essayFile?: File;
  essayFileName?: string;
}

export interface ExamData {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  totalPoints: number;
  questions: Question[];
  showResults: boolean;
}
