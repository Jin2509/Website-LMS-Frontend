import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { FileText, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Assignment } from '@/shared/data';

interface CourseAssignmentsListProps {
  assignments: Assignment[];
  onViewAssignment: (assignmentId: string) => void;
}

export function CourseAssignmentsList({ assignments, onViewAssignment }: CourseAssignmentsListProps) {
  if (assignments.length === 0) {
    return null;
  }

  const getDaysUntilDue = (dueDate: string) => {
    return Math.ceil(
      (new Date(dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <CardTitle>Bài tập khóa học</CardTitle>
        </div>
        <CardDescription>
          Danh sách bài tập của khóa học này ({assignments.length})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assignments.map((assignment) => {
            const daysLeft = getDaysUntilDue(assignment.dueDate);
            const isUrgent = daysLeft <= 3 && assignment.status === 'pending';

            return (
              <div
                key={assignment.id}
                className={`p-4 border rounded-lg hover:border-indigo-300 transition-colors ${
                  isUrgent ? 'border-red-200 bg-red-50/50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {isUrgent && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                      <h4 className="font-semibold text-gray-900 truncate">
                        {assignment.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Hạn: {assignment.dueDate}</span>
                      </div>
                      {assignment.status === 'pending' && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className={isUrgent ? 'text-red-600 font-medium' : 'text-gray-600'}>
                            Còn {daysLeft} ngày
                          </span>
                        </div>
                      )}
                      <Badge 
                        variant={
                          assignment.status === 'graded' 
                            ? 'default' 
                            : assignment.status === 'submitted' 
                            ? 'secondary' 
                            : isUrgent 
                            ? 'destructive' 
                            : 'outline'
                        }
                      >
                        {assignment.status === 'pending' && 'Chưa nộp'}
                        {assignment.status === 'submitted' && 'Đã nộp'}
                        {assignment.status === 'graded' && `Đã chấm - ${assignment.grade}%`}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewAssignment(assignment.id)}
                    className="gap-1 flex-shrink-0"
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}