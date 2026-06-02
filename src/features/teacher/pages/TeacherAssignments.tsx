import { useState } from 'react';
import { Plus, FileText, Download, CheckCircle, Clock, Calendar, Users, ArrowLeft, Edit, Trash2, Loader2 } from 'lucide-react';
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
import { assignments as staticAssignments, courses as staticCourses } from '@/shared/data';
import { assignmentService, type Assignment } from '@/core/service/assignment.service';
import { courseService, type Course } from '@/core/service/course.service';
import { useEffect, useMemo } from 'react';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
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
    id: 0,
    title: '',
    course: '',
    dueDate: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAllAssignments(),
        courseService.getMyCourses()
      ]);
      setAssignments(assignmentsData || []);
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const myCourses = courses;
  const pendingGradingCount = useMemo(() => submissions.filter(s => s.status === 'pending').length, []);
  const gradedCount = useMemo(() => submissions.filter(s => s.status === 'graded').length, []);

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.course || !newAssignment.dueDate) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);
    try {
      await assignmentService.createAssignment({
        title: newAssignment.title,
        description: newAssignment.description,
        courseId: parseInt(newAssignment.course),
        dueDate: newAssignment.dueDate,
        maxScore: 100,
      });
      toast.success('Tạo bài tập thành công!');
      setIsCreateDialogOpen(false);
      setNewAssignment({ title: '', course: '', dueDate: '', description: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Có lỗi xảy ra khi tạo bài tập');
    } finally {
      setIsSubmitting(false);
    }
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
  };

  const openGradeDialog = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsGradeDialogOpen(true);
  };

  const openEditDialog = (assignment: Assignment) => {
    setEditAssignment({
      id: assignment.id,
      title: assignment.title,
      course: assignment.courseId?.toString() || '',
      dueDate: assignment.dueDate.split('T')[0],
      description: assignment.description || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleEditAssignment = async () => {
    if (!editAssignment.title || !editAssignment.course || !editAssignment.dueDate) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);
    try {
      await assignmentService.updateAssignment(editAssignment.id, {
        title: editAssignment.title,
        description: editAssignment.description,
        courseId: parseInt(editAssignment.course),
        dueDate: editAssignment.dueDate,
        maxScore: 100,
      });
      toast.success('Cập nhật bài tập thành công!');
      setIsEditDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast.error('Có lỗi xảy ra khi cập nhật bài tập');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      try {
        await assignmentService.deleteAssignment(id);
        toast.success('Đã xóa bài tập');
        if (selectedAssignment === id.toString()) setSelectedAssignment(null);
        fetchData();
      } catch (error) {
        console.error('Error deleting assignment:', error);
        toast.error('Không thể xóa bài tập');
      }
    }
  };

  const currentAssignment = assignments.find(a => a.id.toString() === selectedAssignment);
  const assignmentSubmissions = selectedAssignment 
    ? submissions.filter(s => s.assignmentId === selectedAssignment)
    : [];

  return (
    <Layout>
      <div className="w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-clip-text mb-2">
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
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Hạn nộp</Label>
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
                    placeholder="Mô tả yêu cầu bài tập..."
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isSubmitting}>
                    Hủy
                  </Button>
                  <Button onClick={handleCreateAssignment} disabled={isSubmitting}>
                    {isSubmitting ? 'Đang tạo...' : 'Tạo bài tập'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assignments List */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách bài tập</CardTitle>
                <CardDescription>Quản lý các bài tập bạn đã tạo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="py-8 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
                    Đang tải bài tập...
                  </div>
                ) : assignments.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">Chưa có bài tập nào</div>
                ) : (
                  assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        selectedAssignment === assignment.id.toString()
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                          : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50/50'
                      }`}
                      onClick={() => setSelectedAssignment(assignment.id.toString())}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedAssignment === assignment.id.toString() ? 'bg-indigo-100' : 'bg-gray-100'
                          }`}>
                            <FileText className={`w-5 h-5 ${
                              selectedAssignment === assignment.id.toString() ? 'text-indigo-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                            <p className="text-sm text-gray-500">{assignment.courseName || `ID Khóa học: ${assignment.courseId}`}</p>
                          </div>
                        </div>
                        <Badge variant={assignment.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {assignment.status === 'ACTIVE' ? 'Đang mở' : 'Đã đóng'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {submissions.filter(s => s.assignmentId === assignment.id.toString()).length} bài nộp
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Assignment Details & Submissions */}
          <div className="space-y-6">
            {selectedAssignment && currentAssignment ? (
              <>
                <Card className="border-indigo-100 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{currentAssignment.title}</CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500 hover:text-indigo-600"
                          onClick={() => openEditDialog(currentAssignment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                          onClick={() => handleDeleteAssignment(currentAssignment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{currentAssignment.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                        <Badge variant={currentAssignment.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {currentAssignment.status === 'ACTIVE' ? 'Đang mở' : 'Đã đóng'}
                        </Badge>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Hạn nộp</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(currentAssignment.dueDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>

                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="all">Tất cả bài nộp</TabsTrigger>
                        <TabsTrigger value="pending" className="relative">
                          Chờ chấm
                          {assignmentSubmissions.filter(s => s.status === 'pending').length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                              {assignmentSubmissions.filter(s => s.status === 'pending').length}
                            </span>
                          )}
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="all" className="space-y-3">
                        {assignmentSubmissions.length === 0 ? (
                          <div className="text-center py-6 text-gray-500 text-sm">Chưa có bài nộp nào</div>
                        ) : (
                          assignmentSubmissions.map((submission) => (
                            <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                  {submission.studentName.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{submission.studentName}</p>
                                  <p className="text-xs text-gray-500">{submission.submittedDate}</p>
                                </div>
                              </div>
                              {submission.status === 'graded' ? (
                                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                                  {submission.grade}/100
                                </Badge>
                              ) : (
                                <Button variant="outline" size="sm" onClick={() => openGradeDialog(submission)}>Chấm điểm</Button>
                              )}
                            </div>
                          ))
                        )}
                      </TabsContent>
                      <TabsContent value="pending" className="space-y-3">
                        {assignmentSubmissions.filter(s => s.status === 'pending').length === 0 ? (
                          <div className="text-center py-6 text-gray-500 text-sm">Không có bài chờ chấm</div>
                        ) : (
                          assignmentSubmissions
                            .filter(s => s.status === 'pending')
                            .map((submission) => (
                              <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                    {submission.studentName.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{submission.studentName}</p>
                                    <p className="text-xs text-gray-500">{submission.submittedDate}</p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => openGradeDialog(submission)}>Chấm điểm</Button>
                              </div>
                            ))
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Chưa chọn bài tập</h3>
                <p className="text-gray-500 text-sm max-w-[200px]">Chọn một bài tập từ danh sách bên trái để xem chi tiết và chấm điểm</p>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chấm điểm bài nộp</DialogTitle>
              <DialogDescription>
                Sinh viên: <span className="font-semibold text-gray-900">{selectedSubmission?.studentName}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{selectedSubmission?.fileName}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-indigo-600 h-8 gap-1">
                  <Download className="w-4 h-4" />
                  Tải xuống
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Điểm số (trên 100)</Label>
                <Input
                  id="grade"
                  type="number"
                  placeholder="90"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback">Nhận xét</Label>
                <Textarea
                  id="feedback"
                  placeholder="Góp ý cho sinh viên về bài nộp này..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsGradeDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleGradeSubmission}>Lưu điểm</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa bài tập</DialogTitle>
              <DialogDescription>Cập nhật thông tin cho bài tập đã chọn</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Tiêu đề</Label>
                <Input
                  id="edit-title"
                  placeholder="Nhập tiêu đề bài tập..."
                  value={editAssignment.title}
                  onChange={(e) => setEditAssignment({ ...editAssignment, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-course">Khóa học</Label>
                <Select
                  value={editAssignment.course}
                  onValueChange={(value) => setEditAssignment({ ...editAssignment, course: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khóa học" />
                  </SelectTrigger>
                  <SelectContent>
                    {myCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dueDate">Hạn nộp</Label>
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
                  placeholder="Mô tả yêu cầu bài tập..."
                  value={editAssignment.description}
                  onChange={(e) => setEditAssignment({ ...editAssignment, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button onClick={handleEditAssignment} disabled={isSubmitting}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
