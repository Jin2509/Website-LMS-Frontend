import { useState, useEffect } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  TrendingUp,
  Users,
  BookOpen,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  UserPlus,
  ClipboardList,
  Loader2,
  Server,
  Database,
  HardDrive,
  Globe,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { SemesterSelector } from '@/shared/components/common';
import { getSelectedSemester, saveSelectedSemester, semesters } from '@/shared/data/semesterData';
import { dashboardService, type AdminDashboardStats, type Activity as SystemActivity } from '@/core/service/dashboard.service';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>(getSelectedSemester().id);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [activities, setActivities] = useState<SystemActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedSemesterId]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, activitiesData] = await Promise.all([
        dashboardService.getAdminStats(),
        dashboardService.getRecentActivities()
      ]);
      setStats(statsData);
      setActivities(activitiesData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSemesterChange = (semesterId: string) => {
    setSelectedSemesterId(semesterId);
    saveSelectedSemester(semesterId);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <UserPlus className="w-4 h-4" />;
      case 'course':
        return <BookOpen className="w-4 h-4" />;
      case 'assignment':
        return <ClipboardList className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'text-blue-600 bg-blue-100';
      case 'course':
        return 'text-green-600 bg-green-100';
      case 'assignment':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getHealthBg = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Đang tải dữ liệu quản trị...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Quản trị hệ thống
            </h1>
            <p className="text-gray-500 font-medium">Tổng quan hiệu suất và quản lý toàn bộ hệ thống LMS</p>
          </div>
          <Button 
            onClick={() => navigate('/admin/users/create')}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
          >
            <UserPlus className="w-5 h-5" />
            Tạo tài khoản mới
          </Button>
        </div>

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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng người dùng"
            value={stats?.totalUsers || 0}
            icon={Users}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-50"
          />
          <StatCard
            title="Tổng khóa học"
            value={stats?.totalCourses || 0}
            icon={BookOpen}
            iconColor="text-emerald-600"
            iconBgColor="bg-emerald-50"
          />
          <StatCard
            title="Bài tập đang chờ"
            value={stats?.pendingAssignments || 0}
            icon={ClipboardList}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-50"
          />
          <StatCard
            title="Tăng trưởng"
            value={`+${stats?.monthlyGrowth || 0}%`}
            icon={TrendingUp}
            iconColor="text-orange-600"
            iconBgColor="bg-orange-50"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none">Học sinh</Badge>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">{stats?.totalStudents || 0}</p>
              <p className="text-sm text-gray-500 font-medium">Học sinh đang hoạt động</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none">Giảng viên</Badge>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">{stats?.totalTeachers || 0}</p>
              <p className="text-sm text-gray-500 font-medium">Giảng viên đang giảng dạy</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-none">Lớp học</Badge>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">{stats?.activeCourses || 0}</p>
              <p className="text-sm text-gray-500 font-medium">Lớp học đang diễn ra</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Thao tác nhanh</CardTitle>
              <CardDescription>Các lối tắt quản trị thường dùng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Quản lý người dùng', icon: Users, path: '/admin/users' },
                { label: 'Quản lý khóa học', icon: BookOpen, path: '/admin/courses' },
                { label: 'Báo cáo thống kê', icon: Activity, path: '/admin/reports' },
                { label: 'Cài đặt hệ thống', icon: AlertCircle, path: '/admin/settings' },
              ].map((action, i) => (
                <Button 
                  key={i}
                  variant="outline" 
                  className="w-full justify-between gap-2 group hover:border-indigo-600 hover:text-indigo-600 transition-all h-12"
                  onClick={() => navigate(action.path)}
                >
                  <div className="flex items-center gap-2">
                    <action.icon className="w-4 h-4" />
                    <span className="font-semibold">{action.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Hoạt động gần đây</CardTitle>
                <CardDescription>Các hoạt động mới nhất trên toàn hệ thống</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-600 font-bold hover:bg-indigo-50">Xem tất cả</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {activities.length === 0 ? (
                  <div className="text-center py-20">
                    <Activity className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 font-medium">Chưa có hoạt động nào được ghi nhận</p>
                  </div>
                ) : (
                  activities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{activity.action}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <p className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-full">{activity.user}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(activity.timestamp).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health Status */}
        <Card className="mt-6 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Sức khỏe hệ thống</CardTitle>
            <CardDescription>Trạng thái hoạt động thời gian thực của các dịch vụ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Web Server', status: stats?.systemHealth.server || 'healthy', icon: Server },
                { name: 'Database', status: stats?.systemHealth.database || 'healthy', icon: Database },
                { name: 'Storage', status: 'healthy', icon: HardDrive, detail: stats?.systemHealth.storage || '75% còn trống' },
                { name: 'API Services', status: stats?.systemHealth.api || 'healthy', icon: Globe },
              ].map((service, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border ${getHealthBg(service.status as any)} transition-all hover:scale-[1.02]`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm`}>
                    <service.icon className={`w-5 h-5 ${service.status === 'healthy' ? 'text-green-600' : service.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">{service.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {getHealthIcon(service.status as any)}
                      <p className="text-[10px] font-black text-gray-600 truncate">
                        {service.detail || (service.status === 'healthy' ? 'HOẠT ĐỘNG TỐT' : service.status === 'warning' ? 'CẢNH BÁO' : 'GẶP SỰ CỐ')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  iconBgColor: string;
}

function StatCard({ title, value, icon: Icon, iconColor, iconBgColor }: StatCardProps) {
  return (
    <Card className="border-none shadow-sm hover:translate-y-[-4px] transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${iconBgColor}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
        <p className="text-3xl font-black text-gray-900 mb-1">{value}</p>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      </CardContent>
    </Card>
  );
}
