import { useState } from 'react';
import { Answer, Question } from '../types';
import { toast } from 'sonner';

export function useExamAnswers(questions: Question[]) {
  const [answers, setAnswers] = useState<Answer[]>(() =>
    questions.map(q => ({ questionId: q.id }))
  );

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

  const isQuestionAnswered = (questionId: string) => {
    const answer = answers.find(a => a.questionId === questionId);
    return answer?.answer !== undefined || answer?.essayFile !== undefined;
  };

  const getAnsweredCount = () => {
    return answers.filter(a => a.answer !== undefined || a.essayFile !== undefined).length;
  };

  return {
    answers,
    handleAnswerChange,
    handleFileUpload,
    handleRemoveFile,
    isQuestionAnswered,
    getAnsweredCount
  };
}
