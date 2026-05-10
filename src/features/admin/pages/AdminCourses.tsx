import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Search, Plus, Edit, Trash2, Eye, Users, BookOpen, Loader2, Star, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PageHeader } from '@/shared/components/common';
import { courseService, type Course, type CreateCourseRequest } from '@/core/service/course.service';
import { toast } from 'sonner';

export default function AdminCourses() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateCourseRequest>({
    name: '',
    description: '',
    category: '',
    level: 'Beginner',
    price: 0,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const data = await courseService.getAllCourses();
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Không thể tải danh sách khóa học');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  const handleDeleteCourse = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa khóa học này? Toàn bộ dữ liệu liên quan sẽ bị mất.')) {
      try {
        await courseService.deleteCourse(id);
        setCourses(courses.filter(c => c.id !== id));
        toast.success('Đã xóa khóa học thành công');
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Không thể xóa khóa học. Vui lòng thử lại sau.');
      }
    }
  };

  const handleCreateCourse = async () => {
    if (!formData.name || !formData.category) {
      toast.error('Vui lòng điền đầy đủ tên và danh mục khóa học');
      return;
    }

    setIsSubmitting(true);
    try {
      const newCourse = await courseService.createCourse(formData);
      setCourses([newCourse, ...courses]);
      toast.success('Tạo khóa học mới thành công!');
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        category: '',
        level: 'Beginner',
        price: 0,
      });
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Có lỗi xảy ra khi tạo khóa học');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = useMemo(() => ({
    total: courses.length,
    totalStudents: courses.reduce((sum, c) => sum + (c.studentCount || 0), 0),
    avgRating: courses.length > 0 
      ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1)
      : 0
  }), [courses]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <PageHeader
            title="Quản lý khóa học"
            description={`${courses.length} khóa học đang hoạt động trong hệ thống`}
            gradient="from-green-600 via-teal-600 to-blue-600"
          />
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm khóa học
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">Tổng khóa học</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">Tổng học viên</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">Đánh giá trung bình</p>
                  <p className="text-3xl font-bold text-orange-500">{stats.avgRating} <span className="text-sm font-normal text-gray-400">/ 5.0</span></p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card className="mb-8 border-none shadow-sm bg-gray-50/50">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm theo tên khóa học, giảng viên hoặc danh mục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-none shadow-none focus-visible:ring-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Đang tải danh sách khóa học...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Không tìm thấy khóa học nào phù hợp</p>
              <Button variant="link" onClick={() => setSearchQuery('')} className="mt-2">Xóa tìm kiếm</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all border-none shadow-sm group">
                <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                  <img
                    src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`} // Default image since course object might not have it
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge className="bg-white/90 text-blue-700 hover:bg-white border-none backdrop-blur-sm">
                      {course.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-black/50 text-white border-none backdrop-blur-sm">
                      {course.level}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                    {course.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{course.studentCount || 0} học viên</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                      <span>{course.rating || 0} / 5.0</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">👨‍🏫 {course.instructor || 'Chưa phân công'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600 font-bold">
                      <DollarSign className="w-4 h-4" />
                      <span>{course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()}đ`}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                      onClick={() => navigate(`/admin/courses/${course.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
                      onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Course Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-2xl shadow-2xl border-none">
              <CardHeader className="bg-gray-50/50 border-b">
                <CardTitle className="text-2xl">Tạo khóa học mới</CardTitle>
                <CardDescription>Cung cấp các thông tin cơ bản để bắt đầu xây dựng khóa học</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">Tên khóa học <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      placeholder="Ví dụ: React Nâng cao cho Mobile"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold">Danh mục <span className="text-red-500">*</span></Label>
                    <Input
                      id="category"
                      placeholder="Ví dụ: Web Development"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="level" className="text-sm font-semibold">Trình độ</Label>
                    <select
                      id="level"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    >
                      <option value="Beginner">Cơ bản</option>
                      <option value="Intermediate">Trung cấp</option>
                      <option value="Advanced">Nâng cao</option>
                      <option value="All Levels">Mọi cấp độ</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-semibold">Giá khóa học (VNĐ)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">Mô tả khóa học</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả tóm tắt về nội dung và mục tiêu của khóa học..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-6 border-t mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateModal(false)}
                    disabled={isSubmitting}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={handleCreateCourse}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang tạo...
                      </>
                    ) : 'Xác nhận tạo khóa học'}
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
