import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LessonNavigationProps {
  currentIndex: number;
  totalLessons: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function LessonNavigation({ 
  currentIndex, 
  totalLessons, 
  onPrevious, 
  onNext 
}: LessonNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t">
      <Button 
        variant="outline" 
        disabled={currentIndex === 0}
        onClick={onPrevious}
        className="gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Bài trước
      </Button>
      <Button 
        disabled={currentIndex === totalLessons - 1}
        onClick={onNext}
        className="gap-2"
      >
        Bài tiếp theo
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}