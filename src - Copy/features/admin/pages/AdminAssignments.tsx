import React, { useState } from 'react';
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
  Download
} from 'lucide-react';
import { PageHeader } from '@/shared/components/common';
import { toast } from 'sonner';
import { exportToExcel } from '@/lib/excelUtils';

interface Assignment {
  id: string;
  title: string;
  course: string;
  courseId: string;
  dueDate: string;
  status: 'active' | 'closed';
  totalSubmissions: number;
  totalStudents: number;
  description: string;
  createdDate: string;
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Bài tập cuối kỳ: Xây dựng ứng dụng Web',
    course: 'Lập trình Web cơ bản',
    courseId: '3',
    dueDate: '2026-03-28',
    status: 'active',
    totalSubmissions: 28,
    totalStudents: 45,
    description: 'Xây dựng một ứng dụng web hoàn chỉnh sử dụng React và Node.js',
    createdDate: '2026-03-01',
  },
  {
    id: '2',
    title: 'Thuật toán sắp xếp và tìm kiếm',
    course: 'Cấu trúc dữ liệu và Giải thuật',
    courseId: '4',
    dueDate: '2026-03-25',
    status: 'active',
    totalSubmissions: 35,
    totalStudents: 40,
    description: 'Cài đặt và phân tích các thuật toán sắp xếp: Quick Sort, Merge Sort, Heap Sort',
    createdDate: '2026-03-05',
  },
  {
    id: '3',
    title: 'Bài tập tích phân và đạo hàm',
    course: 'Toán cao cấp',
    courseId: '2',
    dueDate: '2026-03-20',
    status: 'closed',
    totalSubmissions: 50,
    totalStudents: 50,
    description: 'Giải các bài toán về tích phân và đạo hàm',
    createdDate: '2026-02-28',
  },
  {
    id: '4',
    title: 'Lập trình hướng đối tượng',
    course: 'Nhập môn khoa học máy tính',
    courseId: '1',
    dueDate: '2026-04-05',
    status: 'active',
    totalSubmissions: 18,
    totalStudents: 52,
    description: 'Thiết kế và triển khai hệ thống quản lý thư viện sử dụng OOP',
    createdDate: '2026-03-10',
  },
  {
    id: '5',
    title: 'HTML/CSS Layout Design',
    course: 'Lập trình Web cơ bản',
    courseId: '3',
    dueDate: '2026-03-15',
    status: 'closed',
    totalSubmissions: 45,
    totalStudents: 45,
    description: 'Thiết kế giao diện responsive cho website bán hàng',
    createdDate: '2026-02-20',
  },
];

export default function AdminAssignments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assignments, setAssignments] = useState(mockAssignments);
  
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    courseId: '',
    dueDate: '',
    description: '',
  });

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    closed: assignments.filter(a => a.status === 'closed').length,
    totalSubmissions: assignments.reduce((sum, a) => sum + a.totalSubmissions, 0),
  };

  const handleCreateAssignment = () => {
    if (!formData.title || !formData.course || !formData.dueDate) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const newAssignment: Assignment = {
      id: (assignments.length + 1).toString(),
      title: formData.title,
      course: formData.course,
      courseId: formData.courseId || '1',
      dueDate: formData.dueDate,
      status: 'active',
      totalSubmissions: 0,
      totalStudents: 0,
      description: formData.description,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setAssignments([...assignments, newAssignment]);
    toast.success('Tạo bài tập thành công!');
    setShowCreateModal(false);
    setFormData({
      title: '',
      course: '',
      courseId: '',
      dueDate: '',
      description: '',
    });
  };

  const handleDeleteAssignment = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      setAssignments(assignments.filter(a => a.id !== id));
      toast.success('Đã xóa bài tập');
    }
  };

  const handleExportAssignments = async () => {
    try {
      const data = filteredAssignments.map((assignment, index) => ({
        'STT': index + 1,
        'Tiêu đề': assignment.title,
        'Khóa học': assignment.course,
        'Hạn nộp': assignment.dueDate,
        'Trạng thái': assignment.status === 'active' ? 'Đang mở' : 'Đã đóng',
        'Đã nộp': assignment.totalSubmissions,
        'Tổng sinh viên': assignment.totalStudents,
        'Tỷ lệ nộp': assignment.totalStudents > 0 
          ? `${Math.round((assignment.totalSubmissions / assignment.totalStudents) * 100)}%`
          : '0%',
        'Ngày tạo': assignment.createdDate,
      }));

      exportToExcel(data, `Danh_sach_bai_tap_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Đã xuất file Excel');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Có lỗi xảy ra khi xuất file Excel');
    }
  };

  const getSubmissionRate = (submitted: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((submitted / total) * 100);
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
                    variant={filterStatus === 'active' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('active')}
                    size="sm"
                  >
                    Đang mở
                  </Button>
                  <Button
                    variant={filterStatus === 'closed' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('closed')}
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
          {filteredAssignments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Không tìm thấy bài tập nào</p>
              </CardContent>
            </Card>
          ) : (
            filteredAssignments.map((assignment) => {
              const daysLeft = getDaysUntilDue(assignment.dueDate);
              const submissionRate = getSubmissionRate(assignment.totalSubmissions, assignment.totalStudents);
              
              return (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                          <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'}>
                            {assignment.status === 'active' ? 'Đang mở' : 'Đã đóng'}
                          </Badge>
                          {assignment.status === 'active' && daysLeft <= 3 && daysLeft >= 0 && (
                            <Badge variant="destructive">
                              Sắp hết hạn
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {assignment.course}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Hạn: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                          </div>
                          {assignment.status === 'active' && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã quá hạn'}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">{assignment.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              Đã nộp: {assignment.totalSubmissions}/{assignment.totalStudents} sinh viên
                            </span>
                            <span className="font-semibold text-gray-900">{submissionRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                submissionRate >= 80 ? 'bg-green-600' :
                                submissionRate >= 50 ? 'bg-blue-600' :
                                'bg-orange-600'
                              }`}
                              style={{ width: `${submissionRate}%` }}
                            />
                          </div>
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
                  <Label htmlFor="course">
                    Khóa học <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="course"
                    placeholder="Nhập tên khóa học"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  />
                </div>

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
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({
                        title: '',
                        course: '',
                        courseId: '',
                        dueDate: '',
                        description: '',
                      });
                    }}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                  <Button onClick={handleCreateAssignment} className="flex-1 gap-2">
                    <Plus className="w-4 h-4" />
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