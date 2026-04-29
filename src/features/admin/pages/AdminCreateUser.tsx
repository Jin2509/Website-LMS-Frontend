import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PageHeader } from '@/shared/components/common';
import { UserAccount } from '../data/adminData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { readExcelFile, createExcelTemplate } from '@/lib/excelUtils';
import { Layout } from '@/shared/components/layout';
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

import { 
  ArrowLeft, 
  UserPlus, 
  Download, 
  Upload, 
  FileSpreadsheet 
} from "lucide-react"; 
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input"; 
import { Label } from "@/shared/components/ui/label"; 
import { Textarea } from "@/shared/components/ui/textarea"; 
export default function AdminCreateUser() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('single');
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [parsedUsers, setParsedUsers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: '',
    bio: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    // Create new user account
    const newUser: UserAccount = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role as 'student' | 'teacher',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0],
      coursesEnrolled: formData.role === 'student' ? 0 : undefined,
      coursesTeaching: formData.role === 'teacher' ? 0 : undefined,
    };

    // Save to localStorage
    const existingUsers = localStorage.getItem('createdUsers');
    const createdUsers = existingUsers ? JSON.parse(existingUsers) : [];
    createdUsers.push(newUser);
    localStorage.setItem('createdUsers', JSON.stringify(createdUsers));

    // Simulate API call
    toast.success('Tạo tài khoản thành công!');
    setTimeout(() => {
      navigate('/admin/users');
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFile(file);
      parseExcelFile(file);
    }
  };

  const parseExcelFile = async (file: File) => {
    try {
      const parsedData = await readExcelFile(file);
      setParsedUsers(parsedData.slice(1)); // Skip header row
      toast.success(`Đã đọc ${parsedData.length - 1} tài khoản từ file Excel`);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      toast.error('Có lỗi xảy ra khi đọc file Excel');
    }
  };

  const handleImportUsers = () => {
    if (parsedUsers.length === 0) {
      toast.error('Vui lòng tải lên file Excel trước');
      return;
    }

    const newUsers: UserAccount[] = parsedUsers
      .filter((row: any[]) => row[0] && row[1] && row[2]) // Filter valid rows
      .map((row: any[], index: number) => ({
        id: (Date.now() + index).toString(),
        name: row[0],
        email: row[1],
        role: row[2] === 'teacher' ? 'teacher' : 'student',
        status: 'active' as const,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        coursesEnrolled: row[2] === 'student' || row[2] === 'Học sinh' ? 0 : undefined,
        coursesTeaching: row[2] === 'teacher' || row[2] === 'Giáo viên' ? 0 : undefined,
      }));

    if (newUsers.length === 0) {
      toast.error('Không có dữ liệu hợp lệ để nhập');
      return;
    }

    // Save to localStorage
    const existingUsers = localStorage.getItem('createdUsers');
    const createdUsers = existingUsers ? JSON.parse(existingUsers) : [];
    createdUsers.push(...newUsers);
    localStorage.setItem('createdUsers', JSON.stringify(createdUsers));

    toast.success(`Đã tạo thành công ${newUsers.length} tài khoản!`);
    setTimeout(() => {
      navigate('/admin/users');
    }, 1000);
  };

  const downloadTemplate = async () => {
    try {
      const templateData = [
        ['Họ và tên', 'Email', 'Vai trò'],
        ['Nguyễn Văn A', 'nguyenvana@example.com', 'student'],
        ['Trần Thị B', 'tranthib@example.com', 'teacher'],
        ['Lê Văn C', 'levanc@example.com', 'student'],
      ];

      await createExcelTemplate(templateData, 'Mau_tao_tai_khoan.xlsx', 'Danh sách người dùng', [20, 30, 15]);
      toast.success('Đã tải xuống file mẫu');
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Có lỗi xảy ra khi tạo file mẫu');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/users')}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>

        <PageHeader
          title="Tạo tài khoản mới"
          description="Thêm học sinh hoặc giáo viên vào hệ thống"
          gradient="from-blue-600 via-indigo-600 to-purple-600"
        />

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="single">Tạo đơn lẻ</TabsTrigger>
            <TabsTrigger value="bulk">Nhập hàng loạt</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>Nhập thông tin cần thiết để tạo tài khoản</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name */}
                  <div>
                    <Label htmlFor="name">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Nguyễn Văn A"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <Label htmlFor="role">
                      Vai trò <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="student">🎓 Học sinh</option>
                      <option value="teacher">👨‍🏫 Giáo viên</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0123456789"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Bảo mật</CardTitle>
                  <CardDescription>Thiết lập mật khẩu cho tài khoản</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Password */}
                  <div>
                    <Label htmlFor="password">
                      Mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Label htmlFor="confirmPassword">
                      Xác nhận mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Thông tin bổ sung</CardTitle>
                  <CardDescription>Thông tin tùy chọn về người dùng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="bio">Giới thiệu</Label>
                    <Textarea
                      id="bio"
                      placeholder="Giới thiệu ngắn về người dùng..."
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mb-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/users')}
                >
                  Hủy bỏ
                </Button>
                <Button type="submit" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Tạo tài khoản
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="bulk">
            <Card>
              <CardHeader>
                <CardTitle>Tạo tài khoản hàng loạt từ file Excel</CardTitle>
                <CardDescription>
                  Tải lên file Excel chứa danh sách tài khoản cần tạo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Download Template */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 mb-1">Bước 1: Tải xuống file mẫu</h3>
                      <p className="text-sm text-blue-700 mb-3">
                        Tải file Excel mẫu để xem định dạng yêu cầu
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={downloadTemplate}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Tải xuống file mẫu
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Upload File */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Upload className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-1">Bước 2: Tải lên file Excel</h3>
                      <p className="text-sm text-green-700 mb-3">
                        Chọn file Excel chứa danh sách tài khoản ({parsedUsers.length} tài khoản đã đọc)
                      </p>
                      <Input
                        id="excelFile"
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileChange}
                        className="max-w-md"
                      />
                      {excelFile && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ Đã chọn file: {excelFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Format Information */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-900 mb-1">Định dạng file Excel</h3>
                      <div className="text-sm text-amber-700 space-y-1">
                        <p>• <strong>Cột 1:</strong> Họ và tên (bắt buộc)</p>
                        <p>• <strong>Cột 2:</strong> Email (bắt buộc)</p>
                        <p>• <strong>Cột 3:</strong> Vai trò - nhập "student" hoặc "teacher" (bắt buộc)</p>
                        <p className="mt-2 text-amber-600">
                          <strong>Lưu ý:</strong> Dòng đầu tiên là tiêu đề, dữ liệu bắt đầu từ dòng 2
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Table */}
                {parsedUsers.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Xem trước dữ liệu ({parsedUsers.length} tài khoản)</h3>
                    <div className="overflow-x-auto max-h-64 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="text-left py-2 px-3 border-b">#</th>
                            <th className="text-left py-2 px-3 border-b">Họ và tên</th>
                            <th className="text-left py-2 px-3 border-b">Email</th>
                            <th className="text-left py-2 px-3 border-b">Vai trò</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsedUsers.slice(0, 10).map((row: any[], index: number) => (
                            <tr key={index} className="border-b">
                              <td className="py-2 px-3">{index + 1}</td>
                              <td className="py-2 px-3">{row[0]}</td>
                              <td className="py-2 px-3">{row[1]}</td>
                              <td className="py-2 px-3">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  row[2] === 'teacher' || row[2] === 'Giáo viên'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {row[2] === 'teacher' || row[2] === 'Giáo viên' ? '👨‍🏫 Giáo viên' : '🎓 Học sinh'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {parsedUsers.length > 10 && (
                        <p className="text-sm text-gray-500 text-center py-2">
                          ... và {parsedUsers.length - 10} tài khoản khác
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Import Button */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/users')}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="button"
                    onClick={handleImportUsers}
                    disabled={parsedUsers.length === 0}
                    className="gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Tạo {parsedUsers.length} tài khoản
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