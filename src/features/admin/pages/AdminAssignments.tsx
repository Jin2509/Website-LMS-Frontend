import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Edit, 
  Trash2,
  Users,
  BookOpen,
  Eye,
  Download,
  Loader2
} from 'lucide-react';
import { PageHeader } from '@/shared/components/common';
import { toast } from 'sonner';
import { exportToExcel } from '@/lib/excelUtils';
import { assignmentService, type Assignment } from '@/core/service/assignment.service';
import { courseService, type Course } from '@/core/service/course.service';

export default function AdminAssignments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ACTIVE' | 'CLOSED'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    dueDate: '',
    description: '',
    maxScore: 100,
  });

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAllAssignments(),
        courseService.getAllCourses()
      ]);
      setAssignments(assignmentsData || []);
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (assignment.courseName && assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [assignments, searchTerm, filterStatus]);

  // Statistics
  const stats = useMemo(() => ({
    total: assignments.length,
    active: assignments.filter(a => a.status === 'ACTIVE').length,
    closed: assignments.filter(a => a.status === 'CLOSED').length,
    // Note: totalSubmissions and totalStudents might need to be fetched separately if not in Assignment object
    totalSubmissions: 0, 
  }), [assignments]);

  const handleCreateAssignment = async () => {
    if (!formData.title || !formData.courseId || !formData.dueDate) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const newAssignment = await assignmentService.createAssignment({
        title: formData.title,
        description: formData.description,
        courseId: parseInt(formData.courseId),
        dueDate: formData.dueDate,
        maxScore: formData.maxScore,
      });

      setAssignments([newAssignment, ...assignments]);
      toast.success('Tạo bài tập thành công!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        courseId: '',
        dueDate: '',
        description: '',
        maxScore: 100,
      });
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Có lỗi xảy ra khi tạo bài tập');
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      try {
        await assignmentService.deleteAssignment(id);
        setAssignments(assignments.filter(a => a.id !== id));
        toast.success('Đã xóa bài tập');
      } catch (error) {
        console.error('Error deleting assignment:', error);
        toast.error('Không thể xóa bài tập. Vui lòng thử lại.');
      }
    }
  };

  const handleExportAssignments = async () => {
    try {
      const data = filteredAssignments.map((assignment, index) => ({
        'STT': index + 1,
        'Tiêu đề': assignment.title,
        'Khóa học': assignment.courseName || 'N/A',
        'Hạn nộp': assignment.dueDate,
        'Trạng thái': assignment.status === 'ACTIVE' ? 'Đang mở' : 'Đã đóng',
        'Điểm tối đa': assignment.maxScore,
        'Ngày tạo': assignment.createdAt ? new Date(assignment.createdAt).toLocaleDateString('vi-VN') : 'N/A',
      }));

      exportToExcel(data, `Danh_sach_bai_tap_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Đã xuất file Excel');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Có lỗi xảy ra khi xuất file Excel');
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const days = Math.ceil(
      (new Date(dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Quản lý bài tập"
          description="Tạo, chỉnh sửa và theo dõi bài tập của tất cả khóa học"
          gradient="from-purple-600 via-pink-600 to-red-600"
        />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng bài tập</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đang mở</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã đóng</p>
                  <p className="text-3xl font-bold text-gray-600 mt-1">{stats.closed}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng bài nộp</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalSubmissions}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm bài tập..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('all')}
                    size="sm"
                  >
                    Tất cả
                  </Button>
                  <Button
                    variant={filterStatus === 'ACTIVE' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('ACTIVE')}
                    size="sm"
                  >
                    Đang mở
                  </Button>
                  <Button
                    variant={filterStatus === 'CLOSED' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('CLOSED')}
                    size="sm"
                  >
                    Đã đóng
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  onClick={handleExportAssignments}
                  className="gap-2 flex-1 md:flex-initial"
                >
                  <Download className="w-4 h-4" />
                  Xuất Excel
                </Button>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="gap-2 flex-1 md:flex-initial"
                >
                  <Plus className="w-4 h-4" />
                  Tạo bài tập mới
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignments List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Đang tải danh sách bài tập...</p>
              </CardContent>
            </Card>
          ) : filteredAssignments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Không tìm thấy bài tập nào</p>
              </CardContent>
            </Card>
          ) : (
            filteredAssignments.map((assignment) => {
              const daysLeft = getDaysUntilDue(assignment.dueDate);
              
              return (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                          <Badge variant={assignment.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {assignment.status === 'ACTIVE' ? 'Đang mở' : 'Đã đóng'}
                          </Badge>
                          {assignment.status === 'ACTIVE' && daysLeft <= 3 && daysLeft >= 0 && (
                            <Badge variant="destructive">
                              Sắp hết hạn
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {assignment.courseName || `Course ID: ${assignment.courseId}`}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Hạn: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                          </div>
                          {assignment.status === 'ACTIVE' && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã quá hạn'}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">{assignment.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                            Điểm tối đa: {assignment.maxScore}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toast.info('Tính năng xem chi tiết sẽ sớm được cập nhật')}
                          title="Xem bài nộp"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toast.info('Tính năng chỉnh sửa sẽ sớm được cập nhật')}
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Create Assignment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Tạo bài tập mới</CardTitle>
                <CardDescription>Nhập thông tin bài tập cần tạo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">
                    Tiêu đề <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Nhập tiêu đề bài tập"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="courseId">
                    Khóa học <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="courseId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  >
                    <option value="">Chọn khóa học</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">
                      Hạn nộp <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxScore">Điểm tối đa</Label>
                    <Input
                      id="maxScore"
                      type="number"
                      value={formData.maxScore}
                      onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Nhập mô tả bài tập..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({
                        title: '',
                        courseId: '',
                        dueDate: '',
                        description: '',
                        maxScore: 100,
                      });
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCreateAssignment}
                  >
                    Tạo bài tập
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
