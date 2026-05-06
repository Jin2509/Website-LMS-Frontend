import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { 
  BookOpen, 
  Video, 
  FileText, 
  CheckCircle, 
  PlayCircle, 
  File as FileIcon, 
  Download 
} from 'lucide-react';
import { Lesson, LessonFile } from '@/shared/data';

interface LessonContentProps {
  lesson: Lesson;
  onGoToAssignment?: (assignmentId: string) => void;
}

export function LessonContent({ lesson, onGoToAssignment }: LessonContentProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {lesson.type === 'video' && <Video className="w-5 h-5 text-indigo-600" />}
              {lesson.type === 'reading' && <BookOpen className="w-5 h-5 text-indigo-600" />}
              <Badge variant="outline">{lesson.type === 'video' ? 'Video' : 'Đọc'}</Badge>
            </div>
            <CardTitle className="text-2xl">{lesson.title}</CardTitle>
            <CardContent className="mt-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {lesson.duration}
            </CardContent>
          </div>
          <div className="flex gap-2">
            {lesson.assignmentId && onGoToAssignment && (
              <Button
                variant="outline"
                onClick={() => onGoToAssignment(lesson.assignmentId!)}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                Bài tập
              </Button>
            )}
            {!lesson.completed && (
              <Button>
                <CheckCircle className="w-4 h-4 mr-2" />
                Đánh dấu hoàn thành
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Video Player (Optional) */}
        {lesson.videoUrl && (
          <div className="mb-6 bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
            <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">Video bài học (tùy chọn)</p>
            <p className="text-sm text-gray-500">Video có thể được thêm vào nếu có</p>
          </div>
        )}

        {/* Lesson Content */}
        {lesson.content ? (
          <div 
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
            style={{
              lineHeight: '1.8',
            }}
          />
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center mb-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Nội dung bài học đang được cập nhật...</p>
          </div>
        )}

        {/* Downloadable Files */}
        {lesson.files && lesson.files.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileIcon className="w-5 h-5 text-indigo-600" />
              Tài liệu tham khảo ({lesson.files.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lesson.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}