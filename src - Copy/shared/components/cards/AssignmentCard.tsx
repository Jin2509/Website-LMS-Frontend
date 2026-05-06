import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Assignment } from '../../lib/data';
import { Calendar, FileText } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
  onView?: () => void;
  showCourse?: boolean;
}

export function AssignmentCard({ assignment, onView, showCourse = true }: AssignmentCardProps) {
  const getDaysUntilDue = (dueDate: string) => {
    return Math.ceil(
      (new Date(dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const daysLeft = getDaysUntilDue(assignment.dueDate);
  const isOverdue = daysLeft < 0 && assignment.status === 'pending';
  const isUrgent = daysLeft <= 3 && daysLeft >= 0 && assignment.status === 'pending';

  return (
    <Card className={`${isOverdue ? 'border-red-300 bg-red-50/50' : isUrgent ? 'border-orange-300 bg-orange-50/50' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {(isOverdue || isUrgent) && (
                <AlertCircle className={`w-4 h-4 ${isOverdue ? 'text-red-500' : 'text-orange-500'}`} />
              )}
              <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
            </div>
            {showCourse && (
              <p className="text-sm text-gray-600 mb-3">{assignment.course}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{assignment.dueDate}</span>
              </div>
              {assignment.status === 'pending' && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className={isOverdue ? 'text-red-600 font-medium' : isUrgent ? 'text-orange-600 font-medium' : ''}>
                    {isOverdue ? `Trễ ${Math.abs(daysLeft)} ngày` : `Còn ${daysLeft} ngày`}
                  </span>
                </div>
              )}
            </div>
          </div>
          <Badge 
            variant={
              assignment.status === 'graded' 
                ? 'default' 
                : assignment.status === 'submitted' 
                ? 'secondary' 
                : isOverdue 
                ? 'destructive' 
                : 'outline'
            }
          >
            {assignment.status === 'pending' && 'Chưa nộp'}
            {assignment.status === 'submitted' && 'Đã nộp'}
            {assignment.status === 'graded' && `Đã chấm - ${assignment.grade}%`}
          </Badge>
        </div>
        {onView && (
          <Button 
            variant={assignment.status === 'pending' ? 'default' : 'outline'}
            className="w-full"
            onClick={onView}
          >
            Xem chi tiết
          </Button>
        )}
      </CardContent>
    </Card>
  );
}