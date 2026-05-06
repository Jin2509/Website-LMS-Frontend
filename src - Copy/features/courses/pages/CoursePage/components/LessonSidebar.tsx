import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { BookOpen, CheckCircle, Circle, Lock, Video, Clock, ChevronRight, PanelLeft, PanelLeftClose } from 'lucide-react';
import { Lesson } from '@/shared/data';

interface LessonSidebarProps {
  lessons: Lesson[];
  selectedLesson: string;
  totalLessons: number;
  isCollapsed: boolean;
  onSelectLesson: (lessonId: string) => void;
  onToggleCollapse: () => void;
}

export function LessonSidebar({ 
  lessons, 
  selectedLesson, 
  totalLessons,
  isCollapsed,
  onSelectLesson,
  onToggleCollapse
}: LessonSidebarProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        {!isCollapsed && (
          <div>
            <CardTitle className="text-lg">Nội dung khóa học</CardTitle>
            <CardDescription>{totalLessons} bài học</CardDescription>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </Button>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="p-0">
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => !lesson.locked && onSelectLesson(lesson.id)}
                disabled={lesson.locked}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedLesson === lesson.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''
                } ${lesson.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {lesson.locked ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : lesson.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500">Bài {index + 1}</span>
                      {lesson.type === 'video' && <Video className="w-3 h-3 text-gray-400" />}
                      {lesson.type === 'reading' && <BookOpen className="w-3 h-3 text-gray-400" />}
                    </div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {lesson.title}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {lesson.duration}
                    </div>
                  </div>
                  {selectedLesson === lesson.id && (
                    <ChevronRight className="w-4 h-4 text-indigo-600 mt-2" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}