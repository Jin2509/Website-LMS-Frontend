import React, { useState } from 'react';
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
  Calendar,
  Search,
  UserPlus,
  UserCheck,
  Edit,
  Trash2,
  MapPin,
  Clock
} from 'lucide-react';
import { Link } from 'react-router';
import { classes, students, classStudents } from '@/shared/data';
import { toast } from 'sonner';

// Mock data for teachers
const teachers = [
  { id: '1', name: 'TS. Nguyễn Văn A', email: 'nguyen.a@example.com', department: 'Computer Science' },
  { id: '2', name: 'ThS. Trần Thị B', email: 'tran.b@example.com', department: 'Computer Science' },
  { id: '3', name: 'PGS.TS. Lê Văn C', email: 'le.c@example.com', department: 'AI & Machine Learning' },
  { id: '4', name: 'TS. Phạm Thị D', email: 'pham.d@example.com', department: 'Networks' },
  { id: '5', name: 'ThS. Hoàng Văn E', email: 'hoang.e@example.com', department: 'Software Engineering' },
];

export default function AdminClasses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignTeacherOpen, setIsAssignTeacherOpen] = useState(false);
  const [isAddStudentsOpen, setIsAddStudentsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  
  // Form state
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    schedule: '',
    room: '',
    startDate: '',
    endDate: '',
  });

  // Filter classes by search query
  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClass = () => {
    if (!newClass.name || !newClass.description) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const existingClasses = localStorage.getItem('classes');
      const currentClasses = existingClasses ? JSON.parse(existingClasses) : classes;

      const classData = {
        id: `class-${Date.now()}`,
        name: newClass.name,
        description: newClass.description,
        instructor: 'Chưa phân bổ',
        instructorId: '',
        schedule: newClass.schedule || 'Chưa cập nhật',
        room: newClass.room || 'Chưa cập nhật',
        students: 0,
        courseIds: [],
        assignmentIds: [],
        startDate: newClass.startDate,
        endDate: newClass.endDate,
      };

      const updatedClasses = [...currentClasses, classData];
      localStorage.setItem('classes', JSON.stringify(updatedClasses));

      toast.success('Đã tạo lớp học mới');
      setIsCreateDialogOpen(false);
      setNewClass({
        name: '',
        description: '',
        schedule: '',
        room: '',
        startDate: '',
        endDate: '',
      });
      
      // Reload to show new class
      window.location.reload();
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error('Có lỗi xảy ra khi tạo lớp học');
    }
  };

  const handleAssignTeacher = (teacherId: string) => {
    if (!selectedClass) return;

    try {
      const existingClasses = localStorage.getItem('classes');
      const currentClasses = existingClasses ? JSON.parse(existingClasses) : classes;
      
      const teacher = teachers.find(t => t.id === teacherId);
      if (!teacher) return;

      const updatedClasses = currentClasses.map((cls: any) =>
        cls.id === selectedClass
          ? { ...cls, instructor: teacher.name, instructorId: teacher.id }
          : cls
      );

      localStorage.setItem('classes', JSON.stringify(updatedClasses));
      toast.success(`Đã phân bổ ${teacher.name} vào lớp học`);
      setIsAssignTeacherOpen(false);
      setSelectedClass(null);
      window.location.reload();
    } catch (error) {
      console.error('Error assigning teacher:', error);
      toast.error('Có lỗi xảy ra khi phân bổ giảng viên');
    }
  };

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAddStudents = () => {
    if (!selectedClass || selectedStudents.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sinh viên');
      return;
    }

    try {
      const existingData = localStorage.getItem('classStudents');
      const currentClassStudents = existingData ? JSON.parse(existingData) : classStudents;

      const newStudents = selectedStudents.map((studentId, index) => {
        const student = students.find(s => s.id === studentId);
        if (!student) return null;

        return {
          id: `cs-${Date.now()}-${index}`,
          classId: selectedClass,
          studentName: student.name,
          studentEmail: student.email,
          enrolledDate: new Date().toISOString().split('T')[0],
          attendance: 0,
          averageGrade: undefined,
        };
      }).filter(Boolean);

      const updatedClassStudents = [...currentClassStudents, ...newStudents];
      localStorage.setItem('classStudents', JSON.stringify(updatedClassStudents));

      // Update student count in class
      const existingClasses = localStorage.getItem('classes');
      const currentClasses = existingClasses ? JSON.parse(existingClasses) : classes;
      const updatedClasses = currentClasses.map((cls: any) =>
        cls.id === selectedClass
          ? { ...cls, students: cls.students + selectedStudents.length }
          : cls
      );
      localStorage.setItem('classes', JSON.stringify(updatedClasses));

      toast.success(`Đã thêm ${selectedStudents.length} sinh viên vào lớp học`);
      setIsAddStudentsOpen(false);
      setSelectedClass(null);
      setSelectedStudents([]);
      setStudentSearchQuery('');
      window.location.reload();
    } catch (error) {
      console.error('Error adding students:', error);
      toast.error('Có lỗi xảy ra khi thêm sinh viên');
    }
  };

  const handleDeleteClass = (classId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa lớp học này?')) return;

    try {
      const existingClasses = localStorage.getItem('classes');
      const currentClasses = existingClasses ? JSON.parse(existingClasses) : classes;
      const updatedClasses = currentClasses.filter((cls: any) => cls.id !== classId);
      
      localStorage.setItem('classes', JSON.stringify(updatedClasses));
      
      // Also remove students from this class
      const existingStudents = localStorage.getItem('classStudents');
      const currentStudents = existingStudents ? JSON.parse(existingStudents) : classStudents;
      const updatedStudents = currentStudents.filter((s: any) => s.classId !== classId);
      localStorage.setItem('classStudents', JSON.stringify(updatedStudents));

      toast.success('Đã xóa lớp học');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Có lỗi xảy ra khi xóa lớp học');
    }
  };

  // Get students not in selected class
  const getAvailableStudents = () => {
    if (!selectedClass) return [];
    
    const enrolledEmails = classStudents
      .filter(cs => cs.classId === selectedClass)
      .map(cs => cs.studentEmail);
    
    return students.filter(s => !enrolledEmails.includes(s.email));
  };

  const availableStudents = getAvailableStudents();
  const filteredStudents = availableStudents.filter(s =>
    s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    s.studentId.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  // Statistics
  const totalClasses = classes.length;
  const totalStudents = classStudents.length;
  const classesWithTeacher = classes.filter(c => c.instructorId).length;
  const emptyClasses = classes.filter(c => c.students === 0).length;

  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Quản lý lớp học
              </h1>
              <p className="text-gray-600 mt-1">Tạo và quản lý các lớp học trong hệ thống</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
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
                  <p className="text-sm text-gray-600">Tổng số lớp</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalClasses}</p>
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
                  <p className="text-sm text-gray-600">Đã có giảng viên</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{classesWithTeacher}</p>
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
                  <p className="text-sm text-gray-600">Tổng sinh viên</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
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
                  <p className="text-sm text-gray-600">Lớp trống</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{emptyClasses}</p>
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
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm lớp học theo tên hoặc giảng viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Classes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => {
            const studentsInClass = classStudents.filter(s => s.classId === cls.id);
            const hasTeacher = cls.instructorId && cls.instructorId !== '';

            return (
              <Card key={cls.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{cls.name}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {cls.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClass(cls.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <UserCheck className="w-4 h-4" />
                      <span className={!hasTeacher ? 'text-orange-600 font-medium' : ''}>
                        {cls.instructor}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{cls.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{cls.room}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Sinh viên</p>
                      <p className="font-bold text-gray-900">{studentsInClass.length}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Khóa học</p>
                      <p className="font-bold text-gray-900">{cls.courseIds.length}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <FileText className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Bài tập</p>
                      <p className="font-bold text-gray-900">{cls.assignmentIds.length}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {!hasTeacher && (
                      <Button
                        variant="outline"
                        className="w-full gap-2 text-orange-600 border-orange-300 hover:bg-orange-50"
                        onClick={() => {
                          setSelectedClass(cls.id);
                          setIsAssignTeacherOpen(true);
                        }}
                      >
                        <UserCheck className="w-4 h-4" />
                        Phân bổ giảng viên
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => {
                        setSelectedClass(cls.id);
                        setIsAddStudentsOpen(true);
                      }}
                    >
                      <UserPlus className="w-4 h-4" />
                      Thêm sinh viên
                    </Button>

                    <Button asChild className="w-full">
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

        {filteredClasses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <School className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Không tìm thấy lớp học nào</p>
            </CardContent>
          </Card>
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
            <div className="space-y-3 py-4">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer"
                  onClick={() => handleAssignTeacher(teacher.id)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {teacher.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{teacher.name}</p>
                    <p className="text-sm text-gray-600">{teacher.email}</p>
                    <Badge variant="outline" className="mt-1">{teacher.department}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Students Dialog */}
        <Dialog open={isAddStudentsOpen} onOpenChange={setIsAddStudentsOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm sinh viên vào lớp</DialogTitle>
              <DialogDescription>
                Chọn sinh viên để thêm vào lớp học
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email hoặc mã sinh viên..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-4">
                {filteredStudents.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    {studentSearchQuery ? 'Không tìm thấy sinh viên' : 'Tất cả sinh viên đã được thêm vào lớp'}
                  </p>
                ) : (
                  filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:border-indigo-300 ${
                        selectedStudents.includes(student.id)
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => handleToggleStudent(student.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleToggleStudent(student.id)}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {student.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{student.name}</p>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span>{student.email}</span>
                              <span>•</span>
                              <span>{student.studentId}</span>
                              <span>•</span>
                              <span>{student.department}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedStudents.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>{selectedStudents.length}</strong> sinh viên đã được chọn
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddStudentsOpen(false);
                  setSelectedStudents([]);
                  setStudentSearchQuery('');
                }}
              >
                Hủy
              </Button>
              <Button
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