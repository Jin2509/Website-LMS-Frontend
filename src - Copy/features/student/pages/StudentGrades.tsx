import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  Award,
  TrendingUp,
  TrendingDown,
  BookOpen,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function StudentGrades() {
  // Mock data for grades
  const gradesByCourse = [
    {
      id: '1',
      courseName: 'Lập trình Web nâng cao',
      instructor: 'TS. Nguyễn Văn A',
      averageGrade: 92,
      assignments: [
        { name: 'Bài tập 1', grade: 95, maxGrade: 100, submittedDate: '2026-03-01', status: 'graded' },
        { name: 'Bài tập 2', grade: 88, maxGrade: 100, submittedDate: '2026-03-15', status: 'graded' },
        { name: 'Bài tập 3', grade: 93, maxGrade: 100, submittedDate: '2026-03-28', status: 'graded' },
      ],
      attendance: 95,
      totalClasses: 20,
      attendedClasses: 19,
    },
    {
      id: '2',
      courseName: 'Cơ sở dữ liệu',
      instructor: 'ThS. Trần Thị B',
      averageGrade: 88,
      assignments: [
        { name: 'Bài tập 1', grade: 90, maxGrade: 100, submittedDate: '2026-03-05', status: 'graded' },
        { name: 'Bài tập 2', grade: 85, maxGrade: 100, submittedDate: '2026-03-18', status: 'graded' },
        { name: 'Bài tập 3', grade: 89, maxGrade: 100, submittedDate: '2026-03-30', status: 'graded' },
      ],
      attendance: 90,
      totalClasses: 20,
      attendedClasses: 18,
    },
    {
      id: '3',
      courseName: 'Trí tuệ nhân tạo',
      instructor: 'PGS.TS. Lê Văn C',
      averageGrade: 85,
      assignments: [
        { name: 'Bài tập 1', grade: 82, maxGrade: 100, submittedDate: '2026-03-03', status: 'graded' },
        { name: 'Bài tập 2', grade: 87, maxGrade: 100, submittedDate: '2026-03-17', status: 'graded' },
        { name: 'Bài tập 3', grade: 86, maxGrade: 100, submittedDate: '2026-03-29', status: 'graded' },
      ],
      attendance: 85,
      totalClasses: 20,
      attendedClasses: 17,
    },
    {
      id: '4',
      courseName: 'Mạng máy tính',
      instructor: 'TS. Phạm Thị D',
      averageGrade: 90,
      assignments: [
        { name: 'Bài tập 1', grade: 91, maxGrade: 100, submittedDate: '2026-03-02', status: 'graded' },
        { name: 'Bài tập 2', grade: 89, maxGrade: 100, submittedDate: '2026-03-16', status: 'graded' },
        { name: 'Bài tập 3', grade: 90, maxGrade: 100, submittedDate: '2026-03-27', status: 'graded' },
      ],
      attendance: 100,
      totalClasses: 20,
      attendedClasses: 20,
    },
  ];

  // Calculate overall statistics
  const totalAssignments = gradesByCourse.reduce((sum, course) => sum + course.assignments.length, 0);
  const completedAssignments = gradesByCourse.reduce(
    (sum, course) => sum + course.assignments.filter(a => a.status === 'graded').length, 
    0
  );
  const overallGPA = (gradesByCourse.reduce((sum, course) => sum + course.averageGrade, 0) / gradesByCourse.length).toFixed(1);
  const overallAttendance = (gradesByCourse.reduce((sum, course) => sum + course.attendance, 0) / gradesByCourse.length).toFixed(0);

  // Grade distribution data
  const gradeDistribution = [
    { range: '90-100', count: 8, color: '#22c55e' },
    { range: '80-89', count: 4, color: '#3b82f6' },
    { range: '70-79', count: 0, color: '#f59e0b' },
    { range: '60-69', count: 0, color: '#ef4444' },
  ];

  // Progress over time
  const progressData = [
    { month: 'Tháng 1', gpa: 87, id: 'month-1' },
    { month: 'Tháng 2', gpa: 89, id: 'month-2' },
    { month: 'Tháng 3', gpa: 90, id: 'month-3' },
    { month: 'Tháng 4', gpa: 88.75, id: 'month-4' },
  ];

  // Performance by course type
  const performanceByType = [
    { name: 'Xuất sắc (90-100)', value: 67, color: '#22c55e' },
    { name: 'Giỏi (80-89)', value: 33, color: '#3b82f6' },
    { name: 'Khá (70-79)', value: 0, color: '#f59e0b' },
    { name: 'Trung bình (60-69)', value: 0, color: '#ef4444' },
  ];

  const stats = [
    {
      label: 'Điểm trung bình',
      value: overallGPA,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+2.5%',
      trend: 'up',
    },
    {
      label: 'Bài tập hoàn thành',
      value: `${completedAssignments}/${totalAssignments}`,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '100%',
      trend: 'up',
    },
    {
      label: 'Tỷ lệ tham gia',
      value: `${overallAttendance}%`,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+5%',
      trend: 'up',
    },
    {
      label: 'Khóa học đang học',
      value: gradesByCourse.length.toString(),
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+1',
      trend: 'up',
    },
  ];

  const getGradeStatus = (grade: number) => {
    if (grade >= 90) return { label: 'Xuất sắc', color: 'bg-green-500' };
    if (grade >= 80) return { label: 'Giỏi', color: 'bg-blue-500' };
    if (grade >= 70) return { label: 'Khá', color: 'bg-yellow-500' };
    if (grade >= 60) return { label: 'Trung bình', color: 'bg-orange-500' };
    return { label: 'Yếu', color: 'bg-red-500' };
  };

  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Điểm số & Lịch sử học tập
          </h1>
          <p className="text-gray-600 mt-1">Theo dõi kết quả học tập và tiến độ của bạn</p>
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
                    <div className="flex items-center gap-1">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="courses">Theo khóa học</TabsTrigger>
            <TabsTrigger value="history">Lịch sử</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Xu hướng điểm số</CardTitle>
                  <CardDescription>Theo dõi sự tiến bộ theo thời gian</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid key="cartesian-grid-line" strokeDasharray="3 3" />
                      <XAxis key="xaxis-line" dataKey="month" />
                      <YAxis key="yaxis-line" domain={[0, 100]} />
                      <Tooltip key="tooltip-line" />
                      <Legend key="legend-line" />
                      <Line 
                        key="line-gpa"
                        type="monotone" 
                        dataKey="gpa" 
                        stroke="#8884d8" 
                        strokeWidth={2} 
                        name="Điểm TB" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Phân bố kết quả</CardTitle>
                  <CardDescription>Tỷ lệ phần trăm theo từng mức điểm</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={performanceByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {performanceByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Grade Distribution */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Phân bố điểm số</CardTitle>
                  <CardDescription>Số lượng bài tập theo từng khoảng điểm</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={gradeDistribution}>
                      <CartesianGrid key="cartesian-grid-bar" strokeDasharray="3 3" />
                      <XAxis key="xaxis-bar" dataKey="range" />
                      <YAxis key="yaxis-bar" />
                      <Tooltip key="tooltip-bar" />
                      <Legend key="legend-bar" />
                      <Bar key="bar-count" dataKey="count" fill="#8884d8" name="Số bài tập">
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {gradesByCourse.map((course) => {
              const gradeStatus = getGradeStatus(course.averageGrade);
              return (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{course.courseName}</CardTitle>
                        <CardDescription>{course.instructor}</CardDescription>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Điểm trung bình</p>
                          <p className="text-3xl font-bold text-gray-900">{course.averageGrade}</p>
                        </div>
                        <Badge className={`${gradeStatus.color} text-white`}>
                          {gradeStatus.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Attendance */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-semibold text-gray-900">Tỷ lệ tham gia</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          {course.attendedClasses}/{course.totalClasses} buổi ({course.attendance}%)
                        </span>
                      </div>
                      <Progress value={course.attendance} className="h-2" />
                    </div>

                    {/* Assignments */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Bài tập
                      </h4>
                      <div className="space-y-2">
                        {course.assignments.map((assignment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="font-medium text-gray-900">{assignment.name}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span>Nộp: {assignment.submittedDate}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">
                                {assignment.grade}/{assignment.maxGrade}
                              </p>
                              <Badge variant={assignment.grade >= 90 ? 'default' : 'secondary'}>
                                {((assignment.grade / assignment.maxGrade) * 100).toFixed(0)}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử nộp bài</CardTitle>
                <CardDescription>Tất cả bài tập đã nộp gần đây</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gradesByCourse.flatMap(course =>
                    course.assignments.map(assignment => ({
                      ...assignment,
                      courseName: course.courseName,
                      instructor: course.instructor,
                    }))
                  ).sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
                    .map((item, index) => {
                      const percentage = (item.grade / item.maxGrade) * 100;
                      const isPassed = percentage >= 60;
                      
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPassed ? 'bg-green-100' : 'bg-red-100'}`}>
                            {isPassed ? (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{item.name}</h4>
                              <Badge variant="outline">{item.courseName}</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {item.submittedDate}
                              </span>
                              <span>•</span>
                              <span>{item.instructor}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {item.grade}/{item.maxGrade}
                            </p>
                            <Badge variant={percentage >= 90 ? 'default' : percentage >= 60 ? 'secondary' : 'destructive'}>
                              {percentage.toFixed(0)}%
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}