import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { 
  School, 
  Plus, 
  Users, 
  BookOpen, 
  FileText,
  PlusCircle,
  Search,
  UserPlus,
  UserCheck,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { classService, type Class, type ClassStudent } from '@/core/service/class.service';
import { userService, type User } from '@/core/service/user.service';

export default function AdminClasses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignTeacherOpen, setIsAssignTeacherOpen] = useState(false);
  const [isAddStudentsOpen, setIsAddStudentsOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    schedule: '',
    room: '',
    semester: 'Học kỳ 1',
    year: '2025-2026',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [classesData, teachersData, studentsData] = await Promise.all([
        classService.getAllClasses(),
        userService.getAllUsers({ role: 'TEACHER' }),
        userService.getAllUsers({ role: 'STUDENT' })
      ]);
      setClasses(classesData || []);
      setTeachers(teachersData || []);
      setStudents(studentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter classes by search query
  const filteredClasses = useMemo(() => {
    return classes.filter(cls =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cls.instructorName && cls.instructorName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [classes, searchQuery]);

  const handleCreateClass = async () => {
    if (!newClass.name || !newClass.description) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const classData = {
        name: newClass.name,
        description: newClass.description,
        instructorId: 0, // Will assign later
        semester: newClass.semester,
        year: newClass.year,
        schedule: newClass.schedule,
        room: newClass.room,
        startDate: newClass.startDate,
        endDate: newClass.endDate,
      };

      const createdClass = await classService.createClass(classData);
      setClasses([createdClass, ...classes]);

      toast.success('Đã tạo lớp học mới');
      setIsCreateDialogOpen(false);
      setNewClass({
        name: '',
        description: '',
        schedule: '',
        room: '',
        semester: 'Học kỳ 1',
        year: '2025-2026',
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error('Có lỗi xảy ra khi tạo lớp học');
    }
  };

  const handleAssignTeacher = async (teacherId: number) => {
    if (!selectedClassId) return;

    try {
      const teacher = teachers.find(t => t.id === teacherId);
      if (!teacher) return;

      const updatedClass = await classService.updateClass(selectedClassId, {
        instructorId: teacherId
      });

      setClasses(classes.map(cls => cls.id === selectedClassId ? updatedClass : cls));
      toast.success(`Đã phân bổ ${teacher.name} vào lớp học`);
      setIsAssignTeacherOpen(false);
      setSelectedClassId(null);
    } catch (error) {
      console.error('Error assigning teacher:', error);
      toast.error('Có lỗi xảy ra khi phân bổ giảng viên');
    }
  };

  const handleToggleStudent = (studentId: number) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAddStudents = async () => {
    if (!selectedClassId || selectedStudents.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sinh viên');
      return;
    }

    try {
      await Promise.all(
        selectedStudents.map(studentId => classService.addStudentToClass(selectedClassId, studentId))
      );

      // Refresh data to update student counts
      await fetchData();

      toast.success(`Đã thêm ${selectedStudents.length} sinh viên vào lớp học`);
      setIsAddStudentsOpen(false);
      setSelectedClassId(null);
      setSelectedStudents([]);
      setStudentSearchQuery('');
    } catch (error) {
      console.error('Error adding students:', error);
      toast.error('Có lỗi xảy ra khi thêm sinh viên');
    }
  };

  const handleDeleteClass = async (classId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa lớp học này?')) return;

    try {
      await classService.deleteClass(classId);
      setClasses(classes.filter(cls => cls.id !== classId));
      toast.success('Đã xóa lớp học');
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Có lỗi xảy ra khi xóa lớp học');
    }
  };

  // Get students not in selected class (simplified for now, ideally BE should handle this)
  const filteredStudents = useMemo(() => {
    return students.filter(s =>
      s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearchQuery.toLowerCase())
    );
  }, [students, studentSearchQuery]);

  // Statistics
  const stats = useMemo(() => ({
    total: classes.length,
    withTeacher: classes.filter(c => c.instructorId && c.instructorId !== 0).length,
    totalStudents: classes.reduce((sum, c) => sum + (c.studentCount || 0), 0),
    empty: classes.filter(c => (c.studentCount || 0) === 0).length,
  }), [classes]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Quản lý lớp học
              </h1>
              <p className="text-gray-600 mt-1">Tạo và quản lý các lớp học trong hệ thống</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Tạo lớp học mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tạo lớp học mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin cho lớp học mới. Bạn có thể phân bổ giảng viên và thêm sinh viên sau.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="className">Tên lớp học <span className="text-red-500">*</span></Label>
                    <Input
                      id="className"
                      placeholder="VD: Lớp học lập trình Web 2026"
                      value={newClass.name}
                      onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Mô tả <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="description"
                      placeholder="Mô tả về lớp học..."
                      value={newClass.description}
                      onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="semester">Học kỳ</Label>
                      <select
                        id="semester"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={newClass.semester}
                        onChange={(e) => setNewClass({ ...newClass, semester: e.target.value })}
                      >
                        <option value="Học kỳ 1">Học kỳ 1</option>
                        <option value="Học kỳ 2">Học kỳ 2</option>
                        <option value="Học kỳ Hè">Học kỳ Hè</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="year">Năm học</Label>
                      <Input
                        id="year"
                        placeholder="VD: 2025-2026"
                        value={newClass.year}
                        onChange={(e) => setNewClass({ ...newClass, year: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="schedule">Lịch học</Label>
                      <Input
                        id="schedule"
                        placeholder="VD: Thứ 2, 4, 6"
                        value={newClass.schedule}
                        onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="room">Phòng học</Label>
                      <Input
                        id="room"
                        placeholder="VD: A101"
                        value={newClass.room}
                        onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Ngày bắt đầu</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newClass.startDate}
                        onChange={(e) => setNewClass({ ...newClass, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Ngày kết thúc</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newClass.endDate}
                        onChange={(e) => setNewClass({ ...newClass, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleCreateClass}>Tạo lớp học</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Tổng số lớp</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <School className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Đã có giảng viên</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.withTeacher}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Tổng sinh viên</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Lớp trống</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.empty}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <School className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm lớp học theo tên hoặc giảng viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Classes List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Đang tải danh sách lớp học...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <Card>
            <CardContent className="p-20 text-center">
              <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Không tìm thấy lớp học nào</p>
              <Button variant="link" onClick={() => setSearchQuery('')}>Xóa tìm kiếm</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => {
              const hasTeacher = cls.instructorId && cls.instructorId !== 0;

              return (
                <Card key={cls.id} className="hover:shadow-xl transition-all border-none shadow-sm overflow-hidden">
                  <div className="h-2 bg-indigo-600" />
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl line-clamp-1 text-gray-900">{cls.name}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {cls.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClass(cls.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <UserCheck className="w-4 h-4 text-gray-400" />
                        <span className={!hasTeacher ? 'text-orange-600 font-bold' : 'font-medium'}>
                          {hasTeacher ? cls.instructorName : 'Chưa phân giảng viên'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{cls.schedule || 'Chưa cập nhật'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{cls.room || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium mb-1">Sinh viên</p>
                        <p className="font-bold text-gray-900">{cls.studentCount || 0}</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600 font-medium mb-1">Khóa học</p>
                        <p className="font-bold text-gray-900">{cls.courseIds?.length || 0}</p>
                      </div>
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <p className="text-xs text-purple-600 font-medium mb-1">Bài tập</p>
                        <p className="font-bold text-gray-900">{cls.assignmentIds?.length || 0}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      {!hasTeacher && (
                        <Button
                          variant="outline"
                          className="w-full gap-2 text-orange-600 border-orange-200 hover:bg-orange-50 font-semibold"
                          onClick={() => {
                            setSelectedClassId(cls.id);
                            setIsAssignTeacherOpen(true);
                          }}
                        >
                          <UserPlus className="w-4 h-4" />
                          Phân bổ giảng viên
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        className="w-full gap-2 border-gray-200 hover:bg-gray-50 font-medium"
                        onClick={() => {
                          setSelectedClassId(cls.id);
                          setIsAddStudentsOpen(true);
                        }}
                      >
                        <Users className="w-4 h-4" />
                        Thêm sinh viên
                      </Button>

                      <Button asChild className="w-full bg-gray-900 hover:bg-black">
                        <Link to={`/admin/classes/${cls.id}`}>
                          Xem chi tiết
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Assign Teacher Dialog */}
        <Dialog open={isAssignTeacherOpen} onOpenChange={setIsAssignTeacherOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Phân bổ giảng viên</DialogTitle>
              <DialogDescription>
                Chọn giảng viên để phụ trách lớp học này
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto pr-2">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center gap-3 p-4 border-2 border-gray-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                  onClick={() => handleAssignTeacher(teacher.id)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {teacher.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{teacher.name}</p>
                    <p className="text-sm text-gray-500">{teacher.email}</p>
                    <Badge variant="secondary" className="mt-1 text-[10px] uppercase tracking-wider">{teacher.phone || 'N/A'}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Students Dialog */}
        <Dialog open={isAddStudentsOpen} onOpenChange={setIsAddStudentsOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Thêm sinh viên vào lớp</DialogTitle>
              <DialogDescription>
                Chọn sinh viên từ danh sách để thêm vào lớp học
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 flex-1 overflow-hidden flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-10">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Không tìm thấy sinh viên nào</p>
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedStudents.includes(student.id)
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-100 hover:border-indigo-300'
                      }`}
                      onClick={() => handleToggleStudent(student.id)}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedStudents.includes(student.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                      }`}>
                        {selectedStudents.includes(student.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{student.name}</p>
                        <p className="text-xs text-gray-500 truncate">{student.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex gap-3 justify-end rounded-b-lg">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddStudentsOpen(false);
                  setSelectedStudents([]);
                  setStudentSearchQuery('');
                }}
              >
                Hủy bỏ
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
                onClick={handleAddStudents}
                disabled={selectedStudents.length === 0}
              >
                Thêm {selectedStudents.length > 0 && `(${selectedStudents.length})`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
