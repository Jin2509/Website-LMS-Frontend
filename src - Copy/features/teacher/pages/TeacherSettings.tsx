import React, { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Globe,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  GraduationCap
} from 'lucide-react';
import { getCurrentUser } from '@/features/auth/services/auth';
import { toast } from 'sonner';

export default function TeacherSettings() {
  const user = getCurrentUser();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    teacherId: 'GV2026001',
    department: 'Khoa Công nghệ thông tin',
    position: 'Giảng viên',
    specialization: 'Phát triển Web, Cơ sở dữ liệu',
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    submissionNotifications: true,
    classReminders: true,
    studentQuestions: true,
    systemAnnouncements: true,
    weeklyReport: true,
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'vi',
    dateFormat: 'dd/mm/yyyy',
    timezone: 'Asia/Ho_Chi_Minh',
  });

  const handleSaveProfile = () => {
    try {
      // Update localStorage or send to API
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => 
        u.email === user?.email 
          ? { ...u, name: profile.name, phone: profile.phone, address: profile.address }
          : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update current user
      const currentUser = { ...user, name: profile.name };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      toast.success('Đã cập nhật thông tin cá nhân');
      
      // Reload to update UI
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Có lỗi xảy ra khi lưu thông tin');
    }
  };

  const handleChangePassword = () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      toast.success('Đã thay đổi mật khẩu thành công');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Có lỗi xảy ra khi đổi mật khẩu');
    }
  };

  const handleSaveNotifications = () => {
    try {
      localStorage.setItem('teacherNotificationSettings', JSON.stringify(notifications));
      toast.success('Đã lưu cài đặt thông báo');
    } catch (error) {
      console.error('Error saving notifications:', error);
      toast.error('Có lỗi xảy ra khi lưu cài đặt');
    }
  };

  const handleSaveAppearance = () => {
    try {
      localStorage.setItem('teacherAppearanceSettings', JSON.stringify(appearance));
      toast.success('Đã lưu cài đặt giao diện');
    } catch (error) {
      console.error('Error saving appearance:', error);
      toast.error('Có lỗi xảy ra khi lưu cài đặt');
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Cài đặt
          </h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và tùy chỉnh hệ thống</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Thông tin
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              Bảo mật
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Thông báo
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              Giao diện
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Cập nhật thông tin cá nhân và liên hệ của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-3xl">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Ảnh đại diện</h3>
                    <p className="text-sm text-gray-600 mb-3">PNG hoặc JPG, tối đa 2MB</p>
                    <Button variant="outline" size="sm">Tải ảnh lên</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        value={profile.email}
                        disabled
                        className="pl-10 bg-gray-50"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Email không thể thay đổi</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="0123456789"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacherId">Mã giảng viên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="teacherId"
                        value={profile.teacherId}
                        disabled
                        className="pl-10 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Khoa</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="department"
                        value={profile.department}
                        disabled
                        className="pl-10 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Chức vụ</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="position"
                        value={profile.position}
                        disabled
                        className="pl-10 bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Chuyên môn</Label>
                  <Input
                    id="specialization"
                    value={profile.specialization}
                    onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                    placeholder="Nhập chuyên môn của bạn"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      placeholder="Nhập địa chỉ của bạn"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline">Hủy</Button>
                  <Button onClick={handleSaveProfile} className="gap-2">
                    <Save className="w-4 h-4" />
                    Lưu thay đổi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Bảo mật</CardTitle>
                <CardDescription>
                  Quản lý mật khẩu và cài đặt bảo mật tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="oldPassword"
                        type={showOldPassword ? 'text' : 'password'}
                        value={passwordData.oldPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showOldPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Mật khẩu phải có ít nhất 6 ký tự</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })}>
                    Hủy
                  </Button>
                  <Button onClick={handleChangePassword} className="gap-2">
                    <Lock className="w-4 h-4" />
                    Đổi mật khẩu
                  </Button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="pt-6 border-t">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Xác thực hai yếu tố</h3>
                      <p className="text-sm text-gray-600">Tăng cường bảo mật tài khoản với xác thực 2FA</p>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      Chưa kích hoạt
                    </Badge>
                  </div>
                  <Button variant="outline" className="mt-4">Kích hoạt 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Thông báo</CardTitle>
                <CardDescription>
                  Quản lý các thông báo và nhắc nhở bạn muốn nhận
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Thông báo qua Email</p>
                        <p className="text-sm text-gray-600">Nhận thông báo qua địa chỉ email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Bài nộp mới</p>
                        <p className="text-sm text-gray-600">Nhận thông báo khi sinh viên nộp bài</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.submissionNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, submissionNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Nhắc nhở lớp học</p>
                        <p className="text-sm text-gray-600">Nhận nhắc nhở về lịch giảng dạy</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.classReminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, classReminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Câu hỏi từ sinh viên</p>
                        <p className="text-sm text-gray-600">Nhận thông báo khi sinh viên đặt câu hỏi</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.studentQuestions}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, studentQuestions: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Thông báo hệ thống</p>
                        <p className="text-sm text-gray-600">Nhận thông báo quan trọng từ hệ thống</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.systemAnnouncements}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, systemAnnouncements: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Báo cáo hàng tuần</p>
                        <p className="text-sm text-gray-600">Nhận báo cáo hoạt động giảng dạy hàng tuần</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline">Khôi phục mặc định</Button>
                  <Button onClick={handleSaveNotifications} className="gap-2">
                    <Save className="w-4 h-4" />
                    Lưu cài đặt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Giao diện</CardTitle>
                <CardDescription>
                  Tùy chỉnh giao diện và ngôn ngữ hiển thị
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Chủ đề</Label>
                    <select
                      id="theme"
                      value={appearance.theme}
                      onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="light">Sáng</option>
                      <option value="dark">Tối</option>
                      <option value="auto">Tự động</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Ngôn ngữ</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        id="language"
                        value={appearance.language}
                        onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Định dạng ngày</Label>
                    <select
                      id="dateFormat"
                      value={appearance.dateFormat}
                      onChange={(e) => setAppearance({ ...appearance, dateFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                      <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                      <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Múi giờ</Label>
                    <select
                      id="timezone"
                      value={appearance.timezone}
                      onChange={(e) => setAppearance({ ...appearance, timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                      <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                      <option value="Asia/Singapore">Singapore (GMT+8)</option>
                      <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline">Khôi phục mặc định</Button>
                  <Button onClick={handleSaveAppearance} className="gap-2">
                    <Save className="w-4 h-4" />
                    Lưu cài đặt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}