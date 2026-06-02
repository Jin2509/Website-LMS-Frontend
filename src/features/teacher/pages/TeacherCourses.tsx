import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { courses } from '@/shared/data';
import { Plus, Search, Users, BookOpen, Edit, Trash2, MoreVertical, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { courseService, type Course, type CreateCourseRequest } from '@/core/service/course.service';
import { useEffect, useMemo } from 'react';

export default function TeacherCourses() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: '',
  });

  const [editCourse, setEditCourse] = useState<CreateCourseRequest>({
    name: '',
    description: '',
    category: '',
    level: 'Beginner',
    price: 0,
  });

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    setIsLoading(true);
    try {
      const data = await courseService.getMyCourses();
      setMyCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Không thể tải danh sách khóa học');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description || !newCourse.category) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Navigate to create course page with data
    navigate('/teacher/courses/create', { state: newCourse });
  };

  const openEditDialog = (course: Course) => {
     setEditingCourse(course);
     setEditCourse({
       name: course.name,
       description: course.description,
       category: course.category,
       level: (course as any).level || 'Beginner',
       price: (course as any).price || 0,
     });
     setIsEditDialogOpen(true);
   };

   const handleUpdateCourse = async () => {
     if (!editingCourse || !editCourse.name || !editCourse.category) {
       toast.error('Vui lòng điền đầy đủ thông tin');
       return;
     }

     setIsSubmitting(true);
     try {
       await courseService.updateCourse(editingCourse.id, editCourse);
       toast.success('Cập nhật khóa học thành công!');
       setIsEditDialogOpen(false);
       fetchMyCourses();
     } catch (error) {
       console.error('Error updating course:', error);
       toast.error('Có lỗi xảy ra khi cập nhật khóa học');
     } finally {
       setIsSubmitting(false);
     }
   };

   const handleEditCourse = (courseId: string) => {
     const course = myCourses.find(c => c.id.toString() === courseId);
     if (course) openEditDialog(course);
   };

   const handleDeleteCourse = async (courseId: number, courseTitle: string) => {
     if (confirm(`Bạn có chắc chắn muốn xóa khóa học "${courseTitle}"?`)) {
       try {
         await courseService.deleteCourse(courseId);
         toast.success('Đã xóa khóa học thành công!');
         fetchMyCourses();
       } catch (error) {
         console.error('Error deleting course:', error);
         toast.error('Không thể xóa khóa học');
       }
     }
   };

   const filteredCourses = useMemo(() => {
     return myCourses.filter(course =>
       course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       course.category.toLowerCase().includes(searchQuery.toLowerCase())
     );
   }, [myCourses, searchQuery]);

  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-1">Manage your courses and content</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>Add a new course to your teaching portfolio</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    placeholder="Introduction to Machine Learning"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="Computer Science"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn in this course..."
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCourse}>
                    Create Course
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Chỉnh sửa khóa học</DialogTitle>
                <DialogDescription>Cập nhật thông tin cho khóa học của bạn</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Tên khóa học</Label>
                  <Input
                    id="edit-title"
                    placeholder="Nhập tên khóa học..."
                    value={editCourse.name}
                    onChange={(e) => setEditCourse({ ...editCourse, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Danh mục</Label>
                  <Input
                    id="edit-category"
                    placeholder="Ví dụ: Khoa học máy tính"
                    value={editCourse.category}
                    onChange={(e) => setEditCourse({ ...editCourse, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Mô tả</Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Mô tả nội dung khóa học..."
                    value={editCourse.description}
                    onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
                    Hủy
                  </Button>
                  <Button onClick={handleUpdateCourse} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : 'Lưu thay đổi'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{myCourses.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Enrollment</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">52</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={(course as any).image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                alt={course.name}
                className="w-full h-40 object-cover"
              />
              <CardContent className="p-6">
                <Badge className="mb-3">{course.category}</Badge>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{course.studentCount || 0} students</span>
                    </div>
                    <span className="text-gray-600">{(course as any).totalLessons || 0} lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Avg. Progress</span>
                    <span className="font-semibold text-indigo-600">{(course as any).progress || 0}%</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/teacher/courses/${course.id}`} className="flex-1">
                    <Button variant="default" className="w-full gap-2">
                      <BookOpen className="w-4 h-4" />
                      Quản lý
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditCourse(course.id.toString())}>
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCourse(course.id, course.name)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Try a different search term' : 'Create your first course to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Course
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}