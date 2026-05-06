import React, { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  TrendingUp,
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  Clock,
  Award,
  Target,
  BarChart3,
  FileSpreadsheet
} from 'lucide-react';
import { PageHeader } from '@/shared/components/common';
import { SemesterSelector } from '@/shared/components/common';
import { getSelectedSemester, saveSelectedSemester, type Semester } from '@/shared/data/semesterData';

export default function AdminReports() {
  const [selectedSemester, setSelectedSemester] = useState<Semester>(getSelectedSemester());

  const handleSemesterChange = (semester: Semester) => {
    setSelectedSemester(semester);
    saveSelectedSemester(semester.id);
  };

  // Comparison data between current and previous semester
  const semesterComparison = [
    { 
      label: 'Lớp học', 
      current: 45, 
      previous: 38,
      icon: Users,
      color: 'blue'
    },
    { 
      label: 'Khóa học', 
      current: 125, 
      previous: 98,
      icon: BookOpen,
      color: 'green'
    },
    { 
      label: 'Sinh viên', 
      current: 623, 
      previous: 542,
      icon: GraduationCap,
      color: 'purple'
    },
    { 
      label: 'Giảng viên', 
      current: 42, 
      previous: 38,
      icon: Award,
      color: 'orange'
    },
  ];

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'bgLight') => {
    const colors: Record<string, Record<string, string>> = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', bgLight: 'bg-blue-100' },
      green: { bg: 'bg-green-500', text: 'text-green-600', bgLight: 'bg-green-100' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', bgLight: 'bg-purple-100' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', bgLight: 'bg-orange-100' },
    };
    return colors[color][type];
  };

  const topCourses = [
    { name: 'Lập trình Web với React', students: 156, completion: 78 },
    { name: 'Python for Beginners', students: 142, completion: 82 },
    { name: 'Data Structures & Algorithms', students: 128, completion: 65 },
    { name: 'Machine Learning Basics', students: 98, completion: 71 },
    { name: 'UI/UX Design Fundamentals', students: 87, completion: 88 },
  ];

  const topTeachers = [
    { name: 'Dr. Sarah Smith', courses: 8, students: 324, rating: 4.9 },
    { name: 'Prof. John Anderson', courses: 5, students: 245, rating: 4.8 },
    { name: 'Dr. Lisa Chen', courses: 6, students: 289, rating: 4.7 },
    { name: 'Dr. Robert Taylor', courses: 3, students: 156, rating: 4.6 },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Báo cáo & Thống kê"
          description="Phân tích hiệu suất và xu hướng của hệ thống"
          gradient="from-purple-600 via-pink-600 to-red-600"
        />

        {/* Semester Selector */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-4">
              <SemesterSelector 
                selectedSemester={selectedSemester}
                onSemesterChange={handleSemesterChange}
              />
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">+12.5%</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Tăng trưởng tháng này</p>
              <p className="text-2xl font-bold text-gray-900">260</p>
              <p className="text-xs text-gray-500 mt-1">Học sinh mới</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">+8 mới</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Khóa học hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">125</p>
              <p className="text-xs text-gray-500 mt-1">32 tạo tháng này</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">+15.2%</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Tỷ lệ hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900">76%</p>
              <p className="text-xs text-gray-500 mt-1">Trung bình các khóa học</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">+9.8%</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Điểm TB hệ thống</p>
              <p className="text-2xl font-bold text-gray-900">8.4</p>
              <p className="text-xs text-gray-500 mt-1">Trên thang điểm 10</p>
            </CardContent>
          </Card>
        </div>

        {/* Semester Comparison Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>So sánh với kỳ trước</CardTitle>
            <CardDescription>Thống kê số lượng lớp học, khóa học, sinh viên và giảng viên</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {semesterComparison.map((item, index) => {
                const Icon = item.icon;
                const maxValue = Math.max(item.current, item.previous);
                const currentHeight = (item.current / maxValue) * 100;
                const previousHeight = (item.previous / maxValue) * 100;
                const change = ((item.current - item.previous) / item.previous * 100).toFixed(1);
                const isPositive = item.current >= item.previous;

                return (
                  <div key={index} className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(item.color, 'bgLight')}`}>
                        <Icon className={`w-5 h-5 ${getColorClasses(item.color, 'text')}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{change}%
                        </p>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="flex items-end gap-4 h-40">
                      {/* Previous Semester Bar */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex items-end justify-center h-32">
                          <div 
                            className="w-full bg-gray-300 rounded-t-lg transition-all duration-500 flex items-end justify-center pb-2"
                            style={{ height: `${previousHeight}%`, minHeight: '30px' }}
                          >
                            <span className="text-xs font-bold text-gray-700">{item.previous}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">Kỳ trước</p>
                      </div>

                      {/* Current Semester Bar */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex items-end justify-center h-32">
                          <div 
                            className={`w-full ${getColorClasses(item.color, 'bg')} rounded-t-lg transition-all duration-500 flex items-end justify-center pb-2`}
                            style={{ height: `${currentHeight}%`, minHeight: '30px' }}
                          >
                            <span className="text-xs font-bold text-white">{item.current}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-900 font-bold">Kỳ này</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 khóa học phổ biến</CardTitle>
              <CardDescription>Dựa trên số lượng học viên đăng ký</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCourses.map((course, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{course.name}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {course.students} học viên
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {course.completion}% hoàn thành
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Teachers */}
          <Card>
            <CardHeader>
              <CardTitle>Giáo viên xuất sắc</CardTitle>
              <CardDescription>Dựa trên đánh giá và số lượng học viên</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTeachers.map((teacher, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{teacher.name}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {teacher.courses} khóa học
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {teacher.students} học viên
                        </span>
                        <span className="flex items-center gap-1">
                          ⭐ {teacher.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thời gian học TB</p>
                  <p className="text-2xl font-bold text-gray-900">4.5h</p>
                  <p className="text-xs text-gray-500 mt-1">Mỗi tuần/học viên</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chứng chỉ cấp</p>
                  <p className="text-2xl font-bold text-gray-900">342</p>
                  <p className="text-xs text-gray-500 mt-1">Tháng này</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mục tiêu hoàn thành</p>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                  <p className="text-xs text-gray-500 mt-1">Đạt chỉ tiêu tháng</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}