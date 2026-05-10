import { useState, useEffect, useMemo } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  TrendingUp,
  Users,
  BookOpen,
  GraduationCap,
  Award,
  Target,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { PageHeader } from '@/shared/components/common';
import { SemesterSelector } from '@/shared/components/common';
import { getSelectedSemester, saveSelectedSemester, semesters } from '@/shared/data/semesterData';
import { reportService, type AdminSemesterComparison, type TopCourse, type TopTeacher } from '@/core/service/report.service';
import { toast } from 'sonner';

export default function AdminReports() {
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>(getSelectedSemester().id);
  const [isLoading, setIsLoading] = useState(true);
  const [semesterComparison, setSemesterComparison] = useState<AdminSemesterComparison[]>([]);
  const [topCourses, setTopCourses] = useState<TopCourse[]>([]);
  const [topTeachers, setTopTeachers] = useState<TopTeacher[]>([]);

  useEffect(() => {
    fetchReportData();
  }, [selectedSemesterId]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      // Chuyển đổi ID từ string sang number nếu Backend yêu cầu, hoặc giữ nguyên
      const semesterId = selectedSemesterId === 'all' ? 0 : parseInt(selectedSemesterId.replace(/\D/g, '')) || 0;
      
      const [comparisonData, coursesData, teachersData] = await Promise.all([
        reportService.getAdminSemesterComparison(semesterId),
        reportService.getAdminTopCourses(),
        reportService.getAdminTopTeachers()
      ]);

      setSemesterComparison(comparisonData || []);
      setTopCourses(coursesData || []);
      setTopTeachers(teachersData || []);
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Không thể tải dữ liệu báo cáo. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSemesterChange = (semesterId: string) => {
    setSelectedSemesterId(semesterId);
    saveSelectedSemester(semesterId);
  };

  const getColorClasses = (label: string, type: 'bg' | 'text' | 'bgLight') => {
    const colorMap: Record<string, string> = {
      'Lớp học': 'blue',
      'Khóa học': 'green',
      'Sinh viên': 'purple',
      'Giảng viên': 'orange',
    };
    
    const color = colorMap[label] || 'blue';
    const colors: Record<string, Record<string, string>> = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', bgLight: 'bg-blue-100' },
      green: { bg: 'bg-green-500', text: 'text-green-600', bgLight: 'bg-green-100' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', bgLight: 'bg-purple-100' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', bgLight: 'bg-orange-100' },
    };
    return colors[color][type];
  };

  const getIconForLabel = (label: string) => {
    switch (label) {
      case 'Lớp học': return Users;
      case 'Khóa học': return BookOpen;
      case 'Sinh viên': return GraduationCap;
      case 'Giảng viên': return Award;
      default: return Target;
    }
  };

  // Tính toán các chỉ số Key Metrics từ dữ liệu SemesterComparison
  const keyMetrics = useMemo(() => {
    const findMetric = (label: string) => semesterComparison.find(m => m.label === label);
    const students = findMetric('Sinh viên');
    const courses = findMetric('Khóa học');
    
    return [
      {
        label: 'Tăng trưởng SV',
        value: students ? students.current : 0,
        subtext: 'Học sinh mới',
        growth: students && students.previous ? (((students.current - students.previous) / students.previous) * 100).toFixed(1) + '%' : '0%',
        icon: TrendingUp,
        color: 'blue'
      },
      {
        label: 'Khóa học hoạt động',
        value: courses ? courses.current : 0,
        subtext: `${courses && courses.current - courses.previous > 0 ? '+' + (courses.current - courses.previous) : '0'} mới`,
        growth: courses && courses.previous ? (((courses.current - courses.previous) / courses.previous) * 100).toFixed(1) + '%' : '0%',
        icon: BookOpen,
        color: 'green'
      },
      {
        label: 'Tỷ lệ hoàn thành',
        value: '76%', // Dữ liệu này có thể lấy từ một API khác nếu cần
        subtext: 'Trung bình hệ thống',
        growth: '+15.2%',
        icon: GraduationCap,
        color: 'purple'
      },
      {
        label: 'Điểm TB hệ thống',
        value: '8.4',
        subtext: 'Thang điểm 10',
        growth: '+9.8%',
        icon: Award,
        color: 'orange'
      }
    ];
  }, [semesterComparison]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <PageHeader
          title="Báo cáo & Thống kê"
          description="Phân tích hiệu suất và xu hướng của toàn hệ thống dựa trên dữ liệu thực tế"
          gradient="from-purple-600 via-pink-600 to-red-600"
        />

        {/* Semester Selector */}
        <div className="mb-8">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <SemesterSelector 
                semesters={semesters}
                selectedSemester={selectedSemesterId}
                onSemesterChange={handleSemesterChange}
              />
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium text-lg">Đang tổng hợp dữ liệu báo cáo...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {keyMetrics.map((metric, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${getColorClasses(metric.label, 'bgLight') || 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                        <metric.icon className={`w-6 h-6 ${getColorClasses(metric.label, 'text') || 'text-gray-600'}`} />
                      </div>
                      <span className={`text-sm font-bold ${metric.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.growth}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-1">{metric.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{metric.subtext}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Semester Comparison Chart */}
            <Card className="mb-8 border-none shadow-sm">
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-xl">So sánh hiệu suất kỳ học</CardTitle>
                <CardDescription>Dữ liệu đối chiếu giữa kỳ học hiện tại và kỳ học trước đó</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {semesterComparison.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>Không có dữ liệu so sánh cho kỳ học này</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {semesterComparison.map((item, index) => {
                      const Icon = getIconForLabel(item.label);
                      const maxValue = Math.max(item.current, item.previous, 1);
                      const currentHeight = (item.current / maxValue) * 100;
                      const previousHeight = (item.previous / maxValue) * 100;
                      const change = item.previous !== 0 ? ((item.current - item.previous) / item.previous * 100).toFixed(1) : '100';
                      const isPositive = item.current >= item.previous;

                      return (
                        <div key={index} className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${getColorClasses(item.label, 'bgLight')}`}>
                              <Icon className={`w-6 h-6 ${getColorClasses(item.label, 'text')}`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-800">{item.label}</p>
                              <p className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {isPositive ? '↑' : '↓'} {Math.abs(Number(change))}%
                              </p>
                            </div>
                          </div>

                          <div className="flex items-end gap-6 h-48 bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                            <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                              <div 
                                className="w-full bg-gray-200 rounded-t-xl transition-all duration-1000 ease-out flex items-end justify-center pb-3 hover:bg-gray-300"
                                style={{ height: `${previousHeight}%`, minHeight: '40px' }}
                              >
                                <span className="text-[10px] font-black text-gray-500 rotate-0">{item.previous}</span>
                              </div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kỳ trước</p>
                            </div>

                            <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                              <div 
                                className={`w-full ${getColorClasses(item.label, 'bg')} rounded-t-xl transition-all duration-1000 ease-out flex items-end justify-center pb-3 shadow-lg shadow-indigo-200/50 hover:brightness-110`}
                                style={{ height: `${currentHeight}%`, minHeight: '40px' }}
                              >
                                <span className="text-[10px] font-black text-white">{item.current}</span>
                              </div>
                              <p className="text-[10px] text-gray-900 font-black uppercase tracking-wider">Kỳ này</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Top Courses */}
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-indigo-50/30 border-b border-indigo-50">
                  <CardTitle className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Top 5 khóa học phổ biến
                  </CardTitle>
                  <CardDescription>Xếp hạng dựa trên số lượng học viên và tỷ lệ hoàn thành</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-50">
                    {topCourses.length === 0 ? (
                      <div className="p-10 text-center text-gray-400">Chưa có dữ liệu xếp hạng</div>
                    ) : (
                      topCourses.map((course, index) => (
                        <div key={index} className="flex items-center gap-4 p-5 hover:bg-gray-50/50 transition-colors group">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md ${
                            index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-indigo-300'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{course.name}</p>
                            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mt-1.5">
                              <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded-full">
                                <Users className="w-3 h-3" />
                                {course.studentsCount} học viên
                              </span>
                              <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                                <Target className="w-3 h-3" />
                                {course.completionRate}% hoàn thành
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Teachers */}
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-emerald-50/30 border-b border-emerald-50">
                  <CardTitle className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Giảng viên tiêu biểu
                  </CardTitle>
                  <CardDescription>Vinh danh dựa trên đánh giá tích cực và quy mô giảng dạy</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-50">
                    {topTeachers.length === 0 ? (
                      <div className="p-10 text-center text-gray-400">Chưa có dữ liệu vinh danh</div>
                    ) : (
                      topTeachers.map((teacher, index) => (
                        <div key={index} className="flex items-center gap-4 p-5 hover:bg-gray-50/50 transition-colors group">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-md border-2 border-white">
                            {teacher.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">{teacher.name}</p>
                            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mt-1.5">
                              <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded-full">
                                <BookOpen className="w-3 h-3" />
                                {teacher.coursesCount} khóa học
                              </span>
                              <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                                <Users className="w-3 h-3" />
                                {teacher.studentsCount} học viên
                              </span>
                              <span className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold">
                                ⭐ {teacher.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Thời gian học TB', value: '4.5h', sub: 'Mỗi tuần/học viên', icon: Clock, color: 'indigo' },
                { label: 'Chứng chỉ cấp', value: '342', sub: 'Tháng này', icon: Award, color: 'pink' },
                { label: 'Mục tiêu hoàn thành', value: '87%', sub: 'Đạt chỉ tiêu tháng', icon: Target, color: 'amber' }
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm hover:translate-y-[-4px] transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 bg-${stat.color}-100 rounded-2xl flex items-center justify-center shadow-inner`}>
                        <stat.icon className={`w-7 h-7 text-${stat.color}-600`} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-black text-gray-900 mt-0.5">{stat.value}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 italic">{stat.sub}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
