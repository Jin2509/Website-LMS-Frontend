import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PageHeader } from '@/shared/components/common';
import { exportToExcel } from '@/lib/excelUtils';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Search, Mail, Calendar, CheckCircle, Edit, Trash2, BookOpen, FileDown, UserPlus, Loader2, UserX } from 'lucide-react';
import { Input } from "@/shared/components/ui/input";
import { userService, type User, type UserRole, type UserStatus } from '@/core/service/user.service';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const data = await userService.getAllUsers(params);
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [users, searchQuery]);

  const stats = useMemo(() => ({
    total: users.length,
    students: users.filter(u => u.role === 'STUDENT').length,
    teachers: users.filter(u => u.role === 'TEACHER').length,
    active: users.filter(u => u.status === 'ACTIVE').length,
  }), [users]);

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: UserStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'Hoạt động';
      case 'INACTIVE':
        return 'Không hoạt động';
      case 'SUSPENDED':
        return 'Đã khóa';
      default:
        return status;
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này? Thao tác này không thể hoàn tác.')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
        toast.success('Đã xóa người dùng thành công');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Không thể xóa người dùng. Vui lòng thử lại sau.');
      }
    }
  };

  const exportUsersToExcel = async () => {
    try {
      const exportData = filteredUsers.map(user => ({
        'Họ và tên': user.name,
        'Email': user.email,
        'Số điện thoại': user.phone || 'N/A',
        'Vai trò': user.role === 'STUDENT' ? 'Học sinh' : user.role === 'TEACHER' ? 'Giảng viên' : 'Admin',
        'Trạng thái': getStatusText(user.status),
        'Ngày tham gia': user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A',
      }));

      const currentDate = new Date().toISOString().split('T')[0];
      await exportToExcel(exportData, `Danh_sach_nguoi_dung_${currentDate}.xlsx`);
      toast.success(`Đã xuất ${filteredUsers.length} người dùng ra file Excel!`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Có lỗi xảy ra khi xuất file Excel');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <PageHeader
          title="Quản lý người dùng"
          description="Hệ thống quản lý tài khoản Học sinh, Giảng viên và Quản trị viên"
          gradient="from-blue-600 via-indigo-600 to-purple-600"
          actions={
            <div className="flex gap-3">
              <Button onClick={exportUsersToExcel} variant="outline" className="gap-2 shadow-sm border-gray-200 hover:bg-gray-50">
                <FileDown className="w-4 h-4" />
                Xuất Excel
              </Button>
              <Button onClick={() => navigate('/admin/users/create')} className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                <UserPlus className="w-4 h-4" />
                Tạo tài khoản mới
              </Button>
            </div>
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Tổng số tài khoản', value: stats.total, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Học sinh', value: stats.students, icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Giảng viên', value: stats.teachers, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Đang hoạt động', value: stats.active, icon: CheckCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center shadow-inner`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email người dùng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 border-gray-200 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="h-11 px-4 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="STUDENT">🎓 Học sinh</option>
                  <option value="TEACHER">👨‍🏫 Giảng viên</option>
                  <option value="ADMIN">🛡️ Quản trị viên</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="h-11 px-4 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Không hoạt động</option>
                  <option value="SUSPENDED">Đã khóa</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Danh sách tài khoản</CardTitle>
                <CardDescription>Hiển thị {filteredUsers.length} người dùng phù hợp</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Đang tải danh sách người dùng...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-20 bg-gray-50/30">
                <UserX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-lg">Không tìm thấy người dùng nào</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setRoleFilter('all'); setStatusFilter('all'); }} className="text-indigo-600">
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Người dùng</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Vai trò</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Thông tin liên hệ</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                      <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-indigo-50/20 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                              ) : user.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{user.name}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className={`font-semibold border-none ${
                            user.role === 'TEACHER' ? 'bg-purple-100 text-purple-700' : 
                            user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role === 'STUDENT' ? '🎓 Học sinh' : user.role === 'TEACHER' ? '👨‍🏫 Giảng viên' : '🛡️ Admin'}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className={`font-bold ${getStatusColor(user.status)}`}>
                            {getStatusText(user.status)}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600">
                            {user.phone || 'Chưa cập nhật'}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                              onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-gray-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteUser(user.id)}
                              title="Xóa tài khoản"
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
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
