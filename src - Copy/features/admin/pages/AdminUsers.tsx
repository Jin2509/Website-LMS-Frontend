import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PageHeader } from '@/shared/components/common';
import { allUsers, UserAccount } from '../data/adminData';
import { exportToExcel } from '@/lib/excelUtils';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Search,Mail, Calendar, CheckCircle, Edit, Trash2, BookOpen,FileDown, UserPlus } from 'lucide-react';
import { Input } from "@/shared/components/ui/input";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');

  // Load created users from localStorage
  const loadCreatedUsers = (): UserAccount[] => {
    const stored = localStorage.getItem('createdUsers');
    return stored ? JSON.parse(stored) : [];
  };

  // Merge demo users with created users
  const allUsersData = [...allUsers, ...loadCreatedUsers()];

  const filteredUsers = allUsersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const students = allUsersData.filter(u => u.role === 'student');
  const teachers = allUsersData.filter(u => u.role === 'teacher');
  const activeUsers = allUsersData.filter(u => u.status === 'active');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      case 'suspended':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Không hoạt động';
      case 'suspended':
        return 'Đã khóa';
      default:
        return status;
    }
  };

  // Function to export users to Excel
  const exportUsersToExcel = async () => {
    try {
      // Prepare data with Vietnamese headers
      const exportData = allUsersData.map(user => ({
        'Họ và tên': user.name,
        'Email': user.email,
        'Vai trò': user.role === 'student' ? 'Học sinh' : 'Giáo viên',
        'Trạng thái': getStatusText(user.status),
        'Ngày tham gia': user.joinDate,
        'Hoạt động cuối': user.lastActive,
        'Số khóa học': user.role === 'student' ? user.coursesEnrolled : user.coursesTeaching,
      }));

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `Danh_sach_nguoi_dung_${currentDate}.xlsx`;

      // Export to Excel
      await exportToExcel(exportData, filename);
      
      toast.success(`Đã xuất ${allUsersData.length} người dùng ra file Excel!`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Có lỗi xảy ra khi xuất file Excel');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Quản lý người dùng"
          description={`${allUsersData.length} tài khoản • ${students.length} học sinh • ${teachers.length} giáo viên`}
          gradient="from-blue-600 via-indigo-600 to-purple-600"
          actions={
            <div className="flex gap-2">
              <Button onClick={exportUsersToExcel} variant="outline" className="gap-2">
                <FileDown className="w-5 h-5" />
                Xuất Excel
              </Button>
              <Button onClick={() => navigate('/admin/users/create')} className="gap-2">
                <UserPlus className="w-5 h-5" />
                Tạo tài khoản mới
              </Button>
            </div>
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tổng số</p>
                  <p className="text-2xl font-bold">{allUsersData.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Học sinh</p>
                  <p className="text-2xl font-bold">{students.length}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Giáo viên</p>
                  <p className="text-2xl font-bold">{teachers.length}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
                  <p className="text-2xl font-bold">{activeUsers.length}</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="student">Học sinh</option>
                  <option value="teacher">Giáo viên</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="suspended">Đã khóa</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
            <CardDescription>Quản lý tất cả tài khoản trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Người dùng</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Vai trò</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thống kê</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ngày tham gia</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Hoạt động cuối</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={user.role === 'teacher' ? 'default' : 'secondary'}>
                          {user.role === 'student' ? '🎓 Học sinh' : '👨‍🏫 Giáo viên'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(user.status)}>
                          {getStatusText(user.status)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">
                          {user.role === 'student' ? (
                            <span>{user.coursesEnrolled} khóa học</span>
                          ) : (
                            <span>{user.coursesTeaching} khóa học</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {user.joinDate}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">{user.lastActive}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Không tìm thấy người dùng nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}