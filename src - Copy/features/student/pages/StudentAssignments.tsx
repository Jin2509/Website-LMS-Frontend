import { useState, ChangeEvent } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { assignments } from '@/shared/data';
import { Calendar, Clock, FileText, CheckCircle, AlertCircle, ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';

export default function StudentAssignments() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const submittedAssignments = assignments.filter(a => a.status === 'submitted');
  const gradedAssignments = assignments.filter(a => a.status === 'graded');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile && !submissionText) {
      toast.error('Vui lòng tải lên tệp hoặc nhập nội dung bài làm');
      return;
    }
    
    toast.success('Nộp bài thành công!');
    setIsDialogOpen(false);
    setSelectedFile(null);
    setSubmissionText('');
  };

  const getDaysUntilDue = (dueDate: string) => {
    return Math.ceil(
      (new Date(dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-[#547A95] bg-clip-text text-transparent mb-2">
            Bài tập
          </h1>
          <p className="text-gray-600 mt-1">Theo dõi và nộp bài tập của bạn</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chưa nộp</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {pendingAssignments.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã nộp</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {submittedAssignments.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã chấm điểm</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {gradedAssignments.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Chưa nộp ({pendingAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="submitted">
              Đã nộp ({submittedAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="graded">
              Đã chấm ({gradedAssignments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingAssignments.map((assignment) => {
              const daysLeft = getDaysUntilDue(assignment.dueDate);
              const isUrgent = daysLeft <= 3;

              return (
                <Card
                  key={assignment.id}
                  className={isUrgent ? "border-red-200 bg-red-50/50" : ""}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          {isUrgent && (
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {assignment.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {assignment.course}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Hạn nộp: {assignment.dueDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span
                              className={
                                isUrgent
                                  ? "text-red-600 font-medium"
                                  : "text-gray-600"
                              }
                            >
                              Còn {daysLeft} ngày
                            </span>
                          </div>
                          <Badge
                            variant={isUrgent ? "destructive" : "secondary"}
                          >
                            {assignment.status}
                          </Badge>
                        </div>
                      </div>
                      <Link to={`/student/assignments/${assignment.id}`}>
                        <Button className="gap-2">
                          <ArrowRight className="w-4 h-4" />
                          Xem chi tiết
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {pendingAssignments.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Hoàn thành hết rồi!
                  </h3>
                  <p className="text-gray-600">
                    Bạn không có bài tập nào cần nộp
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="submitted" className="space-y-4">
            {submittedAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {assignment.course}
                      </p>
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Đã nộp vào: {assignment.dueDate}</span>
                        </div>
                        <Badge variant="secondary">{assignment.status}</Badge>
                      </div>
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 text-sm text-blue-700">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">bai_nop.pdf</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto gap-1"
                          >
                            <Download className="w-4 h-4" />
                            Tải xuống
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="graded" className="space-y-4">
            {gradedAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {assignment.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {assignment.course}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-indigo-600">
                            {assignment.grade}%
                          </div>
                          <Badge variant="default" className="mt-2">
                            Đã chấm điểm
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Đã nộp: {assignment.dueDate}</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Nhận xét từ giảng viên
                        </h4>
                        <p className="text-sm text-gray-700">
                          Làm rất tốt! Bài làm của bạn thể hiện sự hiểu biết
                          vững chắc về các khái niệm. Code được cấu trúc tốt và
                          có tài liệu rõ ràng. Hãy thử khám phá thêm các trường
                          hợp biên để có kết quả tốt hơn nữa.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}