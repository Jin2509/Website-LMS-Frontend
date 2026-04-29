import { useState } from 'react';
import { Plus, FileText, Download, CheckCircle, Clock, Calendar, Users, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { assignments, courses } from '@/shared/data';

interface Submission {
  id: string;
  studentName: string;
  assignmentId: string;
  submittedDate: string;
  fileName: string;
  status: 'pending' | 'graded';
  grade?: number;
}

const submissions: Submission[] = [
  {
    id: '1',
    studentName: 'Alex Johnson',
    assignmentId: '2',
    submittedDate: '2026-03-20',
    fileName: 'quiz_submission.pdf',
    status: 'graded',
    grade: 92,
  },
  {
    id: '2',
    studentName: 'Emma Wilson',
    assignmentId: '1',
    submittedDate: '2026-03-21',
    fileName: 'web_app_project.zip',
    status: 'pending',
  },
  {
    id: '3',
    studentName: 'Michael Brown',
    assignmentId: '4',
    submittedDate: '2026-03-19',
    fileName: 'bst_implementation.py',
    status: 'graded',
    grade: 88,
  },
];

export default function TeacherAssignments() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeValue, setGradeValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    course: '',
    dueDate: '',
    description: '',
  });
  const [editAssignment, setEditAssignment] = useState({
    title: '',
    course: '',
    dueDate: '',
    description: '',
  });

  const myCourses = courses.filter(c => c.instructor === 'Dr. Sarah Smith');
  const pendingGrading = submissions.filter(s => s.status === 'pending');
  const graded = submissions.filter(s => s.status === 'graded');

  const handleCreateAssignment = () => {
    if (!newAssignment.title || !newAssignment.course || !newAssignment.dueDate) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    toast.success('Tạo bài tập thành công!');
    setIsCreateDialogOpen(false);
    setNewAssignment({ title: '', course: '', dueDate: '', description: '' });
  };

  const handleGradeSubmission = () => {
    if (!gradeValue || !feedback) {
      toast.error('Vui lòng nhập điểm và nhận xét');
      return;
    }

    toast.success('Đã lưu điểm thành công!');
    setIsGradeDialogOpen(false);
    setGradeValue('');
    setFeedback('');
    setSelectedSubmission(null);
  };

  const openGradeDialog = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsGradeDialogOpen(true);
  };

  const handleEditAssignment = () => {
    if (!editAssignment.title || !editAssignment.course || !editAssignment.dueDate) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    toast.success('Cập nhật bài tập thành công!');
    setIsEditDialogOpen(false);
    setEditAssignment({ title: '', course: '', dueDate: '', description: '' });
  };

  const handleDeleteAssignment = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      toast.success('Đã xóa bài tập thành công!');
      setSelectedAssignment(null);
    }
  };

  const openEditDialog = (assignment: any) => {
    setEditAssignment({
      title: assignment.title,
      course: assignment.course,
      dueDate: assignment.dueDate,
      description: assignment.description || '',
    });
    setIsEditDialogOpen(true);
  };

  const currentAssignment = assignments.find(a => a.id === selectedAssignment);
  const assignmentSubmissions = selectedAssignment 
    ? submissions.filter(s => s.assignmentId === selectedAssignment)
    : [];

  return (
    <Layout>
      <div className="w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Bài tập
            </h1>
            <p className="text-gray-600 mt-1">Tạo và quản lý bài tập khóa học</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Tạo bài tập mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo bài tập mới</DialogTitle>
                <DialogDescription>Thêm bài tập mới cho học sinh của bạn</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề bài tập *</Label>
                  <Input
                    id="title"
                    placeholder="vd: Bài tập cuối kỳ: Xây dựng ứng dụng Web"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Khóa học *</Label>
                  <Select
                    value={newAssignment.course}
                    onValueChange={(value) => setNewAssignment({ ...newAssignment, course: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khóa học" />
                    </SelectTrigger>
                    <SelectContent>
                      {myCourses.map((course) => (
                        <SelectItem key={course.id} value={course.title}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Hạn nộp *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả yêu cầu và mục tiêu của bài tập..."
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleCreateAssignment}>
                    Tạo bài tập
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng số bài tập</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{assignments.length}</p>
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
                  <p className="text-sm text-gray-600">Chưa chấm điểm</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{pendingGrading.length}</p>
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
                  <p className="text-sm text-gray-600">Đã chấm điểm</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{graded.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {!selectedAssignment ? (
          // Assignment List View
          <Card>
            <CardHeader>
              <CardTitle>Danh sách bài tập</CardTitle>
              <CardDescription>Chọn một bài tập để xem chi tiết và danh sách bài nộp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignments.map((assignment) => {
                const submissionCount = submissions.filter(
                  s => s.assignmentId === assignment.id
                ).length;
                const gradedCount = submissions.filter(
                  s => s.assignmentId === assignment.id && s.status === 'graded'
                ).length;

                return (
                  <div
                    key={assignment.id}
                    className="p-6 rounded-lg border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer"
                    onClick={() => setSelectedAssignment(assignment.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{assignment.course}</p>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Hạn nộp: {assignment.dueDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{submissionCount} bài nộp</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>{gradedCount} đã chấm</span>
                          </div>
                          <Badge variant={assignment.status === 'pending' ? 'secondary' : 'default'}>
                            {assignment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ) : (
          // Assignment Detail View
          <div className="space-y-6">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setSelectedAssignment(null)}
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách
            </Button>

            {/* Assignment Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{currentAssignment?.title}</CardTitle>
                    <CardDescription className="mt-2">{currentAssignment?.course}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => currentAssignment && openEditDialog(currentAssignment)}
                    >
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleDeleteAssignment}
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hạn nộp</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-700" />
                      <span className="font-medium text-gray-900">{currentAssignment?.dueDate}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                    <Badge variant={currentAssignment?.status === 'pending' ? 'secondary' : 'default'}>
                      {currentAssignment?.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tổng bài nộp</p>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-700" />
                      <span className="font-medium text-gray-900">{assignmentSubmissions.length}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Đã chấm điểm</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-700" />
                      <span className="font-medium text-gray-900">
                        {assignmentSubmissions.filter(s => s.status === 'graded').length}
                      </span>
                    </div>
                  </div>
                </div>
                {currentAssignment?.description && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Mô tả bài tập</h4>
                    <p className="text-gray-600">{currentAssignment.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submissions List */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách bài nộp</CardTitle>
                <CardDescription>
                  {assignmentSubmissions.length === 0 
                    ? 'Chưa có học sinh nào nộp bài' 
                    : `${assignmentSubmissions.length} bài nộp`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignmentSubmissions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Chưa có bài nộp nào</p>
                  </div>
                ) : (
                  assignmentSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="p-6 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {submission.studentName}
                            </h3>
                            <Badge variant={submission.status === 'graded' ? 'default' : 'secondary'}>
                              {submission.status === 'graded' ? 'Đã chấm' : 'Chưa chấm'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>Đã nộp: {submission.submittedDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FileText className="w-4 h-4" />
                              <span>{submission.fileName}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => toast.success('Đang tải xuống file...')}
                            >
                              <Download className="w-4 h-4" />
                              Tải xuống
                            </Button>
                            {submission.status === 'pending' ? (
                              <Button
                                size="sm"
                                onClick={() => openGradeDialog(submission)}
                              >
                                Chấm điểm
                              </Button>
                            ) : (
                              <div className="flex items-center gap-2 ml-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-semibold text-green-600">
                                  Điểm: {submission.grade}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Grade Dialog */}
        <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chấm điểm bài nộp</DialogTitle>
              <DialogDescription>
                {selectedSubmission?.studentName} - {selectedSubmission?.fileName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Điểm (0-100)</Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="85"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback">Nhận xét</Label>
                <Textarea
                  id="feedback"
                  placeholder="Cung cấp nhận xét chi tiết cho học sinh..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsGradeDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleGradeSubmission}>
                  Lưu điểm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa bài tập</DialogTitle>
              <DialogDescription>Cập nhật thông tin bài tập</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Tiêu đề bài tập *</Label>
                <Input
                  id="edit-title"
                  placeholder="vd: Bài tập cuối kỳ: Xây dựng ứng dụng Web"
                  value={editAssignment.title}
                  onChange={(e) => setEditAssignment({ ...editAssignment, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-course">Khóa học *</Label>
                <Select
                  value={editAssignment.course}
                  onValueChange={(value) => setEditAssignment({ ...editAssignment, course: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khóa học" />
                  </SelectTrigger>
                  <SelectContent>
                    {myCourses.map((course) => (
                      <SelectItem key={course.id} value={course.title}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dueDate">Hạn nộp *</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={editAssignment.dueDate}
                  onChange={(e) => setEditAssignment({ ...editAssignment, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Mô tả yêu cầu và mục tiêu của bài tập..."
                  value={editAssignment.description}
                  onChange={(e) => setEditAssignment({ ...editAssignment, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleEditAssignment}>
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}