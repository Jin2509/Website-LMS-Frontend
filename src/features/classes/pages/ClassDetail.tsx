import React, { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { classes, courses, assignments, classStudents, students } from '@/shared/data';
import { getCurrentUser } from '@/features/auth/services/auth';
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  Users, 
  Calendar, 
  Clock, 
  MapPin,
  Download,
  Mail,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Trash2,
  UserPlus
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { exportToExcel } from '@/lib/excelUtils';

export default function ClassDetail() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';
  const canManageStudents = isTeacher || isAdmin;
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const classData = classes.find(c => c.id === classId);
  const classCourses = classData ? courses.filter(c => classData.courseIds.includes(c.id)) : [];
  const classAssignments = classData ? assignments.filter(a => classData.assignmentIds.includes(a.id)) : [];
  const studentsInClass = classData ? classStudents.filter(s => s.classId === classId) : [];
  
  // Get students not in class
  const enrolledEmails = studentsInClass.map(s => s.studentEmail);
  const availableStudents = students.filter(s => !enrolledEmails.includes(s.email));
  
  // Filter students by search query
  const filteredStudents = availableStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!classData) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy lớp học</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              Quay lại
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleExportStudents = async () => {
    try {
      const data = studentsInClass.map((student, index) => ({
        'STT': index + 1,
        'Họ và tên': student.studentName,
        'Email': student.studentEmail,
        'Ngày đăng ký': student.enrolledDate,
        'Số buổi có mặt': student.attendance,
        'Điểm TB': student.averageGrade || 'N/A',
      }));

      await exportToExcel(data, `${classData.name}_Danh_sach_sinh_vien.xlsx`);
      toast.success('Đã xuất danh sách sinh viên');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Có lỗi xảy ra khi xuất file Excel');
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
    if (selectedStudents.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sinh viên');
      return;
    }

    try {
      // Get existing data from localStorage
      const existingData = localStorage.getItem('classStudents');
      const currentClassStudents = existingData ? JSON.parse(existingData) : classStudents;

      // Add selected students to class
      const newStudents = selectedStudents.map((studentId, index) => {
        const student = students.find(s => s.id === studentId);
        if (!student) return null;

        return {
          id: `new-${Date.now()}-${index}`,
          classId: classId!,
          studentName: student.name,
          studentEmail: student.email,
          enrolledDate: new Date().toISOString().split('T')[0],
          attendance: 0,
          averageGrade: undefined,
        };
      }).filter(Boolean);

      // Save to localStorage
      const updatedClassStudents = [...currentClassStudents, ...newStudents];
      localStorage.setItem('classStudents', JSON.stringify(updatedClassStudents));

      toast.success(`Đã thêm ${selectedStudents.length} sinh viên vào lớp học`);
      setIsAddStudentOpen(false);
      setSelectedStudents([]);
      setSearchQuery('');
      
      // Reload page to show new students
      window.location.reload();
    } catch (error) {
      console.error('Error adding students:', error);
      toast.error('Có lỗi xảy ra khi thêm sinh viên');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>

        {/* Class Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {classData.name}
                </h1>
                <Badge variant="default" className="text-lg px-3 py-1">
                  {classData.semester} {classData.year}
                </Badge>
              </div>
              <p className="text-xl text-gray-600 mt-2">{classData.description}</p>
            </div>
          </div>

          {/* Class Info */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Giảng viên</p>
                    <p className="font-semibold">{classData.instructor}</p>
                  </div>
                </div>
                {classData.schedule && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Lịch học</p>
                      <p className="font-semibold">{classData.schedule}</p>
                    </div>
                  </div>
                )}
                {classData.room && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Phòng học</p>
                      <p className="font-semibold">{classData.room}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Số sinh viên</p>
                    <p className="font-semibold">{classData.studentCount}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">Khóa học</TabsTrigger>
            <TabsTrigger value="assignments">Bài tập</TabsTrigger>
            {canManageStudents && <TabsTrigger value="students">Sinh viên</TabsTrigger>}
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classCourses.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có khóa học nào</p>
                  </CardContent>
                </Card>
              ) : (
                classCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow group">
                    <CardHeader>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tiến độ</span>
                        <span className="font-semibold">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{course.completedLessons}/{course.totalLessons} bài học</span>
                        <Badge variant="secondary">{course.category}</Badge>
                      </div>
                      <Link 
                        to={isTeacher ? `/teacher/courses/${course.id}` : `/student/courses/${course.id}`}
                      >
                        <Button className="w-full mt-2">
                          Xem khóa học
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <div className="space-y-4">
              {classAssignments.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có bài tập nào</p>
                  </CardContent>
                </Card>
              ) : (
                classAssignments.map((assignment) => (
                  <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{assignment.title}</h3>
                            {!isTeacher && (
                              <Badge
                                variant={
                                  assignment.status === 'graded'
                                    ? 'default'
                                    : assignment.status === 'submitted'
                                    ? 'secondary'
                                    : 'destructive'
                                }
                              >
                                {assignment.status === 'graded'
                                  ? 'Đã chấm điểm'
                                  : assignment.status === 'submitted'
                                  ? 'Đã nộp'
                                  : 'Chưa nộp'}
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
                            {!isTeacher && assignment.grade && (
                              <div className="flex items-center gap-1 font-semibold text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                Điểm: {assignment.grade}
                              </div>
                            )}
                          </div>
                          {!isTeacher && assignment.status === 'pending' && (
                            <div className="flex items-center gap-1 text-sm text-orange-600">
                              <AlertCircle className="w-4 h-4" />
                              Vui lòng hoàn thành bài tập trước hạn
                            </div>
                          )}
                        </div>
                        <Link 
                          to={
                            isTeacher 
                              ? `/teacher/assignments/${assignment.id}/submissions`
                              : `/student/assignments/${assignment.id}`
                          }
                        >
                          <Button variant="outline">
                            {isTeacher ? 'Xem bài nộp' : 'Chi tiết'}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Students Tab (Teacher only) */}
          {canManageStudents && (
            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Danh sách sinh viên</CardTitle>
                      <CardDescription>
                        Tổng số {studentsInClass.length} sinh viên
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                        <DialogTrigger asChild>
                          <Button className="gap-2">
                            <UserPlus className="w-4 h-4" />
                            Thêm sinh viên
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Thêm sinh viên vào lớp</DialogTitle>
                            <DialogDescription>
                              Chọn sinh viên để thêm vào lớp học {classData.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                type="text"
                                placeholder="Tìm kiếm theo tên, email hoặc mã sinh viên..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                            
                            <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-4">
                              {filteredStudents.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">
                                  {searchQuery ? 'Không tìm thấy sinh viên' : 'Tất cả sinh viên đã được thêm vào lớp'}
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
                                      id={`student-${student.id}`}
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
                                setIsAddStudentOpen(false);
                                setSelectedStudents([]);
                                setSearchQuery('');
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
                      <Button variant="outline" onClick={handleExportStudents} className="gap-2">
                        <Download className="w-4 h-4" />
                        Xuất Excel
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            STT
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            Họ và tên
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            Email
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            Ngày đăng ký
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            Điểm danh
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            Điểm TB
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentsInClass.map((student, index) => (
                          <tr key={student.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-semibold">
                                    {student.studentName.charAt(0)}
                                  </span>
                                </div>
                                <span className="font-medium text-gray-900">
                                  {student.studentName}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <a 
                                href={`mailto:${student.studentEmail}`}
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <Mail className="w-3 h-3" />
                                {student.studentEmail}
                              </a>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">
                              {new Date(student.enrolledDate).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">
                              {student.attendance} buổi
                            </td>
                            <td className="py-3 px-4">
                              {student.averageGrade ? (
                                <Badge 
                                  variant={student.averageGrade >= 85 ? 'default' : 'secondary'}
                                >
                                  {student.averageGrade}
                                </Badge>
                              ) : (
                                <span className="text-sm text-gray-400">N/A</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
}