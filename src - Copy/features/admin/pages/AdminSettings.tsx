import React, { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Settings,
  Mail,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Save
} from 'lucide-react';
import { PageHeader } from '@/shared/components/common';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'LMS Platform',
    siteDescription: 'Nền tảng học tập trực tuyến',
    adminEmail: 'admin@lms.com',
    supportEmail: 'support@lms.com',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'vi',
    enableRegistration: true,
    enableNotifications: true,
    enableEmailVerification: false,
    maxFileSize: '10',
    sessionTimeout: '30',
  });

  const handleSave = () => {
    toast.success('Đã lưu cài đặt thành công!');
  };

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Cài đặt hệ thống"
          description="Quản lý cấu hình và tùy chỉnh hệ thống"
          gradient="from-gray-600 via-slate-600 to-zinc-600"
        />

        {/* General Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              <CardTitle>Cài đặt chung</CardTitle>
            </div>
            <CardDescription>Thông tin cơ bản về hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Tên hệ thống</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Mô tả hệ thống</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timezone">Múi giờ</Label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                  <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                  <option value="America/New_York">New York (GMT-5)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="language">Ngôn ngữ</Label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <CardTitle>Cài đặt Email</CardTitle>
            </div>
            <CardDescription>Cấu hình email hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="adminEmail">Email quản trị</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => handleChange('adminEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="supportEmail">Email hỗ trợ</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              <CardTitle>Bảo mật</CardTitle>
            </div>
            <CardDescription>Cấu hình bảo mật và quyền truy cập</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Cho phép đăng ký mới</p>
                <p className="text-sm text-gray-600">Người dùng có thể tự đăng ký tài khoản</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableRegistration}
                  onChange={(e) => handleChange('enableRegistration', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Xác thực email</p>
                <p className="text-sm text-gray-600">Yêu cầu xác thực email khi đăng ký</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableEmailVerification}
                  onChange={(e) => handleChange('enableEmailVerification', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div>
              <Label htmlFor="sessionTimeout">Thời gian hết phiên (phút)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-green-600" />
              <CardTitle>Cài đặt hệ thống</CardTitle>
            </div>
            <CardDescription>Cấu hình kỹ thuật</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="maxFileSize">Kích thước file tối đa (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleChange('maxFileSize', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Kích thước tối đa cho file upload</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Thông báo hệ thống</p>
                <p className="text-sm text-gray-600">Gửi thông báo cho người dùng</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => handleChange('enableNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end mb-8">
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </Layout>
  );
}