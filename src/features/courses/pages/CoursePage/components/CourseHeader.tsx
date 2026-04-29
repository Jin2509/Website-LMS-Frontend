import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { Clock, User, Edit, Upload } from 'lucide-react';

interface CourseHeaderProps {
  course: {
    id: string | undefined;
    title: string;
    instructor: string;
    description: string;
    category: string;
    image: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
  };
  userRole: string;
  onEditCourse: () => void;
  onUploadFile: () => void;
}

export function CourseHeader({ course, userRole, onEditCourse, onUploadFile }: CourseHeaderProps) {
  return (
    <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
      <div className="flex items-start gap-4">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-32 h-32 rounded-lg object-cover"
        />
        <div className="flex-1">
          <Badge className="bg-white/20 text-white mb-2">{course.category}</Badge>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-white/90 mb-3">{course.description}</p>
          <div className="flex items-center gap-6 text-sm">
            <span>👨‍🏫 {course.instructor}</span>
            <span>📚 {course.totalLessons} bài học</span>
            <span>✅ {course.completedLessons} đã hoàn thành</span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Tiến độ khóa học</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2 bg-white/20" />
          </div>
        </div>
        {userRole === 'teacher' && (
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              className="gap-2"
              onClick={onEditCourse}
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </Button>
            <Button 
              variant="secondary" 
              className="gap-2"
              onClick={onUploadFile}
            >
              <Upload className="w-4 h-4" />
              Thêm tài liệu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}