import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PageHeader } from '@/shared/components/common';
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
  FileSpreadsheet,
  Loader2 
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
import { userService, type UserRole } from '@/core/service/user.service';

export default function AdminCreateUser() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('single');
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [parsedUsers, setParsedUsers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' as UserRole,
    phone: '',
    bio: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);
    try {
      await userService.createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        status: 'ACTIVE'
      });

      toast.success('Tạo tài khoản thành công!');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Có lỗi xảy ra khi tạo tài khoản. Email có thể đã tồn tại.');
    } finally {
      setIsSubmitting(false);
    }
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

  const handleImportUsers = async () => {
    if (parsedUsers.length === 0) {
      toast.error('Vui lòng tải lên file Excel trước');
      return;
    }

    setIsSubmitting(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Process users sequentially to avoid overloading the server or handling race conditions
      for (const row of parsedUsers) {
        if (row[0] && row[1] && row[2]) {
          try {
            const role = (row[2].toString().toLowerCase().includes('teacher') || 
                         row[2].toString().toLowerCase().includes('giảng viên')) 
                         ? 'TEACHER' : 'STUDENT';
            
            await userService.createUser({
              name: row[0],
              email: row[1],
              role: role as UserRole,
              status: 'ACTIVE',
              password: 'User@123' // Default password for bulk import
            });
            successCount++;
          } catch (err) {
            console.error(`Failed to import user ${row[1]}:`, err);
            failCount++;
          }
        }
      }

      if (successCount > 0) {
        toast.success(`Đã tạo thành công ${successCount} tài khoản!`);
        if (failCount > 0) {
          toast.warning(`${failCount} tài khoản không thể tạo (có thể do trùng email).`);
        }
        navigate('/admin/users');
      } else {
        toast.error('Không có tài khoản nào được tạo thành công.');
      }
    } catch (error) {
      console.error('Error importing users:', error);
      toast.error('Có lỗi xảy ra trong quá trình nhập dữ liệu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const templateData = [
        ['Họ và tên', 'Email', 'Vai trò (student/teacher)'],
        ['Nguyễn Văn A', 'student1@example.com', 'student'],
        ['Trần Thị B', 'teacher1@example.com', 'teacher'],
      ];

      await createExcelTemplate(templateData, 'Mau_tao_tai_khoan.xlsx', 'Danh sách người dùng', [25, 35, 20]);
      toast.success('Đã tải xuống file mẫu');
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Có lỗi xảy ra khi tạo file mẫu');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/users')}
          className="mb-4 gap-2 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>

        <PageHeader
          title="Tạo tài khoản mới"
          description="Thêm Học sinh hoặc Giảng viên mới vào hệ thống quản lý"
          gradient="from-blue-600 via-indigo-600 to-purple-600"
        />

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="single">Tạo đơn lẻ</TabsTrigger>
            <TabsTrigger value="bulk">Nhập hàng loạt (Excel)</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="animate-in fade-in duration-300">
            <form onSubmit={handleSubmit}>
              <Card className="mb-6 border-none shadow-sm">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                  <CardTitle>Thông tin tài khoản</CardTitle>
                  <CardDescription>Các thông tin định danh cơ bản của người dùng</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-semibold text-gray-700">
                        Họ và tên <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="VD: Nguyễn Văn A"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold text-gray-700">
                        Email đăng nhập <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="font-semibold text-gray-700">
                        Vai trò hệ thống <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                        className="w-full h-11 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                        required
                      >
                        <option value="STUDENT">🎓 Học sinh</option>
                        <option value="TEACHER">👨‍🏫 Giảng viên</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-semibold text-gray-700">Số điện thoại</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0123456789"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6 border-none shadow-sm">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                  <CardTitle>Bảo mật</CardTitle>
                  <CardDescription>Thiết lập mật khẩu khởi tạo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="font-semibold text-gray-700">
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
                        className="h-11"
                      />
                      <p className="text-[11px] text-gray-400">Mật khẩu tối thiểu 6 ký tự</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="font-semibold text-gray-700">
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
                        className="h-11"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8 border-none shadow-sm">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                  <CardTitle>Thông tin khác</CardTitle>
                  <CardDescription>Thông tin bổ sung về người dùng (không bắt buộc)</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="font-semibold text-gray-700">Tiểu sử / Giới thiệu</Label>
                    <Textarea
                      id="bio"
                      placeholder="Thông tin giới thiệu ngắn..."
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-end gap-3 mb-10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/users')}
                  disabled={isSubmitting}
                  className="h-11 px-6"
                >
                  Hủy bỏ
                </Button>
                <Button type="submit" className="h-11 px-8 gap-2 bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  Xác nhận tạo tài khoản
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="bulk" className="animate-in fade-in duration-300">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle>Nhập danh sách từ Excel</CardTitle>
                <CardDescription>Hệ thống hỗ trợ tạo hàng loạt tài khoản từ file dữ liệu</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900 mb-1">Tải file mẫu</h3>
                      <p className="text-sm text-blue-700/80 mb-4">Sử dụng file mẫu để đảm bảo định dạng dữ liệu chính xác.</p>
                      <Button type="button" variant="outline" onClick={downloadTemplate} className="w-full gap-2 border-blue-200 text-blue-700 bg-white hover:bg-blue-50">
                        Tải xuống .xlsx
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-indigo-900 mb-1">Tải lên dữ liệu</h3>
                      <p className="text-sm text-indigo-700/80 mb-4">Chọn file Excel đã điền thông tin người dùng.</p>
                      <div className="relative">
                        <Input
                          id="excelFile"
                          type="file"
                          accept=".xlsx, .xls, .csv"
                          onChange={handleFileChange}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        />
                        <Button variant="outline" className="w-full gap-2 border-indigo-200 text-indigo-700 bg-white pointer-events-none">
                          {excelFile ? 'Đã chọn file' : 'Chọn file từ máy tính'}
                        </Button>
                      </div>
                      {excelFile && <p className="text-xs text-indigo-600 mt-2 font-medium truncate">✓ {excelFile.name}</p>}
                    </div>
                  </div>
                </div>

                {parsedUsers.length > 0 && (
                  <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-gray-700 text-sm">Xem trước dữ liệu ({parsedUsers.length} tài khoản)</h3>
                      <Badge className="bg-indigo-100 text-indigo-700 border-none">Dữ liệu hợp lệ</Badge>
                    </div>
                    <div className="overflow-x-auto max-h-[300px]">
                      <table className="w-full text-sm">
                        <thead className="bg-white sticky top-0 shadow-sm">
                          <tr>
                            <th className="text-left py-3 px-4 font-bold text-gray-500 border-b">STT</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-500 border-b">Họ và tên</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-500 border-b">Email</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-500 border-b">Vai trò</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {parsedUsers.map((row: any[], index: number) => (
                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                              <td className="py-3 px-4 font-medium text-gray-900">{row[0]}</td>
                              <td className="py-3 px-4 text-gray-600">{row[1]}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className={`text-[10px] uppercase font-bold ${
                                  row[2]?.toString().toLowerCase().includes('teacher') || row[2]?.toString().toLowerCase().includes('giảng viên')
                                    ? 'bg-purple-50 text-purple-700 border-purple-100'
                                    : 'bg-blue-50 text-blue-700 border-blue-100'
                                }`}>
                                  {row[2]?.toString().toLowerCase().includes('teacher') || row[2]?.toString().toLowerCase().includes('giảng viên') ? 'Giảng viên' : 'Học sinh'}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                  <Button type="button" variant="outline" onClick={() => navigate('/admin/users')} className="h-11 px-6">
                    Hủy bỏ
                  </Button>
                  <Button
                    type="button"
                    onClick={handleImportUsers}
                    disabled={parsedUsers.length === 0 || isSubmitting}
                    className="h-11 px-8 gap-2 bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    Nhập {parsedUsers.length} tài khoản vào hệ thống
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
