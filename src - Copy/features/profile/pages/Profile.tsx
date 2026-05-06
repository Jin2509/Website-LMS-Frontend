import React from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { getCurrentUser } from '@/features/auth/services/auth';
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, GraduationCap } from 'lucide-react';

export default function Profile() {
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  const isStudent = user.role === 'student';

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Thông Tin Cá Nhân
          </h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin và cài đặt tài khoản của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                  <Badge className="mb-4">
                    {isStudent ? 'Học sinh' : 'Giáo viên'}
                  </Badge>
                  <p className="text-sm text-gray-600 mb-6">{user.email}</p>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-indigo-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Số điện thoại</p>
                        <p className="text-sm font-medium text-gray-900">+84 123 456 789</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Địa chỉ</p>
                        <p className="text-sm font-medium text-gray-900">Hà Nội, Việt Nam</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Thống kê</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isStudent ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Khóa học</p>
                          <p className="text-lg font-bold text-gray-900">4</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Điểm trung bình</p>
                          <p className="text-lg font-bold text-gray-900">90%</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Khóa học</p>
                          <p className="text-lg font-bold text-gray-900">8</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Học sinh</p>
                          <p className="text-lg font-bold text-gray-900">156</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tham gia</p>
                      <p className="text-lg font-bold text-gray-900">2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Chỉnh sửa thông tin</CardTitle>
                <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Họ</Label>
                      <Input id="firstName" placeholder="Nguyễn" defaultValue="Nguyễn" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Tên</Label>
                      <Input id="lastName" placeholder="Văn A" defaultValue={user.name.split(' ').slice(1).join(' ')} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" type="tel" placeholder="+84 123 456 789" defaultValue="+84 123 456 789" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input id="address" placeholder="Hà Nội, Việt Nam" defaultValue="Hà Nội, Việt Nam" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Giới thiệu</Label>
                    <textarea
                      id="bio"
                      className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={isStudent ? "Giới thiệu về bản thân..." : "Giới thiệu về kinh nghiệm giảng dạy..."}
                      defaultValue={isStudent ? "Tôi là học sinh năm 2, đam mê học tập và nghiên cứu." : "Giảng viên với 5 năm kinh nghiệm giảng dạy."}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">Lưu thay đổi</Button>
                    <Button type="button" variant="outline">Hủy</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
                <CardDescription>Cập nhật mật khẩu của bạn để bảo mật tài khoản</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button type="submit">Đổi mật khẩu</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}