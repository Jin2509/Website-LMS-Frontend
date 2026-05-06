import React, { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';
import { exportToExcel } from '@/lib/excelUtils';

export default function StudentSchedule() {
  const [currentWeek, setCurrentWeek] = useState(0);

  // Get current week dates
  const getWeekDates = (weekOffset: number) => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeek);

  // Schedule data - organized by day and time
  const scheduleData = {
    monday: [
      {
        id: '1',
        courseName: 'Lập trình Web nâng cao',
        instructor: 'TS. Nguyễn Văn A',
        time: '08:00 - 10:00',
        location: 'Phòng A101',
        type: 'Lý thuyết',
        color: 'blue',
      },
      {
        id: '2',
        courseName: 'Cơ sở dữ liệu',
        instructor: 'ThS. Trần Thị B',
        time: '13:00 - 15:00',
        location: 'Phòng B203',
        type: 'Thực hành',
        color: 'green',
      },
    ],
    tuesday: [
      {
        id: '3',
        courseName: 'Trí tuệ nhân tạo',
        instructor: 'PGS.TS. Lê Văn C',
        time: '08:00 - 10:00',
        location: 'Phòng C305',
        type: 'Lý thuyết',
        color: 'purple',
      },
    ],
    wednesday: [
      {
        id: '4',
        courseName: 'Mạng máy tính',
        instructor: 'TS. Phạm Thị D',
        time: '10:00 - 12:00',
        location: 'Phòng D102',
        type: 'Lý thuyết',
        color: 'orange',
      },
      {
        id: '5',
        courseName: 'Lập trình Web nâng cao',
        instructor: 'TS. Nguyễn Văn A',
        time: '13:00 - 15:00',
        location: 'Phòng Lab 1',
        type: 'Thực hành',
        color: 'blue',
      },
    ],
    thursday: [
      {
        id: '6',
        courseName: 'Cơ sở dữ liệu',
        instructor: 'ThS. Trần Thị B',
        time: '08:00 - 10:00',
        location: 'Phòng E201',
        type: 'Lý thuyết',
        color: 'green',
      },
    ],
    friday: [
      {
        id: '7',
        courseName: 'Trí tuệ nhân tạo',
        instructor: 'PGS.TS. Lê Văn C',
        time: '10:00 - 12:00',
        location: 'Phòng Lab 2',
        type: 'Thực hành',
        color: 'purple',
      },
      {
        id: '8',
        courseName: 'Mạng máy tính',
        instructor: 'TS. Phạm Thị D',
        time: '14:00 - 16:00',
        location: 'Phòng Lab 3',
        type: 'Thực hành',
        color: 'orange',
      },
    ],
    saturday: [],
    sunday: [],
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Thứ 2', short: 'T2' },
    { key: 'tuesday', label: 'Thứ 3', short: 'T3' },
    { key: 'wednesday', label: 'Thứ 4', short: 'T4' },
    { key: 'thursday', label: 'Thứ 5', short: 'T5' },
    { key: 'friday', label: 'Thứ 6', short: 'T6' },
    { key: 'saturday', label: 'Thứ 7', short: 'T7' },
    { key: 'sunday', label: 'Chủ nhật', short: 'CN' },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 hover:border-blue-400',
      green: 'bg-green-50 border-green-200 hover:border-green-400',
      purple: 'bg-purple-50 border-purple-200 hover:border-purple-400',
      orange: 'bg-orange-50 border-orange-200 hover:border-orange-400',
      red: 'bg-red-50 border-red-200 hover:border-red-400',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBadgeColor = (type: string) => {
    return type === 'Lý thuyết' ? 'bg-blue-500' : 'bg-green-500';
  };

  const handleExportSchedule = async () => {
    try {
      const scheduleArray = daysOfWeek.flatMap((day) => {
        const daySchedule = scheduleData[day.key as keyof typeof scheduleData];
        return daySchedule.map((session) => ({
          'Thứ': day.label,
          'Thời gian': session.time,
          'Môn học': session.courseName,
          'Giảng viên': session.instructor,
          'Phòng': session.location,
          'Loại': session.type,
        }));
      });

      await exportToExcel(scheduleArray, 'Thoi_khoa_bieu.xlsx');
      toast.success('Xuất file thành công!');
    } catch (error) {
      console.error('Error exporting schedule:', error);
      toast.error('Xuất file thất bại!');
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Calculate statistics
  const totalClasses = Object.values(scheduleData).flat().length;
  const theoryClasses = Object.values(scheduleData).flat().filter(c => c.type === 'Lý thuyết').length;
  const practiceClasses = Object.values(scheduleData).flat().filter(c => c.type === 'Thực hành').length;
  const uniqueCourses = new Set(Object.values(scheduleData).flat().map(c => c.courseName)).size;

  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Thời khóa biểu
              </h1>
              <p className="text-gray-600 mt-1">Lịch học và hoạt động trong tuần</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Bell className="w-4 h-4" />
                Nhắc nhở
              </Button>
              <Button onClick={handleExportSchedule} className="gap-2">
                <Download className="w-4 h-4" />
                Xuất file
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng số tiết</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalClasses}</p>
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
                  <p className="text-sm text-gray-600">Lý thuyết</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{theoryClasses}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Thực hành</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{practiceClasses}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Môn học</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{uniqueCourses}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Week Navigation */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentWeek(currentWeek - 1)}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Tuần trước
              </Button>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  Tuần {currentWeek === 0 ? 'này' : currentWeek > 0 ? `+${currentWeek}` : currentWeek}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentWeek(currentWeek + 1)}
                className="gap-2"
              >
                Tuần sau
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {daysOfWeek.map((day, dayIndex) => {
            const daySchedule = scheduleData[day.key as keyof typeof scheduleData];
            const date = weekDates[dayIndex];
            const todayClass = isToday(date);

            return (
              <Card key={day.key} className={todayClass ? 'ring-2 ring-indigo-500' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{day.label}</CardTitle>
                      <CardDescription>{formatDate(date)}</CardDescription>
                    </div>
                    {todayClass && (
                      <Badge className="bg-indigo-500">Hôm nay</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {daySchedule.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Không có lịch học</p>
                    </div>
                  ) : (
                    daySchedule.map((session) => (
                      <div
                        key={session.id}
                        className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${getColorClasses(session.color)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm leading-tight flex-1">
                            {session.courseName}
                          </h4>
                          <Badge className={`${getBadgeColor(session.type)} text-white text-xs ml-2`}>
                            {session.type}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1.5 mt-3">
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="font-medium">{session.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{session.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <User className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{session.instructor}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Upcoming Classes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Lịch học sắp tới</CardTitle>
            <CardDescription>Các buổi học trong 24 giờ tới</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.values(scheduleData).flat().slice(0, 3).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                >
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${getColorClasses(session.color)}`}>
                    <BookOpen className="w-8 h-8 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{session.courseName}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {session.location}
                      </span>
                    </div>
                  </div>
                  <Badge className={`${getBadgeColor(session.type)} text-white`}>
                    {session.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}