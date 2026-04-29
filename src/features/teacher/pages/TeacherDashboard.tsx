import { useMemo } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { courses, assignments } from '@/shared/data';
import { Users, BookOpen, FileCheck, TrendingUp, Plus, MoreVertical, CheckCircle2, Clock, XCircle, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function TeacherDashboard() {
  const myCourses = courses.filter(c => c.instructor === 'Dr. Sarah Smith');
  const pendingGrading = assignments.filter(a => a.status === 'submitted').length;

  // Monthly progress data
  const monthlyProgress = useMemo(() => [
    { id: 'jan', month: 'Jan', students: 120, assignments: 45, exams: 12 },
    { id: 'feb', month: 'Feb', students: 135, assignments: 52, exams: 15 },
    { id: 'mar', month: 'Mar', students: 142, assignments: 58, exams: 18 },
    { id: 'apr', month: 'Apr', students: 148, assignments: 61, exams: 20 },
    { id: 'may', month: 'May', students: 153, assignments: 67, exams: 22 },
    { id: 'jun', month: 'Jun', students: 156, assignments: 73, exams: 25 },
  ], []);

  const stats = [
    {
      label: 'Tổng học sinh',
      value: '156',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Khóa học đang dạy',
      value: '8',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Bài tập chưa chấm',
      value: '23',
      icon: FileCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Điểm TB lớp',
      value: '87%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  // Mock detailed course statistics
  const courseStats = [
    {
      id: 1,
      title: 'Lập trình Web với React',
      totalStudents: 52,
      completedStudents: 38,
      assignments: {
        onTime: 42,
        late: 8,
        notSubmitted: 2,
      },
      exams: {
        participated: 48,
        total: 52,
      },
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    },
    {
      id: 2,
      title: 'JavaScript Nâng cao',
      totalStudents: 45,
      completedStudents: 32,
      assignments: {
        onTime: 38,
        late: 5,
        notSubmitted: 2,
      },
      exams: {
        participated: 42,
        total: 45,
      },
      image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
    },
    {
      id: 3,
      title: 'TypeScript Fundamentals',
      totalStudents: 38,
      completedStudents: 28,
      assignments: {
        onTime: 32,
        late: 4,
        notSubmitted: 2,
      },
      exams: {
        participated: 35,
        total: 38,
      },
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Bảng điều khiển giáo viên
            </h1>
            <p className="text-gray-600 mt-1">Quản lý khóa học và học sinh của bạn</p>
          </div>
          <Button className="gap-2" asChild>
            <Link to="/teacher/courses/create">
              <Plus className="w-4 h-4" />
              Tạo khóa học
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Monthly Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tổng quan tiến độ 6 tháng</CardTitle>
            <CardDescription>Theo dõi học sinh, bài tập và kiểm tra theo thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <div key="teacher-monthly-chart">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  id="teacher-monthly-progress-chart"
                  data={monthlyProgress}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid key="teacher-grid" strokeDasharray="3 3" />
                  <XAxis key="teacher-xaxis" dataKey="month" />
                  <YAxis key="teacher-yaxis" />
                  <Tooltip key="teacher-tooltip" />
                  <Legend key="teacher-legend" />
                  <Bar key="teacher-students-bar" dataKey="students" fill="#4F46E5" name="Học sinh hoạt động" radius={[8, 8, 0, 0]} />
                  <Bar key="teacher-assignments-bar" dataKey="assignments" fill="#F59E0B" name="Bài tập đã nộp" radius={[8, 8, 0, 0]} />
                  <Bar key="teacher-exams-bar" dataKey="exams" fill="#EF4444" name="Bài kiểm tra" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* My Courses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Khóa học của tôi</CardTitle>
              <CardDescription>Quản lý tài liệu giảng dạy</CardDescription>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/teacher/courses">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCourses.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <Badge className="mb-2">{course.category}</Badge>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        52 học sinh
                      </span>
                      <span>{course.totalLessons} bài học</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4" size="sm" asChild>
                      <Link to={`/teacher/courses/${course.id}`}>Quản lý</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Course Statistics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Thống kê chi tiết khóa học</CardTitle>
            <CardDescription>Theo dõi tiến độ học sinh, bài tập và kiểm tra theo từng khóa học</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {courseStats.map((course) => {
                const completionRate = ((course.completedStudents / course.totalStudents) * 100).toFixed(0);
                const examParticipationRate = ((course.exams.participated / course.exams.total) * 100).toFixed(0);
                const totalAssignments = course.assignments.onTime + course.assignments.late + course.assignments.notSubmitted;

                return (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:border-indigo-300 transition-all">
                    {/* Course Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.totalStudents} học sinh
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            {course.completedStudents} hoàn thành ({completionRate}%)
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/teacher/courses/${course.id}`}>Chi tiết</Link>
                      </Button>
                    </div>

                    {/* Statistics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Assignment Statistics */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <ClipboardCheck className="w-5 h-5 text-indigo-600" />
                          <h4 className="font-semibold text-gray-900">Tình trạng nộp bài tập</h4>
                        </div>
                        
                        <div className="space-y-3">
                          {/* On Time */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">Đúng hạn</span>
                              </div>
                              <span className="text-sm font-bold text-gray-900">
                                {course.assignments.onTime}/{totalAssignments}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(course.assignments.onTime / totalAssignments) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {((course.assignments.onTime / totalAssignments) * 100).toFixed(0)}% nộp đúng hạn
                            </p>
                          </div>

                          {/* Late */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-medium text-gray-700">Trễ hạn</span>
                              </div>
                              <span className="text-sm font-bold text-gray-900">
                                {course.assignments.late}/{totalAssignments}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(course.assignments.late / totalAssignments) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {((course.assignments.late / totalAssignments) * 100).toFixed(0)}% nộp trễ
                            </p>
                          </div>

                          {/* Not Submitted */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-gray-700">Chưa nộp</span>
                              </div>
                              <span className="text-sm font-bold text-gray-900">
                                {course.assignments.notSubmitted}/{totalAssignments}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(course.assignments.notSubmitted / totalAssignments) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {((course.assignments.notSubmitted / totalAssignments) * 100).toFixed(0)}% chưa nộp
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Exam Participation Statistics */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <FileCheck className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold text-gray-900">Tham gia kiểm tra</h4>
                        </div>

                        {/* Exam Participation Chart */}
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6">
                          <div className="flex items-center justify-center mb-4">
                            <div className="relative w-32 h-32">
                              <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                  cx="64"
                                  cy="64"
                                  r="56"
                                  stroke="currentColor"
                                  strokeWidth="12"
                                  fill="transparent"
                                  className="text-gray-200"
                                />
                                <circle
                                  cx="64"
                                  cy="64"
                                  r="56"
                                  stroke="currentColor"
                                  strokeWidth="12"
                                  fill="transparent"
                                  strokeDasharray={`${2 * Math.PI * 56}`}
                                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - course.exams.participated / course.exams.total)}`}
                                  className="text-purple-600 transition-all duration-1000"
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-2xl font-bold text-gray-900">{examParticipationRate}%</span>
                                <span className="text-xs text-gray-600">Tham gia</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700">Đã tham gia</span>
                              </div>
                              <span className="text-sm font-bold text-gray-900">{course.exams.participated} sinh viên</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700">Chưa tham gia</span>
                              </div>
                              <span className="text-sm font-bold text-gray-900">{course.exams.total - course.exams.participated} sinh viên</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}