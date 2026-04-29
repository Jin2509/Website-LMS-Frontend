import React, { useState, ChangeEvent } from 'react';
import { Layout } from '@/shared/components/layout';
import { useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { 
  BookOpen, 
  Image as ImageIcon, 
  FileText, 
  Plus, 
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function CreateCourse() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state as { title: string; description: string; category: string } | null;

  const [courseData, setCourseData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    imageUrl: '',
    instructor: 'Nguyễn Văn A', // Mock current teacher
    totalLessons: 0,
    estimatedTime: '',
    level: 'Beginner',
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Đã tải lên ảnh bìa');
    }
  };

  const handleSaveBasicInfo = () => {
    if (!courseData.title || !courseData.description || !courseData.category) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    toast.success('Đã lưu thông tin cơ bản của khóa học!');
    // Here you would typically save to backend
    // Then navigate to add lessons/content
  };

  const handleContinueToContent = () => {
    if (!courseData.title) {
      toast.error('Vui lòng nhập tên khóa học trước');
      return;
    }
    // Navigate to content editor (you can create this page later)
    navigate('/teacher/courses/edit/new-course');
  };

  const isFormComplete = courseData.title && courseData.description && courseData.category;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Tạo khóa học mới</h1>
          <p className="text-gray-600 mt-1">Điền thông tin cơ bản cho khóa học của bạn</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <span className="font-medium text-gray-900">Thông tin cơ bản</span>
            </div>
            <div className="h-1 flex-1 bg-gray-200 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <span className="text-gray-400">Nội dung khóa học</span>
            </div>
            <div className="h-1 flex-1 bg-gray-200 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <span className="text-gray-400">Xuất bản</span>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-600" />
                  Ảnh bìa khóa học
                </CardTitle>
                <CardDescription>Tải lên ảnh đại diện cho khóa học của bạn (tỷ lệ 16:9)</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    coverImagePreview ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
                  }`}
                  onClick={() => document.getElementById('cover-image-input')?.click()}
                >
                  {coverImagePreview ? (
                    <div className="relative">
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoverImage(null);
                          setCoverImagePreview('');
                        }}
                      >
                        Thay đổi ảnh
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">
                        Click để chọn ảnh hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG (tối đa 5MB, khuyến nghị 1920x1080)
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="cover-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Thông tin khóa học
                </CardTitle>
                <CardDescription>Thông tin sẽ hiển thị cho học sinh</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Tên khóa học <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ví dụ: Lập trình Web với React"
                    value={courseData.title}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Danh mục <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="category"
                    placeholder="Ví dụ: Lập trình, Thiết kế, Kinh doanh..."
                    value={courseData.category}
                    onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Cấp độ</Label>
                  <select
                    id="level"
                    value={courseData.level}
                    onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Beginner">Cơ bản</option>
                    <option value="Intermediate">Trung cấp</option>
                    <option value="Advanced">Nâng cao</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedTime">Thời lượng ước tính</Label>
                  <Input
                    id="estimatedTime"
                    placeholder="Ví dụ: 8 tuần, 40 giờ..."
                    value={courseData.estimatedTime}
                    onChange={(e) => setCourseData({ ...courseData, estimatedTime: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Mô tả khóa học <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết về khóa học, những gì học sinh sẽ học được..."
                    value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                    rows={6}
                  />
                  <p className="text-xs text-gray-500">
                    {courseData.description.length} ký tự (khuyến nghị 200-500)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trạng thái</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ảnh bìa</span>
                    {coverImage ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tên khóa học</span>
                    {courseData.title ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Danh mục</span>
                    {courseData.category ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mô tả</span>
                    {courseData.description ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Nội dung bài học</span>
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              {/* Preview Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Xem trước</CardTitle>
                  <CardDescription>Khóa học sẽ hiển thị như thế này</CardDescription>
                </CardHeader>
                <CardContent>
                  {coverImagePreview && (
                    <img
                      src={coverImagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  {courseData.category && (
                    <Badge className="mb-2">{courseData.category}</Badge>
                  )}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {courseData.title || 'Tên khóa học của bạn'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {courseData.description || 'Mô tả khóa học sẽ xuất hiện ở đây...'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>👨‍🏫 {courseData.instructor}</span>
                    {courseData.level && <span>📊 {courseData.level}</span>}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={handleSaveBasicInfo}
                  variant="outline"
                  className="w-full"
                  disabled={!isFormComplete}
                >
                  Lưu nháp
                </Button>
                <Button
                  onClick={handleContinueToContent}
                  className="w-full gap-2"
                  disabled={!isFormComplete}
                >
                  Tiếp tục thêm nội dung
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {!isFormComplete && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-orange-800">
                      <p className="font-medium mb-1">Thiếu thông tin bắt buộc</p>
                      <p className="text-xs">Vui lòng điền đầy đủ các trường có dấu (*)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}