import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Course } from '../../lib/data';
import { BookOpen } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <CardDescription className="mb-2">{course.category}</CardDescription>
        <CardTitle className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {course.title}
        </CardTitle>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span>👨‍🏫 {course.instructor}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <BookOpen className="w-4 h-4" />
          <span>{course.completedLessons} / {course.totalLessons} bài học</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tiến độ</span>
            <span className="font-medium text-gray-900">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}